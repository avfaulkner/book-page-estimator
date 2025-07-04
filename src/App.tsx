// === src/App.tsx ===
import { useState, useRef, useEffect } from 'react';
import { estimatePages } from './estimatePages';

interface PositionedImage {
  file: File;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
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
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [resizingId, setResizingId] = useState<string | null>(null);

  const pages = estimatePages(Number(wordCount) || 0, trimSize, Number(fontSize) || 12);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (const img of backImages) {
      const isInResizeCorner =
        x >= img.x + img.width - 10 && x <= img.x + img.width &&
        y >= img.y + img.height - 10 && y <= img.y + img.height;
      if (isInResizeCorner) {
        setResizingId(img.id);
        return;
      }
      if (x >= img.x && x <= img.x + img.width && y >= img.y && y <= img.y + img.height) {
        setDraggingId(img.id);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId && !resizingId) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBackImages(prev =>
      prev.map(img => {
        if (img.id === draggingId) return { ...img, x: x - img.width / 2, y: y - img.height / 2 };
        if (img.id === resizingId) return { ...img, width: Math.max(20, x - img.x), height: Math.max(20, y - img.y) };
        return img;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
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
      ctx.fillStyle = '#d1d5db';
      ctx.fillRect(0, 0, trimW * dpi, height);
      backImages.forEach(({ file, x, y, width, height }) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, x, y, width, height);
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.strokeRect(x, y, width, height);
          ctx.fillStyle = '#fff';
          ctx.fillRect(x + width - 10, y + height - 10, 10, 10);
          ctx.strokeRect(x + width - 10, y + height - 10, 10, 10);
        };
        img.src = URL.createObjectURL(file);
      });

      ctx.fillStyle = descColor;
      ctx.font = `${descFontSize}px sans-serif`;
      ctx.textAlign = descAlign;
      description.split('\n').forEach((line, i) => {
        ctx.fillText(line, descPosition.x, descPosition.y + i * (descFontSize + 4));
      });

      if (frontFile) {
        const frontImg = new Image();
        frontImg.onload = () => ctx.drawImage(frontImg, (trimW + spineW) * dpi, 0, trimW * dpi, height);
        frontImg.src = URL.createObjectURL(frontFile);
      }
    }

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
          <label>Upload Back Cover Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => {
              const files = Array.from(e.target.files || []);
              const images = files.map((file, index) => ({ file, x: 20 + index * 110, y: 20, width: 100, height: 100, id: `${Date.now()}-${index}` }));
              setBackImages(images);
            }}
            className="w-full"
          />
        </div>
        {/* ... other inputs ... */}
      </div>
      <canvas
        ref={canvasRef}
        className="border rounded shadow w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
}

export default App;