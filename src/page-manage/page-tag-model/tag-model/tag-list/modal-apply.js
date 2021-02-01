import intl from 'react-intl-universal'
/**
 * @description 标签申请
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { action, toJS } from 'mobx'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, Input, Radio, DatePicker, Spin, Select } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const { RangePicker } = DatePicker
const { Option } = Select

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
  colon: false,
}

@Form.create()
@observer
class TagApply extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 表单提交
  @action handleOk() {
    const t = this
    const { store } = t
    const {
      form: { validateFieldsAndScroll },
    } = t.props

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const params = {}
      // 申请时长为永远
      if (values.forever) {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = null
      } else {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = values.timeRange[1].format('YYYY-MM-DD')
      }

      store.applyTag(params, () => {
        t.handleCancel()
      })
    })
  }

  @action handleCancel() {
    this.store.modalApplyVisible = false
    this.store.useProjectId.clear()
    this.handleReset()
  }

  // 表单重置
  @action handleReset() {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
  }

  @action.bound applyProjectSelect(v) {
    this.store.useProjectId.push(v)
    // const useProjectIds = this.store.useProjectId
    // for (let i = 0; i < useProjectIds.length; i += 1) {
    //   if (toJS(this.store.applyProjectList.filter(d => d.id === i)[0].endTime)) {
    //     this.store.startDate = moment(moment(toJS(this.store.applyProjectList.filter(d => d.id === this.store.useProjectId)[0].endTime)).format())
    //   } else {
    //     this.store.startDate = moment()
    //   }
    // }
  }

  @action disabledDate = current => {
    return current && current < moment().endOf('day')
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props
    const {
      confirmLoading,
      modalApplyVisible,
      selectItem,
      applyProjectList,
      useProjectId,
      startDate,
      endDate,
      applyProjectLoading,
    } = this.store

    const selectName = selectItem && selectItem.name
    const selectEnName = selectItem && selectItem.enName

    const modalConfig = {
      width: 525,
      maskClosable: false,
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-apply.wey2k3xa6qn'
        )
        .d('标签授权'),
      confirmLoading,
      visible: modalApplyVisible,
      onOk: e => this.handleOk(e),
      onCancel: () => this.handleCancel(),
    }

    return (
      <Modal {...modalConfig}>
        <Form className="FBV">
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
              )
              .d('标签名称')}
          >
            {selectName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
              .d('标签标识')}
          >
            {selectEnName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-apply.z0d0ehl5669'
              )
              .d('授权项目')}
          >
            {getFieldDecorator('useprojectId', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-apply.21zat642jjj'
                    )
                    .d('请选择授权项目'),
                },
              ],
            })(
              <Select
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-apply.21zat642jjj'
                  )
                  .d('请选择授权项目')}
                showSearch
                optionFilterProp="children"
                onSelect={v => this.applyProjectSelect(v)}
                notFoundContent={
                  applyProjectLoading ? (
                    <div style={{ textAlign: 'center' }}>
                      <Spin />
                    </div>
                  ) : null
                }
                mode="multiple"
                size="small"
              >
                {applyProjectList.map(item => (
                  <Option
                    key={item.id}
                    value={item.id}
                    disabled={item.config && !item.endTime}
                  >
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-apply.n9bidtn3008'
              )
              .d('有效时长')}
          >
            {getFieldDecorator('forever', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-apply.7l4iu7e6mog'
                    )
                    .d('请选择有效时长'),
                },
              ],

              initialValue: 1,
            })(
              <Radio.Group>
                <Radio value={1}>
                  {intl
                    .get(
                      'ide.src.page-common.approval.common.comp-approval-modal.5ltr1685i6c'
                    )
                    .d('永久')}
                </Radio>
                <Radio value={0}>
                  {intl
                    .get('ide.src.component.time-range.time-range.fun3s4qcz29')
                    .d('自定义')}
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          {!getFieldValue('forever') ? (
            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-common-tag.common-tag.modal.2kpo3ify5lj'
                )
                .d('自定义时长')}
            >
              {getFieldDecorator('timeRange', {
                // initialValue: [startDate, endDate],
                rules: [
                  {
                    type: 'array',
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-common-tag.common-tag.modal.v8jpa624wk'
                      )
                      .d('请选择自定义时长'),
                  },
                  {
                    // 自定义校验规则
                    validator: (rule, value, callback) => {
                      if (value.length === 2) {
                        if (!value[0] || !value[1]) {
                          callback(
                            intl
                              .get(
                                'ide.src.page-manage.page-common-tag.common-tag.modal.533ni2z1rta'
                              )
                              .d('请选择申请时间')
                          )
                        } else {
                          // callback不传参数表示校验通过
                          callback()
                        }
                      } else {
                        callback(
                          intl
                            .get(
                              'ide.src.page-manage.page-common-tag.common-tag.modal.533ni2z1rta'
                            )
                            .d('请选择申请时间')
                        )
                      }
                    },
                  },
                ],
              })(
                <RangePicker
                  disabled={[true, false]}
                  disabledDate={this.disabledDate}
                />
              )}
            </FormItem>
          ) : null}
        </Form>
      </Modal>
    )
  }
}
export default TagApply
