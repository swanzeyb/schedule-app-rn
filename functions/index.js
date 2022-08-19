const functions = require('firebase-functions')
const vision = require('@google-cloud/vision')

// Instantiate a vision client
const client = new vision.ImageAnnotatorClient()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', {structuredData: true})
//   response.send('Hello from Firebase!')
// })

exports.helloWorld = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const results = await client.annotateImage({
    image: {
      content: data.imgBase64,
    },
    features: [{type: 'DOCUMENT_TEXT_DETECTION'}],
  })

  const pages = results[0]?.fullTextAnnotation?.pages
  if (pages?.length > 0) {
    const text = []
    for (const [_, page] of pages.entries()) {
      for (const [_, block] of page.blocks.entries()) {
        let str = ''
        for (const [i, paragraph] of block.paragraphs.entries()) {
          for (const [_, word] of paragraph.words.entries()) {
            let wrd = ''
            for (const [_, symbol] of word.symbols.entries()) {
              wrd += symbol.text
            }
            str += wrd.length === 1 ? wrd : ` ${wrd}`
          }
          const paraLength = block.paragraphs.length
          if (i == paraLength) word += paraLength > 1 ? ' ' : ''
        }
        str = str.trim()
        if (str.length > 1) text.push(str)
      }
    }
    return { text }
  }

  return { text: [] }
})
