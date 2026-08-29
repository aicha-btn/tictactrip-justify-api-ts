# Step-by-Step Git Commands

Git keeps the project history. Each commit should describe one clear step.

## 1. Open the Terminal

In VS Code:

1. Click **File > Open Folder...**.
2. Choose the project folder.
3. Click **Terminal > New Terminal**.

The terminal should open directly in the right folder.

## 2. Initialize Git

```bash
git init
```

Why: this command turns the folder into a Git repository.

## 3. First Commit

```bash
git add package*.json tsconfig.json .gitignore .editorconfig .nvmrc
git commit -m "chore: initialise TypeScript project"
```

Why: this commit sets the technical foundation of the project.

## 4. API Commit

```bash
git add src
git commit -m "feat: add token auth and justify endpoint"
```

Why: this commit adds the behavior required by the assessment.

## 5. Test Commit

```bash
git add test .github
git commit -m "test: cover justification API"
```

Why: this commit proves that the main features are verified automatically.

## 6. Documentation and Deployment Commit

```bash
git add README.md docs Dockerfile render.yaml .env.example
git commit -m "docs: explain usage and deployment"
```

Why: this commit makes the project readable for reviewers and ready to deploy.

## 7. Check Repository Status

```bash
git status
```

If Git responds with `nothing to commit, working tree clean`, everything is saved.

## 8. Push to GitHub

After creating an empty GitHub repository:

```bash
git branch -M main
git remote add origin git@github.com:YOUR_ACCOUNT/tictactrip-justify-api.git
git push -u origin main
```

Why: GitHub makes the code visible to reviewers and allows Render to deploy it.
