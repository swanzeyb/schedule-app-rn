import { View, Image, Alert } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Text } from '../components'
import tw from '../tw'

export default function ConfirmScreen({ route, navigation: { navigate } }) {
  const { title, subtitle, button, nextScreen } = route.params

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`flex-1 py-16 items-center justify-center`}>
        <StatusBar style="auto" />
        <View>
          <Text font="Poppins" style={tw`text-2xl text-center`}>{title}</Text>
          {subtitle && (
            <Text style={tw`text-sm pt-1.5 text-center`}>{subtitle}</Text>
          )}
        </View>
        <Button
          onPress={() => navigate(nextScreen)}
          title={button}
          style={tw`mt-8`}
        />
      </View>
    </SafeAreaView>
  )
}
