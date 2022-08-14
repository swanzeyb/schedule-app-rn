import {
  useFonts,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins'

import {
  Roboto_400Regular,
  Roboto_500Medium,
} from '@expo-google-fonts/roboto'

import {
  Lato_700Bold,
} from '@expo-google-fonts/lato'

export default function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    // Poppins
    'Poppins_Regular': Poppins_400Regular,
    // Roboto
    'Roboto_Regular': Roboto_400Regular,
    'Roboto_Medium': Roboto_500Medium,
    // Lato
    'Lato_Medium': Lato_700Bold,
  })

  return fontsLoaded
}
