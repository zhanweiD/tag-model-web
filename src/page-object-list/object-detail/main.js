/**
 * @description 对象管理 - 对象详情信息
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import {Time} from '../../common/util'
import {
  Tag,
  TabRoute,
  DetailHeader, 
  OverviewCardWrap, 
} from '../../component'
import {typeCodeMap, objTypeMap} from '../util'
import ObjectView from './object-view'
// import BusinessModel from './business-model'

import store from './store'

@observer
export default class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    store.objId = props.match.params && props.match.params.objId
    store.typeCode = props.match.params && props.match.params.typeCode
  }

  componentWillMount() {
    this.getInitData()
  }

  getInitData() {
    store.objDetail = {}
    store.objCard = {}
    
    store.getObjDetail()
    store.getObjCard()
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
        tooltipText: '该对象下公开的标签总数',
        values: [objCard.tagCount],
      }, {
        title: '上架标签总数',
        // tooltipText: '该对象下公开的标签总数',
        values: [objCard.publicTagCount],
      },
    ]

    return (
      <div className="object-detail">
        <Spin spinning={loading}>
          <div className="mb16">
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
        <div className="bgf">
          <TabRoute tabs={[{name: '对象视图', value: 1}]} />
          <ObjectView store={store} />
          {/* <BusinessModel store={store} /> */}
        </div>
      </div>
    )
  }
}
