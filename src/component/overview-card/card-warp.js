/**
 * @description 卡片包裹组件
 */
import {Component} from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import Card from './card'

const colors = ['#00caaa', '#3187ff', '#5c6df6']

export default class CardWarp extends Component {
  static defaultProps = {
    cards: PropTypes.array,
  }

  static propTypes = {
    cards: [],
  }

  render() {
    const {cards, hasBorder, ...rest} = this.props

    return (
      <div className={cls({'o-card-wrap': true, 'box-border': hasBorder})} {...rest}>
        {
          cards.map((item, index) => (
            <div 
              className="FB1" 
              style={{borderLeft: index !== 0 ? '1px solid #E8E8E8' : '', backgroundColor: colors[index % 3]}}
            >
              <Card {...item} />
            </div>
          ))
        }
      </div>
    )
  }
}
