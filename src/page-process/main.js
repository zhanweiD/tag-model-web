/**
 * @description  标签加工
 */
import {useEffect} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import SchemaList from './schema-list'
import SchemaDetail from './schema-detail'

const prePath = '/process'

export default () => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    ctx.querySiderMenus({
      productCode: 'tag_derivative',
    })
  }, [])
  return (
    <Switch>
      <Route exact path={`${prePath}/tql`} component={SchemaList} />
      <Route exact path={`${prePath}/tql/:id`} component={SchemaDetail} />
      <Redirect strict to={`${prePath}/tql`} />
    </Switch>
  )
}
