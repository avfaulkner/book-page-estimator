# Pages Estimator for Books

This application will estimate the number of pages a personal literary work should be based on the desired book trim size, margins, and font size.

Netlify is used as the web host since it does not require setting up a separate backend and it allows for easy upload of images and the generation of a downloadable PDF.

## Features

- Estimate book page count based on word count, trim size, and font size.

- Accept front and back cover image uploads.

- Generate a print-ready PDF book cover with a spine that includes the book title.

- Run entirely on Netlify, using a serverless function to create the PDF.

## Files

- App.tsx: UI (React) for file upload, form fields, PDF download

- estimatePages.ts: Page estimation logic with font scaling

- generateCoverPDF.js: Netlify serverless function for combining images and creating book cover with spine text into a downloadable PDF

## Steps to deploy to Netlify

Install Netlify CLI: 

```
npm install -g netlify-cli
```

Run locally

```
netlify dev
```

Deploy to Netlify

```
netlify deploy --prod
```
Netlify will auto-detect the serverless function in /netlify/functions and deploy it with the frontend.
