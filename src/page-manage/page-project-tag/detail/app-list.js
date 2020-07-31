import {Component} from 'react'
import {observer} from 'mobx-react'
import {ListContent} from '../../../component'
import {Time} from '../../../common/util'

import store from './store-app'

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
      render: text => (text === 1 ? '业务场景' : ''),
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
