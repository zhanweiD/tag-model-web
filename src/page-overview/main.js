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
  }, [])
  return (
    <Switch>
      {/* 总览 */}
      <Route exact path={`${prePath}`} component={Overview} />
    </Switch>
  )
}
