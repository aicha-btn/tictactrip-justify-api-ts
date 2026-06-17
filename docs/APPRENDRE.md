# Comprendre le projet de zéro

Ce document sert de mini-cours pour refaire le projet plus tard toute seule.

## 1. Une API REST, c'est quoi ?

Une API est comme un guichet : tu arrives avec une demande précise, le guichet répond dans un format prévu.

Ici :

- tu demandes un token à `/api/token` ;
- tu envoies un texte à `/api/justify` ;
- l'API renvoie le texte justifié.

REST est une convention pour organiser ces guichets avec des routes HTTP.

## 2. Pourquoi un token ?

Un token est une clé d'accès.

Sans token, n'importe qui pourrait appeler `/api/justify` sans limite. Avec un token, l'API sait quel compteur de mots utiliser.

La requête envoie le token comme ceci :

```text
Authorization: Bearer TON_TOKEN
```

`Bearer` veut dire : "je porte cette clé, laisse-moi entrer si elle est valide".

## 3. Pourquoi un rate limit ?

Un rate limit est un compteur de sécurité.

Dans ce test, la règle est :

```text
1 token = 80 000 mots maximum par jour
```

Si on dépasse, l'API répond :

```text
402 Payment Required
```

Ici, `402` sert à dire : "ton quota gratuit est dépassé".

## 4. Comment marche la justification ?

Le texte est découpé en mots.

Ensuite, on remplit une ligne tant qu'elle tient dans 80 caractères. Quand le mot suivant ne rentre plus, on répartit les espaces entre les mots de la ligne.

Exemple très petit avec une largeur de 10 caractères :

```text
aa bb cc dd
```

devient :

```text
aa  bb  cc
dd
```

La première ligne est complète. La dernière ligne reste alignée à gauche, comme dans la plupart des justifications de texte.

## 5. Pourquoi TypeScript ?

JavaScript laisse passer beaucoup d'erreurs jusqu'au moment où le programme tourne.

TypeScript ajoute une vérification avant l'exécution. Par exemple, il peut dire :

```text
Cette fonction attend un nombre, pas une phrase.
```

C'est utile pour écrire du code plus fiable.

## 6. Pourquoi des tests ?

Un test est une mini-simulation automatique.

Exemple :

- on donne un texte court ;
- on appelle la fonction de justification ;
- on vérifie que la sortie correspond à ce qu'on attend.

Les tests donnent confiance au recruteur et à toi-même quand tu modifies le code.

## 7. Pourquoi Git ?

Git est l'historique du projet.

Un commit est une photo du projet à un instant précis. Des commits propres racontent ton raisonnement :

```text
chore: initialise project
feat: add text justification
feat: add token authentication
test: add API tests
docs: explain deployment
```

## 8. Ce qu'il faut ouvrir

1. Ouvre **VS Code**.
2. Clique sur **File > Open Folder...**.
3. Choisis `/Users/aicha/API - Tictactrip`.
4. Ouvre le terminal intégré avec **Terminal > New Terminal**.
5. Lance :

```bash
npm install
npm test
```

Si les tests passent, le socle est bon.

## 9. Les fichiers les plus importants

- `src/justify/justifyText.ts` : le coeur de l'exercice.
- `src/server.ts` : les routes HTTP.
- `src/auth/tokenService.ts` : la création et la vérification des tokens.
- `src/quota/wordQuotaService.ts` : le quota de mots par jour.
- `tests/` : les preuves automatiques que le code marche.
- `README.md` : la documentation que le recruteur lira en premier.
