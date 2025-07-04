// import React, { useState, useRef, useEffect } from "react";

// interface ImagePosition {
//   file: File;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   id: string;
// }

// const App = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [wordCount, setWordCount] = useState(0);
//   const [fontSize, setFontSize] = useState<number[]>([]);
//   const [trimSize, setTrimSize] = useState("6x9");
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [frontFile, setFrontFile] = useState<File | null>(null);
//   const [backImages, setBackImages] = useState<ImagePosition[]>([]);
//   const [description, setDescription] = useState("");
//   const [bgColor, setBgColor] = useState("#ffffff");
//   const [textureFile, setTextureFile] = useState<File | null>(null);
//   const [spineFontFamily, setSpineFontFamily] = useState("sans-serif");
//   const [spineFontSize, setSpineFontSize] = useState(16);
//   const [spineFontColor, setSpineFontColor] = useState("#000000");
//   const [descFontSize, setDescFontSize] = useState(14);
//   const [descColor, setDescColor] = useState("#000000");
//   const [descAlign, setDescAlign] = useState("left");
//   const [spineOnlyView, setSpineOnlyView] = useState(false);

//   const [draggingId, setDraggingId] = useState<string | null>(null);

//   // const pages = Math.ceil(wordCount / (trimSize === "8.5x11" ? 400 : 300));

//     const estimatePages = (words: number, trim: string, font: number): number => {
//     const baseWordsPerPage = {
//       "5x8": 250,
//       "6x9": 300,
//       "8.5x11": 400,
//       "8.5x8.5": 280
//     };
//     const wordsPerPage = baseWordsPerPage[trim] * (font / 12);
//     return Math.ceil(words / wordsPerPage);
//   };

//   const pages = estimatePages(wordCount, trimSize, fontSize);


//   const drawCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const width = 900;
//     const height = 600;
//     canvas.width = width;
//     canvas.height = height;

//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, width, height);

//     // Draw spine
//     const spineWidth = Math.max(10, pages * 0.75); // more accurate scaling
//     const spineX = width / 2 - spineWidth / 2;
//     ctx.fillStyle = "#cccccc";
//     ctx.fillRect(spineX, 0, spineWidth, height);

//     // Spine Text
//     ctx.fillStyle = spineFontColor;
//     ctx.font = `${spineFontSize}px ${spineFontFamily}`;
//     ctx.save();
//     ctx.translate(width / 2, height / 2);
//     ctx.rotate(-Math.PI / 2);
//     ctx.textAlign = "center";
//     ctx.fillText(`${title} - ${author}`, 0, 0);
//     ctx.restore();

//     if (!spineOnlyView) {
//       // Draw front cover
//       if (frontFile) {
//         const img = new Image();
//         img.src = URL.createObjectURL(frontFile);
//         img.onload = () => ctx.drawImage(img, spineX + spineWidth, 0, width / 2 - spineWidth, height);
//       }

//       // Draw back cover images
//       backImages.forEach(pos => {
//         const img = new Image();
//         img.src = URL.createObjectURL(pos.file);
//         img.onload = () => ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
//       });

//       // Draw back cover text
//       ctx.fillStyle = descColor;
//       ctx.font = `${descFontSize}px sans-serif`;
//       ctx.textAlign = descAlign as CanvasTextAlign;
//       const textX = descAlign === "center" ? width / 4 : descAlign === "right" ? width / 2 - spineWidth - 20 : 20;
//       const lines = description.split("\n");
//       lines.forEach((line, i) => {
//         ctx.fillText(line, textX, 400 + i * (descFontSize + 4));
//       });
//     }
//   };

