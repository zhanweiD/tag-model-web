import {Component} from 'react'
// import {Button} from 'antd'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Time} from '../../common/util'
import {ListContent} from '../../component'

import store from './store-run-record'

@observer
export default class RunRecord extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }
  
  columns = [{
    title: '记录ID',
    dataIndex: 'name',
  }, {
    title: '运行开始时间',
    dataIndex: 'mtime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '运行结束时间',
    dataIndex: 'mtime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '运行状态',
    dataIndex: 'mtime',
  }, {
    title: '操作',
    dataIndex: 'action',
    render: () => <a href>查看</a>,
  }]

  render() {
    // const {projectId: id} = this.props
    
    const listConfig = {
      columns: this.columns,
      // initParams: {id},
      store, // 必填属性
    }

    return (
      <div> 
        <ListContent {...listConfig} />
      </div>
    )
  }
}
