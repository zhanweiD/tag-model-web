import {Component} from 'react'
import {Button} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Time} from '../../common/util'
import {ListContent} from '../../component'
import ModalResource from './modal-resource'

import store from './store-resource'

@observer
export default class ResourceGroup extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }
  
  columns = [{
    title: '资源组名称',
    dataIndex: 'name',
  }, {
    title: '服务器数',
    dataIndex: 'name',
  }, {
    title: '总任务数',
    dataIndex: 'name',
  }, {
    title: '运行任务数',
    dataIndex: 'name',
  }, {
    title: '修改时间',
    dataIndex: 'mtime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '操作',
    dataIndex: 'action',
    render: () => <a href>查看</a>,
  }]

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
添加资源组
      </Button>],
      store, // 必填属性
    }

    return (
      <div> 
        <ListContent {...listConfig} />
        <ModalResource store={store} />
      </div>
    )
  }
}
