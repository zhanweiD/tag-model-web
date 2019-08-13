import {Component, Fragment} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Tag, Button, Empty} from 'antd'

import {Time} from '../common/util'
import {navListMap} from '../common/constants'
import TrendTag from './trend-tag'
import TrendApi from './trend-api'


import Store from './store-select-tag'
import TagCategory, {TagCategoryStore} from '../category-scene'

@inject('frameChange')
@observer
export default class SelectTag extends Component {
  constructor(props) {
    super(props)

    this.store = new Store(props)
    this.store.categoryStore = new TagCategoryStore(props)
    this.store.categoryStore.getCategoryList()

    // this.store.typeCode = +params.type || 1
    // this.store.id = +params.id || 999999999
    this.store.typeCode = 1
    this.store.id = props.id || -1

    // 场景id
    this.store.sceneId = props.sceneId

    // 选择标签暂存id 
    this.tagId = undefined
  }
  

  // @observable updateKey = 0
  
  componentWillMount() {
    const {frameChange} = this.props
    frameChange('nav', [
      navListMap.assetMgt,
      {text: '名称待定'},
    ])
    
    if (this.tagId) {
      this.store.getTagDetail()
    }
  }

  @action tagChange = tagId => {
    if (tagId !== this.tagId) {
      this.store.getTagDetail()
      this.tagId = tagId
    }
  }

  render() {
    const {tagInfo, tagId} = this.store
    const {
      name,
      used,
      enName,
      valueTypeName,
      cUser,
      cDate,
      descr,
    } = toJS(tagInfo)
    // 详情信息
    const baseInfo = [{
      title: '英文名',
      value: enName,
    }, {
      title: '数据类型',
      value: valueTypeName,
    }, {
      title: '创建者',
      value: cUser,
    }, {
      title: '创建时间',
      value: <Time timestamp={cDate} />,
    }, {
      title: '业务逻辑',
      value: descr,
    }]
    return (
      <Provider bigStore={this.store}>
        <div className="select-tag FBH">
          <TagCategory tagChange={this.tagChange} />
          <div className="select-tag-box">
            {
              tagId ? (
                <Fragment>
                  <div className="detail-info">
                    <div className="d-head FBH FBJ">
                      <div>
                        <span className="mr10">{name}</span>
                        <Tag color={used ? 'green' : 'blue'}>{used ? '使用中' : '未使用'}</Tag>
                      </div>
                      {/* 点击“标签详情”按钮，进入标签池中的标签详情 */}
                      <Button type="primary">标签详情</Button>
                    </div>
                    <NemoBaseInfo dataSource={baseInfo} key={Math.random()} className="d-info" />
                  </div>
                  <TrendTag store={this.store} tagId={this.store.tagId} />
                  <TrendApi store={this.store} tagId={this.store.tagId} />
                </Fragment>
              ) : <div className="empty-box"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div> 
            }
          </div>
        </div>
      </Provider>   
    )
  }
}
