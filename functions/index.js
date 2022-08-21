const functions = require('firebase-functions')
const vision = require('@google-cloud/vision')

// Instantiate a vision client
const client = new vision.ImageAnnotatorClient()

async function detectText(imgBase64) {
  const results = await client.annotateImage({
    image: {
      content: imgBase64,
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
    return text
  }

  return []
}

const dayCodes = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

async function extractShifts(text) {
  const days = []
  const times = []

  for (const [_, line] of text.entries()) {
    const isDay = dayCodes.some(code => line.includes(code))
    if (isDay) {
      const dayNum = (line.match(/\d{2}/g) || [])[0]
      if (dayNum) days.push(Number(dayNum))
      continue
    }
    const isShift = line.match(/\d{2}:\d{2} (AM|PM)/g) || []
    if (isShift.length === 2) {
      times.push(isShift)
      continue
    }
    const isNoShift = line.includes('No Shift')
    if (isNoShift) {
      times.push('No Shift')
      continue
    }
  }

  const shifts = {}
  if (days.length === times.length) {
    for (const [i, day] of days.entries()) {
      const shift = times[i]
      shifts[day] = shift
    }
  }
  return shifts
}

exports.detectShifts = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }
  const text = await detectText(data.imgBase64)
  const shifts = await extractShifts(text)
  console.log(shifts)
  return shifts
})
