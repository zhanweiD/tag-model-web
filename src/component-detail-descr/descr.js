import {Component} from 'react'
import PropTypes from 'prop-types'

export default class Descr extends Component {
  static propTypes = {
    text: PropTypes.string, // 描述内容
    pr: PropTypes.number, // 右侧按钮距离;单位px
  }

  static defaultProps = {
    text: '',
    pr: 200,
  }

  render() {
    const {text, pr} = this.props
    const style = {
      paddingRight: `${pr}px`,
    }

    return (
      <div className="descr" style={style}>
        {text}
      </div>
    )
  }
}
