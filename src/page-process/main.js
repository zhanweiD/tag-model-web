/**
 * @description  标签加工
 */
import {useEffect} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import SchemaList from './schema-list'
import SchemaDetail from './schema-detail'
import TqlExplain from './tql-explain'

const prePath = '/process'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()
  useEffect(() => {
    if (projectId) {
      ctx.querySiderMenus({
        productCode: 'tag_derivative',
        projectId,
      })
      ctx.useSider(true)
    }
  }, [projectId])
  return (
    <Switch>
      <Route exact path={`${prePath}/tql`} component={SchemaList} />
      <Route exact path={`${prePath}/tql/:id/:projectId?`} component={SchemaDetail} />
      <Route exact path={`${prePath}/tql-explain`} component={TqlExplain} />
      <Redirect strict to={`${prePath}/tql`} />
    </Switch>
  )
}
