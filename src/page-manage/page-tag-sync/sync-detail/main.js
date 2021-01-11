import intl from 'react-intl-universal'
/**
 * @description 标签同步详情
 */
import { Component, useEffect } from 'react'
import { Spin } from 'antd'
import { action, observable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import OnerFrame from '@dtwave/oner-frame'
import { DetailHeader, TabRoute, Tag } from '../../../component'
import { Time, codeInProduct } from '../../../common/util'
import ConfigInfo from './config-info'
import RunRecord from './run-record'

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
class SyncDetail extends Component {
  constructor(props) {
    super(props)
    const { match } = props
    store.syncId = match.params.id

    store.projectId = match.params.projectId
    // runStore.projectId = props.projectId

    // console.log(toJS(store.projectId), toJS(props.projectId))
  }

  componentWillMount() {
    store.getDetail()
    store.getConfigInfo()
  }

  @observable tabId = 0 // 当前详情tabID

  @action.bound changeTab(id) {
    this.tabId = id
  }

  getTabCode = () => {
    if (codeInProduct('tag_model:transfer_submit_log[r]')) {
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
    const { infoLoading, detail, syncId, projectId } = store

    const baseInfo = [
      {
        title: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.64wlzv1scpk'
          )
          .d('同步对象'),
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
          .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
          .d('数据源类型'),
        value: detail.storageTypeName,
      },
      {
        title: intl
          .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
          .d('数据源'),
        value: detail.storageName,
      },
    ]

    const tabConfig = {
      tabs: this.getTabCode(),
      currentTab: this.tabId,
      changeTab: this.changeTab,
      changeUrl: false,
    }

    const Content = [ConfigInfo, RunRecord][+this.tabId]

    // 不同状态的相应map
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
      3: (
        <Tag
          status="process"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.huk8rr9jxlj'
            )
            .d('提交中')}
        />
      ),
      4: (
        <Tag
          status="success"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.0doda0qa0mh'
            )
            .d('更新成功')}
        />
      ),
      5: (
        <Tag
          status="error"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.xsc1gk9ooy'
            )
            .d('更新失败')}
        />
      ),
      6: (
        <Tag
          status="process"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.kl5h1dt6a5o'
            )
            .d('更新中')}
        />
      ),
      7: (
        <Tag
          status="default"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-sync.sync-detail.main.rjxbzeiw5pg'
            )
            .d('未完成')}
        />
      ),
    }

    return (
      <div className="page-sync-detail">
        <Spin spinning={infoLoading}>
          <DetailHeader
            name={detail.name}
            descr={detail.descr}
            baseInfo={baseInfo}
            tag={tagMap[detail.status] || null}
          />
        </Spin>
        <div className="list-content box-border">
          <TabRoute {...tabConfig} />
          <Content store={store} syncId={syncId} projectId={projectId} />
        </div>
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

  return <SyncDetail {...props} projectId={projectId} />
}
