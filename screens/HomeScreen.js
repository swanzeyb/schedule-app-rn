import { StatusBar } from 'expo-status-bar'
import { View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text } from '../components'
import tw from '../tw'

const LogoSrc = require('../assets/logo.png')

export default function HomeScreen() {
  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 py-16 items-center justify-between`}>
        <StatusBar style="auto" />
        <Image source={LogoSrc} />
        <View>
          <Text font="Poppins" style={tw`text-2xl text-center`}>Sync Your Schedule</Text>
          <Text style={tw`text-sm pt-1.5 text-center`}>Easily add your work schedule to{'\n'}Google Calendar</Text>
        </View>
        <Button
          // onPress={addSchedule}
          title="Add Schedule"
        />
      </View>
    </SafeAreaView>
  )
}
