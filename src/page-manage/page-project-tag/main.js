import {useEffect} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import Main from './project-tag'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true)
    ctx.useQuickEntrance([{
      tip: '后台配置',
      icon: 'setting',
      url: '/tag-model/index.html#/config/environment',
    },
    {
      tip: '审批管理',
      icon: 'approver',
      url: '/tag-model/index.html#/common/approval',
    },
    {
      tip: '项目管理',
      url: '/project/index.html',
      icon: 'project',
    }])
    ctx.useSider(true)
  }, [projectId])

  return (
    <Main key={projectId} projectId={projectId} />
  )
}
