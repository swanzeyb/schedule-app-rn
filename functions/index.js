const functions = require('firebase-functions')
const vision = require('@google-cloud/vision')

const {
  ocrResultsToBlocks,
  blocksToRows,
  rowsToShifts,
} = require('./parse')

// Instantiate a vision client
const client = new vision.ImageAnnotatorClient()
const fs = require('fs')

async function detectText(imgBase64) {
  // const results = await client.annotateImage({
  //   image: {
  //     content: imgBase64,
  //     mimeType: 'image/jpeg',
  //   },
  //   features: [{type: 'DOCUMENT_TEXT_DETECTION'}],
  // })

  const results = JSON.parse(fs.readFileSync('results.json'))
  const blocks = ocrResultsToBlocks(results)
  const rows = blocksToRows(blocks)
  const shifts = rowsToShifts(rows)

  return [shifts]
}

// const dayCodes = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// const getCurrentDate = () => (new Date().getDate())
// const getCurrentMonth = () => (new Date().getMonth())
// const getCurrentYear = () => (new Date().getFullYear())

// function shiftDateArgs(day, time) {
//   day = Number(day)
//   const year = getCurrentYear()
//   const currMonth = getCurrentMonth()
//   const month = day < getCurrentDate() ? currMonth + 1 : currMonth
//   const hrOffset = time.substr(-2) === 'PM' ? 12 : 0
//   const hour = Number(time.substr(0, 2)) + hrOffset
//   const rawMin = time.substr(3, 2)
//   const minute = rawMin.length < 2 ? `${rawMin}0` : rawMin
//   return `${month}/${day}/${year} ${hour}:${minute}`
// }

// async function extractShifts(text) {
//   const days = []
//   const times = []

//   for (const [_, line] of text.entries()) {
//     const isDay = dayCodes.some(code => line.includes(code))
//     if (isDay) {
//       const dayNum = (line.match(/\d{2}/g) || [])[0]
//       if (dayNum) days.push(dayNum)
//       continue
//     }
//     const isShift = line.match(/\d{2}:\d{2} (AM|PM)/g) || []
//     if (isShift.length === 2) {
//       times.push(isShift)
//       continue
//     }
//     const isNoShift = line.includes('No Shift')
//     if (isNoShift) {
//       times.push(false)
//       continue
//     }
//   }

//   const shifts = {}
//   if (days.length === times.length) {
//     for (const [i, day] of days.entries()) {
//       const shift = times[i]
//       if (shift) {
//         shifts[day] = {
//           start: shiftDateArgs(day, shift[0]),
//           end: shiftDateArgs(day, shift[1])
//         }
//       }
//     }
//   }
//   return shifts
// }

exports.detectShifts = functions.https.onCall(async (data, ctx) => {
  if (!ctx.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  detectText(data.imgBase64)
    .then(console.log)
    .catch(console.log)

    // console.log(data.imgBase64.substr(0, 50))
  // const shifts = await extractShifts(text)
  // console.log(shifts)
  // return shifts
  return {}
})
