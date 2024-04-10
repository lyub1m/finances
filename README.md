# Finances app

## Back

### init

- Move to folder: `cd finances-app`
- Install npm `make init-back-npm`
- Copy env `cp back/app/.env.example back/app/.env`
- Build docker `make build-docker-back`
- App containers `make up-docker-back`
- run migrations `make migrate`

## Front

### init
- Clone repo `git clone https://github.com/smozzh/finances-app.git`
- Move to folder: `cd finances-app`
- Install npm: `make init-front`

### dev mode
- Dev mode run: `make start-dev-front`
##### Android
- Install app to Android https://play.google.com/store/apps/details?id=host.exp.exponent&hl=ru&gl=US
- Scan qr code from ![img.png](img.png)
##### Local
- Click to `Web is waiting on http://localhost:8082`
  ![img.png](img.png)