// === src/App.tsx ===
import { useState, useRef, useEffect } from 'react';
import { estimatePages } from './estimatePages';

interface PositionedImage {
  file: File;
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [wordCount, setWordCount] = useState('');
  const [trimSize, setTrimSize] = useState('6x9');
  const [fontSize, setFontSize] = useState<number | "">("");
  const [title, setTitle] = useState('My Book Title');
  const [author, setAuthor] = useState('Author Name');
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backImages, setBackImages] = useState<PositionedImage[]>([]);
  const [margin, setMargin] = useState<number>(20);
  const [description, setDescription] = useState<string>('');
  const [descFontSize, setDescFontSize] = useState<number>(14);
  const [descAlign, setDescAlign] = useState<'left' | 'center' | 'right'>('left');
  const [descColor, setDescColor] = useState<string>('#000000');
  const [spineFontSize, setSpineFontSize] = useState<number>(14);
  const [spineFontColor, setSpineFontColor] = useState<string>('#000000');
  const [spineOnlyView, setSpineOnlyView] = useState(false);
  const [spineFontFamily, setSpineFontFamily] = useState('sans-serif');
  const [bgColor, setBgColor] = useState('#f0f0f0');
  const [textureFile, setTextureFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [descPosition, setDescPosition] = useState({ x: 20, y: 50 });

  const pages = estimatePages(Number(wordCount) || 0, trimSize, Number(fontSize) || 12);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'book_cover_preview.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const dpi = 50;
    let [trimW, trimH] = trimSize.split('x').map(n => parseFloat(n.trim()));
    if (unit === 'cm') {
      trimW /= 2.54;
      trimH /= 2.54;
    }
    const spineW = (pages / 444) * 0.07;
    const totalW = (trimW * 2 + spineW) * dpi;
    const height = trimH * dpi;

    canvasRef.current.width = totalW;
    canvasRef.current.height = height;

    // Draw background
    if (textureFile) {
      const bg = new Image();
      bg.onload = () => {
        const pattern = ctx.createPattern(bg, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, totalW, height);
        }
      };
      bg.src = URL.createObjectURL(textureFile);
    } else {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalW, height);
    }

    if (!spineOnlyView) {
      // Back Cover
      ctx.fillStyle = '#d1d5db';
      ctx.fillRect(0, 0, trimW * dpi, height);
      backImages.forEach(({ file, x, y, width, height }) => {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, x, y, width, height);
        img.src = URL.createObjectURL(file);
      });

      // Back Description
      ctx.fillStyle = descColor;
      ctx.font = `${descFontSize}px sans-serif`;
      ctx.textAlign = descAlign;
      description.split('\n').forEach((line, i) => {
        ctx.fillText(line, descPosition.x, descPosition.y + i * (descFontSize + 4));
      });

      // Front Cover
      if (frontFile) {
        const frontImg = new Image();
        frontImg.onload = () => ctx.drawImage(frontImg, (trimW + spineW) * dpi, 0, trimW * dpi, height);
        frontImg.src = URL.createObjectURL(frontFile);
      }
    }

    // Spine
    ctx.fillStyle = '#ccc';
    ctx.fillRect(trimW * dpi, 0, spineW * dpi, height);
    ctx.save();
    ctx.translate((trimW + spineW / 2) * dpi, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = spineFontColor;
    ctx.font = `${spineFontSize}px ${spineFontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${title} - ${author}`, 0, 5);
    ctx.restore();
  }, [backImages, title, author, trimSize, pages, frontFile, description, descFontSize, descAlign, descPosition, bgColor, textureFile, descColor, spineFontSize, spineFontColor, spineFontFamily, spineOnlyView]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📘 Book Page Estimator + Cover Designer</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label title="Total number of words in your manuscript">Word Count 🛈</label>
          <input type="number" value={wordCount} onChange={e => setWordCount(e.target.value)} className="w-full border p-1 rounded" />
        </div>
        <div>
          <label title="Font size inside your book, usually 11–12pt">Font Size 🛈</label>
          <input type="number" placeholder="font size" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full border p-1 rounded" />
        </div>
        <div>
          <label>Trim Size</label>
          <select value={trimSize} onChange={e => setTrimSize(e.target.value)} className="w-full border p-1 rounded">
            <option value="6x9">6 x 9</option>
            <option value="5.5x8.5">5.5 x 8.5</option>
            <option value="8.5x11">8.5 x 11</option>
            <option value="8x8">8 x 8 (Square)</option>
            <option value="7x10">7 x 10</option>
          </select>
        </div>
        <div>
          <label>Estimated Pages</label>
          <div className="font-medium text-lg">{pages}</div>
        </div>
        <div>
          <label>Spine Font Family</label>
          <select value={spineFontFamily} onChange={e => setSpineFontFamily(e.target.value)} className="w-full border p-1 rounded">
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="cursive">Cursive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={spineOnlyView} onChange={e => setSpineOnlyView(e.target.checked)} />
          <label>Preview Spine Only</label>
        </div>
        <div>
          <label>Background Color</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full border rounded" />
        </div>
        <div>
          <label>Texture Upload (Optional)</label>
          <input type="file" accept="image/*" onChange={e => setTextureFile(e.target.files?.[0] || null)} className="w-full" />
        </div>
        <div className="col-span-2">
          <label>Front Cover Image</label>
          <input type="file" accept="image/*" onChange={e => setFrontFile(e.target.files?.[0] || null)} className="w-full" />
        </div>
      </div>
      <canvas ref={canvasRef} className="border rounded shadow w-full" />
      <button
        onClick={downloadPNG}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Download Preview as PNG
      </button>
    </div>
  );
}

export default App;