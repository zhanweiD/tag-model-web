/**
 * @description 创建加工方案 - 任务配置
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {
  Input, Form, Select, Button, Switch,
} from 'antd'
import {CycleSelect} from '@dtwave/uikit'

import {scheduleTypeMap} from '../util'

const FormItem = Form.Item
const Option = {Select}

const formItemLayout = {
  labelCol: {span: 7},
  wrapperCol: {span: 12},
}

@inject('rootStore')
@Form.create()
@observer
export default class DrawerThree extends Component {
  constructor(props) {
    super(props)
    this.store = props.rootStore.drawerStore
    this.codeStore = props.rootStore.codeStore
  }

  @observable zoneParams = {
    key: '',
    value: '',
  }

  @action.bound nextStep() {
    const {
      form: {
        validateFieldsAndScroll,
      },
    } = this.props

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      } 

      console.log(values)

      // this.store.nextStep()
    })
    // this.store.nextStep()
  }

  @action zoneInputChange = (e, key) => {
    const {form: {setFieldsValue, validateFields}} = this.props

    const value = _.trim(e.target.value)

    if (key === 'zonekey') {
      this.zoneParams.key = value
    } else {
      this.zoneParams.value = value
    }
    console.log(toJS(this.zoneParams))

    setFieldsValue({zoneParams: 111})

    validateFields('zoneParams', {force: true})
  }

  @action zoneSwitchChange = v => {
    const {form: {setFieldsValue}} = this.props
    setFieldsValue({
      isPartitioned: v,
    })
  }

  @action.bound majorTagSelect(field, objId) {
    const {schemeDetail} = this.store
    schemeDetail.fieldInfo = schemeDetail.fieldInfo.map(d => {
      if (d.column_name_alias === field) {
        return {
          ...d,
          disabled: true,
          objId,
        }
      }

      if (d.objId === objId) {
        return {
          ...d,
          field: d.field,
          disabled: false,
        }
      }
      return d
    })
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      show,
    } = this.props

    const {
      schemeDetail,
    } = this.store

    console.log(toJS(schemeDetail))
    return (
      <div style={{display: show ? 'block' : 'none'}} className="task-config">
        <div className="form-title">主标签配置</div>
        {
          show && schemeDetail.obj && schemeDetail.obj.map((d, i) => (
            <FormItem {...formItemLayout} label={d.name}>
              {getFieldDecorator(`majorTag${i}`, {
                // initialValue: undefined,
                rules: [{required: true, message: '请选择'}],
              })(
                <Select placeholder="请选择" style={{width: '100%'}} onSelect={v => this.majorTagSelect(v, d.id)}>
                  {
                    schemeDetail.fieldInfo.map(item => (
                      <Option 
                        key={item.column_name_alias} 
                        value={item.column_name_alias}
                        disabled={item.disabled}
                      >
                        {item.column_name_alias}
                      </Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          ))
        }
      
        <div className="form-title">设置分区</div>

        <FormItem {...formItemLayout} label="设置分区">
         
          <div className="FBH">
            {
              getFieldDecorator('isPartitioned')(<Switch 
                checkedChildren="是" 
                unCheckedChildren="否"
                onChange={e => this.zoneSwitchChange(e, 'isPartitioned')} 
                style={{marginTop: '8px'}}
              />)
            }
                         
            {
              getFieldValue('isPartitioned')
                ? getFieldDecorator('zoneParams', {
                  rules: [{
                    validator: (rule, param, callback) => {
                      console.log(param)
                      if ((param.zoneValue && param.zonekey) || (!param.zoneValue && !param.zonekey)) {
                        callback()
                      } else if (!param.zonekey) {
                        callback('分区字段名不能为空')
                      } else {
                        callback('分区字段值不能为空')
                      }
                    },
                  }],
                })(
                  <div className="param-item zone-params">
                    <Input
                      value={this.zoneParams.key} 
                      placeholder="请输入分区字段名"
                      onChange={e => this.zoneInputChange(e, 'zonekey')}
                    />
                    <span className="param-hen">－</span>
                    <Input
                      value={this.zoneParams.value} 
                      placeholder="请输入分区字段值"
                      onChange={e => this.zoneInputChange(e, 'zoneValue')}
                    />
                  </div>
                )            
                : null
            }
          </div>
        </FormItem>

        <div className="form-title">调度配置</div>
        <FormItem {...formItemLayout} label="调度类型">
          {getFieldDecorator('scheduleType', {
            initialValue: undefined,
            rules: [{required: true, message: '请选择调度类型'}],
          })(
            <Select placeholder="请选择调度类型" style={{width: '100%'}}>
              {
                scheduleTypeMap.map(item => (
                  <Option key={item.value} value={item.value}>{item.name}</Option>
                ))
              }
            </Select>
          )}
        </FormItem>
        {/* 周期调度/立即执行 判断 */}
        {
          getFieldValue('scheduleType') === 1 ? (
            <FormItem
              className="period-item"
              label=""
              style={{marginBottom: 0}}
            >
              {getFieldDecorator('period', {
                initialValue: CycleSelect.formatCron({
                  cycle: 'day',
                }),
                rules: [
                  {required: true, message: '采集周期不能为空'},
                ],
              })(
                <CycleSelect
                  cycleList={['day']}
                  cycleText="调度"
                  disabled={false}
                  required
                  layout="horizontal"
                  formItemLayout={formItemLayout} 
                />
              )}
            </FormItem>
          ) : null
        }
       
       
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.lastStep()}>上一步</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.nextStep}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}
