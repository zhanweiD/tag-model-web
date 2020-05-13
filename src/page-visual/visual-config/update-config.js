// 更新配置
import {Component} from 'react'

export default class UpdateConfig extends Component {
  render() {
    const {show} = this.props
    return (
      <div style={{display: show ? 'block' : 'none'}}>123</div>
    )
  }
}
