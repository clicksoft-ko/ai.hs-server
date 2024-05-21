FROM node:20

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile;

COPY . .

RUN npm run build

CMD [ "node", "dist/index.js" ]