import {Component} from 'react'
import {Button, Badge} from 'antd'
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
    dataIndex: 'storageName',
    render: (text, record) => <a href onClick={() => this.viewDetail(record)}>{text}</a>,
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '添加时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '使用状态',
    dataIndex: 'status',
    render: status => {
      let color 
      let text
      switch (status) {
        case '使用中': color = '#87d068'; text = '使用中'; break
        case '未使用': color = '#d9d9d9'; text = '未使用'; break
        default: color = '#d9d9d9'; text = '未使用'; break
      }
    
      return <Badge color={color} text={text} />
    }, 
  }]

  @action.bound viewDetail(data) {
    store.getStorageDetail({
      dataStorageId: data.storageId,
    })
    store.visibleDetail = true
  }

  @action.bound addList() {
    store.getStorageType()
    store.visible = true
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
