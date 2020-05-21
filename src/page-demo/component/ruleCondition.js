import {Component} from 'react'
import {Select, Menu, Dropdown} from 'antd'
import {action} from 'mobx'

const {Option} = Select

export default class RuleCondition extends Component {
  // 添加条件
  @action.bound addCondition() {

  }

  // 添加联合条件
  @action.bound addCombineCondition() {
    
  }

  // 删除
  @action.bound deleteCondition() {
    
  }

  menu = (
    <Menu>
      <Menu.Item>
        <a onClick={() => this.addCondition()}>
          添加条件
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.addCombineCondition()}>
          添加联合条件
        </a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.deleteCondition()}>
          删除
        </a>
      </Menu.Item>
    </Menu>
  )
  render() {
    const {pos = []} = this.props
    const posStyle = {
      left: pos[0],
      top: pos[1],
    }

    return (
      <div className="FBH abs" style={posStyle}>
        <Select style={{width: '74px'}} defaultValue="and">
          <Option value="and">并且</Option>
          <Option value="or">或</Option>
        </Select>
        <Dropdown overlay={this.menu} trigger={['click']}>
          <div className="rule-select-action" onClick={e => e.preventDefault()}>...</div>
        </Dropdown>
      </div>

    )
  }
}
