import PdfPrinter from 'pdfmake'

const getPDFReadableStream = blog => {

    function getBase64Image(img) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
    
        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
    
        // Get the data-URL formatted image
        // Firefox supports PNG and JPEG. You could check img.src to
        // guess the original format, but be aware the using "image/jpg"
        // will re-encode the image.
        var dataURL = canvas.toDataURL("image/png");
    
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    const blogImage = getBase64Image(blog.cover)

    const fonts = {
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
        }
    }

    const printer = new PdfPrinter(fonts)

    const docDefinition = {
        info: {
            title: `${blog.title}`,
            author: `${blog.author.name}`
        },
        content: [
            { image: blogImage,  margin: [5, 50], fit: [450, 450] },
            { text: `${blog.title}`, style: 'header', margin: [0, 20] },
            `${blog.content}`
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            }
        },
        defaultStyle: {
            font: "Helvetica",
        }
    }

    const options = {
    }

    const pdfReadableStream = printer.createPdfKitDocument(docDefinition, options)
    pdfReadableStream.end()
    return pdfReadableStream
}

export default getPDFReadableStream