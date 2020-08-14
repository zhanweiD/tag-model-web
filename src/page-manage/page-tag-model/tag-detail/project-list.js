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
      key: 'name',
      dataIndex: 'name',
    }, {
      title: '项目描述',
      key: 'descr',
      dataIndex: 'descr',
    }, {
      title: '申请时间',
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '加工方案引用数',
      key: 'derivativeCount',
      dataIndex: 'derivativeCount',
    }, {
      title: '标签应用数',
      key: 'tagAppCount',
      dataIndex: 'tagAppCount',
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
