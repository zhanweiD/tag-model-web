import {Component} from 'react'
import PropTypes from 'prop-types'

export default class Tag extends Component {
  static propTypes = {
    color: PropTypes.string, // 颜色类型
    text: PropTypes.string, // 内容文案
    className: PropTypes.string,
  }

  static defaultProps = {
    color: 'gray', // 默认灰色
    text: '未使用', // 默认未使用
    className: '',
  }

  render() {
    const {color, text, className} = this.props
    return (
      <div className={`tag ${color} ${className}`}>
        {text}
      </div>
    )
  }
}
