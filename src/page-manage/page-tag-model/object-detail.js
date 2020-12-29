/**
 * @description  对象配置 - 对象详情
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {Spin, Modal, Button} from 'antd'
import {action, toJS} from 'mobx'
import {Time} from '../../common/util'
import {
  TabRoute, DetailHeader, OverviewCardWrap, Tag, Authority,
} from '../../component'
import {objDetailTabMap, objRelTabMap, objTypeMap} from './util'

import TagClass from '../page-object-model/object-list/object-list/tag-class'
// import ObjectView from './object-view'
import ObjectView from './object-view-router'
import DataSheet from './data-sheet'
import FieldList from './field-list'
// import BusinessModel from './business-model'
import {TagModel} from './tag-model'

const {confirm} = Modal

@inject('bigStore')
@observer
export default class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  componentWillMount() {
    this.getData()
  }

  componentWillReceiveProps(next) {
    const {objId} = this.props
    if (!_.isEqual(+objId, +next.objId)) {
      this.getData()
    }
  }

  getData = () => {
    this.store.getObjDetail()
    this.store.getObjCard()
  }

  /*
   * @description 移除对象；使用中的对象不可以移除
   */
  @action.bound remove() {
    const t = this
    const {history} = this.props
    confirm({
      title: '确定移除对象？',
      onOk() {
        t.store.objId = undefined
        history.push(`/manage/tag-model/${t.store.typeCode}`)
        t.store.removeObj(() => {
          t.store.getObjTree(() => {
            t.store.tabId = 'view'
            t.store.objId = t.store.currentSelectKeys
          })
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  @action.bound changeTab(id) {
    this.store.tabId = id
  }

  @action.bound tagClass() {
    // this.store.tagClassObjId = this.store.objId // 对象id
    this.store.tagClassVisible = true
  }

  @action.bound closeTagClass() {
    this.store.tagClassVisible = false
  }

  render() {
    const {
      detailLoading, objDetail, objCard, tabId, typeCode, objId, tagClassObjId, tagClassVisible, projectId,
    } = this.store
    const baseInfo = [{
      title: '对象标识',
      value: objDetail.enName,
    }, 
    // {
    //   title: '创建者',
    //   value: objDetail.creator,
    // }, 
    {
      title: '对象类型',
      value: objTypeMap[objDetail.type],
    }, {
      title: '对象类目',
      value: objDetail.objCatName,
    },
    {
      title: '创建时间',
      value: <Time timestamp={objDetail.createTime} />,
    }, 
    // {
    //   title: '对象主键',
    //   value: objDetail.objPk,
    // }
    ]

    const cards = [{
      title: '数据表',
      tooltipText: '项目内添加的数据表',
      values: [objCard.tableCount],
    }, 
    {
      title: '已发布',
      tooltipText: '已发布即已发布的标签数，项目内创建且发布的标签数',
      values: [objCard.publicTagCount],
    }, 
    // {
    //   title: '已公开/已发布',
    //   tooltipText: '已发布即已发布的标签数，项目内创建且发布的标签数;已公开，即公开标签数，项目内对外公开的标签数',
    //   values: [objCard.publishTagCount, objCard.publicTagCount],
    // }, 
    {
      title: '引用标签数',
      tooltipText: '项目内从其他项目申请或授权过来的标签数（有使用权限）',
      values: [objCard.referencedTagCount],
    }, 
    // {
    //   title: '业务场景数',
    //   tooltipText: '项目内创建的业务场景数',
    //   values: [objCard.occasionCount],
    // }
    ]

    // 不同状态的相应map
    const tagMap = {
      noData: {
        tag: null,
      },
      null: {
        tag: null,
      },
      0: {
        tag: <Tag status="wait" text="未使用" />,
      },
      1: {
        tag: <Tag status="process" text="使用中" />,
      },
    }

    const tabMap = objDetail.type === 0 ? objRelTabMap : objDetailTabMap
    console.log(tabId)
    const tabConfig = {
      tabs: tabMap,
      objType: objDetail.type,
      basePath: `/manage/tag-model/${typeCode}/${objId}`,
      currentTab: tabId,
      changeTab: this.changeTab,
      // eslint-disable-next-line react/destructuring-assignment
      _history: this.props.history,
      changeUrl: true,
    }

    const {tag} = tagMap[objDetail.isUsed === undefined ? 'noData' : objDetail.isUsed]

    const objCompMap = {
      view: ObjectView, 
      table: DataSheet,
      field: FieldList,
      list: TagModel,
      // business: BusinessModel,
    }

    const objCompMap1 = {
      view: ObjectView, 
      table: DataSheet,
      field: ObjectView,
      list: ObjectView,
      // business: BusinessModel,
    }

    const Content = objDetail.type === 0 ? objCompMap1[tabId] : objCompMap[tabId]

    const tagClassConfig = {
      visible: tagClassVisible,
      onClose: this.closeTagClass,
      objId, // 对象id
      store: this.store,
      projectId,
    }
    
    return (
      <div className="object-detail">
        <Spin spinning={detailLoading}>
          <div className="mb16 box-border">
            <DetailHeader 
              name={objDetail.name}
              descr={objDetail.descr}
              baseInfo={baseInfo}
              tag={tag}
              actions={[
                <Authority 
                  authCode="tag_model:select_obj[cud]"
                  // type="primary" 
                  // onClick={this.remove}
                  // disabled={objDetail.isUsed} // 使用中对象不可以移除
                >
                  <Button type="primary" onClick={this.remove} disabled={objDetail.isUsed} className="mr8">移除</Button>
                </Authority>,
                <Button 
                  // loading={releaseLoading} 
                  className="mr8" 
                  type="primary"
                  onClick={() => this.tagClass()}
                >
                    标签类目
                </Button>,
              ]}
            />
          </div>
          <TagClass {...tagClassConfig} />
          <OverviewCardWrap cards={cards} />
        </Spin>
        <div className="box-border"> 
          <TabRoute {...tabConfig} />
          <div className="object-tab-content">
            <Content objId={objId} bigStore={this.store} key={objDetail.type} objType={objDetail.type} />
          </div>
        </div>
     
      </div>
    )
  }
}
