import { View } from 'react-native'
import Text from './Text'
import tw from '../tw'

export default function ShiftRow({ shift, isEmpty }) {
  return (
    <View style={tw`flex-initial flex-row mb-7`}>
      <View style={tw`w-11 flex-initial items-center mr-2`}>
        <Text weight="medium" color={shift.isToday ? 'blue' : 'gray'}>
            {shift.dayOfWeek}
        </Text>
        <View style={tw.style(shift.isToday && 'bg-blue', 'rounded-full', 'p-2.5')}>
          <Text
            font="Lato" weight="medium"
            color={shift.isToday ? 'white' : 'black'}
          >{shift.dayNum}</Text>
        </View>
      </View>
      {isEmpty ? (
        <View style={tw`flex-1 flex-col py-2 pl-2 mt-1`}>
          <Text color="gray" weight="medium">{shift.title}</Text>
          <Text color="white">{shift.subtitle}</Text>
        </View>
      ) : (
        <View style={tw`flex-1 flex-col bg-green rounded py-2 pl-2 mt-1`}>
          <Text color="white" weight="medium">{shift.title}</Text>
          <Text color="white">{shift.subtitle}</Text>
        </View>
      )}
    </View>
  )
}
