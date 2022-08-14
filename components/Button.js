import { TouchableOpacity } from 'react-native'
import Text from './Text'
import tw from '../tw'

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-blue py-2 px-3 rounded shadow`}
    >
      <Text weight="medium" color="white" style={tw`text-sm`}>{title}</Text>
    </TouchableOpacity>
  )
}
