// PageEstimator.tsx
import React, { useContext } from "react";
import { CoverContext } from "./context/CoverContext";

const PageEstimator = () => {
  const { wordCount, setWordCount, fontSize, setFontSize, trimSize, setTrimSize } = useContext(CoverContext);

  const estimatePages = (words: number, trim: string, font: number): number => {
    const baseWordsPerPage = {
      "5x8": 250,
      "6x9": 300,
      "8.5x11": 400,
      "8.5x8.5": 280
    };
    const wordsPerPage = baseWordsPerPage[trim] * (font / 12);
    return Math.ceil(words / wordsPerPage);
  };

  const pages = estimatePages(wordCount, trimSize, fontSize);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label>Word Count</label>
        <input
          type="number"
          value={wordCount}
          onChange={e => setWordCount(Number(e.target.value))}
          className="w-full border p-1"
        />
      </div>
      <div>
        <label>Font Size</label>
        <input
          type="number"
          value={fontSize}
          placeholder="Font size"
          onChange={e => setFontSize(Number(e.target.value))}
          className="w-full border p-1"
        />
      </div>
      <div>
        <label>Trim Size</label>
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
      <div className="col-span-2">
        <p className="font-semibold text-green-600">📄 Estimated pages: {pages}</p>
      </div>
    </div>
  );
};

export default PageEstimator;
// This component estimates the number of pages based on word count, trim size, and font size.
// It uses a simple formula to calculate the pages based on predefined words per page for each trim size.
// The estimated pages are displayed below the input fields.