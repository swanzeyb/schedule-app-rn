import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import functions from '@react-native-firebase/functions'

export default async function searchImage() {
  const fns = functions() //'us-central1'
  fns.useEmulator('100.114.76.77', 5001)
  const detectShifts = fns.httpsCallable('detectShifts')

  const imgBase64 = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    base64: true,
    quality: 1,
  }).then(result => {
    if (!result.cancelled) return result.base64
    // `data:image/jpeg;base64,${result.base64}`
  })

  return detectShifts({ imgBase64 })
    .then(({ data }) => data)
}
