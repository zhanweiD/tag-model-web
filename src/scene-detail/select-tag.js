/* eslint-disable no-nested-ternary */
import {Component, Fragment} from 'react'
import {
  observable, action, toJS, computed,
} from 'mobx'
import {observer, Provider} from 'mobx-react'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Button, Empty, Spin} from 'antd'

import {Time} from '../common/util'
import NoData from '../component-scene-nodata'

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
    this.store.isObjExist(() => {
      this.store.categoryStore.getCategoryList()
    })

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

  goToAddObj = () => {
    // 跳转至标签池添加标签
    window.location.href = `${window.__onerConfig.pathPrefix}/pool#/1`
  }

  // 选择对象
  @action selectObj = () => {
    const {treeData} = this.store.categoryStore
    if (treeData.length) return

    // 获取选择对象
    this.store.categoryStore.getSelectObj()

    this.store.categoryStore.currentTreeItemKey = 0
    this.store.categoryStore.eStatus.editObject = false
    this.store.categoryStore.modalVisible.editObject = true
  }

  // 判断场景下 对象是否存在
  @computed get objExistFlag() {
    const {treeData} = this.store.categoryStore
    return treeData.length
  }

  render() {
    const {
      tagInfo, tagId, tagInfoLoading, tagExistFlag,
    } = this.store
    const {
      id,
      name,
      // used,
      enName,
      valueTypeName,
      cUser,
      cDate,
      descr,
      objTypeCode,
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
              tagExistFlag
                ? (
                  <div>
                    <Spin spinning={this.store.categoryStore.treeLoading}>
                      {
                        this.objExistFlag
                          ? (
                            <div>
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
                                              href={`${window.__onerConfig.pathPrefix}/pool#/${objTypeCode}/${treeId}`}
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
                                ) : <div />
                              // <div className="empty-box bgf"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                              }
                            </div>
                          )
                          : <NoData btnTxt="选择对象" onClick={this.selectObj} />
                      }
                    </Spin>
                  </div>
                )
                
                    
                : <NoData btnTxt="去添加对象" text="没有任何对象，请在标签池中添加！" onClick={this.goToAddObj} />
            }

          </div>
        </div>
      </Provider>
    )
  }
}
