import {Component} from 'react'
import {Select, Input} from 'antd'
import {IconDel} from '../../icon-comp'

const {Option} = Select

export default class RuleItem extends Component {
  render() {
    const {pos = [], delCon, ...rest} = this.props
    const posStyle = {
      left: pos[0],
      top: pos[1],
    }

    const {level} = rest

    return (  
      <div className="rule-item" style={posStyle} {...rest}>
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
        {
          level[level.length - 1] > 1 ? <IconDel size="16" className="delete-icon" onClick={() => delCon()} style={{right: '0px'}} /> : null
        }
       
      </div>
    )
  }
}
