export function estimatePages(wordCount: number, trimSize: string, fontSize: number): number {
  const baseWordsPerPage = {
    "5x8": 260,
    "6x9": 325,
    "8.5x11": 550,
  }[trimSize] || 300;

  const scale = 12 / fontSize;
  const adjustedWPP = baseWordsPerPage * scale;

  return Math.ceil(wordCount / adjustedWPP);
}