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
1. Check **message-created** events and click **Save**
1. Note the give Webhook Secret


## Start node server
#### (Optoin 1). Run app from console
1. Edit the environment variables in [.env](.env)

2.  Build
```
npm install
npm run build
```

3.  Run
```
npm run start
```

#### (Optoin 2). Run app using Docker
1. Edit the environment variables in [.env](.env)

2.  Build a Docker image
```
npm install
npm run build
docker build -f Dockerfile -t watsonwork-loopback-template:latest .
```

3.  Run
```
docker run -it -p 3000:3000 watsonwork-loopback-template:latest
```

#### (Option 3). Run app from Visual Studio Code
1. Open your local repository with Visual Studio Code
1.  Edit the environment variables in [.env](.env)
1. Select **Debug** -> **Start Debugging**

## Enable outbound webhook
1. Open https://developer.watsonwork.ibm.com/apps
1. Navigate to **Listen to Events**
1. Click **Enable** on your webhook
