import intl from 'react-intl-universal'

/**
 * @description 项目组件
 */

import { useEffect, useState, Fragment } from 'react'
import OnerFrame from '@dtwave/oner-frame'
import { message } from 'antd'
import NoData from '../no-data'
import io from './io'
import { changeToOptions } from '../../common/util'
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
      text: (
        <span>
          {intl
            .get(
              'ide.src.component.project-provider.project-provider.x4k5gevdb1p'
            )
            .d('无可用项目 去')}

          {/* <a target="_blank" className="a-href-color" rel="noopener noreferrer" href="/project/index.html#/project">项目管理</a> */}
          <a
            target="_blank"
            className="a-href-color"
            onClick={() =>
              window.open('/project/index.html#/project', '_blank')
            }
          >
            {intl
              .get(
                'ide.src.component.project-provider.project-provider.454zmtzq66v'
              )
              .d('项目管理')}
          </a>
          {intl
            .get(
              'ide.src.component.project-provider.project-provider.vin2r66ukrj'
            )
            .d('添加')}
        </span>
      ),
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
        workspaceList = changeToOptions(res || [])(
          'workspaceName',
          'workspaceId'
        )
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
        message.success(
          intl
            .get(
              'ide.src.component.project-provider.project-provider.ms82mawvu1'
            )
            .d('环境初始化成功')
        )
      } else {
        message.error(
          intl
            .get(
              'ide.src.component.project-provider.project-provider.3m40uy2rt3i'
            )
            .d('环境初始化失败')
        )
      }
    }

    useEffect(() => {
      ctx.useProject(true)

      if (projectId) {
        ctx.useQuickEntrance([
          {
            tip: intl.get('ide.src.common.navList.0ujwqvq35vi').d('审批管理'),
            icon: 'approver',
            url: '/tag-model/index.html#/common/approval',
          },

          {
            tip: intl
              .get(
                'ide.src.component.project-provider.project-provider.odc0bazjvxn'
              )
              .d('后台配置'),
            icon: 'setting',
            url: '/tag-model/index.html#/config/environment',
          },

          {
            tip: intl
              .get(
                'ide.src.component.project-provider.project-provider.454zmtzq66v'
              )
              .d('项目管理'),
            url: '/project/index.html#/project',
            icon: 'project',
          },
        ])

        judgeInit(projectId)
      }
    }, [projectId])

    const noDataConfig = {
      text: (
        <span>
          {intl
            .get(
              'ide.src.component.project-provider.project-provider.nii0v2q34xd'
            )
            .d('该项目下，标签中心的环境未初始化，请到')}

          <a target="_blank" href="/tag-model/index.html#/config/environment">
            {intl
              .get(
                'ide.src.component.project-provider.project-provider.2dzlqg94wee'
              )
              .d('后台配置-环境配置')}
          </a>
          {intl
            .get(
              'ide.src.component.project-provider.project-provider.tlo1so40hvf'
            )
            .d('中初始化标签中心的环境')}
        </span>
      ),
    }

    const noDataConfigC = {
      btnText: intl
        .get('ide.src.component.project-provider.project-provider.rzi2aqj07li')
        .d('初始化环境'),
      onClick: () => {
        getWorkspaceList(projectId)
        changeVisible(true)
      },
      text: intl
        .get('ide.src.component.project-provider.project-provider.zr9k0lkt2xj')
        .d('该项目下，标签中心的环境未初始化'),
      code: 'tag_config:environment_config[u]',
      noAuthText: intl
        .get('ide.src.component.project-provider.project-provider.zr9k0lkt2xj')
        .d('该项目下，标签中心的环境未初始化'),
    }

    const noDataConfig1 = {
      text: intl
        .get('ide.src.component.project-provider.project-provider.prabfw2c2x')
        .d('标签中心仅适配Hadoop集群'),
      noAuthText: intl
        .get('ide.src.component.project-provider.project-provider.prabfw2c2x')
        .d('标签中心仅适配Hadoop集群'),
    }

    if (!projectId) {
      return <NoData {...noProjectDataConfig} />
    }

    if (loading) {
      return <Loading mode="block" height={300} />
    }

    if (hasInit === 1) {
      return (
        <div className="h-100">
          <div className="content-header">
            {intl
              .get('ide.src.component.project-provider.back-config.jxcvund1fi')
              .d('环境配置')}
          </div>
          <div
            className="header-page"
            style={{ minHeight: 'calc(100vh - 137px)', paddingTop: '15%' }}
          >
            {props.match && props.match.path === '/config/environment' ? (
              <NoData {...noDataConfigC} />
            ) : (
              <NoData {...noDataConfig} />
            )}

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
          <div className="content-header">
            {intl
              .get('ide.src.component.project-provider.back-config.jxcvund1fi')
              .d('环境配置')}
          </div>
          <div
            className="header-page"
            style={{ minHeight: 'calc(100vh - 137px)', paddingTop: '15%' }}
          >
            <NoData {...noDataConfig1} />
          </div>
        </div>
      )
    }
    return (
      <div style={{ height: '100%' }}>
        <PageComponent key={projectId} projectId={projectId} {...props} />
      </div>
    )
  }
  return ProjectProvider
}
