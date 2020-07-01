import {useState, useEffect} from 'react'
import {Spin} from 'antd'

import io from './io'
import {ModalForm, projectProvider} from '../../component'

function WorkspaceConfig(props) {
  const [workspace, setWorkspace] = useState({})
  const [loading, setLoading] = useState(true)

  const formItemLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 18},
    colon: false,
  }

  const selectContent = [{
    label: '环境',
    key: 'type',
    initialValue: workspace.workspaceName,
    disabled: true,
    component: 'select',
  }]
  
  const formConfig = {
    labelAlign: 'left',
    selectContent,
    formItemLayout,
  }

  async function getWorkspace(projectId) {
    const res = await io.getWorkspace({
      projectId,
    })
    setWorkspace(res)
    setLoading(false)
  }

  // 不传入[]会造成无限死循环，每次请求数据之后都会设置本地的状态，所以组件会循环更新
  useEffect(() => {
    getWorkspace(props.projectId)
  }, [])

  return (
    <Spin spinning={loading}>
      <div className="back-config">
        <div className="cloud-config">
          <p className="config-title">环境配置</p>
          <ModalForm {...formConfig} />
        </div>
      </div>
    </Spin>
  )
}
export default projectProvider(WorkspaceConfig)
