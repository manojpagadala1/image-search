# Real World Project - 11: Image Search

A responsive single-screen ReactJS image search application using the Unsplash API.

## Features

- ReactJS + Vite
- Unsplash Search Photos API
- Search images by keyword
- Loading state with shimmer placeholders
- Hover popup containing photo details
- Responsive design for desktop, tablet and mobile
- Pagination
- Automatic Wikimedia Commons fallback when the Unsplash API key is missing or invalid
- Error handling for API errors
- Lazy-loaded images
- Accessible labels and buttons

## 1. Requirements

Install Node.js on your computer.

Check:

```bash
node -v
npm -v
```

## 2. Get an Unsplash API key

1. Create/sign in to your Unsplash account.
2. Open https://unsplash.com/developers
3. Create an application.
4. Copy the Access Key.

## 3. Configure the project

Create a file named `.env` in the project root. A valid Unsplash key enables Unsplash search; without one, or if Unsplash rejects it, the app automatically searches Wikimedia Commons without requiring a key.

Copy this:

```env
VITE_UNSPLASH_ACCESS_KEY=your_actual_unsplash_access_key
```

Do not upload `.env` to GitHub. It is already included in `.gitignore`.

## 4. Install packages

Open the project folder in VS Code and run:

```bash
npm install
```

## 5. Start the project

```bash
npm run dev
```

Vite will show a local URL, normally:

```text
http://localhost:5173/
```

Open that URL in Chrome.

## 6. Build check

Before submission:

```bash
npm run build
```

A successful build creates the `dist` folder.

## 7. Suggested meaningful Git commits

Use commits that describe actual progress, for example:

```bash
git init
git add .
git commit -m "chore: initialize React image search project"

git add .
git commit -m "feat: add Unsplash image search API"

git add .
git commit -m "feat: add loading state and image details"

git add .
git commit -m "feat: add responsive image grid and pagination"

git add .
git commit -m "style: improve responsive UI and accessibility"
```

## 8. GitHub

Create a new GitHub repository and push the project.

Important:
- Do NOT commit `.env`.
- You may commit `.env.example`.
- Add your README.

## 9. Deployment

For Vercel:
1. Import the GitHub repository.
2. Framework: Vite should be detected automatically.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the environment variable:
   - Name: `VITE_UNSPLASH_ACCESS_KEY`
   - Value: your Unsplash Access Key
6. Deploy.

## Assignment requirements covered

| Requirement | Implementation |
|---|---|
| ReactJS | React + Vite |
| Public image API | Unsplash Search Photos API |
| Loading state | Skeleton/shimmer grid |
| Hover details | Image overlay |
| Responsive | Desktop/tablet/mobile CSS |
| Pagination bonus | Previous/Next pagination |
| Meaningful commits | Suggested commit sequence |
| Bonus NodeJS | Not required; React REST API implementation is complete |

## Project structure

```text
real-world-project-11-image-search/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Submission

After testing the application and pushing it to GitHub, submit the project through the CCBP project submission form:

https://forms.ccbp.in/project-submission
