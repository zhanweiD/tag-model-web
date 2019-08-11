import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Tabs, Button, Icon} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
// import {Link} from 'react-router-dom'

import {Time} from '../common/util'
import {navListMap} from '../common/constants'
import SelectTag from './select-tag'
import DataSource from './data-source'
import ModalDataSource from './modal-data-source'
import ModalEditScene from '../scene/modal-add'

import store from './store-scene-detail'

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

    this.sceneId = params.id
  }
  
  componentWillMount() {
    const {frameChange} = this.props

    frameChange('nav', [
      navListMap.assetMgt,
      {text: '名称待定'},
    ])
    store.getDetail()
  }

  @action dSourceVisible() {
    store.dSourceVisible = true
  }

  @action sceneDetailVisible() {
    store.isEdit = true
    store.modalVisible = true
  }

  render() {
    const info = toJS(store.info)
    const {
      tagCount,
      cCuser,
      cDate,
      invokeList = [],
      descr,
    } = info

    // 详情信息
    const baseInfo = [{
      title: '创建者',
      value: cCuser,
    }, {
      title: '创建时间',
      value: <Time timestamp={cDate} />,
    }, {
      title: '调用的API名称',
      value: invokeList.join('、'),
    }, {
      title: '标签数',
      value: tagCount,
    }, {
      title: '描述',
      value: descr,
    }]

    return (
      <div className="scene-detail">
        <div className="info">
          <div className="FBH FBJ">
            <p className="name">
              <span className="mr8">{info.name}</span> 
              <Icon type="edit" onClick={this.sceneDetailVisible} />
            </p>
            <div>
              <Button className="mr8" href={`${window.__onerConfig.pathPrefix}/scene#/tags/${this.sceneId}`}>标签列表</Button>
              <Button type="primary" onClick={this.dSourceVisible}>添加目的数据源</Button>
            </div>
          </div>
          <NemoBaseInfo dataSource={baseInfo} key={Math.random()} className="ml4" />
        </div>

        <Tabs defaultActiveKey="1">
          <TabPane tab="标签选择" key="1">    
            <SelectTag sceneId={this.sceneId} />
          </TabPane>
          <TabPane tab="目的数据源列表" key="2">
            <DataSource sceneId={this.sceneId} />
          </TabPane>
        </Tabs>
        <ModalEditScene store={store} />
        <ModalDataSource store={store} />
      </div>
    )
  }
}
