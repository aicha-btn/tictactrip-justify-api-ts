# Tictactrip Justify API

API REST Node.js + TypeScript qui justifie un texte sur des lignes de 80 caracteres.

Le projet respecte les contraintes du test technique :

- `POST /api/token` cree un token a partir d'un email.
- `POST /api/justify` retourne du texte justifie en `text/plain`.
- Chaque ligne justifiee fait 80 caracteres, sauf la derniere ligne d'un paragraphe.
- Le endpoint `/api/justify` est protege par token Bearer.
- Le rate limit est fixe a 80 000 mots par token et par jour.
- Le depassement du quota renvoie `402 Payment Required`.
- La justification est codee sans bibliotheque externe.
- Tests automatises et coverage inclus.

## Comprendre le projet

Une API REST est une interface HTTP : au lieu de cliquer dans une page web, un client envoie une requete vers une URL precise.

Ici, le flux ressemble a ceci :

```mermaid
sequenceDiagram
  participant Client
  participant API
  Client->>API: POST /api/token {"email":"foo@bar.com"}
  API-->>Client: {"token":"..."}
  Client->>API: POST /api/justify + Bearer token + text/plain
  API-->>Client: Texte justifie sur 80 caracteres
```

## Prerequis

- Node.js 20 ou plus recent.
- npm, installe automatiquement avec Node.js.
- Git, pour versionner et publier le code.

Pour verifier :

```bash
node -v
npm -v
git --version
```

## Installation locale

Ouvre le dossier du projet dans ton terminal :

```bash
cd "/Users/aicha/API - Tictactrip"
```

Installe les outils du projet :

```bash
npm install
```

Compile le TypeScript :

```bash
npm run build
```

Lance l'API :

```bash
npm start
```

L'API ecoute alors sur :

```text
http://localhost:3000
```

## Utilisation

Demander un token :

```bash
curl -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"email":"foo@bar.com"}'
```

Exemple de reponse :

```json
{"token":"11111111-2222-3333-4444-555555555555"}
```

Justifier un texte :

```bash
curl -X POST http://localhost:3000/api/justify \
  -H "Authorization: Bearer TON_TOKEN_ICI" \
  -H "Content-Type: text/plain" \
  --data-binary "Longtemps, je me suis couche de bonne heure."
```

Verifier la sante de l'API :

```bash
curl http://localhost:3000/health
```

## Tests et qualite

Lancer les tests :

```bash
npm test
```

Lancer le coverage :

```bash
npm run coverage
```

Tout verifier en une commande :

```bash
npm run verify
```

La commande `verify` lance :

- le controle TypeScript ;
- les tests ;
- le rapport de coverage.

## Deploiement

Le projet est pret pour Render, Railway, Fly.io ou n'importe quel hebergeur Node.js.

Variables attendues :

```text
PORT=3000
```

Commandes de deploiement classiques :

```bash
npm ci
npm run build
npm start
```

Un `Dockerfile` et un `render.yaml` sont fournis pour faciliter la mise en ligne.

## Structure

```text
src/
  app.ts                         routes HTTP
  auth/token-store.ts            creation et verification des tokens
  justify/justify-text.ts        algorithme de justification sans dependance
  rate-limit/daily-word-limiter.ts
  http/                          helpers HTTP
test/                            tests automatises
docs/api.md                      documentation API detaillee
```

## Notes techniques

- Les tokens et les compteurs sont stockes en memoire.
- Le compteur quotidien se base sur la date UTC.
- Pour une production a tres fort trafic, on remplacerait la memoire par Redis ou une base de donnees.
- Ce choix est volontairement simple pour un test technique : il garde le code lisible et concentre sur les contraintes demandees.
