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

Open Source at https://github.com/victorgarciaesgi/Moving-Mate

# Installation

```bash
npm install
```

```bash
yarn
```

# Change API url endpoint

go to `./environment`

`dev.env.js` -> API_URL constant for development
`prod.env.js` -> API_URL constant for production


## Config

Webpack config in `./config`

# Developpment

```bash
npm run dev
```

A page will open on [localhost:5000](http://localhost:5000).

Build ~ 60s

Live reload, Hot Module Replacement and Vue devtools


```bash
npm run dev2
```

Same as dev but with **Webpack-Dashboard**

# Production

```bash
npm run prod
```

- pm2
- minified bundle size
- uglified code
- gzipped
- chunks vendors
- Vue production mode
- drop console logs and comments

```bash
npm run prod2
```
Same as prod but with **Nodemon**

```bash
npm run build:prod
```

Regenerate the assets

# Mobile app

```bash
npm i -g cordova
```

```bash
npm run build:mobile
```

It wuild build the app in prod mode, targeted to ```./mobile-app/www```

```bash
cd ./mobile-app
```

```bash
npm install
```

```bash
cordova platform add ios
# or
cordova platform add android
```

## For IOS

Go to ```./platforms/ios``` and open the Xcode project (Mac only)

## For Android

Install Android Studio

## Build

```bash
cordova build ios
# or
cordova build android
```

plug your Iphone/android

```bash
cordova run ios
# or
cordova run android
```