# Student Management System REST API

## URL to REST API as a Web Service on Render

<https://id607001-graysono-wbnj.onrender.com>

## URL to REST API Documentation

Add the URL here.

## Setup Environment

Install the dependencies by running the following command:

```bash
npm install
```

Copy the `.env.example` file to `.env` and update the values of the environment variables.

## Run the REST API

```bash
npm run dev
```

## Create and Apply a Migration

```bash
npx prisma migrate dev
```

or

```bash
npm run prisma:migrate
```

## Reset the Database

```bash
npx prisma migrate reset --force
```

or

```bash
npm run prisma:reset
```

## Open Prisma Studio

```bash
npx prisma studio
```

or

```bash
npm run prisma:studio
```

## Format Code

```bash
npm run pretty
```

## Seed the Database

```bash
npm run prisma:seed
```

## Run the Tests

```bash
npm test
```

or

```bash
npm run test
```

# Student Management System CRUD Application

## Setup Environment

```bash
cd client
```

Install the dependencies by running the following command:

```bash
npm install
```

## Run the CRUD Application

```bash
npm run dev
```
