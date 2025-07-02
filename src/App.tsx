// === src/App.tsx ===
import { useState, useRef, useEffect } from 'react';
import { estimatePages } from './estimatePages';

function App() {
  const [wordCount, setWordCount] = useState('');
  const [trimSize, setTrimSize] = useState('6x9');
  const [fontSize, setFontSize] = useState<number | "">("");
  const [title, setTitle] = useState('My Book Title');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pages = estimatePages(Number(wordCount) || 0, trimSize, Number(fontSize) || 12);

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

  useEffect(() => {
    if (!canvasRef.current) return;

    const drawPreview = async () => {
      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      const dpi = 50;
      const [trimW, trimH] = trimSize.split('x').map(n => parseFloat(n.trim())) as [number, number];
      const spineW = pages * 0.002252;
      const totalW = (trimW * 2 + spineW) * dpi;
      const height = trimH * dpi;
      canvasRef.current!.width = totalW;
      canvasRef.current!.height = height;

      ctx.clearRect(0, 0, totalW, height);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, totalW, height);

      if (backFile) {
        const backImg = new Image();
        backImg.onload = () => ctx.drawImage(backImg, 0, 0, trimW * dpi, height);
        backImg.src = URL.createObjectURL(backFile);
      } else {
        ctx.fillStyle = '#d1d5db';
        ctx.fillRect(0, 0, trimW * dpi, height);
        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.fillText('Back Cover', 10, 20);
      }

      ctx.fillStyle = '#ccc';
      ctx.fillRect(trimW * dpi, 0, spineW * dpi, height);
      ctx.save();
      ctx.translate((trimW + spineW / 2) * dpi, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#000';
      ctx.font = `${14}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(title, 0, 5);
      ctx.restore();

      if (frontFile) {
        const frontImg = new Image();
        frontImg.onload = () => ctx.drawImage(frontImg, (trimW + spineW) * dpi, 0, trimW * dpi, height);
        frontImg.src = URL.createObjectURL(frontFile);
      } else {
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect((trimW + spineW) * dpi, 0, trimW * dpi, height);
        ctx.fillStyle = '#000';
        ctx.font = '12px sans-serif';
        ctx.fillText('Front Cover', (trimW * 2 + spineW) * dpi - 60, 20);
      }
    };

    const addRuler = () => {
      const ctx = canvasRef.current!.getContext('2d');
      if (!ctx) return;

      const dpi = 50;
      const [trimW, trimH] = trimSize.split('x').map(n => parseFloat(n.trim())) as [number, number];
      const spineW = pages * 0.002252;
      const totalW = (trimW * 2 + spineW) * dpi;
      const height = trimH * dpi;

      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';

      for (let i = 0; i <= totalW; i += dpi) {
        ctx.beginPath();
        ctx.moveTo(i, height);
        ctx.lineTo(i, height - 10);
        ctx.stroke();
        ctx.fillText((i / dpi).toFixed(0) + '"', i, height - 12);
      }

      for (let i = 0; i <= height; i += dpi) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(10, i);
        ctx.stroke();
        ctx.fillText((i / dpi).toFixed(0) + '"', 15, i + 3);
      }
    };

    drawPreview();
    addRuler();
  }, [frontFile, backFile, title, trimSize, pages, fontSize, wordCount]);

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
        value={fontSize ?? ''}
        onChange={(e) => setFontSize(e.target.value === '' ? '' : parseFloat(e.target.value))}
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="w-full mb-3">
  <label className="block text-sm font-medium mb-1">Trim Size</label>
  <select
    value={trimSize}
    onChange={(e) => setTrimSize(e.target.value)}
    className="w-full p-2 border rounded mb-2"
  >
    <option value="5x8">5 x 8</option>
    <option value="6x9">6 x 9</option>
    <option value="8.5x11">8.5 x 11</option>
    <option value="8x8">8 x 8 (Square)</option>
    <option value="8.25x8.25">8.25 x 8.25 (Square)</option>
    <option value="8.5x8.5">8.5 x 8.5 (Square)</option>
    <option value="custom">Custom...</option>
  </select>
  {trimSize === 'custom' && (
    <div className="flex space-x-2">
      <input
        type="number"
        step="0.01"
        placeholder="Width (in)"
        onChange={(e) => {
          const h = trimSize.split('x')[1] || '9';
          setTrimSize(`${e.target.value}x${h}`);
        }}
        className="w-1/2 p-2 border rounded"
      />
      <input
        type="number"
        step="0.01"
        placeholder="Height (in)"
        onChange={(e) => {
          const w = trimSize.split('x')[0] || '6';
          setTrimSize(`${w}x${e.target.value}`);
        }}
        className="w-1/2 p-2 border rounded"
      />
    </div>
  )}
</div>

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

      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Generate Cover PDF
      </button>

      <h2 className="text-lg font-semibold mb-2">Live Preview:</h2>
      <canvas ref={canvasRef} className="border rounded shadow-md w-full" />

      <button
        onClick={() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const link = document.createElement('a');
          link.download = 'book_cover_preview.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
      >
        Download Preview as Image
      </button>
    </div>
  );
}

export default App;