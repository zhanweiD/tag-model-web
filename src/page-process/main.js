/**
 * @description  标签加工
 */
import {useEffect} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import SchemaList from './schema-list'
import SchemaDetail from './schema-detail'
import TqlExplain from './tql-explain'
import TagVisual from './visual'
import VisualDetail from './visual/visual-detail'
import VisualConfig from './visual/visual-config'
import TagList from './visual/tag-list'

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
      <Route exact path={`${prePath}/visual`} component={TagVisual} />
      <Route exact strict path={`${prePath}/visual/detail/:projectId/:id`} component={VisualDetail} />
      <Route exact strict path={`${prePath}/visual/config/:projectId/:id?`} component={VisualConfig} />
      <Route exact strict path={`${prePath}/visual/tags/:id?`} component={TagList} />
      <Redirect strict to={`${prePath}/tql`} />
    </Switch>
  )
}
