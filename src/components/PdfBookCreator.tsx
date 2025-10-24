import React, { useState, FormEvent, ChangeEvent } from "react";

const PdfBookCreator: React.FC = () => {
  const [introPdf, setIntroPdf] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [readyBlob, setReadyBlob] = useState<Blob | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!introPdf || images.length === 0) {
      setStatus("⚠️ Please upload an intro PDF and at least one PNG image.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setStatus("Uploading files...");
    setReadyBlob(null);

    const formData = new FormData();
    formData.append("intro_pdf", introPdf);
    images.forEach((img) => formData.append("images", img));

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      import.meta.env.VITE_RENDER_API_URL ||
        "https://imgs-to-pdf-book.onrender.com/api/create-pdf-book"
    );

    xhr.responseType = "blob";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
        setStatus(`Uploading files... ${percent}%`);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        setReadyBlob(blob);
        setStatus("Success! Book created! Click 'Save Book As…' to download.");
      } else {
        setStatus("❌ Error creating PDF. Please try again.");
      }
      setLoading(false);
    };

    xhr.onerror = () => {
      setStatus("❌ Network error. Please try again.");
      setLoading(false);
    };

    xhr.send(formData);
  };

  const handleIntroChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIntroPdf(file);
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
  };

  const handleSaveClick = async () => {
    if (!readyBlob) return;

    try {
      // “Save As” dialog (Chrome, Edge, Opera)
      // @ts-ignore
      if (window.showSaveFilePicker) {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: "book.pdf",
          types: [
            { description: "PDF File", accept: { "application/pdf": [".pdf"] } },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(readyBlob);
        await writable.close();
        setStatus("Success! Saved successfully.");
        setReadyBlob(null);
        return;
      }

      // Fallback: normal download for unsupported browsers
      const url = window.URL.createObjectURL(readyBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "book.pdf";
      a.click();
      setStatus("Success! Book downloaded successfully.");
      setReadyBlob(null);
    } catch (err) {
      console.warn("Save canceled or unsupported, falling back.", err);
      const url = window.URL.createObjectURL(readyBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "book.pdf";
      a.click();
      setStatus("Success! Book downloaded successfully.");
      setReadyBlob(null);
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white p-4 rounded border border-gray-200 shadow-sm"
      >
        <label className="font-medium text-gray-700">
          Intro Page (PDF):
          <input
            type="file"
            accept="application/pdf"
            onChange={handleIntroChange}
            required
            className="block w-full mt-1 text-sm text-gray-600"
          />
        </label>

        <label className="font-medium text-gray-700">
          PNG Pages:
          <input
            type="file"
            accept="image/png"
            multiple
            onChange={handleImagesChange}
            required
            className="block w-full mt-1 text-sm text-gray-600"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 text-white font-semibold rounded py-2 px-4 transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Create Book"
          )}
        </button>

        {loading && (
          <div className="w-full bg-gray-200 rounded h-3 mt-2">
            <div
              className="bg-blue-600 h-3 rounded transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </form>

      {readyBlob && (
        <button
          onClick={handleSaveClick}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Save Book As…
        </button>
      )}

      <p
        className={`text-sm font-medium ${
          status.startsWith("Success!")
            ? "text-green-600"
            : status.startsWith("❌")
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {status}
      </p>
    </div>
  );
};

export default PdfBookCreator;
