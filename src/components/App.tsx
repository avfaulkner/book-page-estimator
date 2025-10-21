import React from "react";
import PageEstimator from "./PageEstimator";
import CoverEditor from "./CoverEditor";
import CanvasPreview from "./CanvasPreview";
import PdfBookCreator from "./PdfBookCreator";
import { CoverContext } from "../context/CoverContext";

const App = () => {
  const { pageCount, setPageCount } = React.useContext(CoverContext);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-center">
        Book Page Estimator + Cover Designer
      </h1>

      {/* --- Book Page Estimator Section --- */}
      <div className="space-y-2 border rounded p-4 shadow">
        <PageEstimator />
        <div className="text-lg text-green-700 font-semibold">
          Estimated Pages: <span id="estimated-pages-display">{pageCount}</span>
        </div>
        <div className="mt-2">
          <label className="block mb-1 font-medium">
            Or enter known page count
          </label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="e.g., 120"
            value={pageCount !== 0 ? pageCount : ""}
            onChange={(e) => setPageCount(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* --- Cover Design Section --- */}
      <div className="border rounded p-4 shadow space-y-4">
        <h2 className="text-xl font-semibold">Cover Designer</h2>
        <CoverEditor />
        <CanvasPreview />
      </div>

      {/* --- PDF Book Creator Section --- */}
      <div className="border rounded p-4 shadow space-y-4 bg-gray-50">
        <h2 className="text-xl font-semibold text-blue-700">
          PDF Book Creator
        </h2>
        <p className="text-sm text-gray-600">
          Upload your <strong>intro page</strong> (PDF) and your <strong>PNG
          pages</strong> below to generate a one-sided printable book PDF.
        </p>
        <PdfBookCreator />
      </div>
    </div>
  );
};

export default App;

// This is the main App component that combines the book page estimator,
// cover editor, and PDF book creator into a single clean interface.
// Tailwind CSS styling ensures consistent spacing, shadows, and typography.
// The new PDF Book Creator allows users to upload files and download
// a complete printable book built by the Render backend.