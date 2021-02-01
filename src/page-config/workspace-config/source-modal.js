import intl from 'react-intl-universal'
import React from 'react'
import { toJS } from 'mobx'
import { Modal, Form, Select, Popconfirm, Button } from 'antd'
import _ from 'lodash'

const { Option } = Select
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
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
      callback(
        intl
          .get('ide.src.page-config.workspace-config.source-modal.tqu6sqn0s9j')
          .d('数据源已存在')
      )
    }

    callback()
  }

  return (
    <Modal
      visible={visible}
      title={intl
        .get('ide.src.page-config.workspace-config.main.bfslcmhzzgi')
        .d('添加目的源')}
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      onOk={() =>
        form.validateFields().then(values => {
          onOk(values)
          form.resetFields()
        })
      }
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} name="form" {...formItemLayout}>
        <Form.Item
          name="storageType"
          label={intl
            .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
            .d('数据源类型')}
          rules={[
            {
              required: true,
              message: intl
                .get(
                  'ide.src.page-config.workspace-config.source-modal.sexnlhau4v'
                )
                .d('请选择数据源类型'),
            },
          ]}
        >
          <Select
            placeholder={intl
              .get(
                'ide.src.page-config.workspace-config.source-modal.sexnlhau4v'
              )
              .d('请选择数据源类型')}
            onChange={onChange}
            showSearch
            optionFilterProp="children"
          >
            {dataType.map(d => (
              <Option value={d.type}>{d.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="storageId"
          label={intl
            .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
            .d('数据源')}
          rules={[
            {
              required: true,
              message: intl
                .get(
                  'ide.src.page-config.workspace-config.source-modal.0oev0nqwsxun'
                )
                .d('请选择数据源'),
            },
            {
              validator: (rule, value, callback) =>
                validateStorage(rule, value, callback),
            },
          ]}
          extra={
            <span>
              {intl
                .get(
                  'ide.src.page-config.workspace-config.source-modal.xf669s6ye29'
                )
                .d('若无可用的数据源，请到')}

              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`/project/index.html?projectId=${projectId}#/detail/env`}
              >
                {intl
                  .get(
                    'ide.src.component.project-provider.configModal.6a8kalkyc5k'
                  )
                  .d('项目管理-环境配置')}
              </a>
              {intl
                .get(
                  'ide.src.page-config.workspace-config.source-modal.ch9vabxr7gd'
                )
                .d('中添加数据源')}
            </span>
          }
        >
          <Select
            placeholder={intl
              .get(
                'ide.src.page-config.workspace-config.source-modal.0oev0nqwsxun'
              )
              .d('请选择数据源')}
            showSearch
            optionFilterProp="children"
          >
            {dataSource.map(d => (
              <Option value={d.dataStorageId}>{d.storageName}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ConfigModal
