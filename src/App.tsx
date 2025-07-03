// === src/App.tsx ===
import { useState, useRef, useEffect } from 'react';
import { estimatePages } from './estimatePages';

function App() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [wordCount, setWordCount] = useState('');
  const [trimSize, setTrimSize] = useState('6x9');
  const [fontSize, setFontSize] = useState<number | "">("");
  const [title, setTitle] = useState('My Book Title');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFiles, setBackFiles] = useState<File[]>([]);
  const [margin, setMargin] = useState<number>(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pages = estimatePages(Number(wordCount) || 0, trimSize, Number(fontSize) || 12);

  const moveBackFile = (index: number, direction: number) => {
    const newOrder = [...backFiles];
    const target = index + direction;
    if (target >= 0 && target < newOrder.length) {
      [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
      setBackFiles(newOrder);
    }
  };

  const drawBackCoverLayout = (ctx: CanvasRenderingContext2D, dpi: number, width: number, height: number) => {
    const padding = margin;
    const imgWidth = (width - padding * 3) / 2;
    const imgHeight = height / 3 - padding;

    const positions = [
      [padding, padding],
      [padding * 2 + imgWidth, padding],
      [padding, padding * 2 + imgHeight],
      [padding * 2 + imgWidth, padding * 2 + imgHeight],
      [width / 2 - imgWidth / 2, padding * 3 + imgHeight * 2],
    ];

    backFiles.forEach((file, i) => {
      const [x, y] = positions[i] || [0, 0];
      const img = new Image();
      img.onload = () => ctx.drawImage(img, x, y, imgWidth, imgHeight);
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (!frontFile) return;

    formData.append('front', frontFile);
    backFiles.forEach((file, idx) => formData.append(`back${idx}`, file));
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
      let [trimW, trimH] = trimSize.split('x').map(n => parseFloat(n.trim())) as [number, number];
      if (unit === 'cm') {
        trimW /= 2.54;
        trimH /= 2.54;
      }
      const spineW = pages * 0.002252;
      const totalW = (trimW * 2 + spineW) * dpi;
      const height = trimH * dpi;
      canvasRef.current!.width = totalW;
      canvasRef.current!.height = height;

      ctx.clearRect(0, 0, totalW, height);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, totalW, height);

      if (backFiles.length > 0) {
        drawBackCoverLayout(ctx, dpi, trimW * dpi, height);
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

    drawPreview();
  }, [frontFile, backFiles, title, trimSize, pages, fontSize, wordCount, margin]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">📘 Book Page Estimator + Cover Generator</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block">Word Count</label>
          <input value={wordCount} onChange={e => setWordCount(e.target.value)} className="w-full border p-1 rounded" />
        </div>

        <div>
          <label className="block">Font Size</label>
          <input value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full border p-1 rounded" placeholder="font size" />
        </div>

        <div>
          <label className="block">Trim Size</label>
          <input value={trimSize} onChange={e => setTrimSize(e.target.value)} className="w-full border p-1 rounded" />
        </div>

        <div>
          <label className="block">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-1 rounded" />
        </div>

        <div>
          <label className="block">Front Cover Image</label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && setFrontFile(e.target.files[0])} />
        </div>

        <div>
          <label className="block">Back Cover Images</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setBackFiles(Array.from(e.target.files || []))} />
        </div>

        <div>
          <label className="block">Image Margin (px)</label>
          <input type="number" value={margin} min={0} onChange={(e) => setMargin(Number(e.target.value))} className="w-full border p-1 rounded" />
        </div>
      </div>

      <div>
        <label className="block font-semibold mt-4">Reorder Back Cover Images</label>
        {backFiles.map((file, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <span className="text-sm w-8">{index + 1}.</span>
            <span className="truncate flex-1">{file.name}</span>
            <button onClick={() => moveBackFile(index, -1)} className="text-xs px-2 py-1 bg-gray-200">↑</button>
            <button onClick={() => moveBackFile(index, 1)} className="text-xs px-2 py-1 bg-gray-200">↓</button>
          </div>
        ))}
      </div>

      <canvas ref={canvasRef} className="border rounded shadow-md w-full" />
    </div>
  );
}

export default App;