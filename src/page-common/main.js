/**
 * @description  公共模块
 */
import {useEffect} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import Approval from './approval'

const prePath = '/common'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.querySiderMenus({
      productCode: 'tag_common',
      projectId,
    })
    ctx.useSider(false)
    ctx.useProject(true)
  }, [])
  return (
    <Switch>
      {/* 审批管理 */}
      <Route exact path={`${prePath}/approval/:type?`} component={Approval} />
      <Redirect strict to={`${prePath}/project/my-requests`} />
    </Switch>
  )
}
