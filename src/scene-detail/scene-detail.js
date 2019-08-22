import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {
  Tabs, Button, Icon, Spin, Tooltip, Tag,
} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'

import {Time} from '../common/util'
import {navListMap} from '../common/constants'
import ModalEditScene from '../scene/modal-add'
import SelectTag from './select-tag'
import DataSource from './data-source'
import ModalDataSource from './modal-data-source'
import store from './store-scene-detail'

const {functionCodes} = window.__userConfig
const {TabPane} = Tabs

@inject('frameChange')
@observer
export default class SceneDetail extends Component {
  constructor(props) {
    super(props)
    
    const {
      match: {
        params,
      },
    } = props

    store.sceneId = params.id
  }
  
  componentWillMount() {
    const {frameChange} = this.props

    frameChange('nav', [
      navListMap.tagMgt,
      {url: '/scene#/', text: '标签场景'},
      {text: '场景详情'},
    ])
    store.getDetail()
    store.getSourceList()
  }

  @action.bound dbSourceVisible() {
    store.getDBSource()
  }

  @action.bound sceneDetailVisible() {
    store.isEdit = true
    store.modalVisible = true
  }

  @action.bound onTabChange(e) {
    store.currentKey = e
  }

  componentWillUnmount() {
    store.isDbSourcEnough = false
  }

  render() {
    const info = toJS(store.info)
    const {
      tagCount,
      cUser,
      cDate,
      invokeList = [],
      descr,
      used,
    } = info

    // 详情信息
    const baseInfo = [{
      title: '创建者',
      value: cUser,
    }, {
      title: '创建时间',
      value: <Time timestamp={cDate} />,
    }, {
      title: '调用的API名称',
      value: invokeList.join('、'),
    }, {
      title: '标签数',
      value: tagCount,
    },
    // , {
    //   title: '描述',
    //   value: descr,
    // }
    ]

    return (
      <div className="scene-detail">
        <Spin spinning={store.loading}>
          <div className="info">
            <div className="FBH FBJ">
              <p className="name">
                <span>{info.name}</span> 
                {
                  !used && <Icon className="ml8" type="edit" onClick={this.sceneDetailVisible} style={{color: 'rgba(0,0,0, .65)'}} />
                }
                
                <Tag className="ml10" color={used ? 'blue' : ''}>{used ? '使用中' : '未使用'}</Tag>
              </p>
              <div>
                <Button className="mr8" href={`${window.__onerConfig.pathPrefix}/scene#/tags/${store.sceneId}`}>标签列表</Button>
                {(() => {
                  if (functionCodes.includes('asset_tag_occation_add_aim_datasoure')) {
                    if (store.isDbSourcEnough) {
                      return (
                        <Tooltip title="添加的目的数据源数量超过上限">
                          <Button
                            type="primary"
                            onClick={this.dbSourceVisible}
                            disabled={store.isDbSourcEnough}
                          >
                            添加目的数据源
                          </Button>
                        </Tooltip>
                      )
                    }
                    return (
                      <Button 
                        type="primary" 
                        onClick={this.dbSourceVisible} 
                        disabled={store.isDbSourcEnough || used}
                      >
                        添加目的数据源
                      </Button>
                    )
                  }
                  return null
                })()}
              </div>
            </div>
            <div className="descr-box">
              {descr}
            </div>
            <NemoBaseInfo dataSource={baseInfo} key={Math.random()} className="ml4" />
          </div>
        </Spin>
       
        <Tabs defaultActiveKey="1" animated={false} onChange={this.onTabChange}>
          <TabPane tab="标签选择" key="1">    
            <SelectTag sceneId={store.sceneId} />
          </TabPane>
          <TabPane tab="目的数据源列表" key="2">
            <DataSource store={store} onClick={this.dbSourceVisible} />
          </TabPane>
        </Tabs>
        <ModalEditScene store={store} />
        <ModalDataSource store={store} />
      </div>
    )
  }
}
