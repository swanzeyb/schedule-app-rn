import * as Localization from 'expo-localization'

export default function createEvent(name, start, end, accessToken) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      summary: name,
      start: { dateTime: start, timeZone: Localization.timezone },
      end: { dateTime: end, timeZone: Localization.timezone }
    })
  }
  return fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err))
}
