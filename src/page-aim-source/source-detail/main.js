import {Component, Fragment} from 'react'
import {Spin, Popconfirm} from 'antd'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {
  DetailHeader, ListContent, AuthBox, TabRoute,
} from '../../component'
import {Time} from '../../common/util'
import ModalTagConfig from './modal'

import store from './store'

const tabs = [{name: '字段列表', value: 1}]

@observer
export default class SourceDetail extends Component {
  @observable tabId = 1 // 当前详情tabID 

  columns = [{
    title: '字段名称',
    dataIndex: 'name',
  }, {
    title: '字段类型',
    dataIndex: 'name',
  }, {
    title: '字段描述',
    dataIndex: 'name',
  }, {
    title: '映射状态',
    dataIndex: 'name',
  }, {
    title: '标签状态',
    dataIndex: 'name',
  }, {
    title: '字段名称',
    dataIndex: 'name',
  }, {
    title: '标签名称',
    dataIndex: 'name',
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 100,
    render: (text, record) => (
      <Fragment>
        <a href>标签映射</a>
        <Popconfirm placement="topRight" title="你确定要取消该字段的标签映射吗？" onConfirm={() => this.delItem(record.id)}>
          <a href>取消映射</a>
        </Popconfirm>
      </Fragment>
     
    ), 
  }]

  @action.bound delItem(id) {
    store.delItem(id)
  } 

  render() {
    const {infoLoading, detail} = store

    const baseInfo = [{
      title: '同步对象',
      value: detail.name,
    }, {
      title: '创建人',
      value: detail.name,
    }, {
      title: '创建时间',
      value: <Time timestamp={detail.ctime} />,
    }, {
      title: '数据源类型',
      value: detail.name,
    }, {
      title: '数据源',
      value: detail.name,
    }, {
      title: '目的表',
      value: detail.name,
    }]

    const tabConfig = {
      tabs,
      currentTab: this.tabId,
      changeUrl: false,
    }

    const listConfig = {
      columns: this.columns,
      // initParams: {id},
      store, // 必填属性
    }

    return (
      <div className="page-source-detail">
        <Spin spinning={infoLoading}>
          <DetailHeader
            name={detail.name}
            descr={detail.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <div className="list-content">
          <TabRoute {...tabConfig} />
          <ListContent {...listConfig} />
        </div>
        <ModalTagConfig store={store} />
      </div>
    )
  }
}
