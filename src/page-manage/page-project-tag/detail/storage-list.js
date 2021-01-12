import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Badge } from 'antd'
import { ListContent } from '../../../component'
import { Time } from '../../../common/util'

import store from './store-storage'

@observer
class StorageList extends Component {
  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-project-tag.detail.storage-list.di8idc2fun'
        )
        .d('目的数据源'),
      key: 'storageName',
      dataIndex: 'storageName',
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.1b0l5lpgghm')
        .d('数据源类型'),
      key: 'storageTypeName',
      dataIndex: 'storageTypeName',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.vzwvcfbgza'
        )
        .d('目的表'),
      key: 'dataTableName',
      dataIndex: 'dataTableName',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-project-tag.detail.storage-list.8biidsm1yn4'
        )
        .d('绑定字段'),
      key: 'dataFieldName',
      dataIndex: 'dataFieldName',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
        )
        .d('创建时间'),
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get('ide.src.page-manage.page-common-tag.detail.main.hv8quje3qk')
        .d('创建者'),
      key: 'cuserName',
      dataIndex: 'cuserName',
    },
    {
      title: intl
        .get('ide.src.page-config.workspace-config.main.4eyw4o6e3dr')
        .d('使用状态'),
      key: 'status',
      dataIndex: 'status',
      render: text =>
        text ? (
          <Badge
            color="#108ee9"
            text={intl
              .get('ide.src.page-config.workspace-config.main.ztbqzsc34bb')
              .d('使用中')}
          />
        ) : (
          <Badge
            color="#d9d9d9"
            text={intl.get('ide.src.component.tag.tag.ogvpoe5m3bg').d('未使用')}
          />
        ),
    },
  ]

  render() {
    const { tagId, projectId } = this.props

    const listConfig = {
      columns: this.columns,
      initParams: { tagId, projectId },
      store, // 必填属性
    }

    return (
      <div>
        <ListContent {...listConfig} />
      </div>
    )
  }
}
export default StorageList
