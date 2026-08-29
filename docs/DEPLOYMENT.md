# Public Deployment

The goal of deployment is to turn the local project into a public URL.

## Recommended Option: Render

Render hosts Node.js web services and can connect directly to GitHub.

### Step 1: Push the Code to GitHub

The repository is already configured with this remote:

```text
https://github.com/aicha-btn/tictactrip-justify-api-ts.git
```

From the project folder:

```bash
git status
git push origin main
```

If you start again from another computer, create an empty GitHub repository and follow the commands shown by GitHub, for example:

```bash
git branch -M main
git remote add origin git@github.com:YOUR_ACCOUNT/tictactrip-justify-api.git
git push -u origin main
```

### Step 2: Create the Render Service

1. Open Render in your browser.
2. Click **New +**.
3. Click **Web Service**.
4. Choose the GitHub repository.
5. Check the commands:

```text
Build Command: npm ci && npm run build
Start Command: npm start
```

6. Click **Deploy Web Service**.

### Step 3: Test the Public URL

When Render displays the URL, test:

```bash
curl https://YOUR-URL.onrender.com/health
```

Then request a token:

```bash
curl -X POST https://YOUR-URL.onrender.com/api/token \
  -H "Content-Type: application/json" \
  -d '{"email":"foo@bar.com"}'
```

## Docker Option

Docker packages the application and its environment into an image.

```bash
docker build -t tictactrip-justify-api .
docker run -p 3000:3000 tictactrip-justify-api
```

Then open:

```text
http://localhost:3000/health
```
