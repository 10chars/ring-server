# ring-server

## Install Dependencies
```
npm i
```

## Get refresh token

- Run `npm run auth` to start the process. It should prompt you for email/password/token
- You will see a refresh token output like `"refreshToken": "eyJhbGciOi...afa1"`. You need to extract the value from the second part of this output, between the double quotes.
- Create a `.env` file in the root directory of this project and insert the following contents

```sh
RING_REFRESH_TOKEN=eyJhbGciOi...afa1
```

## Add webhook to call on doorbell press event
```
WEBHOOK_URL=https://path.to.my.webhook.com/
```

## Build

```sh
npm run build
```

## Start

```sh
npm start
```
