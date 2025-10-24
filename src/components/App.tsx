import React from "react";
import Navbar from "./Navbar";
import PageEstimator from "./PageEstimator";
import CoverEditor from "./CoverEditor";
import CanvasPreview from "./CanvasPreview";
import PdfBookCreator from "./PdfBookCreator";
import { CoverContext } from "../context/CoverContext";

const App = () => {
  const { pageCount, setPageCount } = React.useContext(CoverContext);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">
        <section id="estimate">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Estimate Your Pages</h2>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <PageEstimator />
            <div className="text-lg text-green-700 font-semibold mt-4">
              Estimated Pages: <span id="estimated-pages-display">{pageCount}</span>
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
        </section>

        <section id="cover">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Design Your Cover</h2>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <CoverEditor />
            <CanvasPreview />
          </div>
        </section>

        <section id="pdf">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Create Your PDF Book</h2>
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
            <p className="text-sm text-slate-600 mb-4">
              Upload your intro page (PDF) and PNG pages to generate a one-sided printable book.
            </p>
            <PdfBookCreator />
          </div>
        </section>
      </main>

      <footer className="text-center text-slate-500 text-sm py-6 border-t border-slate-200 bg-white">
        © 2025 Book Page Estimator — Designed by AVF
      </footer>
    </div>
  );
};

export default App;