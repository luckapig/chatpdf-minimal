FROM node:lts-alpine3.14

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache openai pathlib
RUN apk --no-cache add musl-dev linux-headers g++
RUN apk --no-cache add python3-dev
RUN pip3 install --no-cache pandas
RUN pip3 install --no-cache scikit-learn

WORKDIR /app

COPY package*.json /app/

RUN npm i

COPY . .

RUN npm run build

CMD npm run start
