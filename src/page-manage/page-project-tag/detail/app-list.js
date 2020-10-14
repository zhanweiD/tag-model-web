import {Component} from 'react'
import {observer} from 'mobx-react'
import {ListContent} from '../../../component'
import {Time} from '../../../common/util'

import store from './store-app'
// 1场景 2群体 3数据查询
const appType = {
  1: '业务场景',
  2: '群体洞察',
  3: '数据查询',
} 

@observer
export default class AppList extends Component {
  columns = [
    {
      title: '标签应用名称',
      key: 'appName',
      dataIndex: 'appName',
    }, {
      title: '应用类型',
      key: 'type',
      dataIndex: 'type',
      render: text => <span>{appType[+text]}</span>,
    }, {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '创建者',
      key: 'cuserName',
      dataIndex: 'cuserName',
    },
    //  {
    //   title: '使用状态',
    //   key: 'ctime',
    //   dataIndex: 'ctime',
    //   render: text => <Time timestamp={text} />,
    // },
  ]

  render() {
    const {tagId, projectId} = this.props
    
    const listConfig = {
      columns: this.columns,
      initParams: {tagId, projectId},
      store, // 必填属性
    }

    return (
      <div> 
        <ListContent {...listConfig} /> 
      </div>
    )
  }
}
