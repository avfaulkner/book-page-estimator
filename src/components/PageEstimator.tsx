// PageEstimator.tsx
import React, { useContext } from "react";
import { CoverContext } from "../context/CoverContext";

const PageEstimator = () => {
  const {
    wordCount,
    setWordCount,
    fontSize,
    setFontSize,
    trimSize,
    setTrimSize,
    pageCount,
    setPageCount,
    estimatedPages
  } = useContext(CoverContext);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
      <div>
        <label className="block text-sm font-medium mb-1">Word Count</label>
        <input
          type="number"
          placeholder="Enter word count"
          value={wordCount ?? ""}
          onChange={e => setWordCount(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full border p-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <input
          type="number"
          value={fontSize}
          placeholder="Font size"
          onChange={e => setFontSize(parseInt(e.target.value))}
          className="w-full border p-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Trim Size</label>
        <select
          value={trimSize}
          onChange={e => setTrimSize(e.target.value)}
          className="w-full border p-1"
        >
          <option value="5x8">5 x 8</option>
          <option value="6x9">6 x 9</option>
          <option value="8.5x11">8.5 x 11</option>
          <option value="8.5x8.5">8.5 x 8.5 (Square)</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Optional: Enter known page count</label>
        <input
          type="number"
          placeholder="Optional: known page count"
          value={pageCount ?? ""}
          onChange={e => setPageCount(e.target.value ? parseInt(e.target.value) : null)}
          className="w-full border p-1"
        />
      </div>
      <div className="md:col-span-3 mt-2">
        <span className="font-semibold">Estimated Pages: </span>
        {estimatedPages}
      </div>
    </div>
  );
};

export default PageEstimator;
// This component allows users to input their book's word count, font size, trim size, and optionally a known page count.
// It calculates the estimated number of pages based on the inputs and displays it below the input fields.
// The inputs are styled using Tailwind CSS for a clean and modern look.