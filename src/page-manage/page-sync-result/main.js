import intl from 'react-intl-universal'

/**
 * @description 同步结果
 */
import {Component} from 'react'
import {toJS, action} from 'mobx'
import {observer} from 'mobx-react'
import {Badge} from 'antd'
import {ListContent, projectProvider, OmitTooltip} from '../../component'
import seach from './search'

import store from './store'

@observer
class SyncResult extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'tagName',
      fixed: 'left',
      render: v => <OmitTooltip maxWidth={250} text={v} />,
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
        .d('标签标识'),
      dataIndex: 'enName',
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
        .d('数据类型'),
      dataIndex: 'tagType',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.main.9c8ou0oxjir'
        )
        .d('对象名称'),
      dataIndex: 'objName',
      render: v => <OmitTooltip maxWidth={250} text={v} />,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-project-tag.detail.storage-list.di8idc2fun'
        )
        .d('目的数据源'),
      dataIndex: 'storageName',
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
        .d('数据源类型'),
      dataIndex: 'storageType',
    },
    {
      title: intl.get('ide.src.common.navList.5pko0l7i7qx').d('同步计划'),
      dataIndex: 'tagTransferSchemeName',
      render: v => <OmitTooltip maxWidth={250} text={v} />,
    },

    //  {
    //   title: '最近一次更新时间',
    //   dataIndex: 'lastUpdateTime',
    //   render: text => <Time timestamp={text} />,
    // },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.4eyw4o6e3dr')
        .d('使用状态'),
      dataIndex: 'tagUsed',
      render: text => (text
        === intl
          .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
          .d('使用中') ? (
          <Badge
              color="#87d068"
              text={intl
              .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
              .d('使用中')}
            />
        ) : (
          <Badge
            color="#d9d9d9"
            text={intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用')}
          />
        )),
    },
  ]

  componentWillMount() {
    if (store.projectId) {
      store.getObjList()
      store.getStorageList()
      this.initData()
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.list.clear()
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  render() {
    const {objList, storageList, projectId} = store
    const listConfig = {
      columns: this.columns,
      scroll: {x: 1000},
      initParams: {projectId},
      searchParams: seach({
        objList: toJS(objList),
        storageList: toJS(storageList),
      }),
      store, // 必填属性
    }

    return (
      <div>
        <div className="content-header">
          {intl.get('ide.src.common.navList.popzae466x').d('同步结果')}
        </div>
        <div className="header-page">
          <ListContent {...listConfig} />
        </div>
      </div>
    )
  }
}

export default projectProvider(SyncResult)
