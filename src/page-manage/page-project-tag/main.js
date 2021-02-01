import intl from 'react-intl-universal'
/**
 * @description 项目标签
 */
import { useEffect } from 'react'
import OnerFrame from '@dtwave/oner-frame'

import Main from './project-tag'

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true)
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

    ctx.useSider(true)
  }, [projectId])
  return <Main key={projectId} projectId={projectId} {...props} />
}
