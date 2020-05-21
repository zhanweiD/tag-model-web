import {Component} from 'react'
import {Button, Popconfirm} from 'antd'
import {IconDel} from '../../icon-comp'

export default class RuleCondition extends Component {
  state={
    isAnd: true,
  }

  change = () => {
    const {isAnd} = this.state

    this.setState({
      isAnd: !isAnd,
    })
  }

  render() {
    const {isAnd} = this.state

    const {pos = [], delCon, ...rest} = this.props
    const posStyle = {
      left: pos[0],
      top: pos[1],
    }

    return (
      <div style={posStyle} className="rule-condition" {...rest}>
        <Button onClick={this.change}>
          {isAnd ? '且' : '或'}
        </Button>
        {
          rest.flag !== '0' ? (
            <Popconfirm
              placement="topRight"
              title="确认删除联合条件？"
              onConfirm={() => delCon()} 
              okText="确认"
              cancelText="取消"
            >
              <IconDel size="16" className="delete-icon" />
            </Popconfirm>
          ) : null
        }
     
      </div>
    )
  }
}
