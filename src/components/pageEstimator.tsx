// PageEstimator.tsx
import React, { useContext, useEffect } from "react";
import { CoverContext } from "../context/coverContext";

const PageEstimator = () => {
  const {
    wordCount,
    setWordCount,
    fontSize,
    setFontSize,
    trimSize,
    setTrimSize,
    setPageCount,
    pageCount
  } = useContext(CoverContext);

  const baseWordsPerPage = {
    "5x8": 250,
    "6x9": 300,
    "8.5x11": 400,
    "8.5x8.5": 280
  };

  useEffect(() => {
    if (wordCount > 0 && fontSize > 0 && !pageCount) {
      const wpp = baseWordsPerPage[trimSize] * (fontSize / 12);
      const estimate = Math.ceil(wordCount / wpp);
      setPageCount(estimate);
    }
  }, [wordCount, fontSize, trimSize]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block mb-1">Word Count</label>
        <input
          type="number"
          value={wordCount}
          onChange={e => setWordCount(parseInt(e.target.value) || 0)}
          className="w-full border p-2"
          placeholder="e.g., 35000"
        />
      </div>
      <div>
        <label className="block mb-1">Font Size</label>
        <input
          type="number"
          value={fontSize}
          onChange={e => setFontSize(parseFloat(e.target.value) || 0)}
          className="w-full border p-2"
          placeholder="e.g., 12"
        />
      </div>
      <div>
        <label className="block mb-1">Trim Size</label>
        <select
          value={trimSize}
          onChange={e => setTrimSize(e.target.value)}
          className="w-full border p-2"
        >
          <option value="5x8">5" x 8"</option>
          <option value="6x9">6" x 9"</option>
          <option value="8.5x11">8.5" x 11"</option>
          <option value="8.5x8.5">8.5" x 8.5"</option>
        </select>
      </div>
    </div>
  );
};

export default PageEstimator;