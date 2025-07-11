# Pages Estimator for Books

This application will estimate the number of pages a personal literary work should be based on the desired book trim size, margins, and font size.

Netlify is used as the web host since it does not require setting up a separate backend and it allows for easy upload of images and the generation of a downloadable PDF.

## Site Endpoint

https://book-page-estimator.netlify.app/ 

## Features

- Estimate book page count based on word count, trim size, and font size.

- Accept front and back cover image uploads.

- Generate a print-ready PDF book cover with a spine that includes the book title.

- Run entirely on Netlify, using a serverless function to create the PDF.

## Files

- App.tsx: UI (React) for top-level component.

- estimatePages.ts: Page estimation logic with font scaling.

- generateCoverPDF.js: Netlify serverless function for combining images and creating book cover with spine text into a downloadable PDF

- CoverContext.tsx: to store and share state between components.

- PageEstimator.tsx: handles word count, trim size, and page count

- CoverEditor.tsx: handles input fields for cover details and uploads

- CanvasPreview.tsx: handles rendering and dragging logic for the canvas

## Steps to deploy to Netlify from GitHub using Netlify CLI

Install Netlify CLI: 

```
npm install -g netlify-cli
```

Login to Netlify

```
netlify login
```

Run initialize netlify, install plugin to devDependencies for use during build

```
cd book-page-estimator
netlify init
npm install --save-dev @vitejs/plugin-react
npm install node-sass --save-dev
```

Deploy to Netlify

```
netlify deploy --prod
```

Follow the prompts to connect to GitHub and deploy your site.
Once Github main branch is connected to Netlify, the repo will be deployed using `npm run build` command and published to `dist`.