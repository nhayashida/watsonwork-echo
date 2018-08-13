## Run the app locally

1.  Set environment variables
> export APP_ID=<APP_ID>\
export APP_SECRET=<APP_SECRET>\
export WEBHOOK_SECRET=<WEBHOOK_SECRET>\

2.  Build
> npm install\
npm run build

3.  Run

> npm run start-prod

4.  Expose your node server by using [ngrok](https://ngrok.com/). The given url will be used for your outbound webhook

> ngrok http 3000

## Run the app locally using Docker

1.  Build a Docker image

> docker build -f Dockerfile -t watsonwork-echo:latest .

2.  Run

> docker run -it -p 3000:3000 \
-e APP_ID=<APP_ID> \
-e APP_SECRET=<APP_SECRET> \
-e WEBHOOK_SECRET=<WEBHOOK_SECRET> \
watsonwork-echo:latest

3.  Expose your node server using [ngrok](https://ngrok.com/). The given url will be used for your outbound webhook

> ngrok http 3000
