# Kin DApp Playground

## This app demonstrates three ways of integrating with [Kin](https://developer.kin.org/)

## Via a Back End Server implementing a Kin Server SDK

- e.g. [Node](https://github.com/kinecosystem/kin-node), [Go](https://github.com/kinecosystem/kin-go), [Python](https://github.com/kinecosystem/kin-python)

This app is designed to work with the following Kin Server Demos:

- [Node](https://github.com/kin-starters/kin-demo-node-sdk)
- [Python](https://github.com/kin-starters/kin-demo-python-sdk)
- [Go](https://github.com/kin-starters/kin-demo-go-sdk)

  or

## Via the [Kin Web SDK](https://github.com/kin-sdk/kin-sdk-web)

or

## Via Solana Directly / SDK-less

## Prep

- Your App is registered on the [Kin Developer Portal](https://portal.kin.org/) so you can take advantage of the [Kin Rewards Engine](https://developer.kin.org/docs/the-kre-explained/) and get your App Index
- Environment variable for your server URL (if testing a Back End Server)
- Environment variable for your App Index (if testing a Client DApp or SDK-less DApp )

`.env`

```
REACT_APP_SERVER_URL=Your Server URL e.g. http://localhost:3001
REACT_APP_APP_INDEX=Your App Index e.g. 123
```

## Install Packages

```
npm i
```

or

```
yarn
```

## Start

```
npm run start
```

or

```
yarn start
```

## If you're just getting started, you might want to look at [this](https://developer.kin.org/tutorials/#getting-started) first...

## Dev Community

Join us on [Discord](https://discord.com/invite/kdRyUNmHDn) if you're looking for support with your App or to connect with other active Kin developers
