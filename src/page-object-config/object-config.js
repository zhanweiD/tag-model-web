/**
 * @description  对象配置
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import * as navListMap from '../common/navList'

import {TabRoute, projectProvider, NoData} from '../component'
import {changeToOptions} from '../common/util'
import Tree from './tree'
import ObjectDetail from './object-detail'

import store from './store'

@observer
class ObjectConfig extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    const {spaceInfo} = window

    store.projectId = spaceInfo && spaceInfo.projectId
    store.typeCode = match.params.typeCode || '4'
    store.objId = match.params.objId
    store.tabId = match.params.tabId || 'view' // 当前详情tabID；默认数据视图
  }

  componentWillMount() {
    if (store.projectId) {
      // 权限code
      store.getAuthCode()
    }
  }

  @action changeTab = code => {
    store.typeCode = code
    store.objId = undefined
    store.tabId = 'view'
    store.getObjTree(() => {
      store.objId = store.currentSelectKeys
    })
  }

  @action selectObject = () => {
    store.selectObjUpdateKey = Math.random()
  }

  render() {
    const {history} = this.props
    const {
      typeCode,
      objId,
      treeLoading,
      selectObjUpdateKey,
    } = store

    const tabConfig = {
      tabs: changeToOptions(window.njkData.dict.typeCodes)('value', 'key'),
      basePath: '/object-config',
      currentTab: typeCode,
      changeTab: this.changeTab,
      _history: history,
      changeUrl: true,
    }

    // warning here
    const noObjDataConfig = {
      btnText: '选择对象',
      onClick: this.selectObject,
      text: '没有任何对象，请在当前页面选择对象！',
      isLoading: treeLoading,
      code: 'asset_tag_project_obj_select',
      noAuthText: '没有任何对象',
      myFunctionCodes: store.functionCodes,
    }

    return (
      <Provider bigStore={store}>
        <div className="page-object">
          <div className="content-header">{navListMap.objectConfig.text}</div>
          <TabRoute {...tabConfig} />
          <div className="object-content">
            <Tree history={history} selectObjUpdateKey={selectObjUpdateKey} />
            {
              objId ? <ObjectDetail objId={objId} history={history} /> : (
                <NoData
                  {...noObjDataConfig}
                />
              )
            }
          </div>
        </div>
      </Provider>
    )
  }
}

export default projectProvider(ObjectConfig)
