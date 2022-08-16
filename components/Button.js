import { TouchableOpacity } from 'react-native'
import Text from './Text'
import tw from '../tw'

export default function Button({ title, onPress, style }) {
  const propStyles = tw`bg-blue py-2 px-3 rounded shadow`

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...propStyles, ...style }}
    >
      <Text weight="medium" color="white" style={tw`text-sm`}>{title}</Text>
    </TouchableOpacity>
  )
}
