"use client";

export default function Home() {
  return (
    <main>
      <PdfPrinter />
    </main>
  );
}
import { PDFDict, PDFDocument, PDFName } from "pdf-lib";
import React, { useState } from "react";

const PdfPrinter = () => {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    var reader = new FileReader();
    reader.readAsArrayBuffer(file!);

    reader.onload = function () {
      const data = reader.result;
      setPdfData(data as ArrayBuffer);
    };
  };

  const handlePrintClick = async () => {
    if (!pdfData) {
      return;
    }

    const pdfDoc = await PDFDocument.load(pdfData);

    // Get all the pages
    const pages = pdfDoc.getPages();

    // Iterate over each page
    for (let page of pages) {
      // Get the annotations for the page
      const annotations = page.node.Annots()!.asArray();

      // Iterate over each annotation
      for (let annotation of annotations) {
        if (annotation instanceof PDFDict) {
          const annotationType = annotation.get(PDFName.of("Subtype"));
          if (annotationType === PDFName.of("Link")) {
            annotation.set(PDFName.of("Border"), pdfDoc.context.obj([0, 0, 0]));
          }
        }
      }
    }

    const modifiedPdfData = await pdfDoc.save();
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
