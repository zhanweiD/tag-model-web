import {Component} from 'react'
import {Input} from 'antd'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Time} from '../../../common/util'
import {ListContent} from '../../../component'

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
  }, {
    title: '所有者',
    dataIndex: 'creator',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '生产基础标签/衍生标签',
    dataIndex: 'descr',
  }, {
    title: '使用标签数',
    dataIndex: 'descr',
  }]

  simpleColumns = [{
    title: '项目名称',
    dataIndex: 'name',
  }, {
    title: '项目描述',
    dataIndex: 'descr',
  }, {
    title: '所有者',
    dataIndex: 'creator',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    render: text => <Time timestamp={text} />,
  }]

  @action.bound onChange(v) {
    const keyword = e.target.value
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
        <Search
          placeholder="请输入项目名称关键字"
          onChange={e => this.onChange(e)}
          style={{width: 200}}
        />
                </div>],
      store,
    }

    return (
      <div className="pt16">
        <ListContent {...listConfig} />
      </div>
    )
  }
}
