import intl from 'react-intl-universal'
/**
 * @description 标签申请
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { action, toJS } from 'mobx'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, Input, Radio, DatePicker, Space } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const { RangePicker } = DatePicker

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

      const params = {
        useProjectId: values.useProjectId || this.store.useProjectId,
        applyDescr: values.applyDescr,
      }

      // 申请时长为永远
      if (values.forever) {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = null
      } else {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = values.timeRange[1].format('YYYY-MM-DD')
      }

      params.tagIds = toJS(store.tagIds)

      store.applyTag(params, () => {
        t.handleCancel()
      })
    })
  }

  @action handleCancel() {
    this.store.modalApplyVisible = false
    this.handleReset()
  }

  // 表单重置
  @action handleReset() {
    const {
      form: { resetFields },
    } = this.props
    this.store.tagIds.clear()
    resetFields()
  }

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props
    const {
      confirmLoading,
      modalApplyVisible,
      selectItem,
      ownProjectList,
      useProjectId,
    } = this.store
    // console.log(toJS(selectItem.endTime))
    // const defaultSelectDate = {
    //   startDate: toJS(selectItem.endTime) ? moment(moment(toJS(selectItem.endTime)).format()) : moment(),
    // endDate: '',
    // }

    const disabledDate = current => {
      return current && current < moment().endOf('day')
    }

    const modalConfig = {
      width: 525,
      maskClosable: false,
      title: intl
        .get(
          'ide.src.page-manage.page-project-tag.tag-list.modal-apply.kqmswz28zq'
        )
        .d('权限申请'),
      confirmLoading,
      visible: modalApplyVisible,
      onOk: e => this.handleOk(e),
      onCancel: () => this.handleCancel(),
    }

    const { projectName } =
      ownProjectList.filter(d => d.projectId === useProjectId)[0] || {}

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
            {selectItem.name}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
              .d('标签标识')}
          >
            {selectItem.enName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.modal.0snlii7b6ll'
              )
              .d('使用项目')}
          >
            {projectName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-common.approval.common.comp-approval-modal.4nobznc4k2w'
              )
              .d('申请时长')}
          >
            {getFieldDecorator('forever', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-common-tag.common-tag.modal.g9fsitnnhb'
                    )
                    .d('请选择申请时长'),
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
                // initialValue: [defaultSelectDate.startDate],
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
                  disabledDate={disabledDate}
                  disabled={[true, false]}
                />
              )}
            </FormItem>
          ) : null}

          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-common.approval.common.comp-approval-modal.qskkf95ea1k'
              )
              .d('申请理由')}
          >
            {getFieldDecorator('applyDescr', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-common-tag.common-tag.modal.6lbexqjjvlf'
                    )
                    .d('请输入申请理由'),
                },
                {
                  max: 128,
                  whitespace: true,
                  message: intl
                    .get('ide.src.component.form-component.8ftxftczpk7')
                    .d('输入不能超过128个字符'),
                },
              ],
            })(
              <TextArea
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-common-tag.common-tag.modal.6lbexqjjvlf'
                  )
                  .d('请输入申请理由')}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
export default TagApply
