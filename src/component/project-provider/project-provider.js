

/**
 * @description 项目组件
 */

import {useEffect, useState, Fragment} from 'react'
import OnerFrame from '@dtwave/oner-frame'
import NoData from '../no-data'
import io from './io'
import {
  changeToOptions,
} from '../../common/util'
import ConfigModal from './configModal'
// import Loading from '../loading'

export default PageComponent => {
  function ProjectProvider(props) {
    const ctx = OnerFrame.useFrame()
    const projectId = ctx.useProjectId()
    const [hasInit, changeHasInit] = useState(false)
    const [visible, changeVisible] = useState(false)
    const [workspace, changeWorkspace] = useState([])

    const noProjectDataConfig = {
      text: '没有任何项目，去创建项目吧！',
    }

    async function judgeInit(id) {
      const res = await io.judgeInit({
        projectId: id,
      })
      changeHasInit(res)
    }

    // async function getWorkspace(id) {
    //   const res = await io.getWorkspace({
    //     projectId: id,
    //   })
    //   changeWorkspace(res)
    // }

    async function getWorkspaceList(id) {
      const res = await io.getWorkspaceList({
        projectId: id,
      })
      let workspaceList
      if (res) {
        workspaceList = changeToOptions(res || [])('workspaceName', 'workspaceId')
      }
      changeWorkspace(workspaceList)
    }


    async function initProject(params) {
      const res = await io.initProject(params)

      if (res) {
        changeVisible(false)
        changeHasInit(true)
      }
    }

    useEffect(() => {
      judgeInit(projectId)
    }, [projectId])
    

    const noDataConfig = {
      btnText: '去初始化',
      onClick: () => {
        getWorkspaceList(projectId)
        changeVisible(true)
      },
      text: '初始化',
    }

    if (!projectId) {
      return (
        <NoData
          {...noProjectDataConfig}
        />
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
