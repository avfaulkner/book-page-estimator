import React from "react";
import PageEstimator from "./PageEstimator";
import CoverEditor from "./CoverEditor";
import CanvasPreview from "./CanvasPreview";
import { CoverContext } from "../context/CoverContext";

const App = () => {
  const { pageCount, setPageCount } = useContext(CoverContext);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📘 Book Page Estimator + Cover Designer</h1>
      <div className="space-y-2 border rounded p-4 shadow">
        <PageEstimator />
        <div className="text-lg text-green-700 font-semibold">
          Estimated Pages: <span id="estimated-pages-display">{pageCount}</span>
        </div>
        <div className="mt-2">
          <label className="block mb-1 font-medium">Or enter known page count</label>
          <input
            type="number"
            className="w-full border p-2"
            placeholder="e.g., 120"
            value={pageCount !== 0 ? pageCount : ""}
            onChange={e => setPageCount(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <CoverEditor />
      <CanvasPreview />
    </div>
  );
};

export default App;
// This is the main App component that combines the page estimator, cover editor, and canvas preview.
// It provides a user-friendly interface for estimating book pages and designing covers.
// The estimated pages are displayed below the page estimator, and users can also enter a known page count if they have it.
// The CoverEditor allows users to customize the book cover details, and the CanvasPreview shows a real-time preview of the cover design based on the inputs provided in the CoverEditor.
// The components are styled using Tailwind CSS for a clean and modern look.