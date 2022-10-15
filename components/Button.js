import { TouchableOpacity, Image } from 'react-native'
import Text from './Text'
import tw from '../tw'

export default function Button({ title, onPress, style, iconSrc }) {
  const propStyles = !iconSrc && tw`bg-blue py-2 px-3 rounded shadow`
  const iconStyles = tw.style('', { width: 24, height: 24 })

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...propStyles, ...style }}
    >
      {iconSrc ? (
        <Image style={iconStyles} source={iconSrc} />
      ) : (
        <Text weight="medium" color="white" style={tw`text-sm`}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}
