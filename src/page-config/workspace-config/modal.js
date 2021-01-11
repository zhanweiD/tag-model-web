import intl from 'react-intl-universal'
import React from 'react'
import { Modal, Form, Select, Popconfirm, Button } from 'antd'

const { Option } = Select
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
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
      title={
        isAdd
          ? intl
              .get('ide.src.component.project-provider.configModal.v4dizvi1i2')
              .d('初始化')
          : intl
              .get('ide.src.page-config.workspace-config.modal.b41d68h3bhg')
              .d('修改初始化')
      }
      onCancel={() => {
        onCancel()
        form.resetFields()
      }}
      destroyOnClose
      maskClosable={false}
      footer={
        isAdd
          ? [
              <Button
                onClick={() => {
                  onCancel()
                  form.resetFields()
                }}
              >
                {intl
                  .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
                  .d('取消')}
              </Button>,
              <Button
                type="primary"
                onClick={() => {
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
              >
                {intl
                  .get('ide.src.page-config.workspace-config.modal.wrk0nanr55b')
                  .d('确定')}
              </Button>,
            ]
          : [
              <Button
                onClick={() => {
                  onCancel()
                  form.resetFields()
                }}
              >
                {intl
                  .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
                  .d('取消')}
              </Button>,
              <Popconfirm
                title={
                  <div>
                    {intl
                      .get(
                        'ide.src.page-config.workspace-config.modal.rmrts2imzrk'
                      )
                      .d(
                        '更改后原环境中的“标签体系、标签加工方案、标签同步计划、场景、'
                      )}

                    <br />
                    {intl
                      .get(
                        'ide.src.page-config.workspace-config.modal.jaknozm4pj'
                      )
                      .d('我的查询、群体、API”都将会失效，请谨慎操作。')}
                  </div>
                }
                onCancel={() => {}}
                onConfirm={() => {
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
                okText={intl
                  .get('ide.src.page-config.workspace-config.modal.osxrfhrriz')
                  .d('确认')}
                cancelText={intl
                  .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
                  .d('取消')}
              >
                <Button type="primary">
                  {intl
                    .get(
                      'ide.src.page-config.workspace-config.modal.wrk0nanr55b'
                    )
                    .d('确定')}
                </Button>
              </Popconfirm>,
            ]
      }
    >
      <Form form={form} name="form" {...formItemLayout}>
        <Form.Item
          name="workspaceId"
          label={intl
            .get('ide.src.component.project-provider.back-config.q1r9bbokqf9')
            .d('环境')}
          initialValue={config.workspaceId || undefined}
          rules={[
            {
              required: true,
              message: intl
                .get('ide.src.page-config.workspace-config.modal.rljhiqji2qs')
                .d('请选择环境'),
            },
          ]}
          extra={
            <span>
              {intl
                .get(
                  'ide.src.component.project-provider.configModal.nsvcxaje1d'
                )
                .d('若无可用的环境，请到')}

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
                  'ide.src.component.project-provider.configModal.hwn5ae7rhkm'
                )
                .d('中添加环境')}
            </span>
          }
        >
          <Select
            placeholder={intl
              .get('ide.src.page-config.workspace-config.modal.rljhiqji2qs')
              .d('请选择环境')}
            showSearch
            optionFilterProp="children"
          >
            {workspace.map(d => (
              <Option value={d.workspaceId}>{d.workspaceName}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default ConfigModal
