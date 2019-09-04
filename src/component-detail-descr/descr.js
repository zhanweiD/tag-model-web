import {Component, Fragment} from 'react'
import PropTypes from 'prop-types'

export default class Descr extends Component {
  static propTypes = {
    text: PropTypes.string, // 描述内容
    pr: PropTypes.number, // 右侧按钮距离;单位px
    className: PropTypes.string, // 右侧按钮距离;单位px
  }

  static defaultProps = {
    text: '',
    pr: 200,
    className: '',
  }

  render() {
    const {text, pr, className} = this.props
    const style = {
      paddingRight: `${pr}px`,
    }

    return (
      <Fragment>
        {
          text ? (
            <div className={`descr ${className}`} style={style}>
              {text}
            </div>
          ) : null
        }
      </Fragment>
      
    )
  }
}
