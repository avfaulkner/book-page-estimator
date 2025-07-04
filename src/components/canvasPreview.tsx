// CanvasPreview.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { CoverContext } from "./context/CoverContext";

const CanvasPreview = () => {
  const {
    title,
    author,
    frontFile,
    backImages,
    setBackImages,
    description,
    bgColor,
    spineFontFamily,
    spineFontSize,
    spineFontColor,
    descFontSize,
    descColor,
    descAlign,
    spineOnlyView,
    wordCount,
    fontSize,
    trimSize
  } = useContext(CoverContext);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

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

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 900;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    const spineWidth = Math.max(10, pages * 0.75);
    const spineX = width / 2 - spineWidth / 2;

    ctx.fillStyle = "#cccccc";
    ctx.fillRect(spineX, 0, spineWidth, height);

    ctx.fillStyle = spineFontColor;
    ctx.font = `${spineFontSize}px ${spineFontFamily}`;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(`${title} - ${author}`, 0, 0);
    ctx.restore();

    if (!spineOnlyView) {
      if (frontFile) {
        const img = new Image();
        img.src = URL.createObjectURL(frontFile);
        img.onload = () => ctx.drawImage(img, spineX + spineWidth, 0, width / 2 - spineWidth, height);
      }

      backImages.forEach(pos => {
        const img = new Image();
        img.src = URL.createObjectURL(pos.file);
        img.onload = () => ctx.drawImage(img, pos.x, pos.y, pos.width, pos.height);
      });

      ctx.fillStyle = descColor;
      ctx.font = `${descFontSize}px sans-serif`;
      ctx.textAlign = descAlign as CanvasTextAlign;
      const textX = descAlign === "center" ? width / 4 : descAlign === "right" ? width / 2 - spineWidth - 20 : 20;
      const lines = description.split("\n");
      lines.forEach((line, i) => {
        ctx.fillText(line, textX, 400 + i * (descFontSize + 4));
      });
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [wordCount, fontSize, trimSize, title, author, frontFile, backImages, description, bgColor, spineFontColor, spineFontSize, spineFontFamily, descColor, descFontSize, descAlign, spineOnlyView]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const target = backImages.find(img => x >= img.x && x <= img.x + img.width && y >= img.y && y <= img.y + img.height);
    if (target) setDraggingId(target.id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBackImages(prev =>
      prev.map(img => (img.id === draggingId ? { ...img, x: x - img.width / 2, y: y - img.height / 2 } : img))
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return <canvas ref={canvasRef} className="border rounded shadow w-full mt-4" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} />;
};

export default CanvasPreview;
// This component renders a canvas preview of the book cover, allowing users to see their design in real-time.
// It also allows dragging of back cover images and estimates the number of pages based on word count, trim size, and font size.
// The canvas is redrawn whenever the relevant context values change, ensuring the preview is always up-to-date.
// The canvas includes the spine, front cover image, back cover images, and description text.
// The user can drag back cover images around the canvas, and the estimated number of pages is displayed based on the word count, trim size, and font size.
// The canvas is responsive to changes in the context, such as title, author, front cover image, back images, description, background color, spine font settings, and whether the spine-only view is enabled.
// The component uses the CoverContext to access and manage the state of the cover design, including title