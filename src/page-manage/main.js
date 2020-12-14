/**
 * @description  标签管理
 */
import {useEffect} from 'react'
import {Route, Switch} from 'react-router-dom'
import OnerFrame from '@dtwave/oner-frame' 

import SyncResult from './page-sync-result'
import {SourceList, SourceDetail} from './page-aim-source'
import {SyncList, SyncDetail} from './page-tag-sync'
import {ProjectTag, ProjectTagDetail} from './page-project-tag'
import {CommonTag, CommonTagDetail} from './page-common-tag'
import {TagModel, TagModelDetail} from './page-object-config/tag-model'
import {ObjectList, ObjectDetail} from './page-object-list'
import ObjectModel from './page-object-model'
import ObjectConfig from './page-object-config'

const prePath = '/manage'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    if (projectId) {
      ctx.querySiderMenus({
        productCode: 'tag_model',
        projectId,
      })
    } else {
      ctx.querySiderMenus({
        productCode: 'tag_model',
      })
    }
    // ctx.useProject(true)
    ctx.useSider(true)
  }, [projectId])
  return (
    <Switch>
      {/* ************* 标签仓库 ************* */}
      {/* 项目标签 */}
      <Route exact path={`${prePath}/project-tag`} component={ProjectTag} />
      <Route exact path={`${prePath}/project-tag/:id?/:projectId?`} component={ProjectTagDetail} />

      {/* 公共标签 */}
      <Route exact path={`${prePath}/common-tag`} component={CommonTag} />
      <Route exact path={`${prePath}/common-tag/:id?/:projectId?`} component={CommonTagDetail} />
    
      {/* ************* 标签同步 ************* */}
    
      {/* 同步计划 */}
      <Route exact strict path={`${prePath}/tag-sync`} component={SyncList} />
      <Route exact strict path={`${prePath}/tag-sync/:id/:projectId?`} component={SyncDetail} />

      {/* 目的源管理 */}
      <Route exact strict path={`${prePath}/aim-source`} component={SourceList} />
      <Route exact strict path={`${prePath}/aim-source/:id/:projectId?`} component={SourceDetail} />
      
      {/* 同步结果 */}
      <Route exact strict path={`${prePath}/sync-result`} component={SyncResult} />

      {/* ************* 标签模型 ************* */}
      
      {/* 标签维护 */}
      <Route exact strict path={`${prePath}/tag-maintain`} component={TagModel} />
      <Route exact strict path={`${prePath}/tag-maintain/:tagId/:projectId?`} component={TagModelDetail} />

      {/* ************* 对象管理 ************* */}

      {/* 对象列表 */}
      <Route exact strict path={`${prePath}/object-list`} component={ObjectList} />
      <Route exact strict path={`${prePath}/object-list/:typeCode/:objId`} component={ObjectDetail} />

      {/* 对象模型 */}
      <Route exact strict path={`${prePath}/object-model/:typeCode?/:objId?/:tabId?`} component={ObjectModel} />

      {/* 对象配置 */}
      <Route exact path={`${prePath}/object-config/:typeCode?/:objId?/:tabId?`} component={ObjectConfig} />
    </Switch>
  )
}
