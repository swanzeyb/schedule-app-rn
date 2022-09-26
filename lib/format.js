const DAY_NAMES = ['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT']

export function dateToHourMin(date) {
  let hour = date.getHours()
  hour = hour > 12 ? hour - 12 : hour
  const ampm = date.getHours() > 12 ? 'PM' : 'AM'
  let mins = `${date.getMinutes()}`
  mins = mins.length < 2 ? `0${mins}` : mins
  return `${hour}:${mins} ${ampm}`
}

export function dayToName(dayNum) {
  return DAY_NAMES[dayNum]
}
