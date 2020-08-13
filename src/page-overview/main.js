import {useEffect} from 'react'
import {Route, Switch} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import Overview from './overview'

const prePath = '/overview'

export default () => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    ctx.useSider(false)
    ctx.useProject(false)
    ctx.useQuickEntrance([{
      label: '后台配置',
      icon: 'setting',
      url: '/tag-model/index.html#/config/environment',
    },
    {
      label: '审批管理',
      icon: 'approver',
      url: '/tag-model/index.html#/common/approval',
    }])
  }, [])
  return (
    <Switch>
      {/* 总览 */}
      <Route exact path={`${prePath}`} component={Overview} />
    </Switch>
  )
}
