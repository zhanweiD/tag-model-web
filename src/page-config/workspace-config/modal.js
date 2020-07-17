import React from 'react'
import {Modal, Form, Select} from 'antd'

const {Option} = Select
const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}

const ConfigModal = ({
  visible, 
  onCreate, 
  onCancel,
  workspace,
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      title="初始化"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            onCreate(values)
          })
          .catch(info => {
            console.log('Validate Failed:', info)
          })
      }}
      destroyOnClose
      maskClosable={false}
    >
      <Form
        form={form}
        name="form"

        {...formItemLayout}
      >
        <Form.Item
          name="workspaceId"
          label="环境"
          rules={[
            {
              required: true,
              message: '请选择环境',
            },
          ]}
        >
          <Select placeholder="请选择环境" showSearch optionFilterProp="children"> 
            {
              workspace.map(d => <Option value={d.workspaceId}>{d.workspaceName}</Option>)
            }
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ConfigModal
