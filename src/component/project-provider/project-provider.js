

/**
 * @description 项目组件
 */

import {useEffect, useState, Fragment} from 'react'
import OnerFrame from '@dtwave/oner-frame'
import {message} from 'antd'
import NoData from '../no-data'
import io from './io'
import {
  changeToOptions,
} from '../../common/util'
import ConfigModal from './configModal'
import Loading from '../loading'

export default PageComponent => {
  function ProjectProvider(props) {
    const ctx = OnerFrame.useFrame()
    const projectId = ctx.useProjectId()
    const [hasInit, changeHasInit] = useState(true)
    const [loading, changeLoading] = useState(true)
    const [visible, changeVisible] = useState(false)
    const [workspace, changeWorkspace] = useState([])

    const noProjectDataConfig = {
      text: '没有任何项目，去创建项目吧！',
    }

    // 判断项目是否初始化
    async function judgeInit(id) {
      const res = await io.judgeInit({
        projectId: id,
      })
      changeLoading(false)
      changeHasInit(res)
    }

    // 获取环境列表
    async function getWorkspaceList(id) {
      const res = await io.getWorkspaceList({
        projectId: id,
      })
      let workspaceList = []
      if (res) {
        workspaceList = changeToOptions(res || [])('workspaceName', 'workspaceId')
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
        changeHasInit(true)
        message.success('初始化环境成功')
      } else {
        message.error('初始化环境失败')
      }
    }

    useEffect(() => {
      ctx.useProject(true)
      ctx.useQuickEntrance([
        {
          tip: '审批管理',
          icon: 'approver',
          url: '/tag-model/index.html#/common/approval',
        },
        {
          tip: '后台配置',
          icon: 'setting',
          url: '/tag-model/index.html#/config/environment',
        },
        {
          tip: '项目管理',
          url: '/project/index.html',
          icon: 'project',
        }])
      judgeInit(projectId)
    }, [projectId])
    

    const noDataConfig = {
      btnText: '去初始化',
      onClick: () => {
        getWorkspaceList(projectId)
        changeVisible(true)
      },
      // text: '初始化',
    }

    if (!projectId) {
      return (
        <NoData
          {...noProjectDataConfig}
        />
      )
    }

    if (loading) {
      return (
        <Loading mode="block" height={300} /> 
      )
    }

    if (!hasInit) {
      return (
        <Fragment>
          <NoData
            {...noDataConfig}
          />
          <ConfigModal 
            visible={visible}
            workspace={workspace}
            handleCancel={() => changeVisible(false)}
            submit={params => initProject(params)}
          />
        </Fragment>
       
      )
    }

    return (
      <div style={{height: '100%'}}>
        <PageComponent key={projectId} projectId={projectId} {...props} />
      </div>
    )
  }
  return ProjectProvider
}
