import { TouchableOpacity, Image } from 'react-native'
import tw from '../tw'

export default function SquareButton({ iconSrc, onPress, style }) {
  const propStyles = tw`bg-lightBlue p-4 rounded-2xl shadow`
  const iconStyles = tw.style({ width: 24, height: 24 })

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...propStyles, ...style }}
    >
      <Image style={iconStyles} source={iconSrc} />
    </TouchableOpacity>
  )
}
