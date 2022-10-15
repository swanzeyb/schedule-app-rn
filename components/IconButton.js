import { TouchableOpacity, Image } from 'react-native'
import tw from '../tw'

export default function IconButton({ iconSrc, onPress, style }) {
  const iconStyles = tw.style({ width: 24, height: 24 })

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
    >
      <Image style={iconStyles} source={iconSrc} />
    </TouchableOpacity>
  )
}
