// 逻辑配置
import {Component} from 'react'

export default class LogicConfig extends Component {
  render() {
    const {show} = this.props
    return (
      <div style={{display: show ? 'block' : 'none'}}>123</div>
    )
  }
}
