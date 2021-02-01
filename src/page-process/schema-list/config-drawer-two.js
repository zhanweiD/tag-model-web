import intl from 'react-intl-universal'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'antd'
import { action } from 'mobx'

import { ListContent } from '../../component'

@inject('store')
@observer
class ConfigDrawerTwo extends Component {
  constructor(props) {
    super(props)

    this.store = props.store
    this.listStore = props.listStore
  }

  columns = [
    {
      title: '',
      children: [
        {
          key: 'bfieldName',
          title: intl
            .get('ide.src.business-component.tag-relate.dag-box.bhzleo4vj5g')
            .d('字段'),
          dataIndex: 'bfieldName',
          width: 184,
        },
      ],
    },

    {
      title: intl
        .get('ide.src.page-process.schema-list.config-drawer-two.wgiytjvdtje')
        .d('更新前'),
      children: [
        {
          key: 'btagEnName',
          title: intl
            .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
            .d('标签标识'),
          dataIndex: 'btagEnName',
          width: 210,
          render: text => text || '-',
        },
        {
          key: 'btagName',
          title: intl
            .get(
              'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
            )
            .d('标签名称'),
          width: 210,
          dataIndex: 'btagName',
          render: text => text || '-',
        },
      ],
    },

    {
      title: intl
        .get('ide.src.page-process.schema-list.config-drawer-two.2mybooff8mq')
        .d('更新后'),
      children: [
        {
          key: 'tagEnName',
          title: intl
            .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
            .d('标签标识'),
          dataIndex: 'tagEnName',
          width: 210,
          render: text => text || '-',
        },
        {
          key: 'tagName',
          title: intl
            .get(
              'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
            )
            .d('标签名称'),
          width: 210,
          dataIndex: 'tagName',
          render: text => text || '-',
        },
      ],
    },
  ]

  @action closeDrawer = () => {
    this.listStore.getList()
    this.store.configDrawerVisible = false
  }
  @action preStep = () => {
    // this.store.list = this.store.allList
    this.store.currentStep = 0
    this.store.tabChange(1)
  }

  render() {
    const { tableLoading, currentStep } = this.store
    const listConfig = {
      tableLoading,
      bordered: true,
      columns: this.columns,
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store: this.store, // 必填属性
      paginationConfig: {
        hideOnSinglePage: true, // 只有一页时隐藏
      },
    }

    return (
      <div
        className="config-two"
        style={{ display: currentStep ? 'block' : 'none' }}
      >
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        <div className="bottom-button">
          <Button style={{ marginRight: 8 }} onClick={this.preStep}>
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field.m6ae9pj50gh'
              )
              .d('上一步')}
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => this.closeDrawer()}
          >
            {intl
              .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
              .d('关闭')}
          </Button>
        </div>
      </div>
    )
  }
}
export default ConfigDrawerTwo
