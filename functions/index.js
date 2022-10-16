const functions = require('firebase-functions')
const vision = require('@google-cloud/vision')

const {
  ocrResultsToBlocks,
  blocksToRows,
  rowsToShifts,
} = require('./parse')

// Instantiate a vision client
const client = new vision.ImageAnnotatorClient()
// const fs = require('fs')

async function detectText(imgBase64) {
  const results = await client.annotateImage({
    image: {
      content: imgBase64,
      mimeType: 'image/jpeg',
    },
    features: [{type: 'DOCUMENT_TEXT_DETECTION'}],
  })

  // const results = JSON.parse(fs.readFileSync('results.json'))
  const blocks = ocrResultsToBlocks(results)
  const rows = blocksToRows(blocks)
  const shifts = rowsToShifts(rows)

  return shifts
}

exports.detectShifts = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  return detectText(data.imgBase64)
})
