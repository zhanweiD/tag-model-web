import {Component} from 'react'
import {Select, Input} from 'antd'

const {Option} = Select

export default class RuleItem extends Component {
  render() {
    const {pos = []} = this.props
    const posStyle = {
      left: pos[0],
      top: pos[1],
    }

    return (
      <div className="FBH abs" style={posStyle}>
        <Select defaultValue="tag" className="mr8" style={{width: 100}}>
          <Option value="tag">标签值</Option>
        </Select>
        <Select 
          showSearch
          className="mr8" 
          style={{width: 100}}
          optionFilterProp="children"
          placeholder="选择标签"
        >
          <Option value="tag">选择标签</Option>
        </Select>
        <Select defaultValue="equal" className="mr8" style={{width: 100}}>
          <Option value="equal">等于</Option>
        </Select>
        <Select defaultValue="fixed" className="mr8" style={{width: 100}}>
          <Option value="fixed">固定值</Option>
        </Select>
        <Input placeholder="请输入" style={{width: 120}} />
      </div>
    )
  }
}
