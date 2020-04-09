import {Component} from 'react'
import {Popconfirm, Button} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {ListContent} from '../../component'
import {Time} from '../../common/util'
import ModalStotage from './modal-storage'
import ModalDetail from './modal-storage-detail'

import store from './store-storage'

@observer
export default class DataStorage extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }
  
  columns = [{
    title: '数据源名称',
    dataIndex: 'name',
    render: (text, record) => <a href onClick={() => this.viewDetail(record)}>{text}</a>,
  }, {
    title: '数据源类型',
    dataIndex: 'name',
  }, {
    title: '添加时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '使用状态',
    dataIndex: 'name',
  }, {
    title: '操作',
    dataIndex: 'action',
    render: (text, record) => (
      <Popconfirm placement="topRight" title="确认移除？" onConfirm={() => this.delList(record.id)}>
        <a href>移除</a>
      </Popconfirm>
    ),
  }]

  @action.bound viewDetail(data) {
    store.detail = data
    store.visibleDetail = true
  }

  @action.bound addList() {
    store.visible = true
  }

  @action.bound delList(id) {
    store.delList({
      id,
    })
  }

  render() {
    const {projectId: id, functionCodes} = this.props
    
    const listConfig = {
      columns: this.columns,
      initParams: {id},
      buttons: [<Button type="primary" onClick={this.addList}>
添加数据源
      </Button>],
      store, // 必填属性
    }

    return (
      <div> 
        <ListContent {...listConfig} />
        <ModalStotage store={store} />
        <ModalDetail store={store} />
      </div>
    )
  }
}
