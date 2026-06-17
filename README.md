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
- Tests automatises, coverage, CI GitHub Actions, Dockerfile et configuration Render inclus.

## Comprendre le projet

Une **API** est une porte d'entree pour demander un service a un programme.

**REST** est une convention qui organise cette porte d'entree avec des routes HTTP. Ici, au lieu de cliquer dans une page web, un client envoie une requete vers une URL precise.

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

## Petit glossaire

- **Endpoint** : une route precise de l'API. Exemple : `/api/token`.
- **HTTP** : le protocole utilise par le web pour transporter une requete et une reponse.
- **POST** : une methode HTTP utilisee pour envoyer des donnees.
- **Body** : le contenu envoye dans une requete HTTP.
- **Content-Type** : l'etiquette qui annonce le format du body, par exemple `text/plain`.
- **Token** : une cle d'acces. L'API s'en sert pour reconnaitre le client.
- **Bearer token** : un token envoye dans le header `Authorization`.
- **Rate limit** : une limite d'utilisation. Ici : 80 000 mots par token et par jour.
- **Build** : la transformation du TypeScript en JavaScript executable par Node.js.
- **Coverage** : un rapport qui montre quelles parties du code sont exercees par les tests.

## Prerequis

- Node.js 20.11 ou plus recent.
- npm, installe automatiquement avec Node.js.
- Git, pour versionner et publier le code.
- VS Code, pour lire le code confortablement.
- curl, Postman ou Insomnia, pour tester l'API.

Pour verifier :

```bash
node -v
npm -v
git --version
```

## Installation locale

Ouvre VS Code, puis :

1. Clique sur **File > Open Folder...**.
2. Choisis `/Users/aicha/API - Tictactrip`.
3. Clique sur **Terminal > New Terminal**.

Dans le terminal :

```bash
npm ci
```

`npm ci` installe exactement les versions listees dans `package-lock.json`.

## Lancer l'API

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

`localhost` veut dire "mon ordinateur". C'est local, donc ce n'est pas encore une URL publique.

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

Le coverage impose des seuils minimaux :

- lignes : 95% ;
- branches : 90% ;
- fonctions : 95%.

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
- Les mots plus longs que 80 caracteres sont decoupes pour respecter la largeur demandee.
- Pour une production a tres fort trafic, on remplacerait la memoire par Redis ou une base de donnees.
- Ce choix est volontairement simple pour un test technique : il garde le code lisible et concentre sur les contraintes demandees.
