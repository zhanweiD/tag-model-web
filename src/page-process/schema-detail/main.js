import intl from 'react-intl-universal'
/**
 * @description 加工方案详情
 */
import { Component, useEffect } from 'react'
import { observable, action, toJS } from 'mobx'
import { observer } from 'mobx-react'

import { Spin, NoData } from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import { Tag, TabRoute, DetailHeader } from '../../component'
import ConfigInfo from './config-info'
import RunRecord from './run-record'
import { Time, codeInProduct } from '../../common/util'

import store from './store'
// import runStore from './store-run-record'

const tabs = [
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.m38f67oruj')
      .d('配置信息'),
    value: 0,
  },
  {
    name: intl
      .get('ide.src.page-manage.page-tag-sync.sync-detail.main.x2izvfk9gwh')
      .d('运行记录'),
    value: 1,
  },
]

@observer
class SchemaDetail extends Component {
  constructor(props) {
    super(props)
    const { match, projectId } = props
    store.projectId = match.params.projectId
    // runStore.projectId = projectId
    store.processeId = match.params.id // 方案id
    console.log(toJS(store.projectId))
  }

  @observable tabId = 0 // 当前详情tabID

  @action.bound changeTab(id) {
    this.tabId = id
  }

  componentWillMount() {
    if (store.processeId) {
      store.getDetail()
    }
  }

  @action.bound submit() {
    store.submitScheme({
      id: this.processeId,
    })
  }

  getTabCode = () => {
    if (codeInProduct('tag_derivative:tql_submit_log[r]')) {
      return [
        {
          name: intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.m38f67oruj'
            )
            .d('配置信息'),
          value: 0,
        },
        {
          name: intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.x2izvfk9gwh'
            )
            .d('运行记录'),
          value: 1,
        },
      ]
    }

    return [
      {
        name: intl
          .get('ide.src.page-manage.page-tag-sync.sync-detail.main.m38f67oruj')
          .d('配置信息'),
        value: 0,
      },
    ]
  }

  render() {
    const { loading, detail, processeId, projectId } = store

    // 详情信息
    const baseInfo = [
      {
        title: intl
          .get('ide.src.page-process.schema-detail.main.tua55dlv62t')
          .d('方案类型'),
        value: 'TQL',
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.tag-config.main.2vfpdytl49n'
          )
          .d('所属对象'),
        value: detail.objName,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.ixa3qz2l6ie'
          )
          .d('创建人'),
        value: detail.cuserName,
      },
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
          )
          .d('创建时间'),
        value: <Time timestamp={detail.createTime} />,
      },
      {
        title: intl
          .get('ide.src.page-process.schema-detail.main.qxjr69vf03o')
          .d('物理表'),
        value: detail.tableName,
      },
    ]

    const tabConfig = {
      tabs: this.getTabCode(),
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    // 不同状态的相应map --方案状态 0 未完成、1 提交成功 2 提交失败
    const tagMap = {
      0: (
        <Tag
          status="default"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.rjxbzeiw5pg'
            )
            .d('未完成')}
        />
      ),
      1: (
        <Tag
          status="success"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.yf96acx8evb'
            )
            .d('提交成功')}
        />
      ),
      2: (
        <Tag
          status="error"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.2n0b3tsdnkb'
            )
            .d('提交失败')}
        />
      ),
    }

    const Content = [ConfigInfo, RunRecord][+this.tabId]

    return (
      <div className="processe-detail">
        {processeId ? (
          <Spin spinning={loading}>
            <div>
              <DetailHeader
                name={detail.name}
                descr={detail.descr}
                btnMinWidth={160}
                baseInfo={baseInfo}
                tag={tagMap[detail.status]}
              />
            </div>
            <TabRoute {...tabConfig} />
            {/* <ConfigInfo store={store} /> */}
            <div className="list-content box-border">
              <Content
                store={store}
                processeId={processeId}
                projectId={projectId}
              />
            </div>
          </Spin>
        ) : (
          <NoData
            text={intl
              .get('ide.src.business-component.tag-trend.tag-trend.o18ga4b3ils')
              .d('暂无数据')}
          />
        )}
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true, null, { visible: false })
  }, [])

  return <SchemaDetail {...props} projectId={projectId} />
}
