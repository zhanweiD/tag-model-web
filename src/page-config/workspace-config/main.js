
/**
 * @description 系统环境配置
 */

import {useEffect, useState} from 'react'
// import {FormOutlined} from '@ant-design/icons'
import {projectProvider} from '../../component'
import ConfigModal from './modal'
import io from './io'

const WorkspaceConfig = ({projectId}) => {
  const [config, changeConfig] = useState({})
  const [visible, changeVisible] = useState(false)
  const [workspace, changeWorkspace] = useState([])
  
  async function getWorkspace() {
    const res = await io.getWorkspace({
      projectId,
    })

    changeConfig(res)
  }

  // 获取环境列表
  async function getWorkspaceList() {
    const res = await io.getWorkspaceList({
      projectId,
    })
    let workspaceList = []
    if (res) {
      workspaceList = res || []
    }
    changeWorkspace(workspaceList)
  }

  // 初始化项目
  async function initProject(params) {
    const res = await io.initProject({
      ...params,
      projectId,
    })

    if (res) {
      changeVisible(false)
      getWorkspace()
    }
  }


  useEffect(() => {
    getWorkspace(projectId)
  }, [projectId])
  
  const editClick = () => {
    changeVisible(true)
    getWorkspaceList()
  }

  const onCancel = () => {
    changeVisible(false)
  }

  const onCreate = params => {
    initProject(params)
  }
  
  return (
    <div>
      <div className="content-header">环境配置</div> 
      <div className="header-page p24">
        <div className="env-config-item">
          <div className="env-config-label">环境：</div>
          <div className="env-config-value">
            <span className="mr16">{config.workspaceName}</span>
            {/* <FormOutlined className="action" onClick={editClick} /> */}
          </div>
        </div>
      </div>
      <ConfigModal 
        visible={visible}
        workspace={workspace}
        onCancel={onCancel}
        onCreate={onCreate}
      />
    </div>
  )
}

export default projectProvider(WorkspaceConfig)
