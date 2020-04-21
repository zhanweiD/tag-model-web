import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent} from '../../component'
import {Time} from '../../common/util'
import seach from './search'
import AddSource from './drawer'
import DrawerTagConfig from '../tag-config'

import store from './store'

@observer
export default class SourceList extends Component {
  columns = [{
    title: '目的源名称',
    dataIndex: 'name',
    render: (text, record) => <Link to={`/aim-source/${record.id}`}>{text}</Link>,
  }, {
    title: '对象',
    dataIndex: 'objName',
  }, {
    title: '目的数据源',
    dataIndex: 'storageName',
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '已映射/字段数',
    dataIndex: 'tagUsedCount',
    render: (text, record) => `${record.tagUsedCount}/${record.fieldTotalCount}`,
  }, {
    title: '已被使用(字段未确定)',
    dataIndex: 'tagUsedCount',
  }, {
    title: '创建时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    render: (text, record) => (
      <div>
        <a href onClick={() => this.openTagConfig()}>标签映射</a>
        <span className="table-action-line" />
        <Popconfirm placement="topRight" title="你确定要删除该目的源吗？" onConfirm={() => this.delItem(record.id)}>
          <a href>删除</a>
        </Popconfirm>
      </div>
    ),
  }]

  @action.bound addSource() {
    store.visible = true
  }

  @action.bound openTagConfig() {
    store.drawerVisible = true
  }

  // 删除目的源
  delItem = id => {
    store.delList(id)
  }

  render() {
    const {
      drawerVisible,
      drawerTagConfigInfo,
      closeTagConfig,
      updateTagConfig,
    } = store

    const listConfig = {
      columns: this.columns,
      searchParams: seach(),
      buttons: [<Button type="primary" onClick={() => this.addSource()}>添加目的源</Button>],
      store, // 必填属性
    }

    return (
      <div className="page-aim-source">
        <div className="content-header">目的源管理</div>
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        <AddSource store={store} />
        <DrawerTagConfig
          projectId=""
          visible={drawerVisible}
          info={drawerTagConfigInfo}
          onClose={closeTagConfig}
          onUpdate={updateTagConfig}
        />
      </div>
     
    )
  }
}
