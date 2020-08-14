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
  onUpdate,
  isAdd,
  workspace,
  config,
  projectId,
}) => {
  const [form] = Form.useForm()

  return (
    <Modal
      visible={visible}
      title={isAdd ? '初始化' : '修改初始化'}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields()
            isAdd ? onCreate(values) : onUpdate(values)
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
          initialValue={config.workspaceId || undefined}
          rules={[
            {
              required: true,
              message: '请选择环境',
            },
          ]}
          extra={(
            <span>
              若无可用的环境，请到
              <a target="_blank" rel="noopener noreferrer" href={`/project/index.html?projectId=${projectId}#/detail/env`}>项目管理-环境配置</a>
              中添加环境
            </span>
          )}
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
