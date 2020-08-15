import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Button} from 'antd'
import {action} from 'mobx'

import {ListContent} from '../../component'

@inject('store')
@observer
export default class ConfigDrawerTwo extends Component {
  constructor(props) {
    super(props)

    this.store = props.store
  }

  columns = [{
    title: '更新前',
    children: [
      {
        key: 'bfieldName',
        title: '字段',
        dataIndex: 'bfieldName',
      }, {
        key: 'btagEnName',
        title: '唯一标识',
        dataIndex: 'btagEnName',
      }, {
        key: 'btagName',
        title: '标签名称',
        dataIndex: 'btagName',
      }, 
    ],
  }, {
    title: '更新后',
    children: [
      {
        key: 'fieldName',
        title: '字段',
        dataIndex: 'fieldName',
      }, {
        key: 'tagEnName',
        title: '唯一标识',
        dataIndex: 'tagEnName',
      }, {
        key: 'tagName',
        title: '标签名称',
        dataIndex: 'tagName',
      }, 
    ],
  }]
  @action closeDrawer = () => {
    this.store.configDrawerVisible = false
  }
  @action preStep = () => {
    // this.store.list = this.store.allList
    this.store.currentStep = 0
    this.store.tabChange(1)
  }
  
  render() {
    const {
      tableLoading,
      currentStep,
    } = this.store

    const listConfig = {
      tableLoading,
      // bordered: true,
      columns: this.columns,
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store: this.store, // 必填属性
    }
    return (
      <div className="config-two" style={{display: currentStep ? 'block' : 'none'}}>
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.preStep}>
            上一步
          </Button>
          <Button type="primary" style={{marginRight: 8}} onClick={() => this.closeDrawer()}>
            关闭
          </Button>
        </div>
      </div>
    )
  }
}
