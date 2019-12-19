/**
 * @description 卡片包裹组件
 */
import {Component} from 'react'
import PropTypes from 'prop-types'
import Card from './card'

export default class CardWarp extends Component {
  static defaultProps = {
    cards: PropTypes.array,
  }

  static propTypes = {
    cards: [],
  }

  render() {
    const {cards, ...rest} = this.props
    return (
      <div className="o-card-wrap" {...rest}>
        {
          cards.map((item, index) => (
            <div className="FB1" style={{borderLeft: index !== 0 ? '1px solid #E8E8E8' : ''}}>
              <Card {...item} />
            </div>
          ))
        }
      </div>
    )
  }
}
