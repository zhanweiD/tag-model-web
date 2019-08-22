import {Component} from 'react'
import PropTypes from 'prop-types'
import {Button} from 'antd'
import nodata from '../icon/noData.svg'

const {functionCodes} = window.__userConfig

export default class NoData extends Component {
  static propTypes = {
    pt: PropTypes.string, // 距离顶部的距离；默认 10%
    text: PropTypes.string, // 说明文案；不传视为不需
    btnTxt: PropTypes.string, // 按钮文案；不传视为不需按钮
    onClick: PropTypes.func, // 按钮点击事件
    isLoading: PropTypes.bool, // 判断当前页面是否在loading; 若页面正在loading 则空组件隐藏处理；避免出现loading 空组件同时出现的情况
  }

  static defaultProps = {
    pt: '13%',
    text: '暂无数据',
    btnTxt: '',
    isLoading: false,
    onClick: () => {},
  }

  onClick = () => {
    const {onClick} = this.props

    // 点击回调函数
    if (onClick) onClick()
  }

  renderText() {
    const {text} = this.props

    // 渲染说明文字
    if (text) {
      return <div className="text">{text}</div>
    }

    return null
  }


  renderBtn() {
    const {btnTxt} = this.props
    
    // 渲染按钮
    if (btnTxt) {
      return <Button type="primary" onClick={this.onClick}>{btnTxt}</Button>
    }

    return null
  }

  render() {
    console.log(functionCodes)
    const {pt: paddingTop, isLoading} = this.props
    const style = {
      paddingTop,
      marginBottom: '8px',
    }

    return (
      <div className={`nodata ${isLoading ? 'no-show' : ''}`}>
        <div style={style}>
          <img width="180px" height="180px" src={nodata} alt="暂无数据" />
        </div>
        {
          this.renderText()
        }
        {
          this.renderBtn()
        }
      </div>
    )
  }
}
