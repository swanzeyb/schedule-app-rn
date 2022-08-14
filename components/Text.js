import { Text as RNText } from 'react-native'
import PropTypes from 'prop-types'
import tw from '../tw'

export default function Text({ font, weight, color, style, children }) {
  const propStyles = tw.style(`font-${font}_${weight}`, `text-${color}`)

  return (
    <RNText
      style={{ ...propStyles, ...style }}
    >{children}</RNText>
  )
}

Text.propTypes = {
  font: PropTypes.oneOf(['Poppins', 'Roboto', 'Lato']),
  weight: PropTypes.oneOf(['regular', 'medium']),
  color: PropTypes.string,
}

Text.defaultProps = {
  font: 'Roboto',
  weight: 'regular',
  color: 'black',
  style: {},
}
