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
      key: 'userName',
      dataIndex: 'userName',
    }, {
      title: '应用类型',
      key: 'mobile',
      dataIndex: 'mobile',
    }, {
      title: '创建时间',
      key: 'email',
      dataIndex: 'email',
    }, {
      title: '创建者',
      key: 'role',
      dataIndex: 'role',
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
