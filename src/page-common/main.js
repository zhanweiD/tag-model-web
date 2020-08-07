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
  useEffect(() => {
    ctx.querySiderMenus({
      productCode: 'tag_common',
    })
    ctx.useSider(true)
  }, [])
  return (
    <Switch>
      {/* 审批管理 */}
      <Route exact path={`${prePath}/approval/:type?`} component={Approval} />
      <Redirect strict to={`${prePath}/project`} />
    </Switch>
  )
}
