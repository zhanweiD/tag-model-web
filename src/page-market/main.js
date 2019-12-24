/**
 * @description 标签集市
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {HashRouter as Router} from 'react-router-dom'
import {Button} from 'antd'
import Frame from '../frame'
import {ListContent, Tag, NoData} from '../component'
import {getDataTypeName} from '../common/util'
import Search from './search'
import Modal from './modal'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  navListMap.market,
]

@observer
export default class Market extends Component {
  componentWillMount() {
    // 请求项目列表，放在父组件进行请求是因为需要在外层做空数据判断。
    // 若返回数据为空[]。则渲染 NoData 组件。
    // 要是请求放在列表组件ListContent中的话, 就必须渲染表格的dom 影响体验
    store.getList()
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
            record.status === 1 ? <Tag status="success" className="ml8" text="审批中" /> : null
          }
        </div>
      ),
    }, {
      key: 'enName',
      title: '唯一标识',
      dataIndex: 'enName',
    }, {
      key: 'objName',
      title: '对象',
      dataIndex: 'objName',
    }, {
      key: 'valueType',
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    }, {
      key: 'projectName',
      title: '所属项目',
      dataIndex: 'projectName',
    }, {
      key: 'action',
      title: '操作',
      width: 120,
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* eslint-disable-next-line no-underscore-dangle */}
          <a href={`${window.__onerConfig.pathPrefix}/tag-management#/${record.id}`}>查看详情</a>  
          <span className="table-action-line" />
          <a href onClick={() => this.openModal(record)} className={record.status ? 'disabled' : ''}>申请</a>
        </div>
      ),
    },
  ]

  @action.bound openModal(data) {
    store.tagIds.replace([data.id]) 
    store.modalVisible = true
  }

  @action.bound onTableCheck(selectedRowKeys, selectedRows) {
    // 表格 - 已选项
    store.selectedRows = selectedRows

    // 表格 - 已选项key数组
    store.rowKeys = selectedRowKeys
  }

  /**
   * @description 批量申请
   */
  @action.bound batchApply() {
    store.tagIds.replace(store.rowKeys) 
    store.modalVisible = true
  }

  // 跳转到标签管理
  goTagManager = () => {
    window.location.href = `${window.__onerConfig.pathPrefix || '/'}/tag-management`
  }

  // 是否有进行搜索操作
  isSearch = () => {
    const {
      hotWord, 
      objectId,
      useProjectId, 
      ownProjectId,
      projectPermission,
    } = store

    if (
      typeof hotWord === 'undefined'
    && useProjectId === ''
    && objectId === ''
    && typeof projectPermission === 'undefined'
    && ownProjectId === ''
    ) {
      return false
    }

    return true
  }

  render() {
    const {
      useProjectId, 
      tableLoading, 
      list,
    } = store

    const rowSelection = {
      selectedRowKeys: store.rowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.status, // 权限审批中的，不可进行申请、批量申请，且显示审批中
      }),
    }
  
    const listConfig = {
      columns: this.columns,
      buttons: useProjectId ? [
        <Button type="primary" disabled={!store.rowKeys.length} onClick={this.batchApply}>批量申请</Button>,
        <span className="ml8">
          已选择 
          <span style={{color: '#0078FF'}} className="mr4 ml4">{store.rowKeys.length}</span>
          项
        </span>,
      ] : null,
      rowSelection: useProjectId ? rowSelection : null,
      rowKey: 'id',
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    const noDataConfig = {
      btnText: '去上架标签',
      onClick: this.goTagManager,
      text: '没有任何公开标签，去标签管理上架标签吧!',
    }

    return (
      <Router>
        <Frame navList={navList}>
          <div>
            <div className="content-header">{navListMap.market.text}</div>
            {
              !list.length && !this.isSearch() ? (
                <NoData
                  isLoading={tableLoading}
                  {...noDataConfig}
                />
               
              ) : (
                <Fragment>
                  <Search store={store} />
                  <div className="search-list">
                    <ListContent {...listConfig} />
                    <Modal store={store} />
                  </div>
                </Fragment>
              )
            }
          </div>
        </Frame>
      </Router>
     
    )
  }
}
