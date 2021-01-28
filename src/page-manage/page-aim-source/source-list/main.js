import intl from 'react-intl-universal'
/**
 * 目的源管理列表
 */
import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import {
  ListContent,
  projectProvider,
  OmitTooltip,
  Authority,
} from '../../../component'
import {Time} from '../../../common/util'
import seach from './search'
import AddSource from './drawer'
import DrawerTagConfig from '../tag-config'

import store from './store'

@observer
class SourceList extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-list.drawer.u411cezuxlh'
        )
        .d('目的源名称'),
      dataIndex: 'name',
      render: (text, record) => (
        <Link
          target="_blank"
          to={`/manage/aim-source/${record.id}/${store.projectId}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
        )
        .d('对象'),
      dataIndex: 'objName',
      render: text => <OmitTooltip maxWidth={100} text={text} />,
    },
    {
      title: intl
        .get('ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5')
        .d('数据表'),
      dataIndex: 'dataTableName',
      render: text => <OmitTooltip maxWidth={100} text={text} />,
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
        .d('数据源'),
      dataIndex: 'storageName',
      render: text => <OmitTooltip maxWidth={100} text={text} />,
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
        .d('数据源类型'),
      dataIndex: 'storageType',
    },
    {
      title: intl
        .get('ide.src.page-manage.page-aim-source.source-list.main.314snpt0uf6')
        .d('已映射/字段数'),
      dataIndex: 'tagUsedCount',
      render: (text, record) => `${record.tagUsedCount}/${record.fieldTotalCount}`,
    },
    {
      title: intl
        .get('ide.src.page-manage.page-aim-source.source-list.main.nfmxnys5ozt')
        .d('已被使用'),
      dataIndex: 'status',
      render: text => (text
        ? intl.get('ide.src.component.form-component.03xp8ux32s3a').d('是')
        : intl.get('ide.src.component.form-component.h7p1pcijouf').d('否')),
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
        )
        .d('创建时间'),
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      dataIndex: 'action',
      width: 200,
      render: (text, record) => (
        <Authority authCode="tag_model:update_tag_target[ud]">
          <div>
            <a href className="mr16" onClick={() => this.openTagConfig(record)}>
              {intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.6pm0gqavven'
                )
                .d('标签映射')}
            </a>
            {record.status ? (
              <span className="disabled">
                {intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi'
                  )
                  .d('删除')}
              </span>
            ) : (
              <Popconfirm
                placement="topRight"
                title={intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-list.main.uaj8a3mq69'
                  )
                  .d('你确定要删除该目的源吗？')}
                onConfirm={() => this.delItem(record.id)}
              >
                <a href>
                  {intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi'
                    )
                    .d('删除')}
                </a>
              </Popconfirm>
            )}
          </div>
        </Authority>
      ),
    },
  ]

  componentWillMount() {
    if (store.projectId) {
      store.getObjList()
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

  @action.bound addSource() {
    store.getStorageType()
    store.getUnderObjList()
    store.getDefaultStorage()
    store.visible = true
  }

  @action.bound openTagConfig(record) {
    store.drawerTagConfigInfo = record
    store.drawerVisible = true
  }

  // 删除目的源
  delItem = id => {
    store.delList(id)
  }

  render() {
    const {
      projectId,
      objList,
      drawerVisible,
      drawerTagConfigInfo,
      closeTagConfig,
      updateTagConfig,
    } = store

    const listConfig = {
      columns: this.columns,
      searchParams: seach({
        objList: toJS(objList),
      }),

      initParams: {projectId},
      buttons: [
        <Authority authCode="tag_model:create_target_source[c]">
          <Button type="primary" onClick={() => this.addSource()}>
            {intl
              .get(
                'ide.src.page-manage.page-aim-source.source-list.drawer.r6g2nr788q8'
              )
              .d('新建目的源')}
          </Button>
        </Authority>,
      ],

      store, // 必填属性
    }

    return (
      <div>
        <div className="content-header">
          {intl.get('ide.src.common.navList.f777ubhv3uk').d('目的源管理')}
        </div>
        <div className="header-page">
          <ListContent {...listConfig} />
        </div>
        <AddSource store={store} />
        <DrawerTagConfig
          visible={drawerVisible}
          info={drawerTagConfigInfo}
          onClose={closeTagConfig}
          onUpdate={updateTagConfig}
          projectId={store.projectId}
        />
      </div>
    )
  }
}

export default projectProvider(SourceList)
