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
            title: 'awesome Document',
            author: 'john doe',
            subject: 'subject of document',
          },
        content: [
            {text: 'First paragraph', style: 'header', margin: [0, 20]},
            'Second Pargajdsklfjsklfjskl',
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines lkjiewjoikdensjlfsdiljfldsk fisodj foissflj dslfjdsi',
            'jdilshfk dsfl '
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