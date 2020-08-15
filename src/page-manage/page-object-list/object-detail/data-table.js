import {Component} from 'react'
import {Input} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {SearchOutlined} from '@ant-design/icons'

import {Time} from '../../../common/util'
import {ListContent} from '../../../component'
import store from './store-table'

const {Search} = Input

@observer
export default class DataTable extends Component {
  columns = [{
    title: '数据表',
    dataIndex: 'tableName',
  }, {
    title: '数据源',
    dataIndex: 'storageName',
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '添加项目',
    dataIndex: 'projectName',
  }, {
    title: '标签数/字段数',
    dataIndex: 'tagCount',
    render: (text, record) => `${text}/${record.fieldCount}`,
  }, {
    title: '添加时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }]
  
  simpleColumns = [{
    title: '数据表',
    dataIndex: 'tableName',
  }, {
    title: '数据源',
    dataIndex: 'storageName',
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '添加项目',
    dataIndex: 'projectName',
  }, {
    title: '添加时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '标签/字段数',
    dataIndex: 'tagCount',
    render: (text, record) => `${record.tagCount}/${record.fieldCount}`,
  }]

  @action.bound onChange(e) {
    const keyword = e.target.value
    store.getList({
      currentPage: 1,
      keyword,
    })
  }

  render() {
    const {objId, type} = this.props
    const listConfig = {
      columns: +type ? this.columns : this.simpleColumns,
      initParams: {objId: +objId},
      buttons: [<div className="pr24 far">
        {/* <Search
          placeholder="请输入数据表名称关键字"
          onChange={e => this.onChange(e)}
          style={{width: 200}}
          size="small"
        /> */}
        <Input
          onChange={e => this.onChange(e)}
          style={{width: 200}}
          size="small"
          placeholder="请输入数据表名称关键字"
          suffix={<SearchOutlined />}
        />
      </div>],
      store,
    }
    return (
      <div className="pt16">
        <ListContent {...listConfig} />
      </div>
    )
  }
}
