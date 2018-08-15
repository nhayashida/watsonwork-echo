## Start ngrok
Expose the port for your node server using [ngrok](https://ngrok.com/). The given hostname will be used for your callback and configuration URLs.

```
ngrok http 3000
```


## Register new app for Watson Work Services
#### Create new app
1. Open https://developer.watsonwork.ibm.com/apps
1. Click **Create new app**
1. Give your app name and click **Create**
1. Note the given App ID and App Secret
#### Add outbound webhook
1. Navigate to **Listen to Events** and click **Add an outbound webhook**
1. Give your webhook name and set your callback URL. The URL should be `<NGROK_HOST>/webhook`.
1. Check **message-created** and **_message-annotation-added** events and click **Save**
1. Note the give Webhook Secret


## Start node server
#### (Optoin 1). Run app from console
1.  Set the following environment variables
```
export WORKSPACE_APP_ID=<Your App ID>
export WORKSPACE_APP_SECRET=<Your App Secret>
export WORKSPACE_WEBHOOK_SECRET=<Your Webhook Secret>
```

2.  Build
```
npm install
npm run build
```

3.  Run

> npm run start-prod

#### (Optoin 2). Run app using Docker

1.  Build a Docker image
```
docker build -f Dockerfile -t watsonwork-echo:latest .
```

2.  Run
```
docker run -it -p 3000:3000 \
-e WORKSPACE_APP_ID=<Your App ID> \
-e WORKSPACE_APP_SECRET=<Your App Secret> \
-e WORKSPACE_WEBHOOK_SECRET=<Your Webhook Secret> \
watsonwork-echo:latest
```

#### (Option 3). Run app from Visual Studio Code
1. Open your local repository with Visual Studio Code
2. Set the following envitonment variables in [.vscode/launch.json](https://github.com/nhayashida/watsonwork-echo/blob/master/.vscode/launch.json)
```
"env": {
  "WORKSPACE_APP_ID": "<Your App ID>",
  "WORKSPACE_APP_SECRET": "<Your App Secret>",
  "WORKSPACE_WEBHOOK_SECRET": "<Your Webhook Secret>",
},
```
3. Select **Debug** -> **Start Debugging**

## Enable outbound webhook
1. Open https://developer.watsonwork.ibm.com/apps
1. Navigate to **Listen to Events**
1. Click **Enable** on your webhook
