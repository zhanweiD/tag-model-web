import intl from 'react-intl-universal'
/**
 * @description 对象管理
 */
import { Component, useEffect } from 'react'
import { action } from 'mobx'
import { observer, Provider } from 'mobx-react'
import OnerFrame from '@dtwave/oner-frame'
import { TabRoute, NoData, StatusImg } from '../../component'
import { changeToOptions, codeInProduct } from '../../common/util'
import Tree from './tree'
import ObjectDetail from './detail'

import store from './store'

@observer
class ObjectModel extends Component {
  constructor(props) {
    super(props)
    const { match } = props

    store.typeCode = match.params.typeCode || '4'
    store.objId = match.params.objId
    store.tabId = match.params.tabId || '0' // 当前详情tabID；默认数据视图
  }

  @action changeTab = code => {
    store.typeCode = code
    store.objId = undefined
    store.tabId = '0'

    // 更新类目树
    store.updateTreeKey = Math.random()
  }

  @action addObject = () => {
    store.addObjectUpdateKey = Math.random()
  }

  render() {
    const { history } = this.props
    const {
      typeCode,
      objId,
      updateTreeKey,
      updateDetailKey,
      addObjectUpdateKey,
    } = store

    const tabConfig = {
      tabs: changeToOptions(window.njkData.dict.typeCodes)('value', 'key'),
      basePath: '/manage/object-model',
      currentTab: typeCode,
      changeTab: this.changeTab,
      _history: history,
      changeUrl: true,
    }

    const noDataConfig = {
      text: intl
        .get('ide.src.page-manage.page-object-model.main.5th4b1lc22f')
        .d('没有任何对象，请在当前页面新建对象！'),
    }

    return (
      <Provider bigStore={store}>
        <div className="page-object-modal">
          <div className="content-header-noBorder">
            {intl.get('ide.src.common.navList.oerfqubqsve').d('对象模型')}
          </div>

          <TabRoute {...tabConfig} />
          <div className="object-modal-content">
            <Tree
              history={history}
              updateTreeKey={updateTreeKey}
              addObjectUpdateKey={addObjectUpdateKey}
            />

            {objId ? (
              <ObjectDetail
                updateDetailKey={updateDetailKey}
                objId={objId}
                // store={store}
                history={history}
              />
            ) : (
              <div className="m16 bgf" style={{ width: '100%' }}>
                <NoData {...noDataConfig} />
              </div>
            )}
          </div>
        </div>
      </Provider>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    // store.getProjects(isProject => {
    //   ctx.useProject(isProject, null, {visible: false})
    // })
    ctx.useProject(ctx.useProjectId(), null, { visible: false })
    ctx.useQuickEntrance([
      {
        tip: intl.get('ide.src.common.navList.0ujwqvq35vi').d('审批管理'),
        icon: 'approver',
        url: '/tag-model/index.html#/common/approval',
      },
      {
        tip: intl
          .get(
            'ide.src.component.project-provider.project-provider.odc0bazjvxn'
          )
          .d('后台配置'),
        icon: 'setting',
        url: '/tag-model/index.html#/config/environment',
      },
    ])
  }, [])

  return <ObjectModel {...props} />
}
