"use client";

export default function Home() {
  return (
    <main>
      <PdfPrinter />
    </main>
  );
}
import React, { useState } from "react";

const PdfPrinter = () => {
  const [pdfData, setPdfData] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        const data = reader.result;
        setPdfData(data as string);
      };
      reader.readAsBinaryString(file);
    } else {
      setPdfData(null);
    }
  };

  const handlePrintClick = () => {
    if (!pdfData) {
      return;
    }

    const modifiedPdfData = pdfData.replace(/\/Rect\s*\[[^\]]*\]/g, "");
    const modifiedPdfBlob = new Blob([modifiedPdfData], {
      type: "application/pdf",
    });
    const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
    const downloadLink = document.createElement("a");
    downloadLink.download = "modified.pdf";
    downloadLink.href = modifiedPdfUrl;
    downloadLink.click();
  };

  return (
    <div className="w-full h-screen grid place-items-center">
      <div className="flex flex-col items-start justify-start gap-3">
        <p>Remove Figma borders from pdf</p>

        <input
          placeholder="Select PDF"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {pdfData && (
          <button
            className="border px-4 py-2 mt-6 rounded-md"
            onClick={handlePrintClick}
            disabled={!pdfData}
          >
            Print PDF
          </button>
        )}
      </div>
    </div>
  );
};
