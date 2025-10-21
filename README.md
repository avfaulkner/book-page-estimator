# Pages Estimator for Books

A complete browser-based tool for authors and creators:

- Estimate how many pages your book should have based on trim size, margins and font size.  
- Design your front & back cover, including adjustable spine width.  
- Upload your content (intro page + PNG pages) and generate a print-ready single-sided PDF book. [See the repo for this feature here.](https://github.com/avfaulkner/imgs-to-pdf-book)

Netlify is used as the web host since it does not require setting up a separate backend and it allows for easy upload of images and the generation of a downloadable PDF.

## Site Endpoint

https://book-page-estimator.netlify.app/ 

---

## Files

- App.tsx: UI (React) for top-level component.

- estimatePages.tsx: Page estimation logic with font scaling.

- generateCoverPDF.js: Netlify serverless function for combining images and creating book cover with spine text into a downloadable PDF

- CoverContext.tsx: to store and share state between components.

- PageEstimator.tsx: handles word count, trim size, and page count

- CoverEditor.tsx: handles input fields for cover details and uploads

- CanvasPreview.tsx: handles rendering and dragging logic for the canvas

## Features

- **Page Estimation** – Enter word count, select trim size and font to estimate page-count.  
- **Cover Designer** – Upload front/back cover images, add text, preview and export a PDF cover with spine.  
- **PDF Book Creator** – Upload an intro PDF and PNG image pages to generate a one-sided printable book PDF.  
- **Fully in Browser** – Works seamlessly on a Netlify-hosted site.  
- **Modern UI** – Clean card-based layout, elegant typography and responsive design.

---

## How to Use

1. Open the live site or deploy locally.  
2. **Estimate pages** – Enter your word count and design parameters to get an estimate.  
3. **Design your cover** – Upload front/back images, add title/author text, preview your cover.  
4. **Create your book PDF** – In the PDF Book Creator section, upload an intro PDF (optional) and your PNG pages. Click “Create Book” → your browser will download the final `book.pdf`.

---

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
git clone https://github.com/avfaulkner/book-page-estimator.git
cd book-page-estimator
netlify init
npm install --save-dev @vitejs/plugin-react
npm install node-sass --save-dev
```

Deploy to Netlify

```
netlify deploy --prod
```

Follow the prompts to connect to GitHub and deploy the site.
Once repo's main branch is connected to Netlify, the repo will be deployed using the `npm run build` command and published to `dist`.