import { StatusBar } from 'expo-status-bar'
import { useState, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen'
import { useCustomFonts, useGoogleSignIn } from './hooks'

// Keep splash screen up until loading finished
preventAutoHideAsync()

// Main navigation stack
const Stack = createNativeStackNavigator()

// Main App Screens
import {
  HomeScreen,
  ConfirmScreen,
  ShiftsScreen,
} from './screens'

// Example of loading assets before showing the app:
// https://docs.expo.dev/versions/latest/sdk/splash-screen/

export default function App() {
  const { authReady } = useGoogleSignIn()
  const fontsReady = useCustomFonts()
  const appReady = authReady && fontsReady

  const onRootLayout = useCallback(async () => {
    if (appReady) {
      // await new Promise((resolve) => setTimeout(() => resolve(), 20000))
      await hideAsync()
    }
  }, [appReady])

  if (!appReady) {
    return null
  }

  return (
    <SafeAreaProvider onLayout={onRootLayout}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Confirm" component={ConfirmScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="Shifts" component={ShiftsScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
