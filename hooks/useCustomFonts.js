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
  const [fontsReady] = useFonts({
    // Poppins
    'Poppins_regular': Poppins_400Regular,
    // Roboto
    'Roboto_regular': Roboto_400Regular,
    'Roboto_medium': Roboto_500Medium,
    // Lato
    'Lato_medium': Lato_700Bold,
  })

  return fontsReady
}
