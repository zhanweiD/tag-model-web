import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {
  Tabs, Button, Icon, Spin, Tooltip, Alert,
} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'

import {Time} from '../common/util'
import {navListMap} from '../common/constants'
import ModalEditScene from '../scene/modal-add'
import AuthBox from '../component-auth-box'
import Descr from '../component-detail-descr'
import Tag from '../component-tag'

import SelectTag from './select-tag'
import DataSource from './data-source'
import ModalDataSource from './modal-data-source'

import store from './store-scene-detail'

// const {functionCodes} = window.__userConfig
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
    store.dbSourceVisible = true
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
    store.sourceData.data.clear()
    store.info = {}
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
    }]

    return (
      <div className="scene-detail">
        {
          store.sourceData.data.length ? (
            <Alert
              showIcon
              closable
              type="warning"
              className="fs12"
              message="已添加目的数据源或场景使用中，无法在场景中继续选择或移除对象，添加、编辑或删除类目，选择或移除标签，只能查看类目与标签详情。"
            />
          ) : null
        }
       
        <Spin spinning={store.loading}>
          <div className="info">
            <div className="FBH FBJ FBAC pr8 pl8">
              <div className="name">
                <span>{info.name}</span> 
                {
                  !used && <Icon className="ml8" type="edit" onClick={this.sceneDetailVisible} style={{color: 'rgba(0,0,0, .65)'}} />
                }
                
                {/* <Tag className="ml10" color={used ? 'blue' : ''}>{used ? '使用中' : '未使用'}</Tag> */}
                <Tag className="ml10" text={used ? '使用中' : '未使用'} color={used ? 'blue' : 'gray'} />
              </div>
              <div>
                <Button className="mr8" href={`${window.__onerConfig.pathPrefix}/scene#/tags/${store.sceneId}`}>标签列表</Button>
                <AuthBox code="asset_tag_occation_add_aim_datasoure" isButton={false}>
                  {
                    store.isDbSourcEnough 
                      ? (
                        <Tooltip title="添加的目的数据源数量超过上限10个">
                          <Button 
                            // className="mr8"
                            type="primary" 
                            onClick={this.dbSourceVisible} 
                            disabled={store.isDbSourcEnough}
                          >
                        添加目的数据源
                          </Button>                   
                        </Tooltip>
                      ) : (
                        <Button 
                          // className="mr8"
                          type="primary" 
                          onClick={this.dbSourceVisible} 
                          disabled={used}
                        >
                        添加目的数据源
                        </Button>
                      )
                  }
                </AuthBox>
                {/* {(() => {
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
                })()} */}
              </div>
            </div>
            <Descr text={descr} pr={210} className="pl8 mt8" />
            <NemoBaseInfo dataSource={baseInfo} key={Math.random()} className="detail-border" />
          </div>
        </Spin>
       
        <Tabs defaultActiveKey="1" animated={false} onChange={this.onTabChange}>
          <TabPane tab="标签选择" key="1">    
            <SelectTag sceneId={store.sceneId} dataSourceLen={store.sourceData.data.length} />
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
