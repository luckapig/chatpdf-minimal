import { execa } from 'execa'
import { join } from 'path'
import { readFile } from 'fs/promises'

export const exec = execa

export const loadQuestions = async (id: string) => {
  let file = join('embeddings', id, 'result.json')
  return JSON.parse(await readFile(file, 'utf-8')).questions
}