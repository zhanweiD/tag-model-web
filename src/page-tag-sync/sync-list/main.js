import {Component} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {Button} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent} from '../../component'
import {Time} from '../../common/util'
import seach from './search'
import DrawerAddSync from './drawer'

import store from './store'

@observer
export default class SourceList extends Component {
  columns = [{
    title: '计划名称',
    dataIndex: 'name',
    render: (text, record) => <Link to={`/tag-sync/${record.id}`}>{text}</Link>,
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
    title: '使用中/标签数',
    dataIndex: 'tagUsedCount',
    render: (text, record) => `${record.tagUsedCount}/${record.tagTotalCount}`,
  }, {
    title: '最近提交时间',
    dataIndex: 'lastSubmitTime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '最近运行状态',
    dataIndex: 'lastStatus',
  }, {
    title: '计划状态',
    dataIndex: 'status',
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    render: (text, record) => (
      <div>
        <a href onClick={() => {}}>启动</a>
        <a href onClick={() => {}}>启动</a>
      </div>
    ),
  }]

  @action.bound addSync() {
    store.visible = true
  }

  // 删除同步计划
  delItem = id => {
    store.delList(id)
  }

  render() {
    const listConfig = {
      columns: this.columns,
      searchParams: seach(),
      buttons: [<Button type="primary" onClick={() => this.addSync()}>添加同步计划</Button>],
      store, // 必填属性
    }

    return (
      <Provider bigStore={store}>
        <div className="page-sync-list">
          <div className="content-header">标签同步</div>
          <div className="list-content">
            <ListContent {...listConfig} />
          </div>
          <DrawerAddSync />
        </div>
      </Provider>
    )
  }
}
