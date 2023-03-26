import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { load } from "../../../../apis/db"
import nl2br from 'react-nl2br'
import { exec, loadQuestions } from "../../../../apis/run"

export default function Post() {
  let { id } = useParams()
  let [article, setArticle] = useState('')
  let [msgs, setMsgs] = useState([])
  let [question, setQuestion] = useState('')
  let [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    Promise.all([
      load(`/article/${id}/text`).then(x => setArticle(x)),
      loadQuestions(id).then(questions => setMsgs(msgs => [
        [
          `你可以问|You can ask:`,
          ...questions
        ].join('\n'),
        ...msgs
      ])),
    ]).then(()=>setLoading(false))

  }, [id, setArticle, setMsgs])
  return <article>
    <h2>聊天|Chat</h2>
    <div style={{
      display: 'flex',
    }}>
      <div style={{ flex: 1 }}>
        <article>
          {nl2br(article)}
        </article>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
        }}>
          <input value={question} onChange={e => setQuestion(e.target.value)} />
          <button
            disabled={loading}
            onClick={async () => {
              setQuestion('')
              setLoading(true)
              setMsgs(msgs => [`Q:${question}`, ...msgs])
              let { stdout } = await exec(
                'python3',
                ['py/process-article.py', 'ask', `embeddings/${id}`, question],
                { env: { OPENAI_API_KEY: localStorage.getItem('token') } })
              let { answer } = JSON.parse(stdout)
              setMsgs(msgs => [`A:${answer}`, ...msgs])
              setLoading(false)
            }}>{loading ? 'loading...' : `发送问题 | Send Question`}</button>
        </div>
        <ul>{msgs.map((x, i) => <li key={i}>{nl2br(x)}</li>)}</ul>
      </div>
    </div>
  </article>
}