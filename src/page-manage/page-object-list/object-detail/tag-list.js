import {Component} from 'react'
import {Input} from 'antd'
import {action} from 'mobx'
import {SearchOutlined} from '@ant-design/icons'
import {Time} from '../../../common/util'
import {ListContent} from '../../../component'

import store from './store-tag-list'

const {Search} = Input

export default class TagList extends Component {
  columns = [{
    title: '标签名称',
    dataIndex: 'name',
  }, {
    title: '绑定方式',
    dataIndex: 'configType',
    render: text => (text === 1 ? '衍生标签' : '基础标签'),
  }, {
    title: '标签标识',
    dataIndex: 'enName',
  }, {
    title: '数据类型',
    dataIndex: 'valueTypeName',
  }, {
    title: '所属项目',
    dataIndex: 'projectName',
  }, {
    title: '描述',
    dataIndex: 'descr',
    render: text => (text || '-'),
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    render: text => <Time timestamp={text} />,
  }]

  @action.bound onChange(e) {
    const keyword = e.target.value
    store.getList({
      currentPage: 1,
      keyword,
    })
  }

  render() {
    const {objId} = this.props
    const listConfig = {
      columns: this.columns,
      initParams: {objId: +objId},
      buttons: [<div className="pr24 far">
        {/* <Search
          placeholder="请输入标签名称关键字"
          onChange={e => this.onChange(e)}
          style={{width: 200}}
        /> */}
        <Input
          onChange={e => this.onChange(e)}
          style={{width: 200}}
          size="small"
          placeholder="请输入标签名称关键字"
          suffix={<SearchOutlined />}
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
