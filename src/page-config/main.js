/**
 * @description  后台配置
 */
import {useEffect} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import WorkspaceConfig from './workspace-config'

const prePath = '/config'

export default () => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    ctx.querySiderMenus({
      productCode: 'tag_config',
    })
  }, [])
  return (
    <Switch>
      <Route exact path={`${prePath}/environment`} component={WorkspaceConfig} />
      <Redirect strict to={`${prePath}/environment`} />
    </Switch>
  )
}
