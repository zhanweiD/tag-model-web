/**
 * @description 对象管理
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {TabRoute, NoData} from '../component'
import {changeToOptions} from '../common/util'
import Tree from './tree'
import ObjectDetail from './object-detail'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper

// tab
const tabs = changeToOptions(window.njkData.typeCodes)('objTypeName', 'objTypeCode')

@observer
export default class ObjectManage extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.typeCode = match.params.typeCode || '4'
    store.objId = match.params.objId
  }

  @action changeTab = code => {
    store.typeCode = code
    store.objId = undefined

    // 更新类目树
    store.updateTreeKey = Math.random()
  }

  render() {
    const {history} = this.props
    const {
      typeCode, objId, updateTreeKey, updateDetailKey,
    } = store

    const tabConfig = {
      tabs,
      basePath: '',
      currentTab: typeCode,
      changeTab: this.changeTab,
      _history: history,
      changeUrl: true,
    }

    const noDataConfig = {
      btnText: '添加对象',
      // onClick: () => this.handleModalVisible(),
      code: 'asset_tag_obj_add_edit_del_publish',
      noAuthText: '暂无数据',
      text: '没有任何对象，请在当前页面添加对象！',
    }

    return (
      <Provider bigStore={store}>
        <div className="page-object">
          <div className="content-header">{navListMap.object.text}</div>
          <TabRoute {...tabConfig} />
          <div className="object-content">
            <Tree updateTreeKey={updateTreeKey} history={history} />
            {
              objId ? <ObjectDetail updateDetailKey={updateDetailKey} objId={objId} /> : (
                <NoData
                  // isLoading={loading}
                  {...noDataConfig}
                />
              )
            }
          </div>
        </div>
      </Provider>
    )
  }
}
