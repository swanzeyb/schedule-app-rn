import { StatusBar } from 'expo-status-bar'
import { useState, useCallback } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { preventAutoHideAsync, hideAsync } from 'expo-splash-screen'
import { useCustomFonts } from './hooks'

// Keep splash screen up until loading finished
preventAutoHideAsync()

const Stack = createNativeStackNavigator()

import {
  HomeScreen
} from './screens'

// Example of loading assets before showing the app:
// https://docs.expo.dev/versions/latest/sdk/splash-screen/

export default function App() {
  const appReady = useCustomFonts()

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
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
