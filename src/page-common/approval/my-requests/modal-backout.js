import intl from 'react-intl-universal'
/**
 * @description 我的申请-撤销弹窗
 */
import { Component } from 'react'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, Input } from 'antd'

const { TextArea } = Input

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

@Form.create()
class ModalBackout extends Component {
  submit = () => {
    const {
      form: { validateFields },
      handleSubmit,
    } = this.props
    validateFields((err, params) => {
      if (err) {
        return
      }
      handleSubmit(params)
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      visible,
      handleCancel,
      ...rest
    } = this.props

    const modalConfig = {
      title: intl
        .get('ide.src.page-common.approval.my-requests.main.bdgrq9qdii')
        .d('撤销申请'),
      visible,
      maskClosable: false,
      destroyOnClose: true,
      onOk: this.submit,
      onCancel: handleCancel,
      ...rest,
    }

    return (
      <Modal {...modalConfig}>
        <Form>
          <FormItem
            {...formItemLayout}
            label={intl
              .get('ide.src.component.modal-stroage-detail.main.lyqo7nv5t9h')
              .d('描述')}
          >
            {getFieldDecorator('revokeDescr', {
              rules: [
                { transform: value => value && value.trim() },
                {
                  required: true,
                  whitespace: true,
                  message: intl
                    .get(
                      'ide.src.page-common.approval.my-requests.modal-backout.9tx758kywlc'
                    )
                    .d('描述不可为空'),
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
                    'ide.src.page-common.approval.my-requests.modal-backout.ttfdehmnl3g'
                  )
                  .d('请输入撤销申请描述')}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
export default ModalBackout
