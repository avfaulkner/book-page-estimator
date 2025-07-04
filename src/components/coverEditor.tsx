// CoverEditor.tsx
import React, { useContext } from "react";
import { CoverContext } from "./context/CoverContext";

const CoverEditor = () => {
  const {
    title,
    setTitle,
    author,
    setAuthor,
    bgColor,
    setBgColor,
    spineFontFamily,
    setSpineFontFamily,
    spineFontSize,
    setSpineFontSize,
    spineFontColor,
    setSpineFontColor,
    descFontSize,
    setDescFontSize,
    descColor,
    setDescColor,
    descAlign,
    setDescAlign,
    description,
    setDescription,
    setFrontFile,
    setTextureFile,
    spineOnlyView,
    setSpineOnlyView,
    setBackImages
  } = useContext(CoverContext);

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFrontFile(e.target.files[0]);
  };

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setTextureFile(e.target.files[0]);
  };

  const handleBackImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const images = Array.from(e.target.files).map((file, i) => ({
        file,
        x: 20 + i * 60,
        y: 60,
        width: 100,
        height: 100,
        id: `${Date.now()}-${i}`
      }));
      setBackImages(prev => [...prev, ...images]);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-1" />
      </div>
      <div>
        <label>Author</label>
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full border p-1" />
      </div>
      <div>
        <label>Front Cover Image</label>
        <input type="file" accept="image/*" onChange={handleFrontUpload} className="w-full" />
      </div>
      <div>
        <label>Back Cover Images</label>
        <input type="file" accept="image/*" multiple onChange={handleBackImages} className="w-full" />
      </div>
      <div>
        <label>Background Color</label>
        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full" />
      </div>
      <div>
        <label>Texture Upload</label>
        <input type="file" accept="image/*" onChange={handleTextureUpload} className="w-full" />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border p-1" rows={4} />
      </div>
      <div>
        <label>Spine Only View</label>
        <input type="checkbox" checked={spineOnlyView} onChange={e => setSpineOnlyView(e.target.checked)} />
      </div>
    </div>
  );
};

export default CoverEditor;
// This component allows users to edit cover details like title, author, background color, and upload images.
// It uses the CoverContext to manage state and provides handlers for file uploads and input changes.
// The layout is responsive, adapting to different screen sizes with a grid system.