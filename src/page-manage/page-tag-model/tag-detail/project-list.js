import {Component} from 'react'
import {observer} from 'mobx-react'
import {ListContent} from '../../../component'
import {Time} from '../../../common/util'

import store from './store-project'

@observer
export default class ProjectList extends Component {
  columns = [
    {
      title: '项目名称',
      key: 'userName',
      dataIndex: 'userName',
    }, {
      title: '项目描述',
      key: 'mobile',
      dataIndex: 'mobile',
    }, {
      title: '申请时间',
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '加工方案引用数',
      key: 'role',
      dataIndex: 'role',
    }, {
      title: '标签应用数',
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
