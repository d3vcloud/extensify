<div align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=xavimon.extensify">
    <img src="https://media.giphy.com/media/fvDGJdOJ1W6ym9do8U/giphy.gif" />
  </a>
</div>

# Extensify

> ⚠️ NOTICE: this extension is still under active development! ⚠️

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
2. Copy .env.example to .env and fill in DATABASE_URL (You will get it from PlanetScale dashboard) and PORT variable.

### Monorepo

1. Run `npm install` to install dependencies.
2. Run `npm run db:schema` to generate the schema.
3. Run `npm run db:migrate` to migrate tables.
4. Run `npm run dev:api` to start the server.
4. Run `npm run ext:watch` to compile the extension.
4. Press F5 to trigger VSCode debugger.