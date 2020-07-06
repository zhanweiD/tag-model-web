/**
 * @description 对象管理 - 对象详情信息
 */
import {Component, useEffect} from 'react'
import OnerFrame from '@dtwave/oner-frame' 
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import {observable, action} from 'mobx'
import {Time} from '../../../common/util'
import {
  Tag,
  TabRoute,
  DetailHeader, 
  OverviewCardWrap, 
} from '../../../component'
import {typeCodeMap, objTypeMap} from '../util'
import ObjectView from './object-view'
import BusinessModel from './business-model'

import store from './store'

@observer
class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    store.objId = props.match.params && props.match.params.objId
    store.typeCode = props.match.params && props.match.params.typeCode
  }

  @observable tabId = 0

  componentWillMount() {
    this.getInitData()
  }

  getInitData() {
    store.objDetail = {}
    store.objCard = {}
    
    store.getObjDetail()
    store.getObjCard()
  }

  @action.bound changeTab(id) {
    this.tabId = id
  }

  render() {
    const {
      objDetail, objCard, loading, typeCode,
    } = store
   
    // 详情信息
    const baseInfo = [{
      title: '对象标识',
      value: objDetail.enName,
    },
    //  {
    //   title: '创建者',
    //   value: objDetail.creator,
    // },
    {
      title: '对象类型',
      value: objTypeMap[objDetail.type],
    }, {
      title: '对象类目',
      value: objDetail.objCatName,
    }, {
      title: '创建时间',
      value: <Time timestamp={objDetail.createTime} />,
    },
    //  {
    //   title: '对象主键',
    //   value: objDetail.objPk,
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
        tag: <Tag status="wait" text="待发布" />,
      },
      1: {
        tag: <Tag status="success" text="已发布" />,
      },
      2: {
        tag: <Tag status="process" text="使用中" />,
      },
    }
    const {tag} = tagMap[objDetail.status === undefined ? 'noData' : objDetail.status]

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
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    // const Content = [ObjectView][+this.tabId]
    const Content = [ObjectView, BusinessModel][+this.tabId]

    return (
      <div>
        <Spin spinning={loading}>
          <div>
            <DetailHeader 
              name={objDetail.name}
              descr={objDetail.descr}
              btnMinWidth={160}
              baseInfo={baseInfo}
              tag={tag}
            />
            <OverviewCardWrap cards={cards} />
          </div>
          <TabRoute {...tabConfig} />
        </Spin>
        <div className="bgf m16 box-border">
          <Content store={store} />
        </div>
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  useEffect(() => {
    ctx.useProject(false)
  }, [])

  return (
    <ObjectDetail {...props} />
  )
}
