import React from "react";
import PageEstimator from "./PageEstimator";
import CoverEditor from "./CoverEditor";
import CanvasPreview from "./CanvasPreview";
import PdfBookCreator from "./PdfBookCreator";
import { CoverContext } from "../context/CoverContext";

// This is the main application component that integrates all features.
// It includes the Page Estimator, Cover Designer, and PDF Book Creator.
// The layout is structured with a navbar, hero section, main content area, and footer.
// It uses the CoverContext to manage shared state across components.

const App = () => {
  const { pageCount, setPageCount } = React.useContext(CoverContext);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* ───── NAVBAR ───── */}
      <nav className="w-full bg-white border-b border-slate-200 shadow-sm py-3 px-6 flex justify-between items-center sticky top-0 z-50">
        <span className="font-semibold text-blue-700 text-lg tracking-tight">
          Book Tools
        </span>
        <a
          href="https://github.com/avfaulkner"
          className="text-slate-500 hover:text-blue-600 text-sm font-medium transition"
        >
          GitHub
        </a>
      </nav>

      {/* ───── HERO SECTION ───── */}
      <section className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-none md:rounded-b-3xl shadow-inner">
        <h1 className="text-4xl font-bold text-blue-800 mb-3 tracking-tight">
          Your Book, Perfectly Planned
        </h1>
        <p className="text-slate-700 max-w-2xl mx-auto px-4 text-base sm:text-lg">
          Estimate, design, and create print-ready book PDFs — all in one
          intuitive workspace.
        </p>
      </section>

      {/* ───── MAIN CONTENT ───── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Page Estimator */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 transition-transform hover:scale-[1.01]">
          <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">
            Book Page Estimator
          </h2>
          <PageEstimator />
          <div className="text-lg text-green-700 font-semibold mt-4">
            Estimated Pages:{" "}
            <span id="estimated-pages-display">{pageCount}</span>
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium text-slate-700">
              Or enter known page count
            </label>
            <input
              type="number"
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              placeholder="e.g., 120"
              value={pageCount !== 0 ? pageCount : ""}
              onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Cover Designer */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 transition-transform hover:scale-[1.01]">
          <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-4">
            Cover Designer
          </h2>
          <CoverEditor />
          <CanvasPreview />
        </div>

        {/* PDF Book Creator */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 transition-transform hover:scale-[1.01]">
          <h2 className="text-xl font-semibold text-blue-700 border-b pb-2 mb-3">
            PDF Book Creator
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Upload your <strong>intro page (PDF)</strong> and your{" "}
            <strong>PNG pages</strong> to generate a one-sided printable book.
          </p>
          <PdfBookCreator />
        </div>
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="text-center text-slate-500 text-sm py-6 border-t border-slate-200 bg-white">
        © 2025 Book Page Estimator — Designed by{" "}
        <a
          href="https://www.linkedin.com/in/avfaulkner"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          AVF
        </a>
      </footer>
    </div>
  );
};

export default App;