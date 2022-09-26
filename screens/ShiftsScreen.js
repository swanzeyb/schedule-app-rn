import { View, Image, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { Text } from '../components'
import { useGoogleSignIn } from '../hooks'
import { dateToHourMin, dayToName, createEvent } from '../lib'
import tw from '../tw'

const EVENT_NAME = 'Starbucks'

// This converts the API results from strings
// to appropriate types
function parseShifts() {

}

// This converts to shift parts to presentation
// strings
function displayShifts() {

}

export default function ConfirmScreen({ route, navigation }) {
  const { getTokens } = useGoogleSignIn()
  const { shifts: rawInitShifts } = route.params

  // Convert shift info array to Date objects and display format
  const initShifts = []
  for (const [_, shift] of Object.entries(rawInitShifts)) {
    const start = new Date(shift.start)
    const end = new Date(shift.end)
    console.log(start.getDate(), start.getDay())
    initShifts.push({
      shift: `${dateToHourMin(start)} - ${dateToHourMin(end)}`,
      dayNum: start.getDate(),
      dayName: dayToName(start.getDay()),
      isToday: start.getDate() === (new Date().getDate()),
    })
  }

  console.log(initShifts)

  const [shifts, setShifts] = useState(initShifts)

  const addToCalendar = async (start, end) => {
    const startISO = start.toISOString()
    const endISO = end.toISOString()
    const token = await getTokens()
    return createEvent(EVENT_NAME, startISO, endISO, token)
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1`}>
        <StatusBar style="auto" />
        <View style={tw`flex-1 p-3`}>
          {shifts.map(display => (
            <View key={display.shift} style={tw`flex-initial flex-row mb-7`}>
              <View style={tw`w-11 flex-initial items-center mr-2`}>
                <Text weight="medium" color={display.isToday ? 'blue' : 'gray'}>
                    {display.dayName}
                </Text>
                <View style={tw.style(display.isToday && 'bg-blue', 'rounded-full', 'p-2.5')}>
                  <Text
                    font="Lato" weight="medium"
                    color={display.isToday ? 'white' : 'black'}
                  >{display.dayNum}</Text>
                </View>
              </View>
              <View style={tw`flex-1 flex-col bg-green rounded py-2 pl-2 mt-1`}>
                <Text color="white" weight="medium">{EVENT_NAME}</Text>
                <Text color="white">{display.shift}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  )
}
