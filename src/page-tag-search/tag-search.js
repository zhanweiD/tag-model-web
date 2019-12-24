/**
 * @description 项目空间 - 标签搜索
 */
import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Button} from 'antd'
import {ListContent, Tag} from '../component'
import {getDataTypeName} from '../common/util'
import ModalApply from './modal-apply'

import store from './store'
import './main.styl'

import Search from './search'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  navListMap.space,
  navListMap.tagSearch,
]

const statusMap = {
  0: '有效',
  1: '有效',
  2: '无效',
}

@inject('frameChange')
@observer
export default class TagSearch extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.useProjectId = spaceInfo && spaceInfo.projectId
  }

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    // 获取所属对象下拉数据
  }

  columns = [
    {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
      render: (text, record) => (
        <div>
          <span>{text}</span>
          {
            record.status === 1 ? <Tag status="success" /> : null
          }
        </div>
      ),
    }, {
      key: 'enName',
      title: '唯一标识',
      dataIndex: 'enName',
    }, {
      key: 'valueType',
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    }, {
      key: 'objName',
      title: '对象名称',
      dataIndex: 'objName',
    }, {
      key: 'projectName',
      title: '所属项目',
      dataIndex: 'projectName',
    }, {
      key: 'status',
      title: '使用权限状态',
      dataIndex: 'status',
      render: text => statusMap[+text] || '无效',
    }, {
      key: 'action',
      title: '操作',
      width: 120,
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* eslint-disable-next-line no-underscore-dangle */}
          <a href={`${window.__onerConfig.pathPrefix}/tag-management#/${record.id}`}>标签详情</a>  
          <span className="table-action-line" />
          {
            record.status === 0 
              ? <a href onClick={() => this.openApplyModal(record)}>权限申请</a> 
              : <a href onClick={() => this.openSceneModal(record)}>添加到业务场景</a> 
          }
        </div>
      ),
    },
  ]

  @action.bound openApplyModal(data) {
    if (!store.projectName) {
      store.getProjectDetail()
    }
    store.tagIds.replace([data.id]) 
    store.modalApplyVisible = true
  }

  @action.bound openSceneModal() {
    store.occTags.replace([this.rowKeys]) 
    store.modalSceneVisible = true
  }


  @action.bound onTableCheck(selectedRowKeys, selectedRows) {
    // 表格 - 已选项
    store.selectedRows = selectedRows

    // 表格 - 已选项key数组
    store.rowKeys = selectedRowKeys
  }

  /**
   * @description 批量添加到业务场景
   */
  @action.bound batchAction() {
    store.tagIds.replace(store.rowKeys) 
    store.modalVisible = true
  }

  render() {
    const {useProjectId, list} = store

    const rowSelection = {
      selectedRowKeys: store.rowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: !record.status, // 标签权限状态为无效 不可添加到业务场景
      }),
    }

    const buttons = list.length ? [
      <Button type="primary" disabled={!store.rowKeys.length} onClick={this.batchAction}>批量添加到业务场景</Button>,
      <span className="ml8">
        已选择 
        <span style={{color: '#0078FF'}} className="mr4 ml4">{store.rowKeys.length}</span>
        项
      </span>,
    ] : null
  
    const listConfig = {
      columns: this.columns,
      initParams: {useProjectId},
      buttons,
      rowSelection,
      rowKey: 'id',
      store, // 必填属性
    }
    return (
      <div>
        <div className="content-header">{navListMap.tagSearch.text}</div>
        {
          useProjectId ? (
            <Fragment>
              <Search store={store} />
              <div className="search-list">
                <ListContent {...listConfig} />
                <ModalApply store={store} />
              </div>
            </Fragment>
          ) : null
        }
      </div>
    )
  }
}
