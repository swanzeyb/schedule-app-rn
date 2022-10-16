import { View, Text } from 'react-native'
import { useMemo, useReducer } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoogleSignIn } from '../hooks'
import { searchImage, createEvent } from '../lib'
import {
  ShiftRow,
  SquareButton,
  IconButton,
  RoundedButton
} from '../components'
import uniqBy from 'lodash.uniqby'
import sortBy from 'lodash.sortby'
import tw from '../tw'

// Images
const CloseSrc = require('../assets/close-icon.png')
const PlusSrc = require('../assets/plus-icon.png')

// Constants
const EVENT_NAME = 'Starbucks'
const NO_EVENT_NAME = 'No shift found'

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
  return `${yyyy}-${MM}-${DD}T${hh}:${mm}:00.000` // ISO string
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

// Find the day of the week
const dayCodes = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// This converts to shift parts to presentation
// strings
function getDisplayValues(startISO, endISO, day) {
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

  return {
    key: `${startISO}${endISO}`,
    isToday: isSameDate && isSameMonth,
    dayNum: start.getUTCDate(), // Leave this a Number so we can sort
    title: EVENT_NAME,
    subtitle: `${startTime} - ${endTime}`,
    dayOfWeek: dayCodes[start.getDay()],
  }
}

function formatResponse(response) {
  const shiftsData = parseAPIResponse(response)
  const shifts = []
  for (const [_, shiftData] of Object.entries(shiftsData)) {
    const { start, end } = shiftData
    shifts.push({
      start, end,
      ...getDisplayValues(start, end),
    })
  }
  return shifts
}

function reducer(state, action) {
  switch(action.type) {
    case 'UPDATE':
      const uniqShifts = uniqBy([...state.shifts, ...action.shifts], 'key')
      const sortedShifts = sortBy(uniqShifts, 'dayNum')
      return {
        ...state,
        shifts: sortedShifts,
        hasShiftToday: sortedShifts.some(shift => shift.isToday),
      }
  }
}

export default function ShiftsScreen({ route, navigation: { goBack, navigate } }) {
  const { getTokens } = useGoogleSignIn()
  const { initialData } = route.params

  const [state, dispatch] = useReducer(reducer, {
    hasShiftToday: false,
    placeholder: {
      dayNum: new Date().getDate(),
      dayOfWeek: dayCodes[new Date().getDay()]
    },
    shifts: [],
  })

  // We want to only process the data once on mount
  // and avoid computation on re-renders
  useMemo(() => {
    const shifts = formatResponse(initialData)
    dispatch({ type: 'UPDATE', shifts })
  }, [initialData])

  const addShifts = async () => {
    const shifts = await searchImage()
      .then(formatResponse)
    dispatch({ type: 'UPDATE', shifts })
  }

  const uploadShifts = async () => {
    const { accessToken } = await getTokens()
    const eventPromises = []
    for (let i = 0; i < state.shifts.length; i++) {
      const { title, start, end } = state.shifts[i]
      eventPromises.push(createEvent(title, start, end, accessToken))
    }
    Promise.all(eventPromises)
      .then(() => navigate('Confirm', {
        title: 'Shifts Added to\nYour Calendar',
        button: 'Continue',
        nextScreen: 'Home',
      }))
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <StatusBar style="auto" />
        <View style={tw`flex-row justify-between items-center p-3 border-b border-divisor`}>
          <IconButton onPress={() => goBack()} iconSrc={CloseSrc} />
          <RoundedButton onPress={() => uploadShifts()} title="Add to Calendar"/>
        </View>
        <View style={tw`flex-1 p-3`}>
          {(!state.hasShiftToday) && (
            <ShiftRow
              isEmpty
              shift={{
                isToday: !state.hasShiftToday,
                dayNum: state.placeholder.dayNum,
                dayOfWeek: state.placeholder.dayOfWeek,
                title: NO_EVENT_NAME,
              }}
            />
          )}
          {state.shifts.map(shift => (
            <ShiftRow key={shift.key} shift={shift} />
          ))}
        </View>
      </View>
      <View style={tw`absolute bottom-3 right-3`}>
        <SquareButton onPress={() => addShifts()} iconSrc={PlusSrc} />
      </View>
    </SafeAreaView>
  )
}
