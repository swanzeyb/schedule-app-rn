import { TouchableOpacity, Text } from 'react-native'
import tw from '../tw'

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-blue py-2 px-3 rounded shadow`}
    >
      <Text style={tw`font-body text-white text-sm font-medium`}>{title}</Text>
    </TouchableOpacity>
  )
}
