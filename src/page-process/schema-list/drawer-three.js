import intl from 'react-intl-universal'
/**
 * @description 创建加工方案 - 任务配置
 */
import { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { action, observable, toJS } from 'mobx'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input, Select, Button, Switch } from 'antd'
import { CycleSelect } from '@dtwave/uikit'
import { QuestionTooltip } from '../../component'

import { scheduleTypeMap, cycleSelectMap } from '../util'

const FormItem = Form.Item
const Option = { Select }

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 },
}

@inject('rootStore')
@Form.create()
@observer
class DrawerThree extends Component {
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
    const { schemeDetail } = this.store

    if (
      schemeDetail.isPartitioned &&
      schemeDetail.partitionMappingKeys &&
      Array.isArray(toJS(schemeDetail.partitionMappingKeys))
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
      form: { validateFields },
    } = this.props
    const { schemeDetail } = this.store

    // const {runStatusMessage} = this.codeStore
    validateFields((err, values) => {
      if (err) {
        return
      }

      if (values.zoneParams) {
        const { isPartitioned, key, value } = values.zoneParams
        this.store.schemeDetail.isPartitioned = isPartitioned ? 1 : 0

        if (isPartitioned) {
          this.store.schemeDetail.partitionMappingKeys = [
            { partitionFieldName: key, partitionFieldValue: value },
          ]
        } else {
          this.store.schemeDetail.partitionMappingKeys = []
        }
      } else {
        this.store.schemeDetail.isPartitioned = 0
        this.store.schemeDetail.partitionMappingKeys = []
      }

      if (values.scheduleExpression) {
        this.store.schemeDetail.scheduleExpression = values.scheduleExpression

        const expression = CycleSelect.cronSrialize(values.scheduleExpression)
        this.store.schemeDetail.period = cycleSelectMap[expression.cycle]
        this.store.schemeDetail.periodTime = expression.time
      }

      const mainTagMappingKeys =
        schemeDetail.obj &&
        schemeDetail.obj.map((d, i) => ({
          objId: d.id,
          columnName: values[`majorTag${i}`],
        }))

      this.store.schemeDetail.mainTagMappingKeys = mainTagMappingKeys
      this.store.schemeDetail.scheduleType = values.scheduleType

      this.store.saveSchema(
        {
          status: 0, // 未完成
        },
        'next'
      ) // 保存
    })
  }

  // 分区输入映射
  @action zoneInputChange = (e, key) => {
    const {
      form: { setFieldsValue, validateFields },
    } = this.props

    const value = _.trim(e.target.value)

    if (key === 'zonekey') {
      this.zoneParams.key = value
    } else {
      this.zoneParams.value = value
    }

    setFieldsValue({ zoneParams: toJS(this.zoneParams) })
    validateFields(['zoneParams'], { force: true })
  }

  // 分区开关
  @action zoneSwitchChange = v => {
    const {
      form: { setFieldsValue, resetFields },
    } = this.props
    this.zoneParams.isPartitioned = v
    setFieldsValue({
      zoneParams: toJS(this.zoneParams),
    })

    if (!v) {
      resetFields(['zoneParams'])
    }
  }

  // 主标签选择
  @action.bound majorTagSelect(field, objId) {
    const { schemeDetail } = this.store
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

  // 切换主标签
  getMajorTagInit = data => {
    const obj = {}
    data.forEach(d => {
      obj[d.objId] = d.columnName
    })

    return obj
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },

      show,
      wrappedComponentRef,
    } = this.props

    const { schemeDetail } = this.store

    const majorTagInit = schemeDetail.mainTagMappingKeys
      ? this.getMajorTagInit(schemeDetail.mainTagMappingKeys)
      : {}

    return (
      <div style={{ display: show ? 'block' : 'none' }} className="task-config">
        <Form wrappedComponentRef={wrappedComponentRef}>
          <div className="form-title">
            {intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.modal-relate-table.m5inicr74ce'
              )
              .d('主标签配置')}
          </div>
          {show &&
            schemeDetail.obj &&
            schemeDetail.obj.map((d, i) => (
              <FormItem {...formItemLayout} label={d.name}>
                {getFieldDecorator(`majorTag${i}`, {
                  initialValue:
                    schemeDetail.fieldInfo &&
                    majorTagInit &&
                    schemeDetail.fieldInfo.filter(
                      sd => sd.column_name_alias === majorTagInit[d.id]
                    ).length
                      ? majorTagInit[d.id]
                      : undefined,
                  rules: [
                    {
                      required: true,
                      message: intl
                        .get(
                          'ide.src.component.project-provider.configModal.huo38php0h'
                        )
                        .d('请选择'),
                    },
                  ],
                })(
                  <Select
                    placeholder={intl
                      .get(
                        'ide.src.component.project-provider.configModal.huo38php0h'
                      )
                      .d('请选择')}
                    style={{ width: '100%' }}
                    onSelect={v => this.majorTagSelect(v, d.id)}
                    showSearch
                    optionFilterProp="children"
                  >
                    {schemeDetail.fieldInfo &&
                      schemeDetail.fieldInfo.map(item => (
                        <Option
                          key={item.column_name_alias}
                          value={item.column_name_alias}
                          disabled={item.disabled}
                        >
                          {item.column_name_alias}
                        </Option>
                      ))}
                  </Select>
                )}
              </FormItem>
            ))}

          <div className="form-title">
            {intl
              .get('ide.src.page-process.schema-list.drawer-four.lz4ovsfwwri')
              .d('设置分区')}
          </div>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                {intl
                  .get(
                    'ide.src.page-process.schema-list.drawer-four.lz4ovsfwwri'
                  )
                  .d('设置分区')}

                <QuestionTooltip
                  tip={intl
                    .get(
                      'ide.src.page-process.schema-list.drawer-three.zas75mojsk'
                    )
                    .d(
                      '分区字段值暂且只支持输入系统参数（cyctime、bizDate、bizMonth）'
                    )}
                />
              </span>
            }
          >
            <div className="FBH">
              {getFieldDecorator('zoneParams', {
                rules: [
                  {
                    validator: (rule, param, callback) => {
                      if (param && param.isPartitioned) {
                        if (!param.value && !param.key) {
                          callback(
                            intl
                              .get(
                                'ide.src.page-process.schema-list.drawer-three.sp9sdduexoa'
                              )
                              .d('分区字段名、分区字段值不能为空')
                          )
                        } else if (param.value && param.key) {
                          callback()
                        } else if (!param.key) {
                          callback(
                            intl
                              .get(
                                'ide.src.page-process.schema-list.drawer-three.23t1njw3kdg'
                              )
                              .d('分区字段名不能为空')
                          )
                        } else {
                          callback(
                            intl
                              .get(
                                'ide.src.page-process.schema-list.drawer-three.9zqhqo3vnyu'
                              )
                              .d('分区字段值不能为空')
                          )
                        }
                      } else {
                        callback()
                      }
                    },
                  },
                ],
              })(
                <Fragment>
                  <Switch
                    size="small"
                    checkedChildren={intl
                      .get('ide.src.component.form-component.03xp8ux32s3a')
                      .d('是')}
                    unCheckedChildren={intl
                      .get('ide.src.component.form-component.h7p1pcijouf')
                      .d('否')}
                    onChange={e => this.zoneSwitchChange(e)}
                    style={{ marginTop: '6px' }}
                    checked={this.zoneParams.isPartitioned}
                  />

                  {this.zoneParams.isPartitioned ? (
                    <div className="param-item zone-params">
                      <Input
                        value={this.zoneParams.key}
                        size="small"
                        placeholder={intl
                          .get(
                            'ide.src.page-process.schema-list.drawer-three.fol7th9dx9v'
                          )
                          .d('请输入分区字段名')}
                        onChange={e => this.zoneInputChange(e, 'zonekey')}
                      />

                      <span className="param-hen">－</span>
                      <Input
                        value={this.zoneParams.value}
                        size="small"
                        placeholder={intl
                          .get(
                            'ide.src.page-process.schema-list.drawer-three.uiol0o2xyna'
                          )
                          .d('请输入分区字段值')}
                        onChange={e => this.zoneInputChange(e, 'zoneValue')}
                      />
                    </div>
                  ) : null}
                </Fragment>
              )}
            </div>
          </FormItem>

          <div className="form-title">
            {intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.config-info.iejk9zbmj4'
              )
              .d('调度配置')}
          </div>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
              )
              .d('调度类型')}
          >
            {getFieldDecorator('scheduleType', {
              initialValue: schemeDetail.scheduleType,
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-process.schema-list.drawer-three.3f95udtgi91'
                    )
                    .d('请选择调度类型'),
                },
              ],
            })(
              <Select
                placeholder={intl
                  .get(
                    'ide.src.page-process.schema-list.drawer-three.3f95udtgi91'
                  )
                  .d('请选择调度类型')}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
              >
                {scheduleTypeMap.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {/* 周期调度/立即执行 判断 */}
          {getFieldValue('scheduleType') === 1 ? (
            <FormItem
              className="period-item"
              label=""
              style={{ marginBottom: 0 }}
            >
              {getFieldDecorator('scheduleExpression', {
                initialValue:
                  schemeDetail.scheduleExpression ||
                  CycleSelect.formatCron({
                    cycle: 'day',
                  }),

                rules: [
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-list.modal-start.gqzpzl1sv4r'
                      )
                      .d('调度周期不能为空'),
                  },
                ],
              })(
                <CycleSelect
                  cycleList={['day']}
                  cycleText={intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.modal-start.py6hq3ix0g8'
                    )
                    .d('调度')}
                  disabled={false}
                  required
                  layout="horizontal"
                  formItemLayout={formItemLayout}
                />
              )}
            </FormItem>
          ) : null}
        </Form>

        <div className="bottom-button">
          <Button
            style={{ marginRight: 8 }}
            onClick={() => this.store.lastStep()}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field.m6ae9pj50gh'
              )
              .d('上一步')}
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={this.nextStep}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field.kpiieqt46x'
              )
              .d('下一步')}
          </Button>
        </div>
      </div>
    )
  }
}
export default DrawerThree
