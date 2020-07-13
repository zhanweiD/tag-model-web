import {Component} from 'react'
import {observer} from 'mobx-react'
import {Badge} from 'antd'
import {ListContent} from '../../../component'
import {Time} from '../../../common/util'

import store from './store-storage'

@observer
export default class StorageList extends Component {
  columns = [
    {
      title: '目的数据源',
      key: 'storageName',
      dataIndex: 'storageName',
    }, {
      title: '数据源类型',
      key: 'storageTypeName',
      dataIndex: 'storageTypeName',
    }, {
      title: '目的表',
      key: 'dataTableName',
      dataIndex: 'dataTableName',
    }, {
      title: '绑定字段',
      key: 'dataFieldName',
      dataIndex: 'dataFieldName',
    }, {
      title: '创建时间',
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '创建者',
      key: 'cuserName',
      dataIndex: 'cuserName',
    }, {
      title: '使用状态',
      key: 'status',
      dataIndex: 'status',
      render: text => (text ? <Badge color="#108ee9" text="使用中" /> : <Badge color="#d9d9d9" text="未使用" />),
    },
  ]

  render() {
    const {tagId} = this.props
    
    const listConfig = {
      columns: this.columns,
      initParams: {tagId},
      store, // 必填属性
    }

    return (
      <div> 
        <ListContent {...listConfig} /> 
      </div>
    )
  }
}
