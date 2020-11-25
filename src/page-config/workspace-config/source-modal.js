import React from 'react'
import {Modal, Form, Select, Popconfirm, Button} from 'antd'
import _ from 'lodash'

const {Option} = Select
const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}


const ConfigModal = ({
  visible,
  onCancel,
  selectDataType,
  dataType,
  projectId,
  dataSource,
  tableDatas,
  onOk,
}) => {
  const [form] = Form.useForm()

  const onChange = e => {
    form.resetFields(['storageId'])
    selectDataType(e)
  }

  const validateStorage = (rule, value, callback) => {
    if (_.some(tableDatas, item => item.storageId === value)) {
      callback('数据源已存在')
    }

    callback()
  }

  return (
    <Modal
      visible={visible}
      title="添加目的源"
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      onOk={() => form.validateFields().then(values => onOk(values))}
      destroyOnClose
      maskClosable={false}
    >
      <Form
        form={form}
        name="form"

        {...formItemLayout}
      >
        <Form.Item
          name="storageType"
          label="数据源类型"
          rules={[
            {
              required: true,
              message: '请选择数据源类型',
            },
          ]}
        >
          <Select placeholder="请选择数据源类型" onChange={onChange} showSearch optionFilterProp="children">
            {
              dataType.map(d => <Option value={d.type}>{d.name}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="storageId"
          label="数据源"
          rules={[
            {
              required: true,
              message: '请选择数据源',
            }, {
              validator: (rule, value, callback) => validateStorage(rule, value, callback),
            },
          ]}
          extra={(
            <span>
              若无可用的数据源，请到
              <a target="_blank" rel="noopener noreferrer" href={`/project/index.html?projectId=${projectId}#/detail/env`}>项目管理-环境配置</a>
              中添加数据源
            </span>
          )}
        >
          <Select placeholder="请选择数据源" showSearch optionFilterProp="children">
            {
              dataSource.map(d => <Option value={d.storageId}>{d.storageName}</Option>)
            }
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  )
}
export default ConfigModal
