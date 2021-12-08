import PdfPrinter from 'pdfmake'

const getPDFReadableStream = blog => {

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
            {text: `${blog.title}`, style: 'header', margin: [0, 20]},
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