/*
  Purpose: Associate text from Vision OCR output into rows of data.
  Outcome: Group all data related to a work shift together.
*/

// This constant defines how much two blocks can differ
// in their y value, and still be considered part of the
// same row.
const ROW_Y_TOLERANCE = 6

function paragraphToString({ words }) {
  let string = ''
  for (const [_, word] of Object.entries(words)) {
    for (const [_, symbol] of Object.entries(word.symbols)) {
      string = `${string}${symbol.text}`
    }
    string = `${string} `
  }
  string = string.trim()
  return string
}

function ocrResultsToBlocks(results) {
  const blocks = []
  const rawBlocks = results[0]?.fullTextAnnotation?.pages[0]?.blocks

  if (rawBlocks) {
    for (const [_, rawBlock] of Object.entries(rawBlocks)) {
      if (rawBlock.blockType === 'TEXT') {
        const block = {
          text: [],
          minY: 0,
        }
        const { paragraphs, boundingBox: { vertices } } = rawBlock

        // Obtain text contents of each paragraph in this block
        for (const [_, paragraph] of Object.entries(paragraphs)) {
          block.text.push(paragraphToString(paragraph))
        }

        // Find smallest Y value of bounding box so we can later find neighbor blocks in this row
        block.minY = Math.min(...vertices.map(vertex => vertex.y))

        blocks.push(block)
      }
    }
  }

  return blocks
}

function blocksToRows(blocks) {
  const rows = []

  for (const [_, block] of Object.entries(blocks)) {
    for (const [_, word] of Object.entries(block.text)) {
      // The constant 'word' might be confusing here because
      // 'word' may contain multiple words in a single string
      const isShift = (word.match(/\d{2}:\d{2} (AM|PM)/g) || []).length === 2
      if (isShift) {
        const row = []
        // If this block contains a shift, find other blocks within
        // a similar y value, which is considered the same row.
        for (const [_, test] of Object.entries(blocks)) {
          if (Math.abs(block.minY - test.minY) <= ROW_Y_TOLERANCE) {
            row.push(test.text)
          }
        }

        if (row.length > 0) rows.push(row)
        break
      }
    }
  }

  return rows
}

function to24HRFormat(time) {
  const hrOffset = time.substr(-2) === 'PM' ? 12 : 0
  const hour = Number(time.substr(0, 2)) + hrOffset
  const rawMin = time.substr(3, 2)
  const minute = rawMin.length < 2 ? `${rawMin}0` : rawMin
  return `${hour}:${minute}`
}

function rowsToShifts(rows) {
  const shifts = []

  for (const [_, row] of Object.entries(rows)) {
    const day = row[0]?.[1]
    const times = row[1]?.[0]
    let [start, end] = times.match(/\d{2}:\d{2} (AM|PM)/g) || []
    const location = row[1]?.[2]

    // Only continue if this row contains all of the string parts of a shift
    const hasAllParts = [day, start, end, location]
      .some(part => part !== undefined)

    if (hasAllParts) {
      // Convert times to 24hr format
      start = to24HRFormat(start)
      end = to24HRFormat(end)

      shifts.push({
        day, start, end, location,
      })
    }
  }

  return shifts
}

module.exports = {
  ocrResultsToBlocks,
  blocksToRows,
  rowsToShifts
}
