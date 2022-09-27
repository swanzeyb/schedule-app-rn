import { View, Image, Alert } from 'react-native'
import { useMemo } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Text } from '../components'
import { useGoogleSignIn } from '../hooks'
import { dateToHourMin, dayToName, createEvent } from '../lib'
import tw from '../tw'

const EVENT_NAME = 'Starbucks'

// Puts padding 0s to maintain a format length
function normalizeLength(str, length) {
  if (str.length !== length) {
    const filler = new Array(length - str.length).fill('0').join('')
    return `${filler}${str}`
  } else {
    return str
  }
}

// Make an ISO string by assuming missing info
// Input's must be in a string format
function makeISOString(DD, hhmm) {
  const yyyy = new Date().getFullYear().toString() // Year
  let currMM = new Date().getMonth() + 1 // Current month. getMonth is 0 based
  const currDay = new Date().getDate() // Current day

  // If the shift date is less than now, assume
  // it's a shift for next month
  if (Number(DD) < currDay) {
    currMM += 1
  }

  let [hh, mm] = hhmm.split(':')
  hh = normalizeLength(hh, 2)
  mm = normalizeLength(mm, 2)
  const MM = normalizeLength(currMM.toString(), 2) // Month
  DD = normalizeLength(DD, 2) // Day
  return `${yyyy}-${MM}-${DD}T${hh}:${mm}Z` // ISO string
}

// This converts the API results from strings
// to appropriate types
function parseAPIResponse(response) {
  const shifts = []
  for (const [_, entry] of Object.entries(response)) {
    const { day, start, end, location } = entry
    shifts.push({
      start: makeISOString(day, start),
      end: makeISOString(day, end),
      location,
    })
  }
  return shifts
}

// This converts to shift parts to presentation
// strings
function getDisplayValues(startISO, endISO) {
  const start = new Date(startISO)
  const end = new Date(endISO)
  const isSameDate = new Date().getDate() === start.getDate()
  const isSameMonth = new Date().getMonth() === start.getMonth()
  
  // Format shift starting time
  const startHours = start.getUTCHours() > 12
    ? start.getUTCHours() - 12
    : start.getUTCHours()
  const startMinutes = normalizeLength(start.getUTCMinutes().toString(), 2)
  const startIsMidday = start.getUTCHours() > 12 ? 'PM' : 'AM'
  const startTime = `${startHours}:${startMinutes} ${startIsMidday}`

  // Format end of shift time
  const endHours = end.getUTCHours() > 12
    ? end.getUTCHours() - 12
    : end.getUTCHours()
  const endMinutes = normalizeLength(end.getUTCMinutes().toString(), 2)
  const endIsMidday = end.getUTCHours() > 12 ? 'PM' : 'AM'
  const endTime = `${endHours}:${endMinutes} ${endIsMidday}`

  // Find the day of the week
  const dayCodes = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return {
    key: `${startISO}${endISO}`,
    isToday: isSameDate && isSameMonth,
    dayNum: start.getDate().toString(),
    shift: `${startTime} - ${endTime}`,
    dayOfWeek: dayCodes[start.getDay()],
  }
}

export default function ConfirmScreen({ route, navigation }) {
  const { getTokens } = useGoogleSignIn()
  const { response } = route.params

  const [shifts, setShifts] = useState([])

  // We want to only process the data once on mount
  // and avoid computation on re-renders
  useMemo(() => {
    const shiftsData = parseAPIResponse(response)
    const display = []
    for (const [_, shiftData] of Object.entries(shiftsData)) {
      const { start, end } = shiftData
      display.push(getDisplayValues(start, end))
    }
    setShifts(display)
  }, [response])

  const Today = (!shifts.some(shift => shift.isToday)) && (
    <View></View>
  )

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <StatusBar style="auto" />
        <View style={tw`flex-1 p-3`}>
          {Today && <Today />}
          {shifts.map(shift => (
            <View key={shift.key} style={tw`flex-initial flex-row mb-7`}>
              <View style={tw`w-11 flex-initial items-center mr-2`}>
                <Text weight="medium" color={shift.isToday ? 'blue' : 'gray'}>
                    {shift.dayOfWeek}
                </Text>
                <View style={tw.style(shift.isToday && 'bg-blue', 'rounded-full', 'p-2.5')}>
                  <Text
                    font="Lato" weight="medium"
                    color={shift.isToday ? 'white' : 'black'}
                  >{shift.dayNum}</Text>
                </View>
              </View>
              <View style={tw`flex-1 flex-col bg-green rounded py-2 pl-2 mt-1`}>
                <Text color="white" weight="medium">{EVENT_NAME}</Text>
                <Text color="white">{shift.shift}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}
