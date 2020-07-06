/**
 * @description 对象管理 - 对象详情信息
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import {action} from 'mobx'
import {Time} from '../../common/util'
import {
  DetailHeader, Tag, OverviewCardWrap, TabRoute, AuthBox,
} from '../../component'
import {typeCodeMap, objStatusMap, objTypeMap} from './util'
import ObjectView from './object-view'
import BusinessModel from './business-model'

@observer
export default class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
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
 
  /**
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

  render() {
    const {
      objId, objDetail, objCard, loading, releaseLoading, typeCode,
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
        button: <AuthBox 
          loading={releaseLoading} 
          className="mr8" 
          onClick={() => this.handleRelease('release')}
          code="asset_tag_obj_add_edit_del_publish"
        >
          发布
                </AuthBox>,
      },
      1: {
        tag: <Tag status="success" text="已发布" />,
        button: <AuthBox 
          loading={releaseLoading} 
          className="mr8" 
          onClick={() => this.handleRelease('cancel')}
          code="asset_tag_obj_add_edit_del_publish"
        >
          取消发布
                </AuthBox>,
      },
      2: {
        tag: <Tag status="process" text="使用中" />,
        button: null,
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
      }, {
        title: '上架标签总数',
        tooltipText: '该对象下公开的标签总数',
        values: [objCard.publicTagCount],
      },
    ]


    const tabConfig = {
      tabs: [
        {name: '对象视图', value: 0},
        {name: '业务视图', value: 1},
      ],
      basePath: `/manage/object-model/${typeCode}/${objId}`,
      currentTab: this.store.tabId,
      changeTab: this.changeTab,
      // eslint-disable-next-line react/destructuring-assignment
      _history: this.props.history,
      changeUrl: true,
    }

    const Content = [ObjectView, BusinessModel][+this.store.tabId]

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
            <OverviewCardWrap cards={cards} />
          </div>
        </Spin>
        <div className="bgf  box-border">
          <TabRoute {...tabConfig} />
          <div className="object-tab-content">
            <Content store={this.store} updateDetailKey={this.props.updateDetailKey} objId={objId} />

          </div>
        </div>
      </div>
    )
  }
}
