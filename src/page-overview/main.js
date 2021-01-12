import intl from 'react-intl-universal'
/**
 * @description 总览
 */
import { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame'

import Overview from './overview'

const prePath = '/overview'

export default () => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    ctx.useSider(false)
    ctx.useProject(false)
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
    ])
  }, [])
  return (
    <Switch>
      {/* 总览 */}
      <Route exact path={`${prePath}`} component={Overview} />
    </Switch>
  )
}
