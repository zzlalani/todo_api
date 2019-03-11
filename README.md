# TODO App Webservices

A Todo application web services using following tools.

  - [Fastify](https://github.com/fastify/fastify) - nodejs web framework for web services
  - [Firebase Admin](https://github.com/firebase/firebase-admin-node) - for data storage
  - [Ava](https://github.com/avajs/ava) - for unit test

### Installation

clone master branch

    git clone https://github.com/zzlalani/todo_api.git

Install the dependencies and devDependencies.

```sh
cd todo_api
npm install
```

copy enviornment file `.env.example` file to `.env.development` and make the necessary changes in `.env.development` file

    APIKEY="<APIKEY>"
    AUTHDOMAIN="<AUTHDOMAIN>"
    DATABASEURL="<DATABASEURL>"
    PROJECTID="<PROJECTID>"
    STORAGEBUCKET=<STORAGEBUCKET>"
    MESSAGINGSENDERID="<MESSAGINGSENDERID>"
    SERVICEACCOUNTKEYPATH="./firebase_admin_sdk/<serviceAccountKey.json>"

put your `firebase-admin` `serviceAccountKey.json` file into `firebase_admin_sdk` folder

start server

    node server.js
    
unit test

    npm test