//   useEffect(() => {
//     drawCanvas();
//   }, [wordCount, fontSize, trimSize, title, author, frontFile, backImages, description, bgColor, textureFile, spineFontColor, spineFontSize, spineFontFamily, descColor, descFontSize, descAlign, spineOnlyView]);

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const target = backImages.find(img =>
//       x >= img.x && x <= img.x + img.width &&
//       y >= img.y && y <= img.y + img.height
//     );
//     if (target) setDraggingId(target.id);
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!draggingId) return;
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     setBackImages(prev =>
//       prev.map(img =>
//         img.id === draggingId ? { ...img, x: x - img.width / 2, y: y - img.height / 2 } : img
//       )
//     );
//   };

//   const handleMouseUp = () => {
//     setDraggingId(null);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">📘 Book Page Estimator + Cover Designer</h1>
//       <div className="grid md:grid-cols-2 gap-4">
//         <div>
//           <label>Word Count</label>
//           <input type="number" value={wordCount} onChange={e => setWordCount(Number(e.target.value))} className="w-full border p-1" />
//           <small>{pages} estimated pages</small>
//         </div>
//         <div>
//           <label>Font Size</label>
//           <input type="number" value={fontSize} placeholder="Font size" onChange={e => setFontSize(Number(e.target.value))} className="w-full border p-1" />
//         </div>
//         <div>
//           <label>Trim Size</label>
//           <select value={trimSize} onChange={e => setTrimSize(e.target.value)} className="w-full border p-1">
//             <option value="5x8">5 x 8</option>
//             <option value="6x9">6 x 9</option>
//             <option value="8.5x11">8.5 x 11</option>
//             <option value="8.5x8.5">8.5 x 8.5 (Square)</option>
//           </select>
//         </div>
//         <div>
//           <label>Title</label>
//           <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-1" />
//         </div>
//         <div>
//           <label>Author</label>
//           <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full border p-1" />
//         </div>
//         <div>
//           <label>Upload Front Cover</label>
//           <input type="file" accept="image/*" onChange={e => setFrontFile(e.target.files?.[0] || null)} className="w-full" />
//         </div>
//         <div>
//           <label>Upload Back Cover Images</label>
//           <input type="file" accept="image/*" multiple onChange={e => {
//             const files = Array.from(e.target.files || []);
//             const images = files.map((file, index) => ({
//               file,
//               x: 20 + index * 110,
//               y: 20,
//               width: 100,
//               height: 100,
//               id: `${Date.now()}-${index}`
//             }));
//             setBackImages(images);
//           }} className="w-full" />
//         </div>
//         <div>
//           <label>Back Cover Description</label>
//           <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-1" />
//         </div>
//         <div>
//           <label>Background Color</label>
//           <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
//         </div>
//         <div>
//           <label>Texture Image (optional)</label>
//           <input type="file" accept="image/*" onChange={e => setTextureFile(e.target.files?.[0] || null)} className="w-full" />
//         </div>
//         <div>
//           <label>Spine Font Family</label>
//           <select value={spineFontFamily} onChange={e => setSpineFontFamily(e.target.value)} className="w-full border p-1">
//             <option value="sans-serif">Sans-serif</option>
//             <option value="serif">Serif</option>
//             <option value="monospace">Monospace</option>
//             <option value="cursive">Cursive</option>
//           </select>
//         </div>
//         <div>
//           <label>Spine Font Size</label>
//           <input type="number" value={spineFontSize} onChange={e => setSpineFontSize(Number(e.target.value))} className="w-full border p-1" />
//         </div>
//         <div>
//           <label>Spine Font Color</label>
//           <input type="color" value={spineFontColor} onChange={e => setSpineFontColor(e.target.value)} />
//         </div>
//         <div>
//           <label>Back Text Font Size</label>
//           <input type="number" value={descFontSize} onChange={e => setDescFontSize(Number(e.target.value))} className="w-full border p-1" />
//         </div>
//         <div>
//           <label>Back Text Color</label>
//           <input type="color" value={descColor} onChange={e => setDescColor(e.target.value)} />
//         </div>
//         <div>
//           <label>Text Alignment</label>
//           <select value={descAlign} onChange={e => setDescAlign(e.target.value)} className="w-full border p-1">
//             <option value="left">Left</option>
//             <option value="center">Center</option>
//             <option value="right">Right</option>
//           </select>
//         </div>
//         <div>
//           <label className="flex items-center gap-2">
//             <input type="checkbox" checked={spineOnlyView} onChange={e => setSpineOnlyView(e.target.checked)} />
//             Preview spine only
//           </label>
//         </div>
//       </div>

//       <canvas
//         ref={canvasRef}
//         className="border rounded shadow w-full mt-4"
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//       />
//     </div>
//   );
// };

// export default App;
import React from "react";
import PageEstimator from "./pageEstimator";
import CoverEditor from "./coverEditor";
import CanvasPreview from "./canvasPreview";
import { CoverContext } from "../context/coverContext";

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