import intl from 'react-intl-universal'
/**
 * @description 对象管理 - 对象详情信息
 */
import { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Spin, Button } from 'antd'
import { action } from 'mobx'
import { Time } from '../../common/util'
import {
  DetailHeader,
  Tag,
  OverviewCardWrap,
  TabRoute,
  Authority,
} from '../../component'
import { typeCodeMap, objStatusMap, objTypeMap } from './util'
// import ObjectView from './object-view'
import ObjectView from '../page-tag-model/object-view-router'
import BusinessModel from './business-model'
import UseProject from './object-list/object-detail/use-project'
import DataTable from './object-list/object-detail/data-table'
import TagList from './object-list/object-detail/tag-list'
import TagClass from './object-list/object-list/tag-class'

@inject('bigStore')
@observer
class ObjectDetail extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  componentWillMount() {
    this.getInitData()
  }

  componentWillReceiveProps(next) {
    const { updateDetailKey, objId } = this.props
    if (
      !_.isEqual(updateDetailKey, next.updateDetailKey) ||
      !_.isEqual(+objId, +next.objId)
    ) {
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
    this.store.tabKey = id
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
      objId,
      objDetail,
      objCard,
      loading,
      releaseLoading,
      typeCode,
      tagClassObjId,
      tagClassVisible,
      tabKey,
    } = this.store

    // 详情信息
    const baseInfo = [
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.q19x51sjr7')
          .d('对象标识'),
        value: objDetail.enName,
      },
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
        button: null,
      },

      null: {
        tag: null,
        button: null,
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
        button: (
          <Authority authCode="tag_model:update_obj[cud]" isCommon>
            <Button
              loading={releaseLoading}
              className="mr8"
              onClick={() => this.handleRelease('release')}
            >
              {intl
                .get('ide.src.page-manage.page-object-model.detail.xs4lzzgw79d')
                .d('发布')}
            </Button>
          </Authority>
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
        button: (
          <Fragment>
            <Authority authCode="tag_model:update_obj[cud]" isCommon>
              <Button
                loading={releaseLoading}
                className="mr8"
                onClick={() => this.handleRelease('cancel')}
              >
                {intl
                  .get(
                    'ide.src.page-manage.page-object-model.detail.a24dcsgx9g8'
                  )
                  .d('取消发布')}
              </Button>
            </Authority>
            <Button
              loading={releaseLoading}
              // className="mr8"
              type="primary"
              onClick={() => this.tagClass()}
            >
              {intl
                .get('ide.src.page-manage.page-object-model.detail.9o263cdwzol')
                .d('标签类目')}
            </Button>
          </Fragment>
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
        button: (
          <Button
            loading={releaseLoading}
            // className="mr8"
            type="primary"
            onClick={() => this.tagClass()}
          >
            {intl
              .get('ide.src.page-manage.page-object-model.detail.9o263cdwzol')
              .d('标签类目')}
          </Button>
        ),
      },
    }

    const { tag } = tagMap[
      objDetail.status === undefined ? 'noData' : objDetail.status
    ]
    const { button } = tagMap[
      objDetail.status === undefined ? 'noData' : objDetail.status
    ]
    const typeCodeMap1 = typeCodeMap[typeCode]
    const typeCodeMap2 = typeCodeMap[`${typeCode}～`]
    // 对象指标信息卡
    const cards = [
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.aksa7mk6v55', {
            typeCodeMap2: typeCodeMap2,
          })
          .d('{typeCodeMap2}总数'),
        tooltipText: intl
          .get('ide.src.page-manage.page-object-model.detail.jhbpjoxq84', {
            typeCodeMap1: typeCodeMap1,
            typeCodeMap2: typeCodeMap2,
          })
          .d('跟该{typeCodeMap1}相关的{typeCodeMap2}总数'),
        values: [objCard.objectCount],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.pl1ceawzje9')
          .d('相关项目数'),
        tooltipText: intl
          .get('ide.src.page-manage.page-object-model.detail.t4h6rz6gex9')
          .d('使用该对象的项目总数'),
        values: [objCard.projectCount],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.wih18jbc78')
          .d('数据表数'),
        tooltipText: intl
          .get('ide.src.page-manage.page-object-model.detail.20ysvy4w8zt')
          .d('该对象绑定的数据表总数'),
        values: [objCard.tableCount],
      },
      {
        title: intl
          .get('ide.src.page-manage.page-object-model.detail.oq3u9e6e36')
          .d('标签总数'),
        tooltipText: intl
          .get('ide.src.page-manage.page-object-model.detail.jjhghyku4sk')
          .d('已发布的标签总数'),
        values: [objCard.tagCount],
      },

      //  {
      //   title: '上架标签总数',
      //   tooltipText: '该对象下公开的标签总数',
      //   values: [objCard.publicTagCount],
      // },
    ]

    const objCompMap = {
      view: ObjectView,
      pro: UseProject,
      table: DataTable,
      list: TagList,
      // business: BusinessModel,
    }

    const objCompMap1 = {
      view: ObjectView,
      pro: UseProject,
      table: DataTable,
      list: ObjectView,
      // business: BusinessModel,
    }

    const tabConfig = {
      tabs:
        objDetail.type === 0
          ? [
              {
                name: intl
                  .get(
                    'ide.src.page-manage.page-object-model.detail.rnj5knhzw8'
                  )
                  .d('对象视图'),
                value: 'view',
              },
              // {name: '业务视图', value: 1},
              {
                name: intl
                  .get(
                    'ide.src.page-manage.page-common-tag.common-tag.modal.0snlii7b6ll'
                  )
                  .d('使用项目'),
                value: 'pro',
              },
              {
                name: intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
                  )
                  .d('数据表'),
                value: 'table',
              },
            ]
          : [
              {
                name: intl
                  .get(
                    'ide.src.page-manage.page-object-model.detail.rnj5knhzw8'
                  )
                  .d('对象视图'),
                value: 'view',
              },
              // {name: '业务视图', value: 1},
              {
                name: intl
                  .get(
                    'ide.src.page-manage.page-common-tag.common-tag.modal.0snlii7b6ll'
                  )
                  .d('使用项目'),
                value: 'pro',
              },
              {
                name: intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5'
                  )
                  .d('数据表'),
                value: 'table',
              },
              {
                name: intl
                  .get('ide.src.common.navList.5ywghq8b76s')
                  .d('标签列表'),
                value: 'list',
              },
            ],

      objType: objDetail.type,
      basePath: `/manage/object-model/${typeCode}/${objId}`,
      // currentTab: this.store.tabId,
      currentTab: tabKey,
      changeTab: this.changeTab,
      // eslint-disable-next-line react/destructuring-assignment
      _history: this.props.history,
      changeUrl: true,
    }

    const Content =
      objDetail.type === 0 ? objCompMap1[tabKey] : objCompMap[tabKey]
    // const Content = [ObjectView, BusinessModel, UseProject, DataTable, TagList][+this.store.tabId]
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
        <div className="bgf box-border">
          <TabRoute {...tabConfig} />
          <div className="object-tab-content">
            <Content
              bigStore={this.store}
              store={this.store}
              updateDetailKey={this.props.updateDetailKey}
              objId={objId}
              objType={objDetail.type}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default ObjectDetail
