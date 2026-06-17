# Déploiement public

Le but du déploiement est de transformer ton projet local en URL publique.

## Option recommandée : Render

Render héberge des services web Node.js et peut se connecter à GitHub.

### Étape 1 : pousser le code sur GitHub

Le dépôt est deja configure avec ce remote :

```text
https://github.com/aicha-btn/tictactrip-justify-api-ts.git
```

Dans le terminal :

```bash
cd "/Users/aicha/API - Tictactrip"
git status
git push origin main
```

Si tu repars de zero sur un autre ordinateur, cree un repository sur GitHub, puis suis les commandes affichees par GitHub, par exemple :

```bash
git branch -M main
git remote add origin git@github.com:TON_COMPTE/tictactrip-justify-api.git
git push -u origin main
```

### Étape 2 : créer le service Render

1. Ouvre Render dans ton navigateur.
2. Clique sur **New +**.
3. Clique sur **Web Service**.
4. Choisis ton repository GitHub.
5. Vérifie les commandes :

```text
Build Command: npm install && npm run build
Start Command: npm start
```

6. Clique sur **Deploy Web Service**.

### Étape 3 : tester l'URL publique

Quand Render affiche l'URL, teste :

```bash
curl https://TON-URL.onrender.com/health
```

Puis :

```bash
curl -X POST https://TON-URL.onrender.com/api/token \
  -H "Content-Type: application/json" \
  -d '{"email":"foo@bar.com"}'
```

## Option Docker

Docker emballe l'application et son environnement dans une image.

```bash
docker build -t tictactrip-justify-api .
docker run -p 3000:3000 tictactrip-justify-api
```

Puis ouvre :

```text
http://localhost:3000/health
```
