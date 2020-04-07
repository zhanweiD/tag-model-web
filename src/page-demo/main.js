/* eslint-disable valid-jsdoc */
import {Component, Fragment} from 'react'
import {Button, Popconfirm} from 'antd'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import Frame from '../frame'
import {IconDel} from '../icon-comp'
import {
  RuleIfBox, 
  FixedValue,
} from './component'


@observer
export default class Page extends Component {
  @observable ruleList = []
  
  /**
   * @description 添加规则 (如果 - 那么)
   */
  @action.bound addRule() {
    const len = this.ruleList.length

    if (len === 0) {
      this.ruleList.push({
        id: `rule${len}`,
      })
    } else {
      const lastRule = toJS(this.ruleList[len - 1])
      this.ruleList.push({
        id: `rule${+lastRule.id.slice(4) + 1}`,
      })
    }
  }

  /**
   * @description 删除规则 (如果 - 那么)
   */
  @action.bound delRule(item) {
    const newArr = this.ruleList.filter(d => d.id !== item.id)
    this.ruleList.replace(newArr)
  }

  renderRule = () => {
    return (
      <Fragment>
        {this.ruleList.map(d => (
          <div key={d} className="condition-item-box">
            <Popconfirm
              placement="topRight"
              title="确认删除此条规则？"
              onConfirm={() => this.delRule(d)}
              okText="确认"
              cancelText="取消"
            >
              <IconDel size="16" className="delete-icon" />
            </Popconfirm>
            <h3>如果</h3> 
            <RuleIfBox />
            <div>
              <h3>那么</h3>
              <FixedValue />
            </div>
          </div>
        ))}
        <div className="condition-item-box">
          <h3>否则</h3>
          <FixedValue />
        </div>
      </Fragment>
    )
  }

  render() {
    return (
      <Frame>
        <div className="bgf p16">
          <Button type="primary" className="mb16" onClick={this.addRule}>添加规则</Button>
          {
            this.renderRule()
          }
        </div>
      </Frame>
     
    )
  }
}
