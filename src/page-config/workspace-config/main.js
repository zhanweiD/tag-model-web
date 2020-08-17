
/**
 * @description 系统环境配置
 */

import {useEffect, useState} from 'react'
// import {FormOutlined} from '@ant-design/icons'
import {Button, Popconfirm} from 'antd'
import {projectProvider, Authority} from '../../component'
import ConfigModal from './modal'
import io from './io'
import {successTip, errorTip} from '../../common/util'

const WorkspaceConfig = ({projectId}) => {
  const [config, changeConfig] = useState({})
  const [visible, changeVisible] = useState(false)
  const [workspace, changeWorkspace] = useState([])
  const [isAdd, changeIsAdd] = useState(true)
  
  // 获取初始化配置
  async function getWorkspace() {
    try {
      const res = await io.getWorkspace({
        projectId,
      })
      changeConfig(res)
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 获取环境列表
  async function getWorkspaceList() {
    try {
      const res = await io.getWorkspaceList({
        projectId,
      })
      let workspaceList = []
      if (res) {
        workspaceList = res || []
      }
      changeWorkspace(workspaceList)
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 初始化项目
  async function initProject(params) {
    try {
      const res = await io.initProject({
        ...params,
        projectId,
      })
  
      if (res) {
        successTip('初始化成功')
        changeVisible(false)
        getWorkspace()
      }
    } catch (error) {
      errorTip(error.message)
    }
  }

  // 修改初始化配置
  async function updateWprkspace(params) {
    try {
      const res = await io.updateWprkspace({
        ...params,
        id: config.id,
      })
  
      if (res) {
        getWorkspace()
        successTip('修改成功')
        changeVisible(false)
        changeIsAdd(true)
      }
    } catch (error) {
      errorTip(error.message)
    }
  }

  useEffect(() => {
    getWorkspace(projectId)
  }, [projectId])
  
  const editClick = () => {
    changeVisible(true)
    changeIsAdd(false)
    getWorkspaceList()
  }

  const onCancel = () => {
    changeVisible(false)
    changeIsAdd(true)
  }

  const onCreate = params => {
    changeIsAdd(true)
    initProject(params)
  }

  const onUpdate = params => {
    updateWprkspace(params)
  }
  
  return (
    <div>
      <div className="content-header">环境配置</div> 
      <div className="header-page p24 config-work">
        <div className="env-config-item">
          <div className="env-config-label">环境：</div>
          <div className="env-config-value">
            <span className="mr16">{config.workspaceName}</span>
            {/* <FormOutlined className="action" onClick={editClick} /> */}
          </div>
        </div>
        {/* <Authority authCode="tag_config:environment_config[u]"> */}
        {/* <Popconfirm
          title={(
            <div>
更改后原环境中的“标签体系、标签加工方案、标签同步计划、场景、
              <br />
我的查询、群体、API”都将会失效，请谨慎操作。
            </div>
          )}
          onConfirm={editClick}
          onCancel={() => {}}
          okText="确认"
          cancelText="取消"
        >
          <Button type="primary">编辑</Button>
        </Popconfirm> */}
        <Button type="primary" onClick={editClick}>编辑</Button>
        {/* </Authority> */}
      </div>
      <ConfigModal 
        visible={visible}
        isAdd={isAdd}
        config={config}
        workspace={workspace}
        onCancel={onCancel}
        onCreate={onCreate}
        onUpdate={onUpdate}
        projectId={projectId}
      />
    </div>
  )
}

export default projectProvider(WorkspaceConfig)
