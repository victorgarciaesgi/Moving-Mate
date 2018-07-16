# Moving Mate

<p align="center">
<img width="100" src="./src/assets/images/logo_M.svg" alt="Moving Mate logo">
<img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">

</p>

## Features

- Vue single file components with Typescript using [Vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) and [Vue-mixin-decorator](https://github.com/justrhysism/vue-mixin-decorator)
- Vuex Store with namespaced modules
- Full form component suite, including Calendar, Upload, Stars, Select etc...
- Vue router with progress bar and async fetch before resolve
- Form Validation using [Vuelidate](https://github.com/monterail/vuelidate)
- Webpack dev server with Hot Modules Replacements and minified/gzipped code in Prod
- Dynamic component import
- Use of repo [Vuex-Typex](https://github.com/mrcrowl/vuex-typex) to have Vuex typed
- Heavy use of Typescript. Target to es2015 and esnext modules
- SCSS implementation
- 100% flexbox
- JWT OAuth
- Paypal Payment (Sandbox)
- Google OAuth
- Google Maps Client

## Installation

```bash
npm install
```

```bash
yarn
```

## Developing

A page will open on [localhost:5000](http://localhost:5000) .

Live reload and Hot Module Replacement.

```bash
npm run dev
```

## Production

Deploy with minified bundle size, gzipped and chunks vendors and Vue production mode

```bash
npm run prod

```

## Generate SSL certificate

```bash
openssl genrsa -des3 -out ./cert/rootCA.key 2048
```

```bash
openssl req -x509 -new -nodes -key ./cert/rootCA.key -sha256 -days 1024 -out ./cert/rootCA.pem
```