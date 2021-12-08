import PdfPrinter from "pdfmake"
import axios from "axios"

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

export const generateBlogPDF = async (blog) => {
  
    let imagePart = {};
  
  if (blog.cover) {
    const response = await axios.get(blog.cover, {
      responseType: "arraybuffer",
    })
    // const blogCoverURLParts = blog.cover.split("/");
    // const fileName = blogCoverURLParts[blogCoverURLParts.length - 1];
    // const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/jpeg;base64,${base64}`;
    imagePart = { image: base64Image, fit: [500, 500], margin: [0, 30] };
  }

  const docDefinition = {
    content: [
      imagePart,
      { text: blog.title, fontSize: 20, bold: true, margin: [0, 0, 0, 30] },
      { text: blog.content, lineHeight: 1.75 },
    ],
  }

  const pdfDoc = printer.createPdfKitDocument(docDefinition)
  return pdfDoc
}