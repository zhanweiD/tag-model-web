import {Component} from 'react'
import {observer} from 'mobx-react'
import {ListContent} from '../../../component'
import {Time} from '../../../common/util'

import store from './store-storage'

@observer
export default class StorageList extends Component {
  columns = [
    {
      title: '目的数据源',
      key: 'userName',
      dataIndex: 'userName',
    }, {
      title: '数据源类型',
      key: 'mobile',
      dataIndex: 'mobile',
    }, {
      title: '目的表',
      key: 'email',
      dataIndex: 'email',
    }, {
      title: '绑定字段',
      key: 'role',
      dataIndex: 'role',
    }, {
      title: '创建时间',
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '创建者',
      key: 'role',
      dataIndex: 'role',
    }, {
      title: '使用状态',
      key: 'role',
      dataIndex: 'role',
    },
  ]

  render() {
    const {tagId: id} = this.props
    
    const listConfig = {
      columns: this.columns,
      initParams: {id},
      store, // 必填属性
    }

    return (
      <div> 
        <ListContent {...listConfig} /> 
      </div>
    )
  }
}
