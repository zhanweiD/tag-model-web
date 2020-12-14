/**
 * @description 对象管理 - 对象详情信息
 */
import {Component, Fragment} from 'react'
import {inject, observer} from 'mobx-react'
import {Spin, Button} from 'antd'
import {action} from 'mobx'
import {Time} from '../../common/util'
import {
  DetailHeader, Tag, OverviewCardWrap, TabRoute, Authority,
} from '../../component'
import {typeCodeMap, objStatusMap, objTypeMap} from './util'
// import ObjectView from './object-view'
import ObjectView from '../page-tag-model/object-view-router'
import BusinessModel from './business-model'
import UseProject from './object-list/object-detail/use-project'
import DataTable from './object-list/object-detail/data-table'
import TagList from './object-list/object-detail/tag-list'
import TagClass from './object-list/object-list/tag-class'

@inject('bigStore')
@observer
export default class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  componentWillMount() {
    this.getInitData()
  }

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    if (!_.isEqual(updateDetailKey, next.updateDetailKey) || !_.isEqual(+objId, +next.objId)) {
      this.store.objId = next.objId
      this.getInitData()
    }
  }

  getInitData() {
    this.store.objDetail = {}
    this.store.objCard = {}
    
    this.store.getObjDetail()
    this.store.getObjCard()
  }
 
  /*
   * @description 发布/取消发布
   * @param {*} status 发布操作类型标识
   */
  handleRelease(status) {
    const t = this
    this.store.changeObjStatus(objStatusMap[status], () => {
      // 发布状态改变 更新对象详情 和 类目树
      this.store.updateTreeKey = Math.random()
      this.store.getObjDetail()
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
      objId, objDetail, objCard, loading, releaseLoading, typeCode, tagClassObjId, tagClassVisible,
    } = this.store
   
    // 详情信息
    const baseInfo = [{
      title: '对象标识',
      value: objDetail.enName,
    }, {
      title: '对象类型',
      value: objTypeMap[objDetail.type],
    }, {
      title: '对象类目',
      value: objDetail.objCatName,
    }, {
      title: '创建时间',
      value: <Time timestamp={objDetail.createTime} />,
    }]

    // 不同状态的相应map
    const tagMap = {
      noData: {
        tag: null,
        button: null,
      },
      null: {
        tag: null,
        button: null,
      },
      0: {
        tag: <Tag status="wait" text="待发布" />,
        button: 
  <Authority authCode="tag_model:update_obj[cud]" isCommon>
    <Button
      loading={releaseLoading}
      className="mr8"
      onClick={() => this.handleRelease('release')}
    >
              发布
    </Button>
  </Authority>,
      },
      1: {
        tag: <Tag status="success" text="已发布" />,
        button: 
  <Fragment>
    <Authority authCode="tag_model:update_obj[cud]" isCommon>
      <Button 
        loading={releaseLoading} 
        className="mr8" 
        onClick={() => this.handleRelease('cancel')}
      >
          取消发布
      </Button>
    </Authority>
    <Button 
      loading={releaseLoading} 
      // className="mr8" 
      type="primary"
      onClick={() => this.tagClass()}
    >
          标签类目
    </Button>
  </Fragment>,
      },
      2: {
        tag: <Tag status="process" text="使用中" />,
        button: 
  <Button 
    loading={releaseLoading} 
    // className="mr8" 
    type="primary"
    onClick={() => this.tagClass()}
  >
        标签类目
  </Button>,
      },
    }
    const {tag} = tagMap[objDetail.status === undefined ? 'noData' : objDetail.status]
    const {button} = tagMap[objDetail.status === undefined ? 'noData' : objDetail.status]

    // 对象指标信息卡
    const cards = [
      {
        title: `${typeCodeMap[`${typeCode}～`]}总数`,
        tooltipText: `跟该${typeCodeMap[typeCode]}相关的${typeCodeMap[`${typeCode}～`]}总数`,
        values: [objCard.objectCount],
      }, {
        title: '相关项目数',
        tooltipText: '使用该对象的项目总数',
        values: [objCard.projectCount],
      }, {
        title: '数据表数',
        tooltipText: '该对象绑定的数据表总数',
        values: [objCard.tableCount],
      }, {
        title: '标签总数',
        tooltipText: '已发布的标签总数',
        values: [objCard.tagCount],
      },
      //  {
      //   title: '上架标签总数',
      //   tooltipText: '该对象下公开的标签总数',
      //   values: [objCard.publicTagCount],
      // },
    ]


    const tabConfig = {
      tabs: [
        {name: '对象视图', value: 0},
        // {name: '业务视图', value: 1},
        {name: '使用项目', value: 2},
        {name: '数据表', value: 3},
        {name: '标签列表', value: 4},
      ],
      basePath: `/manage/object-model/${typeCode}/${objId}`,
      currentTab: this.store.tabId,
      changeTab: this.changeTab,
      // eslint-disable-next-line react/destructuring-assignment
      _history: this.props.history,
      changeUrl: true,
    }

    const Content = [ObjectView, BusinessModel, UseProject, DataTable, TagList][+this.store.tabId]
    const tagClassConfig = {
      visible: tagClassVisible,
      onClose: this.closeTagClass,
      objId, // 对象id
      // store: this.store,
    }

    return (
      <div className="object-detail">
        <Spin spinning={loading}>
          <div className="mb16 box-border">
            <DetailHeader 
              name={objDetail.name}
              descr={objDetail.descr}
              btnMinWidth={160}
              baseInfo={baseInfo}
              tag={tag}
              actions={[button]}
            />
          </div>
          <TagClass {...tagClassConfig} />
          <OverviewCardWrap cards={cards} />
        </Spin>
        <div className="bgf  box-border">
          <TabRoute {...tabConfig} />
          <div className="object-tab-content">
            <Content bigStore={this.store} store={this.store} updateDetailKey={this.props.updateDetailKey} objId={objId} />
          </div>
        </div>
      </div>
    )
  }
}
