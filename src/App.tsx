import { useState } from 'react';
import { estimatePages } from './estimatePages';

function App() {
  const [wordCount, setWordCount] = useState('');
  const [trimSize, setTrimSize] = useState('6x9');
  const [fontSize, setFontSize] = useState(12);
  const [title, setTitle] = useState('My Book Title');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  const pages = estimatePages(Number(wordCount) || 0, trimSize, fontSize);

  const handleSubmit = async () => {
    const formData = new FormData();
    if (!frontFile) return;

    formData.append('front', frontFile);
    if (backFile) formData.append('back', backFile);
    formData.append('title', title);
    formData.append('trimSize', trimSize);
    formData.append('pageCount', pages.toString());

    const res = await fetch('/api/generateCoverPDF', {
      method: 'POST',
      body: formData,
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'book_cover.pdf';
    link.click();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📘 Book Page Estimator + Cover Generator</h1>

      <input
        type="number"
        placeholder="Word Count"
        value={wordCount}
        onChange={(e) => setWordCount(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="number"
        placeholder="Font Size"
        value={fontSize}
        onChange={(e) => setFontSize(parseFloat(e.target.value))}
        className="w-full mb-3 p-2 border rounded"
      />

      <select
        value={trimSize}
        onChange={(e) => setTrimSize(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="5x8">5 x 8</option>
        <option value="6x9">6 x 9</option>
        <option value="8.5x11">8.5 x 11</option>
      </select>

      <input
        type="text"
        placeholder="Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFrontFile(e.target.files?.[0] || null)}
        className="w-full mb-3"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBackFile(e.target.files?.[0] || null)}
        className="w-full mb-3"
      />

      <p className="mb-4">📄 Estimated Pages: {pages}</p>

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Generate Cover PDF
      </button>
    </div>
  );
}

export default App;