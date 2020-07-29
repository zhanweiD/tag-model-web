/**
 * @description 对象管理 - 对象详情信息
 */
import {Component, useEffect} from 'react'
import OnerFrame from '@dtwave/oner-frame' 
import {observer, Provider} from 'mobx-react'
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
import UseProject from './use-project'
import DataTable from './data-table'
import TagList from './tag-list'

import store from './store'

@observer
class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    const {match: {params}} = props
    store.objId = params && params.objId
    store.typeCode = params && params.typeCode
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
      objDetail, objCard, loading, typeCode, objId,
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
        tooltipText: `已经发布的关联${typeCodeMap[`${typeCode}～`]}总数`,
        values: [objCard.objectCount],
      }, {
        title: '使用项目数',
        tooltipText: '租户下，项目的使用数',
        values: [objCard.projectCount],
      }, {
        title: '数据表数',
        tooltipText: '租户下，项目中添加的数据表数',
        values: [objCard.tableCount],
      }, {
        title: '标签总数',
        tooltipText: '租户下，已经发布的标签总数（不包括主标签）',
        values: [objCard.tagCount],
      },
      // , {
      //   title: '上架标签总数',
      //   tooltipText: '该对象下公开的标签总数',
      //   values: [objCard.publicTagCount],
      // },
      // {
      //   title: '对象总数',
      //   tooltipText: '租户下，比如会员实体集，会员总数',
      //   values: [objCard.publicTagCount],
      // },
    ]

    const tabConfig = {
      tabs: +objDetail.type ? [
        {name: '对象视图', value: 0},
        {name: '业务视图', value: 1},
        {name: '使用项目', value: 2},
        {name: '数据表', value: 3},
        {name: '标签列表', value: 4},
      ] : [
        {name: '对象视图', value: 0},
        {name: '业务视图', value: 1},
        {name: '使用项目', value: 2},
        {name: '数据表', value: 3},
      ],
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    const comp = +objDetail.type ? [ObjectView, BusinessModel, UseProject, DataTable, TagList] : [ObjectView, BusinessModel, UseProject, DataTable]
    const Content = comp[+this.tabId]

    return (
      <Provider bigStore={store}>
        <div className="object-detail">
          <Spin spinning={loading}>
            <div className="box-border">
              <DetailHeader 
                name={objDetail.name}
                descr={objDetail.descr}
                btnMinWidth={160}
                baseInfo={baseInfo}
                tag={tag}
              />
              <OverviewCardWrap cards={cards} />
            </div>
          </Spin>
          <div className="mt16 bgf box-border">
            <TabRoute {...tabConfig} />
            <Content objId={+objId} type={+objDetail.type} />
          </div>
        </div>
      </Provider>
     
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
