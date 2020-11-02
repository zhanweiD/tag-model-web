

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
    const [hasInit, changeHasInit] = useState(1)
    const [loading, changeLoading] = useState(true)
    const [visible, changeVisible] = useState(false)
    const [workspace, changeWorkspace] = useState([])

    const noProjectDataConfig = {
      text: <span>
          无可用项目 去
        <a target="_blank" className="a-href-color" rel="noopener noreferrer" href="/project/index.html#/project">项目管理</a>
    添加
            </span>,
    }

    // 判断项目是否初始化
    async function judgeInit(id) {
      const res = await io.judgeInit({
        projectId: id,
      })
      changeLoading(false)
      changeHasInit(res)
      // changeHasInit(0)
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
        changeHasInit(2)
        message.success('环境初始化成功')
      } else {
        message.error('环境初始化失败')
      }
    }

    useEffect(() => {
      ctx.useProject(true)
      
      if (projectId) {
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
            url: '/project/index.html#detail/base',
            icon: 'project',
          }])
        judgeInit(projectId)
      }
    }, [projectId])
    

    const noDataConfig = {
      text: <span>
该项目下，标签中心的环境未初始化，请到
        <a target="_blank" href="/tag-model/index.html#/config/environment">后台配置-环境配置</a>
中初始化标签中心的环境
            </span>,
    }

    const noDataConfigC = {
      btnText: '初始化环境',
      onClick: () => {
        getWorkspaceList(projectId)
        changeVisible(true)
      },
      text: '该项目下，标签中心的环境未初始化',
      code: 'tag_config:environment_config[u]',
      noAuthText: '该项目下，标签中心的环境未初始化',
    }

    const noDataConfig1 = {
      text: '标签中心仅适配Hadoop集群',
      noAuthText: '标签中心仅适配Hadoop集群',
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

    if (hasInit === 1) {
      return (
        <div className="h-100">
          <div className="content-header">环境配置</div>
          <div className="header-page" style={{minHeight: 'calc(100vh - 137px)', paddingTop: '15%'}}>
            {
              props.match && props.match.path === '/config/environment' ? (
                <NoData
                  {...noDataConfigC}
                />
              ) : (
                <NoData
                  {...noDataConfig}
                />
              )
            }
            <ConfigModal 
              visible={visible}
              workspace={workspace}
              handleCancel={() => changeVisible(false)}
              submit={params => initProject(params)}
              projectId={projectId}
            />
          </div>
        </div>
       
      )
    }

    if (hasInit === 0) {
      return (
        <div className="h-100">
          <div className="content-header">环境配置</div>
          <div className="header-page" style={{minHeight: 'calc(100vh - 137px)', paddingTop: '15%'}}>
            <NoData 
              {...noDataConfig1}
            />
          </div>
        </div>
       
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
