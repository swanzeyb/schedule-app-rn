// import { useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text } from '../components'
import { useGoogleSignIn } from '../hooks'
import tw from '../tw'

const LogoSrc = require('../assets/logo.png')

export default function HomeScreen({ navigation: { navigate } }) {
  const { user, signIn } = useGoogleSignIn()

  const onSignIn = () => {
    signIn()
      .then(result => {
        if (result.error && !result.userError) {
          Alert.alert(
            'Please Try Again',
            'There was an unexpected error, please try again.',
            { text: 'OK' }
          )
        }
        if (result.user) {
          navigate('Confirm', {
            title: 'Sign In\nSuccessful',
            button: 'Continue',
            nextScreen: 'Scanner',
          })
        }
      })
  }

  const addSchedule = () => {
    if (!user) {
      Alert.alert(
        'Sign In',
        'To continue, please sign in with the Google account tied to your calendar.', [
        { text: 'CANCEL', style: 'cancel' },
        { text: 'SIGN IN', onPress: onSignIn }
      ])
    } else {
      navigate('Scanner')
    }
  }

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
          onPress={addSchedule}
          title="Add Schedule"
        />
      </View>
    </SafeAreaView>
  )
}
