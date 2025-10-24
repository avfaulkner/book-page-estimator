import React from "react";
import Sidebar from "./Sidebar";
import PageEstimator from "./PageEstimator";
import CoverEditor from "./CoverEditor";
import CanvasPreview from "./CanvasPreview";
import PdfBookCreator from "./PdfBookCreator";
import { CoverContext } from "../context/CoverContext";

const App = () => {
  const { pageCount, setPageCount } = React.useContext(CoverContext);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 flex">
      <Sidebar />

      <main className="flex-1 px-6 md:ml-60 py-20 space-y-20 max-w-5xl mx-auto">
        {/* HERO */}
        <section id="hero" className="text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            Your All-in-One Book Creator
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Estimate your book length, design your cover, and generate
            professional one-sided PDFs for printing — all in one place.
          </p>
        </section>

        {/* Estimate Pages */}
        <section id="estimate" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            📄 Estimate Your Pages
          </h2>
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
            <PageEstimator />
            <div className="text-lg text-green-700 font-semibold mt-4">
              Estimated Pages: <span>{pageCount}</span>
            </div>
            <div className="mt-4">
              <label className="block mb-1 font-medium text-slate-700">
                Or enter known page count
              </label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none transition"
                placeholder="e.g., 120"
                value={pageCount !== 0 ? pageCount : ""}
                onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </section>

        {/* Cover Designer */}
        <section id="cover" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            🎨 Design Your Cover
          </h2>
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
            <CoverEditor />
            <CanvasPreview />
          </div>
        </section>

        {/* PDF Creator */}
        <section id="pdf" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            📘 Create Your PDF Book
          </h2>
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
            <p className="text-slate-600 text-sm mb-4">
              Upload your intro page (PDF) and PNG pages to generate a
              one-sided printable book.
            </p>
            <PdfBookCreator />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm py-6">
          © 2025 Book Page Estimator — Designed by AVF
        </footer>
      </main>
    </div>
  );
};

export default App;
