import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Form, Select} from 'antd'
import {withRouter} from 'react-router-dom'
import store from './store-tag-import'

const {Option} = Select

@observer
class StepOne extends Component {
  @action handleChange(type, e) {
    store[type] = e
    if (type === 'typeCode') store.getObjs()
  }

  render() {
    return (
      <div style={{width: '420px'}}>
        <div>
          <span className="pr16">所属对象</span>
          <Select
            placeholder="请下拉选择"
            style={{width: '320px'}}
            onChange={e => this.handleChange('typeCode', e)}
          >
            {
              store.typeCodes.map(item => (
                <Option key={item.objTypeCode} value={item.objTypeCode}>{item.objTypeName}</Option>
              ))
            }
          </Select>
        </div>

        <div className="mt24">
          <span className="pr16">对象名称</span>
          <Select
            placeholder="请下拉选择"
            style={{width: '320px'}}
            onChange={e => this.handleChange('objId', e)}
            disabled={!store.typeCode}
          >
            {
              store.objs.map(item => (
                <Option key={item.objId} value={item.objId}>{item.objName}</Option>
              ))
            }
          </Select>
        </div>
        
        <div className="fac mt48">
          <Button
            type="primary"
            size="large"
            disabled={!store.typeCode || !store.objId}
            onClick={() => {
              store.currStep = 1
            }}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
export default withRouter(StepOne)
