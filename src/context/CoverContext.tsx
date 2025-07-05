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
  wordCount: number | null;
  setWordCount: (n: number | null) => void;
  fontSize: number;
  setFontSize: (n: number) => void;
  trimSize: string;
  setTrimSize: (s: string) => void;
  pageCount: number | null;
  setPageCount: (n: number | null) => void;
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
  descY: number;
  setDescY: (n: number) => void;
  estimatedPages: number;
  setEstimatedPages: (n: number) => void;
}

export const CoverContext = createContext({} as CoverContextProps);

export const CoverProvider = ({ children }: { children: React.ReactNode }) => {
  const [wordCount, setWordCount] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState(12);
  const [trimSize, setTrimSize] = useState("6x9");
  const [pageCount, setPageCount] = useState<number | null>(null);
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
  const [descY, setDescY] = useState(60);

  const estimatePages = (words: number, trim: string, font: number): number => {
    const baseWordsPerPage: Record<string, number> = {
      "5x8": 250,
      "6x9": 300,
      "8.5x11": 400,
      "8.5x8.5": 280
    };
    const wordsPerPage = baseWordsPerPage[trim] * (font / 12);
    return Math.ceil(words / wordsPerPage);
  };

  const [estimatedPages, setEstimatedPages] = useState<number>(0);

  React.useEffect(() => {
    if (wordCount !== null && wordCount > 0) {
      setEstimatedPages(estimatePages(wordCount, trimSize, fontSize));
    } else if (pageCount !== null && pageCount > 0) {
      setEstimatedPages(pageCount);
    } else {
      setEstimatedPages(0);
    }
  }, [wordCount, fontSize, trimSize, pageCount]);

  return (
    <CoverContext.Provider
      value={{
        wordCount,
        setWordCount,
        fontSize,
        setFontSize,
        trimSize,
        setTrimSize,
        pageCount,
        setPageCount,
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
        setSpineOnlyView,
        descY,
        setDescY,
        estimatedPages,
        setEstimatedPages
      }}
    >
      {children}
    </CoverContext.Provider>
  );
};