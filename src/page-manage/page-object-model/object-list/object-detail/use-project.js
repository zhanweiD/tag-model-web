import {Component} from 'react'
import {Input} from 'antd'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {SearchOutlined} from '@ant-design/icons'
import {Time} from '../../../../common/util'
import {ListContent} from '../../../../component'

import store from './store-project'

const {Search} = Input

@observer
export default class UseProject extends Component {
  columns = [{
    title: '项目名称',
    dataIndex: 'name',
  }, {
    title: '项目描述',
    dataIndex: 'descr',
    render: text => (text || '-'),
  }, {
    title: '所有者',
    dataIndex: 'cuserName',
  }, {
    title: '创建时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '生产基础标签/衍生标签',
    dataIndex: 'descr',
    render: (text, record) => `${record.basicCount}/${record.produceCount}`,
  }, {
    title: '使用标签数',
    dataIndex: 'usedCount',
  }]

  simpleColumns = [{
    title: '项目名称',
    dataIndex: 'name',
  }, {
    title: '项目描述',
    dataIndex: 'descr',
    render: text => (text || '-'),
  }, {
    title: '所有者',
    dataIndex: 'cuserName',
  }, {
    title: '创建时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }]

  // componentDidMount() {
  //   this.store.getList()
  // }

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    if (!_.isEqual(updateDetailKey, next.updateDetailKey) || !_.isEqual(+objId, +next.objId)) {
      store.getList({objId: next.objId})
    }
  }
  
  @action.bound onChange(v) {
    const keyword = v.target.value
    store.getList({
      currentPage: 1,
      keyword,
    })
  }

  render() {
    const {type, objId} = this.props
    
    const listConfig = {
      columns: +type ? this.columns : this.simpleColumns,
      initParams: {objId: +objId},
      buttons: [<div className="pr24 far">
        {/* <Search
          placeholder="请输入项目名称关键字"
          onChange={e => this.onChange(e)}
          style={{width: 200}}
        /> */}
        <Input
          size="small"
          onChange={e => this.onChange(e)}
          placeholder="请输入项目名称关键字"
          style={{width: 200}}
          suffix={<SearchOutlined />}
        />
      </div>],
      store,
    }

    return (
      <div>
        <ListContent {...listConfig} />
      </div>
    )
  }
}
