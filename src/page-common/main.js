/**
 * @description  公共模块
 */
import {useEffect} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import ProjectConfig from './project-config'
import ProjectList from './project-list'
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
      {/* 项目配置 */}
      <Route exact path={`${prePath}/project/:projectId`} component={ProjectConfig} />
      {/* 项目管理 */}
      <Route exact path={`${prePath}/project`} component={ProjectList} />

      {/* 审批管理 */}
      <Route exact path={`${prePath}/approval/:type?`} component={Approval} />
      <Redirect strict to={`${prePath}/project`} />
    </Switch>
  )
}
