import intl from 'react-intl-universal'
/**
 * @description 对象管理 - 对象详情信息
 */
import {observer, Provider} from 'mobx-react'
import {Spin} from 'antd'
import {observable, action} from 'mobx'
import {Component} from 'react'

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
    const {
      match: {params},
    } = props
    store.projectId = undefined
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
    const {objDetail, objCard, loading, typeCode, objId, projectId} = store

    // 详情信息
    const baseInfo = [
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.q19x51sjr7')
          .d('对象标识'),
        value: objDetail.enName,
      },

      //  {
      //   title: '创建者',
      //   value: objDetail.creator,
      // },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.qksgujny9q')
          .d('对象类型'),
        value: objTypeMap[objDetail.type],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.ml3nv2hkkdo')
          .d('对象类目'),
        value: objDetail.objCatName,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
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
        tag: (
          <Tag
            status="wait"
            text={intl
              .get('ide.src.page-manage.page-object-model.detail.3fpa4r1400q')
              .d('待发布')}
          />
        ),
      },

      1: {
        tag: (
          <Tag
            status="success"
            text={intl
              .get('ide.src.page-manage.page-object-model.detail.mayalaiwna')
              .d('已发布')}
          />
        ),
      },

      2: {
        tag: (
          <Tag
            status="process"
            text={intl
              .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
              .d('使用中')}
          />
        ),
      },
    }

    const {tag} = tagMap[
      objDetail.status === undefined ? 'noData' : objDetail.status
    ]

    // 对象指标信息卡
    const typeCodeMap4 = typeCodeMap[`${typeCode}～`]
    const cards = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.main.u1ln4g746r',
            {typeCodeMap4}
          )
          .d('{typeCodeMap4}总数'),
        tooltipText: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.main.vdfr59d0o9s',
            {typeCodeMap4}
          )
          .d('已经发布的关联{typeCodeMap4}总数'),
        values: [objCard.objectCount],
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.main.ps8jdn62w8s'
          )
          .d('使用项目数'),
        tooltipText: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.main.t88g7n6dj79'
          )
          .d('租户下，项目的使用数'),
        values: [objCard.projectCount],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.wih18jbc78')
          .d('数据表数'),
        tooltipText: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.main.jr6l9imczaq'
          )
          .d('租户下，项目中添加的数据表数'),
        values: [objCard.tableCount],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.oq3u9e6e36')
          .d('标签总数'),
        tooltipText: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.main.hjacvsfeses'
          )
          .d('租户下，已经发布的标签总数（不包括主标签）'),
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
      tabs: +objDetail.type
        ? [
          {
            name: intl
              .get('ide.src.page-manage.page-object-model.detail.rnj5knhzw8')
              .d('对象视图'),
            value: 0,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.main.e6qy2b1e2kq'
              )
              .d('业务视图'),
            value: 1,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.modal.0snlii7b6ll'
              )
              .d('使用项目'),
            value: 2,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
              )
              .d('数据表'),
            value: 3,
          },
          {
            name: intl
              .get('ide.src.common.navList.5ywghq8b76s')
              .d('标签列表'),
            value: 4,
          },
        ]
        : [
          {
            name: intl
              .get('ide.src.page-manage.page-object-model.detail.rnj5knhzw8')
              .d('对象视图'),
            value: 0,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.main.e6qy2b1e2kq'
              )
              .d('业务视图'),
            value: 1,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.modal.0snlii7b6ll'
              )
              .d('使用项目'),
            value: 2,
          },
          {
            name: intl
              .get(
                'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
              )
              .d('数据表'),
            value: 3,
          },
        ],

      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    const comp = +objDetail.type
      ? [ObjectView, BusinessModel, UseProject, DataTable, TagList]
      : [ObjectView, BusinessModel, UseProject, DataTable]
    const Content = comp[+this.tabId]

    return (
      <Provider bigStore={store}>
        <div className="object-detail0 pb16">
          <Spin spinning={loading}>
            <div className="box-border">
              <DetailHeader
                name={objDetail.name}
                descr={objDetail.descr}
                btnMinWidth={160}
                baseInfo={baseInfo}
                tag={tag}
              />
            </div>
          </Spin>
          <div className="ml16 mr16">
            <OverviewCardWrap cards={cards} />
            <div
              className="mt16 bgf box-border"
              style={{minHeight: 'calc(100vh - 348px)'}}
            >
              <TabRoute {...tabConfig} />
              <Content
                objId={+objId}
                type={+objDetail.type}
                projectId={+projectId}
              />
            </div>
          </div>
        </div>
      </Provider>
    )
  }
}

export default props => {
  // const ctx = OnerFrame.useFrame()
  // useEffect(() => {
  //   ctx.useProject(true, null, {visible: false})
  // }, [])
  // const projectId = ctx.useProjectId()
  return <ObjectDetail {...props} />
}
