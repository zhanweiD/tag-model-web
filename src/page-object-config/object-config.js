/**
 * @description 项目空间 - 对象配置
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {TabRoute, Loading, NoData} from '../component'
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
export default class ObjectConfig extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    const {spaceInfo} = window

    store.projectId = spaceInfo && spaceInfo.projectId
    store.typeCode = match.params.typeCode || '4'
    store.objId = match.params.objId
    store.tabId = match.params.tabId || '0' // 当前详情tabID；默认数据视图
  }

  @action changeTab = code => {
    store.typeCode = code
    store.objId = undefined
    store.getObjTree(() => {
      store.objId = store.currentSelectKeys
      if (store.currentSelectKeys) {
        store.getObjDetail()
      }
    })
  }

  // 跳转到项目列表
  goProjectList = () => {
    window.location.href = `${window.__onerConfig.pathPrefix || '/'}/project`
  }

  render() {
    const {history} = this.props
    const {typeCode, objId} = store

    const tabConfig = {
      tabs,
      basePath: '',
      currentTab: typeCode,
      changeTab: this.changeTab,
      _history: history,
      changeUrl: true,
    }
    const {spaceInfo} = window

    const noProjectDataConfig = {
      btnText: '去创建项目',
      onClick: this.goProjectList,
      text: '没有任何项目，去项目列表页创建项目吧！',
    }

    // warning here
    const noObjDataConfig = {
      btnText: '选择对象',
      onClick: this.goProjectList,
      text: '没有任何对象，请在当前页面选择对象！',
    }

    return (
      <div>
        {
          spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length 
            ? (
              <Provider bigStore={store}>
                <div className="page-object">
                  <div className="content-header">{navListMap.objectConfig.text}</div>
                  <TabRoute {...tabConfig} />
                  <div className="object-content">
                    <Tree history={history} />
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
            ) : null
        }

        {
          spaceInfo.finish   
            ? (
              <NoData
                {...noProjectDataConfig}
              />
            ) : <Loading mode="block" height={200} />
        }
      </div>
    )
  }
}
