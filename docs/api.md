# Documentation API

Base URL locale :

```text
http://localhost:3000
```

## POST /api/token

Cree ou retrouve le token associe a un email.

### Requete

Headers :

```text
Content-Type: application/json
```

Body :

```json
{
  "email": "foo@bar.com"
}
```

### Reponse 200

```json
{
  "token": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### Erreurs

- `400` si l'email est absent ou invalide.
- `413` si le body depasse la taille maximale acceptee.
- `405` si la methode n'est pas `POST`.
- `415` si le `Content-Type` n'est pas `application/json`.

## POST /api/justify

Justifie un texte en lignes de 80 caracteres.

### Requete

Headers :

```text
Authorization: Bearer <token>
Content-Type: text/plain
```

Body :

```text
Un texte libre a justifier.
```

### Reponse 200

Headers :

```text
Content-Type: text/plain; charset=utf-8
```

Body :

```text
Texte justifie.
```

### Erreurs

- `401` si le token est absent ou invalide.
- `402` si le token depasse 80 000 mots sur la journee.
- `413` si le body depasse la taille maximale acceptee.
- `405` si la methode n'est pas `POST`.
- `415` si le `Content-Type` n'est pas `text/plain`.

Exemple de reponse `402` :

```json
{
  "error": "Daily word limit exceeded.",
  "details": {
    "limit": 80000,
    "remainingWords": 0,
    "resetDate": "2026-06-17"
  }
}
```

## GET /health

Endpoint technique pour verifier que le serveur repond.

### Reponse 200

```json
{
  "status": "ok"
}
```
