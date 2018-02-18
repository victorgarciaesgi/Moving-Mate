<p align="center"><a href="https://vuejs.org" target="_blank"><img width="100" src="https://vuejs.org/images/logo.png" alt="Vue logo"></a></p>


# Installation

```bash
 $ npm install
```

```bash
 $ yarn
```

## Developing

A page will open on [localhost:5000](http://localhost:5000) .

Live reload and Hot Module Replacement are enabled.

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