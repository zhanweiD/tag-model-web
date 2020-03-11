/**
 * @description 创建加工方案 - 任务配置
 */
import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable, toJS} from 'mobx'
import {
  Input, Form, Select, Button, Switch,
} from 'antd'
import {CycleSelect} from '@dtwave/uikit'

import {scheduleTypeMap, cycleSelectMap} from '../util'

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
    isPartitioned: false,
    key: '',
    value: '',
  }

  @action componentDidMount() {
    const {schemeDetail} = this.store

    if (schemeDetail.isPartitioned
       && schemeDetail.partitionMappingKeys 
       && Array.isArray(toJS(schemeDetail.partitionMappingKeys))
    ) {
      const obj = schemeDetail.partitionMappingKeys[0] || {}

      this.zoneParams = {
        isPartitioned: Boolean(schemeDetail.isPartitioned),
        key: obj.partitionFieldName,
        value: obj.partitionFieldValue,
      }
    }
  }

  @action.bound nextStep() {
    const {
      form: {
        validateFields,
      },
    } = this.props
    const {
      schemeDetail,
    } = this.store

    // const {runStatusMessage} = this.codeStore
    validateFields((err, values) => {
      if (err) {
        return
      }

      if (values.zoneParams) {
        const {
          isPartitioned, key, value,
        } = values.zoneParams
        this.store.schemeDetail.isPartitioned = isPartitioned ? 1 : 0

        if (isPartitioned) {
          this.store.schemeDetail.partitionMappingKeys = [{partitionFieldName: key, partitionFieldValue: value}]
        } else {
          this.store.schemeDetail.partitionMappingKeys = []
        }
      } else {
        this.store.schemeDetail.isPartitioned = 0
        this.store.schemeDetail.partitionMappingKeys = []
      }

      if (values.scheduleExpression) {
        console.log(values.scheduleExpression)

        this.store.schemeDetail.scheduleExpression = values.scheduleExpression

        const expression = CycleSelect.cronSrialize(values.scheduleExpression)
        console.log(expression)
        this.store.schemeDetail.period = cycleSelectMap[expression.cycle]
        this.store.schemeDetail.periodTime = expression.time
      }

      const mainTagMappingKeys = schemeDetail.obj && schemeDetail.obj.map((d, i) => ({
        objId: d.id,
        columnName: values[`majorTag${i}`],
      }))
      
      this.store.schemeDetail.mainTagMappingKeys = mainTagMappingKeys
      this.store.schemeDetail.scheduleType = values.scheduleType
      
      this.store.saveSchema({
        status: 0, // 未完成
      }, 'next') // 保存
    })
  }

  @action zoneInputChange = (e, key) => {
    const {form: {setFieldsValue, validateFields}} = this.props

    const value = _.trim(e.target.value)

    if (key === 'zonekey') {
      this.zoneParams.key = value
    } else {
      this.zoneParams.value = value
    }

    setFieldsValue({zoneParams: toJS(this.zoneParams)})
    validateFields(['zoneParams'], {force: true})
  }

  @action zoneSwitchChange = v => {
    const {form: {setFieldsValue, resetFields}} = this.props
    this.zoneParams.isPartitioned = v
    setFieldsValue({
      zoneParams: toJS(this.zoneParams),
    })

    if (!v) {
      resetFields(['zoneParams'])
    }
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

  getMajorTagInit = data => {
    const obj = {}
    data.forEach(d => {
      obj[d.objId] = d.columnName
    })  

    return obj
  }

  render() {
    const {
      form: {
        getFieldDecorator,
        getFieldValue,
      },
      show,
      wrappedComponentRef,
    } = this.props

    const {
      schemeDetail,
    } = this.store

    const majorTagInit = (schemeDetail.mainTagMappingKeys)
      ? this.getMajorTagInit(schemeDetail.mainTagMappingKeys)
      : {}

    return (
      <div style={{display: show ? 'block' : 'none'}} className="task-config">
        <Form wrappedComponentRef={wrappedComponentRef}>
          <div className="form-title">主标签配置</div>
          {
            show && schemeDetail.obj && schemeDetail.obj.map((d, i) => (
              <FormItem {...formItemLayout} label={d.name}>
                {getFieldDecorator(`majorTag${i}`, {
                  initialValue: majorTagInit[d.id],
                  rules: [{required: true, message: '请选择'}],
                })(
                  <Select placeholder="请选择" style={{width: '100%'}} onSelect={v => this.majorTagSelect(v, d.id)}>
                    {
                      schemeDetail.fieldInfo && schemeDetail.fieldInfo.map(item => (
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
                getFieldDecorator('zoneParams', {
                  rules: [{
                    validator: (rule, param, callback) => {
                      if (param && param.isPartitioned) {
                        if (!param.value && !param.key) {
                          callback('分区字段名、分区字段值不能为空')
                        } else if (param.value && param.key) {
                          callback()
                        } else if (!param.key) {
                          callback('分区字段名不能为空')
                        } else {
                          callback('分区字段值不能为空')
                        }
                      } else {
                        callback()
                      }
                    },
                  }],
                })(
                  <Fragment>
                    <Switch 
                      checkedChildren="是" 
                      unCheckedChildren="否"
                      onChange={e => this.zoneSwitchChange(e)} 
                      style={{marginTop: '8px'}}
                      checked={this.zoneParams.isPartitioned}
                    />
                    {
                      this.zoneParams.isPartitioned ? (
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
                      ) : null
                    }
                  </Fragment> 
                )
              }
            </div>
          </FormItem>

          <div className="form-title">调度配置</div>
          <FormItem {...formItemLayout} label="调度类型">
            {getFieldDecorator('scheduleType', {
              initialValue: schemeDetail.scheduleType,
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
                {getFieldDecorator('scheduleExpression', {
                  initialValue: schemeDetail.scheduleExpression || CycleSelect.formatCron({
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
        </Form>
       
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
