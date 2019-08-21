import {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'antd'
import nodata from '../icon/noData.svg'

export default class NoData extends Component {
  static propTypes = {
    pt: PropTypes.string, // 距离顶部的距离；默认 10%
    text: PropTypes.string, // 说明文案；不传视为不需
    btnTxt: PropTypes.string, // 按钮文案；不传视为不需按钮
    onClick: PropTypes.func, // 按钮点击事件
  }

  static defaultProps = {
    pt: '13%',
    text: '',
    btnTxt: '',
    onClick: () => {},
  }

  onClick = () => {
    const {onClick} = this.props

    // 点击回调函数
    if (onClick) onClick()
  }

  renderContent() {
    const {text, btnTxt} = this.props

    // 渲染按钮
    if (btnTxt) {
      return <Button type="primary" onClick={this.onClick}>{btnTxt}</Button>
    }

    // 渲染说明文字
    if (text) {
      return <div className="text">{text}</div>
    }

    return null
  }

  render() {
    const {pt: paddingTop} = this.props
    const style = {
      paddingTop,
      marginBottom: '8px',
    }
    return (
      <div className="nodata">
        <div style={style}>
          <img width="180px" height="180px" src={nodata} alt="暂无数据" />
        </div>
        {
          this.renderContent()
        }
      </div>
    )
  }
}
