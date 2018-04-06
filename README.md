# Moving Mate

<p align="center">
<img width="100" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFE%0D%0AT0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53%0D%0AMy5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBo%0D%0AZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJo%0D%0AdHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3Jn%0D%0ALzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9k%0D%0AZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGlt%0D%0AaXQ6MS40MTQyMTsiPjxwYXRoIGQ9Ik0wLjU4MiwzLjY0N2wyNC41NTMsMGwyNC4yNzUsMzUuNzE0%0D%0AbDI0LjEzNSwtMzUuNzE0bDI0LjU1MywwbDAsOTMuMDUybC0yOS43MTUsMGwwLC0zMy40ODJsLTE4%0D%0ALjk3MywyNy45MDJsLTE5LjExMywtMjcuOTAybDAsMzMuNDgybC0yOS43MTUsMGwwLC05My4wNTJa%0D%0AbTE3LjU3OCw4MS44OTJsMCwtNjQuMDM1bDMxLjI1LDQ1LjQ4bDMxLjExLC00NS40OGwwLDY0LjAz%0D%0ANWwzLjYyNywwbDAsLTcwLjczMWwtMy42MjcsMGwtMzEuMTEsNDUuODk4bC0zMS4yNSwtNDUuODk4%0D%0AbC0zLjYyNywwbDAsNzAuNzMxbDMuNjI3LDBaIiBzdHlsZT0iZmlsbDojNDk3NWJhO2ZpbGwtcnVs%0D%0AZTpub256ZXJvOyIvPjwvc3ZnPg==" alt="Moving Mate logo">
<img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo">

</p>

## Features

- Vue single file components
- Vuex Store with namespaced modules
- Vue router with progress bar and async fetch before resolve
- Webpack dev server with Hot Modules Replacements and minified/gzipped code in Prod
- Dynamic component import
- Use of repo [Vuex-Typex](https://github.com/mrcrowl/vuex-typex) to have Vuex typed
- Typescript implementation. Target to es2015 and esnext modules
- SCSS implementation
- 100% flexbox
- JWT OAuth
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