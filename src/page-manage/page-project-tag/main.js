/**
 * @description 项目标签
 */
import {useEffect} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import Main from './project-tag'

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

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
        url: '/project/index.html#detail/base',
        icon: 'project',
      }])
    ctx.useSider(true)
  }, [projectId])
  return (
    <Main key={projectId} projectId={projectId} {...props} />
  )
}
