import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import functions from '@react-native-firebase/functions'

export default async function searchImage() {
  const fns = functions() //'us-central1'
  // fns.useEmulator('100.114.76.77', 5001)
  const detectShifts = fns.httpsCallable('detectShifts')

  let cancelled = false
  const imgBase64 = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    base64: true,
    quality: 1,
  }).then(result => {
    if (result.cancelled) {
      cancelled = true
    } else {
      return result.base64
    }
  })

  if (cancelled) {
    return Promise.resolve([])
  } else {
    return detectShifts({ imgBase64 })
      .then(({ data }) => data)
  }
}
