import intl from 'react-intl-universal'
/**
 * @description  对象配置（标签模型）
 */
import { Component } from 'react'
import { action } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { TabRoute, projectProvider, NoData } from '../../component'
import { changeToOptions } from '../../common/util'
import Tree from './tree'
import ObjectDetail from './object-detail'

import store from './store'
import './main.styl'

@observer
class ObjectConfig extends Component {
  constructor(props) {
    super(props)
    const { match } = props

    store.projectId = props.projectId

    store.typeCode = match.params.typeCode || '4'
    store.objId = match.params.objId
    store.tabId = match.params.tabId || 'view' // 当前详情tabID；默认数据视图
  }

  // componentWillMount() {
  //   if (store.projectId) {
  //     // 权限code
  //     store.getAuthCode()
  //   }
  // }

  @action changeTab = code => {
    store.typeCode = code
    store.objId = undefined
    store.tabId = 'view'
    store.searchKey = undefined
    store.getObjTree(() => {
      store.objId = store.currentSelectKeys
    })
  }

  @action selectObject = () => {
    store.selectObjUpdateKey = Math.random()
  }

  render() {
    const { history } = this.props
    const { typeCode, objId, treeLoading, selectObjUpdateKey } = store

    const tabConfig = {
      tabs: changeToOptions(window.njkData.dict.typeCodes)('value', 'key'),
      basePath: '/manage/tag-model',
      currentTab: typeCode,
      changeTab: this.changeTab,
      _history: history,
      changeUrl: true,
    }

    // warning here
    const noObjDataConfig = {
      btnText: intl.get('ide.src.common.navList.1u4wc7wzm02').d('对象配置'),
      onClick: this.selectObject,
      text: intl
        .get('ide.src.page-manage.page-tag-model.main.rqocnq83yup')
        .d('项目下未配置对象，请在当前页面配置对象！'),
      isLoading: treeLoading,
      code: 'tag_model:select_obj[cud]',
      noAuthText: intl
        .get('ide.src.page-manage.page-tag-model.main.g8k2rewcjve')
        .d('没有任何对象'),
      // myFunctionCodes: store.functionCodes,
    }

    return (
      <Provider bigStore={store}>
        <div className="page-object">
          <div className="content-header-noBorder">
            {intl.get('ide.src.common.navList.bmnnu96l68r').d('标签模型')}
          </div>
          <TabRoute {...tabConfig} />
          <div className="object-content">
            <Tree history={history} selectObjUpdateKey={selectObjUpdateKey} />
            {objId ? (
              <ObjectDetail objId={objId} history={history} />
            ) : (
              <div className="bgf m16" style={{ width: '100%' }}>
                <NoData {...noObjDataConfig} />
              </div>
            )}
          </div>
        </div>
      </Provider>
    )
  }
}

export default projectProvider(ObjectConfig)
