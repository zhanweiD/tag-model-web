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

  columns = [
    {
      key: 'name',
      title: '字段',
      dataIndex: 'name',
    }, {
      key: 'objName',
      title: '唯一标识',
      dataIndex: 'objName',
    }, {
      key: 'lastCount',
      title: '标签名称',
      dataIndex: 'lastCount',
    }, 
  ]
  @action closeDrawer = () => {
    this.store.configDrawerVisible = false
  }
  @action preStep = () => {
    this.store.list = this.store.saveList
    this.store.currentStep = 0
  }
  
  render() {
    const {
      tableLoading,
      currentStep,
    } = this.store

    const listConfig = {
      tableLoading,
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
          <Button type="primary" style={{marginRight: 8}} onClick={this.preStep}>
            上一步
          </Button>
          <Button style={{marginRight: 8}} onClick={() => this.closeDrawer()}>
            关闭
          </Button>
        </div>
      </div>
    )
  }
}
