/**
 * @description 对象管理
 */
import {Component, useEffect} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import OnerFrame from '@dtwave/oner-frame' 
import {TabRoute, NoData, StatusImg} from '../../component'
import {changeToOptions, codeInProduct} from '../../common/util'
import Tree from './tree'
import ObjectDetail from './detail'

import store from './store'

const NotFount = () => <StatusImg status="authError" title="暂无权限" tip="您尚无相关系统权限，请联系管理员授权后即可使用" imgWidth="250" />

@observer
class ObjectModel extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    
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
    const {history} = this.props
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
      btnText: '新建对象',
      onClick: this.addObject,
      code: 'asset_tag_obj_add_edit_del_publish',
      noAuthText: '暂无对象',
      text: '没有任何对象，请在当前页面新建对象！',
    }

    return (
      <Provider bigStore={store}>
        {
          codeInProduct('asset_tag_obj_model') ? (
            <div className="page-object-modal">
              <div className="content-header-noBorder">对象模型</div>
           
              <TabRoute {...tabConfig} />
              <div className="object-modal-content">
                <Tree 
                  history={history}
                  updateTreeKey={updateTreeKey} 
                  addObjectUpdateKey={addObjectUpdateKey}
                />
                {
                  objId ? (
                    <ObjectDetail 
                      updateDetailKey={updateDetailKey} 
                      objId={objId} 
                      store={store}
                      history={history}
                    />
                  ) : (
                    <NoData
                      {...noDataConfig}
                    />
                  )
                }
              </div>
           
            </div>
          ) : (
            <div style={{
              background: '#fff',
              height: '100%',
            }}
            >
              <div style={{paddingTop: '200px'}}>
                <NotFount />
              </div>
            </div>
          
          )
        }
       
      </Provider>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    ctx.useProject(false)
    ctx.useQuickEntrance([{
      tip: '后台配置',
      icon: 'setting',
      url: '/tag-model/index.html#/config/environment',
    },
    {
      tip: '审批管理',
      icon: 'approver',
      url: '/tag-model/index.html#/common/approval',
    }])
  }, [])

  return (
    <ObjectModel {...props} />
  )
}
