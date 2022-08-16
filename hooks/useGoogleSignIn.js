import auth from '@react-native-firebase/auth'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { useState, useEffect } from 'react'

// Initiate Google SDK for Google Sign In
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/calendar'],
  webClientId: '453659831313-n5schdcd7u7mcm8k3l2sr0643f3mpqdm.apps.googleusercontent.com',
})

async function googleAuth() {
  try {
    await GoogleSignin.hasPlayServices()
    return await GoogleSignin.signIn()
  } catch ({ code }) {
    const { SIGN_IN_CANCELLED, IN_PROGRESS } = statusCodes
    if (code === SIGN_IN_CANCELLED || code === IN_PROGRESS ) {
      return { error: true, userError: true }
    } else {
      return { error: true, userError: false }
    }
  }
}

async function firebaseAuth(idToken) {
  try {
    const googleCredential = auth.GoogleAuthProvider.credential(idToken) // Create a Google credential
    return await auth().signInWithCredential(googleCredential)
  } catch (error) {
    return { error: true, userError: false }
  }
}

function signIn() {
  return new Promise(async (resolve, reject) => {
    const google = await googleAuth()
    if (google.error) return reject(google)
    const firebase = firebaseAuth(google.idToken)
    if (firebase.error) return reject(firebase)
    resolve(firebase)
  })
}

export default function useGoogleAuth() {
  const [authReady, setAuthReady] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setUser(user)
      if (!authReady) setAuthReady(true)
    })
    return subscriber 
  })

  return { authReady, signIn, user }
}
