# My Simple Site Template

My personal website template. The purpose of this repo is to setup a barebone framework that has all the tools one needs to start building their first pug site yet not overloaded with packages that would confuse a newbie.

- babel 7 is used to transpile ES6, 7, and React into ES5 for better browser compatibilities.

## Install

Clone or download this repo and run

```console
npm i
```

## Run

NOTE: remember to change values in .env file

```console
NODE_ENV = [development | production]
MONGODB_URI = mongodb://<your mongodb address>
```

To run under development mode with live reload:

```console
npm run dev-start
```

To serve app normally:

```console
npm start
```
