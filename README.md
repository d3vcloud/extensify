# Extensify
[![](https://vsmarketplacebadge.apphb.com/version/xavimon.Extensify.svg)](https://marketplace.visualstudio.com/items?itemName=xavimon.Extensify) [![](https://vsmarketplacebadge.apphb.com/installs/xavimon.Extensify.svg)](https://marketplace.visualstudio.com/items?itemName=xavimon.Extensify)

> ⚠️ NOTICE: this extension is still under active development! ⚠️

Extensify will allow you to share your extensions with others and being able to download them.

![Extensify](https://user-images.githubusercontent.com/68721455/190838527-fb055abe-9f22-4a31-8bce-d0652962f073.gif)

## Features

```
1. Authentication using your GitHub account.
2. Upload your extensions easily.
3. Search for extensions of other users by their user's GitHub.
4. Install any extension that you liked from other users.
5. Follow and unfollow users.
6. List of users that you are following to.
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