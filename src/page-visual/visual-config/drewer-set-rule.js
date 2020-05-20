import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {Drawer, Button, Popconfirm} from 'antd'
import {RuleIfBox, FixedValue} from '../component'

const elseId = 'set-rule-else'
const thenId = 'set-rule-then'

@observer
export default class DrewerSetRule extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable clearActionKey = 0
  @observable submitActionKey = 0
  combineData = []
  allData=[]

  @action.bound onClose() {
    this.store.drawerRuleVisible = false
  }

  @action.bound clear() {
    this.clearActionKey = Math.random()
  }

  @action.bound confirm() {
    this.submitActionKey = Math.random()
  }

  @action.bound submitCondition(conditionData, allData) {
    const andOr = allData.filter(d => d.type === 1)

    this.combineData = conditionData.concat(andOr)
    this.allData = allData
    this.validateThen()
  }

  @action.bound validateThen() {
    const t = this

    this.then.validateFields((err, values) => {
      if (!err) {
        const sData = {
          flag: thenId,
          thenFunction: values.thenFunction,
          thenParams: values.thenParams,
        }

        t.thenData = sData

        t.validateElse()
      }
    })
  }

  @action.bound validateElse() {
    const t = this

    this.else.validateFields((err, values) => {
      if (!err) {
        const sData = {
          flag: elseId,
          thenFunction: values.thenFunction,
          thenParams: values.thenParams,
        }
        t.elseData = sData

        t.getSubmitData(t.combineData)
      }
    })
  }

  @action.bound getSubmitData() {
    const result = {
      type: 1,
    }

    const elseData = {
      function: this.elseData.thenFunction,
      params: [this.elseData.thenParams],
    }
    
    const thenData = {
      function: this.thenData.thenFunction,
      params: [this.thenData.thenParams],
    }
    const obj = {}

    obj.then = thenData

    obj.posInfoList = this.allData;

    [obj.when] = this.getWhenData(this.combineData)

    const visualWhenThenElse = {
      whenThenList: [obj],
      elseCondition: elseData,
    }

    result.visualWhenThenElse = visualWhenThenElse
    this.submit(result)
  }

  @action.bound getWhenData(data) {
    const newData = _.cloneDeep(data)

    newData.forEach(d => {
      const comparisionList = newData.filter(sd => sd.type === 2
         && (sd.source[0] === d.x + 44) 
        && (sd.source[1] === d.y + 16))

      const comparisionListResult = comparisionList.map(sd => ({
        comparision: sd.comparision,
        left: {
          function: sd.leftFunction,
          params: [
            sd.leftTagId,
          ],
        },
        right: {
          function: sd.rightFunction,
          params: [
            sd.rightParams,
          ],
        },
      }))

      if (comparisionListResult.length && !d.comparisionList) d.comparisionList = comparisionListResult

      const childList = newData.filter(sd => sd.type === 1 
        && sd.source
        && (sd.source[0] === d.x + 44) 
        && (sd.source[1] === d.y + 16))

      if (childList.length && !d.childList) {
        d.childList = childList
      }

      if (d.type === 1) {
        delete d.flag
        delete d.level
        delete d.source
        delete d.target
        delete d.type
        delete d.y
      }
    })

    return newData.filter(d => d.x === 0)
  }

  @action.bound submit(data) {
    this.store.saveVisualExt(data, res => {
      if (res) {
        this.store.drawerRuleVisible = false
      }
    })
  }

  render() {
    const {funcList, tagList} = this.props

    const {drawerRuleVisible} = this.store

    const drawerConfig = {
      title: '数据过滤规则设置',
      placement: 'right',
      width: 1120,
      closable: true,
      visible: drawerRuleVisible,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.onClose,
      className: 'set-rule',
    }
    return (
      <Drawer
        {...drawerConfig}
      >
        <div style={{paddingBottom: '60px'}}>
          <Popconfirm
            placement="rightTop"
            title="确认清空规则？"
            onConfirm={this.clear}
            okText="是"
            cancelText="否"
          >
            <Button type="primary" className="mb16">清空规则</Button>
          </Popconfirm>

          <div>
            <div className="condition-item-box">
              <h3>如果</h3>
              <RuleIfBox
                id="set-rule"
                clearActionKey={this.clearActionKey}
                submitActionKey={this.submitActionKey}
                funcList={funcList}
                tagList={tagList}
                submit={this.submitCondition}
              />
              <div>
                <h3>那么</h3>
                <FixedValue
                  id={thenId}
                  clearActionKey={this.clearActionKey}
                  wrappedComponentRef={form => { this.then = form ? form.props.form : form }}
                />
              </div>
            </div>
            <div className="condition-item-box">
              <h3>否则</h3>
              <FixedValue
                id={elseId}
                clearActionKey={this.clearActionKey}
                wrappedComponentRef={form => { this.else = form ? form.props.form : form }}
              />
            </div>
          </div>
        </div>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.onClose}>取消</Button>
          <Button
            type="primary"
            onClick={this.confirm}
          >
            确定
          </Button>
        </div>
      </Drawer>
    )
  }
}
