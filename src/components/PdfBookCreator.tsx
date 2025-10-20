import React, { useState } from "react";

const PdfBookCreator = () => {
  const [introPdf, setIntroPdf] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!introPdf || images.length === 0) {
      setStatus("Please upload an intro PDF and at least one PNG image.");
      return;
    }

    setLoading(true);
    setStatus("Creating your book...");

    const formData = new FormData();
    formData.append("intro_pdf", introPdf);
    images.forEach((img) => formData.append("images", img));

    try {
      const response = await fetch(
        "https://imgs-to-pdf-book.onrender.com/api/create-pdf-book",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error creating PDF.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "book.pdf";
      a.click();

      setStatus("Book created! Your PDF has been downloaded.");
    } catch (error) {
      console.error(error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Create Your PDF Book</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Intro Page (PDF):
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setIntroPdf(e.target.files[0])}
            required
          />
        </label>
        <br />
        <label>
          PNG Pages:
          <input
            type="file"
            accept="image/png"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            required
          />
        </label>
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Create Book"}
        </button>
      </form>
      <p style={{ marginTop: "10px" }}>{status}</p>
    </div>
  );
};

export default PdfBookCreator;
