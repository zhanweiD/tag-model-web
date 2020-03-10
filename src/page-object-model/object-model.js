/**
 * @description 对象管理
 */
import {Component, Fragment} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {TabRoute, NoData, StatusImg} from '../component'
import {changeToOptions} from '../common/util'
import Tree from './tree'
import ObjectDetail from './detail'

import store from './store'
import './main.styl'

// tab
const tabs = changeToOptions(window.njkData.typeCodes)('objTypeName', 'objTypeCode')

const NotFount = () => <StatusImg status="authError" title="暂无权限" tip="您尚无相关系统权限，请联系管理员授权后即可使用" imgWidth="250" />

const {functionCodes = []} = window.__userConfig

@observer
export default class ObjectModel extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.typeCode = match.params.typeCode || '3'
    store.objId = match.params.objId
  }

  @action changeTab = code => {
    store.typeCode = code
    store.objId = undefined

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
      tabs,
      basePath: '',
      currentTab: typeCode,
      changeTab: this.changeTab,
      _history: history,
      changeUrl: true,
    }

    const noDataConfig = {
      btnText: '添加对象',
      onClick: this.addObject,
      code: 'asset_tag_obj_add_edit_del_publish',
      noAuthText: '暂无对象',
      text: '没有任何对象，请在当前页面添加对象！',
    }

    return (
      <Provider bigStore={store}>
        {
          functionCodes.includes('asset_tag_obj_model') ? (
            <div className="page-object-modal">
              <div className="content-header">对象模型</div>
           
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
