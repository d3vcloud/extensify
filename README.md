# Extensify

Extensify will allow you to share your extensions with others and being able to download them.

![extensify](https://user-images.githubusercontent.com/68721455/188761406-08fc5a05-eb13-4119-82d9-1935e1428e67.png)

## Features

```
1. Authentication using your GitHub account.
2. Upload your extensions easily.
3. Search for extensions of other users by their user's GitHub.
4. Install any extension that you liked from other users.
```

## How to run locally

### Server

1. Create a db called `extensifydb` and a new branch called `shadow` on PlanetScale.
2. Copy .env.example to .env and fill in DATABASE_URL and SHADOW_DATABASE_URL (You will get them from PlanetScale dashboard. Keep in mind you will need two connection strings, since Prisma needs a shadow branch. See **known issue #1**).
3. Also fill in PORT variable.

### Monorepo

1. Run `npm install` to install dependencies.
2. Run `npm run db:schema` to generate the schema.
3. Run `npm run db:migrate` to migrate tables.
4. Run `npm run dev:api` to start the server.
4. Run `npm run ext:watch` to compile the extension.
4. Press F5 to trigger VSCode debugger.

## Known issues

1. [Working with Prisma' migrations and PlanetScale.](https://github.com/prisma/prisma/issues/7292#:~:text=Here%20is%20how%20you%20can%20use%20Prisma%20and%20PlanetScale%20together%20anyway%3A)

