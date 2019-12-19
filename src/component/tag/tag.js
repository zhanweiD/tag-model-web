import {Component} from 'react'
import PropTypes from 'prop-types'

export default class Tag extends Component {
  static propTypes = {
    status: PropTypes.string, // 颜色类型
    text: PropTypes.string, // 内容文案
    className: PropTypes.string,
  }

  static defaultProps = {
    status: 'default', // 默认灰色
    text: '未使用', // 默认未使用
    className: '',
  }

  /**
   * default  停止
   * process  进行中
   * success  成功
   * wait     未开始
   * error    失败
   */
  render() {
    const {status, text, className} = this.props
    return (
      <div className={`tag ${status} ${className}`}>
        {text}
      </div>
    )
  }
}
