/**
 * @description 对象管理 - 对象详情信息
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {Button, Spin} from 'antd'
import {action} from 'mobx'
import {Time} from '../../common/util'
import {
  DetailHeader, Tag, OverviewCardWrap, TabRoute,
} from '../../component'
import {typeCodeMap, objStatusMap} from '../util'

import TagClass from './tag-class'
import ObjectView from './object-view'

import store from './store'
import './index.styl'

@inject('bigStore')
@observer
export default class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    store.objId = props.bigStore.objId
    store.typeCode = props.bigStore.typeCode
  }

  componentWillMount() {
    this.getInitData()
  }

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    
    if (!_.isEqual(updateDetailKey, next.updateDetailKey) || !_.isEqual(objId, next.objId)) {
      store.objId = next.objId
      this.getInitData()
    }
  }

  getInitData() {
    store.objDetail = {}
    store.objCard = {}
    
    store.getObjDetail()
    store.getObjCard()
  }
 
  /**
   * @description 发布/取消发布
   * @param {*} status 发布操作类型标识
   */
  handleRelease(status) {
    const t = this
    store.changeObjStatus(objStatusMap[status], () => {
      // 发布状态改变 更新对象详情 和 类目树
      t.bigStore.updateTreeKey = Math.random()
      store.getObjDetail()
    })
  }

  @action.bound closetTagClass() {
    store.tagClassVisible = false
  }

  render() {
    const {
      objId, objDetail, objCard, loading, releaseLoading, tagClassVisible,
    } = store
    const {typeCode} = this.bigStore
   
    // 详情信息
    const baseInfo = [{
      title: '唯一标识',
      value: objDetail.enName,
    }, {
      title: '创建者',
      value: objDetail.creator,
    }, {
      title: '创建时间',
      value: <Time timestamp={objDetail.createTime} />,
    }, {
      title: '对象类型',
      value: objDetail.objType,
    }, {
      title: '对象类目',
      value: objDetail.objCatName,
    }, {
      title: '对象主键',
      value: objDetail.objPk,
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
        button: <Button loading={releaseLoading} className="mr8" onClick={() => this.handleRelease('release')}>发布</Button>,
      },
      1: {
        tag: <Tag status="success" text="已发布" />,
        button: <Button loading={releaseLoading} className="mr8" onClick={() => this.handleRelease('cancel')}>取消发布</Button>,
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
        tooltipText: '该对象下公开的标签总数',
        values: [objCard.tagCount],
      },
    ]

    // 标签类目
    const tagClassConfig = {
      visible: tagClassVisible,
      onClose: this.closetTagClass,
      objId, // 对象id
    }

    return (
      <div className="object-detail">
        <Spin spinning={loading}>
          <div className="mb16">
            <DetailHeader 
              name={objDetail.name}
              descr={objDetail.descr}
              baseInfo={baseInfo}
              tag={tag}
              actions={[
                button,
                <Button 
                  type="primary" 
                  onClick={() => {
                    store.tagClassVisible = true
                  }}
                >
            标签类目
                </Button>,
              ]}
            />
            <OverviewCardWrap cards={cards} />
          </div>
        </Spin>
        <div className="bgf">
          <TabRoute tabs={[{name: '对象视图', value: 1}]} />
          <ObjectView store={store} updateDetailKey={this.props.updateDetailKey} objId={objId} />
        </div>
        <TagClass {...tagClassConfig} />
      </div>
    )
  }
}
