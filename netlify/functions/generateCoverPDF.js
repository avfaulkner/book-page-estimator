const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const multiparty = require('multiparty');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(event, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return resolve({ statusCode: 500, body: 'File upload error' });
      }

      try {
        const frontPath = files.front[0].path;
        const backPath = files.back?.[0]?.path || null;
        const title = fields.title[0];
        const trimSize = fields.trimSize[0];
        const pageCount = parseInt(fields.pageCount[0]);

        const spineWidthInInches = pageCount * 0.002252;
        const trimWidth = parseFloat(trimSize.split('x')[0]);
        const trimHeight = parseFloat(trimSize.split('x')[1]);
        const totalWidth = trimWidth * 2 + spineWidthInInches;

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([
          totalWidth * 72, // 1 inch = 72 points
          trimHeight * 72,
        ]);

        const frontImage = await sharp(frontPath).resize({
          width: Math.floor(trimWidth * 300),
          height: Math.floor(trimHeight * 300),
        }).jpeg().toBuffer();

        const frontEmbed = await pdfDoc.embedJpg(frontImage);
        page.drawImage(frontEmbed, {
          x: spineWidthInInches * 72 + 0,
          y: 0,
          width: trimWidth * 72,
          height: trimHeight * 72,
        });

        if (backPath) {
          const backImage = await sharp(backPath).resize({
            width: Math.floor(trimWidth * 300),
            height: Math.floor(trimHeight * 300),
          }).jpeg().toBuffer();

          const backEmbed = await pdfDoc.embedJpg(backImage);
          page.drawImage(backEmbed, {
            x: 0,
            y: 0,
            width: trimWidth * 72,
            height: trimHeight * 72,
          });
        }

        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 24;
        page.drawText(title, {
          x: (trimWidth + spineWidthInInches / 2) * 72 - (title.length * fontSize * 0.25),
          y: trimHeight * 36 / 72,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
          rotate: { type: 'degrees', angle: 90 },
        });

        const pdfBytes = await pdfDoc.save();
        return resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=book_cover.pdf',
          },
          body: pdfBytes.toString('base64'),
          isBase64Encoded: true,
        });
      } catch (e) {
        console.error(e);
        return resolve({ statusCode: 500, body: 'PDF generation error' });
      }
    });
  });
};