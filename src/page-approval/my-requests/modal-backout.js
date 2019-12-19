/**
 * @description 我的申请-撤销弹窗
 */
import {Component} from 'react'
import {Modal, Form, Input} from 'antd'

const {TextArea} = Input

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}

@Form.create()
export default class ModalBackout extends Component {
  submit = () => {
    const {form: {validateFields}, handleSubmit} = this.props
    validateFields((err, params) => {
      if (err) {
        return
      }
      handleSubmit(params)
    })
  }

  render() {
    const {
      form: {getFieldDecorator}, visible, handleCancel, ...rest
    } = this.props

    const modalConfig = {
      title: '撤销申请',
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
          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator('revokeDescr', {
              rules: [
                {transform: value => value && value.trim()},
                {required: true, whitespace: true, message: '描述不可为空'},
              ],
            })(
              <TextArea placeholder="请输入撤销申请描述" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
