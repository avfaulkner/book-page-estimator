// CoverContext.tsx
import React, { createContext, useState } from "react";

interface ImagePosition {
  file: File;
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
}

interface CoverContextProps {
  wordCount: number;
  setWordCount: (n: number) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  trimSize: string;
  setTrimSize: (s: string) => void;
  title: string;
  setTitle: (s: string) => void;
  author: string;
  setAuthor: (s: string) => void;
  frontFile: File | null;
  setFrontFile: (f: File | null) => void;
  backImages: ImagePosition[];
  setBackImages: (imgs: ImagePosition[]) => void;
  description: string;
  setDescription: (s: string) => void;
  bgColor: string;
  setBgColor: (s: string) => void;
  textureFile: File | null;
  setTextureFile: (f: File | null) => void;
  spineFontFamily: string;
  setSpineFontFamily: (s: string) => void;
  spineFontSize: number;
  setSpineFontSize: (n: number) => void;
  spineFontColor: string;
  setSpineFontColor: (s: string) => void;
  descFontSize: number;
  setDescFontSize: (n: number) => void;
  descColor: string;
  setDescColor: (s: string) => void;
  descAlign: string;
  setDescAlign: (s: string) => void;
  spineOnlyView: boolean;
  setSpineOnlyView: (b: boolean) => void;
}

export const CoverContext = createContext({} as CoverContextProps);

export const CoverProvider = ({ children }: { children: React.ReactNode }) => {
  const [wordCount, setWordCount] = useState(0);
  const [fontSize, setFontSize] = useState(12);
  const [trimSize, setTrimSize] = useState("6x9");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backImages, setBackImages] = useState<ImagePosition[]>([]);
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textureFile, setTextureFile] = useState<File | null>(null);
  const [spineFontFamily, setSpineFontFamily] = useState("sans-serif");
  const [spineFontSize, setSpineFontSize] = useState(16);
  const [spineFontColor, setSpineFontColor] = useState("#000000");
  const [descFontSize, setDescFontSize] = useState(14);
  const [descColor, setDescColor] = useState("#000000");
  const [descAlign, setDescAlign] = useState("left");
  const [spineOnlyView, setSpineOnlyView] = useState(false);

  return (
    <CoverContext.Provider
      value={{
        wordCount,
        setWordCount,
        fontSize,
        setFontSize,
        trimSize,
        setTrimSize,
        title,
        setTitle,
        author,
        setAuthor,
        frontFile,
        setFrontFile,
        backImages,
        setBackImages,
        description,
        setDescription,
        bgColor,
        setBgColor,
        textureFile,
        setTextureFile,
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
        spineOnlyView,
        setSpineOnlyView
      }}
    >
      {children}
    </CoverContext.Provider>
  );
};
