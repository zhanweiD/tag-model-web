import intl from 'react-intl-universal'
/**
 * @description 标签申请
 */
import { Component } from 'react'
import { observer } from 'mobx-react'
import { action, toJS } from 'mobx'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, Input, Radio } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input

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
        tagIds: toJS([store.tagDetail.id]),
        // useProjectId: values.useProjectId || this.store.projectId,
        useProjectId: this.store.projectId,
        applyDescr: values.applyDescr,
      }

      // 申请时长为永远
      if (values.forever) {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = null
      } else {
        params.startTime = values.timeRange[0].format('YYYY-MM-DD')
        params.endTime = values.timeRange[1].format('YYYY-MM-DD')
      }

      // params.tagIds = toJS([store.tagDetail.id])

      store.applyTag(params, () => {
        t.handleCancel()
      })
    })
  }

  @action handleCancel() {
    this.store.modalApplyVisible = false
    const {
      form: { resetFields },
    } = this.props
    resetFields()
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props
    const { confirmLoading, modalApplyVisible, projectName } = this.store

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

    return (
      <Modal {...modalConfig}>
        <Form className="FBV">
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
              </Radio.Group>
            )}
          </FormItem>

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
