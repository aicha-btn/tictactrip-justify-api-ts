# Commandes Git pas à pas

Git garde l'historique du projet. Chaque commit doit raconter une étape claire.

## 1. Ouvrir le terminal

Dans VS Code :

1. Clique sur **File > Open Folder...**.
2. Choisis `/Users/aicha/API - Tictactrip`.
3. Clique sur **Terminal > New Terminal**.

Le terminal doit s'ouvrir directement dans le bon dossier.

## 2. Initialiser Git

```bash
git init
```

Pourquoi : cette commande transforme le dossier en repository Git.

## 3. Premier commit

```bash
git add package*.json tsconfig.json .gitignore .editorconfig .nvmrc
git commit -m "chore: initialise TypeScript project"
```

Pourquoi : ce commit pose la base technique du projet.

## 4. Commit de l'API

```bash
git add src
git commit -m "feat: add token auth and justify endpoint"
```

Pourquoi : ce commit ajoute le vrai comportement demandé par l'énoncé.

## 5. Commit des tests

```bash
git add tests .github
git commit -m "test: cover justification API"
```

Pourquoi : ce commit prouve que les fonctionnalités principales sont vérifiées automatiquement.

## 6. Commit documentation et déploiement

```bash
git add README.md docs Dockerfile render.yaml .env.example
git commit -m "docs: explain usage and deployment"
```

Pourquoi : ce commit rend le projet lisible pour le recruteur et prêt à déployer.

## 7. Vérifier l'état du repo

```bash
git status
```

Si Git répond `nothing to commit, working tree clean`, tout est enregistré.

## 8. Pousser sur GitHub

Après avoir créé un repository GitHub vide :

```bash
git branch -M main
git remote add origin git@github.com:TON_COMPTE/tictactrip-justify-api.git
git push -u origin main
```

Pourquoi : GitHub rend le code visible au recruteur et permet à Render de le déployer.
