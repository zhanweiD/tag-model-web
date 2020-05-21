import {Component} from 'react'
import {Select, Input} from 'antd'

const {Option} = Select

export default class FixedValue extends Component {
  render() {
    return (
      <div className="FBH">
        <Select defaultValue="fixed" className="mr8" style={{width: 120}}>
          <Option value="fixed">固定值</Option>
        </Select>
        <Input placeholder="请输入" style={{width: 120}} />
      </div>
    )
  }
}
