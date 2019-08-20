import {Component, Fragment} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Button, Empty, Spin} from 'antd'

import {Time} from '../common/util'
import TrendTag from './trend-tag'
import TrendApi from './trend-api'

import sceneDetail from './store-scene-detail'
import Store from './store-select-tag'

import TagCategory, {TagCategoryStore} from '../category-scene'

@observer
export default class SelectTag extends Component {
  constructor(props) {
    super(props)

    this.store = new Store(props)
    this.store.categoryStore = new TagCategoryStore(props)
    this.store.categoryStore.getCategoryList()

    this.store.typeCode = 1
    this.store.id = props.id || -1

    // 场景id
    this.store.sceneId = props.sceneId

    // 选择标签暂存id 
    this.tagId = undefined

    this.isTagDel = false
  }

  // 判断标签是否被删除
  @observable isTagDel = false
  
  componentWillMount() {
    if (this.tagId) {
      this.store.getTagDetail()
    }
  }

  @action tagChange = tagId => {
    if (tagId && tagId !== this.tagId) {
      this.store.getTagDetail()
      this.tagId = tagId
      this.isTagDel = false
    }
  }

  @action tagDel = tagId => {
    const {categoryStore} = this.store
    const target = categoryStore.cateList.filter(item => item.id === this.tagId) || []
    this.isTagDel = !target.length
  }

  render() {
    const {tagInfo, tagId, tagInfoLoading} = this.store
    const {
      id,
      name,
      // used,
      enName,
      valueTypeName,
      cUser,
      cDate,
      descr,
      // objTypeCode,
      treeId,
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

    const tagCategoryOpt = {
      tagChange: this.tagChange,
      tagDel: this.tagDel,
    }

    return (
      <Provider bigStore={this.store} sceneDetail={sceneDetail}>
        <div className="select-tag FBH">
          <TagCategory {...tagCategoryOpt} />
          <div className="FB1 m16">
           
            {
              tagId && !this.isTagDel ? (
                <Fragment>
                  <div className="detail-info mb16">
                    <Spin spinning={tagInfoLoading}> 
                      <div className="d-head FBH FBJ">
                        <span className="mr10">{name}</span>
                        {/* 点击“标签详情”按钮，进入标签池中的标签详情 */}
                        <Button type="primary">
                          <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            href={`${window.__onerConfig.pathPrefix}/pool#/${treeId}/${id}`}
                          >
                          标签详情
                          </a>
                        </Button>
                      </div>
                      <NemoBaseInfo dataSource={baseInfo} key={Math.random()} className="d-info" />
                    </Spin>
                  </div>
                  <TrendTag store={this.store} tagId={this.store.tagId} />
                  <TrendApi store={this.store} tagId={this.store.tagId} />
                </Fragment>
              ) : <div className="empty-box bgf"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            }  

            
          </div> 
        </div>
      </Provider>   
    )
  }
}
