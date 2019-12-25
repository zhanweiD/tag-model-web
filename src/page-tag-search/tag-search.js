/**
 * @description 项目空间 - 标签搜索
 */
import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import {Button} from 'antd'
import {
  ListContent, Tag, Loading, NoData,
} from '../component'
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

    // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
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
          <span className="mr8">{text}</span>
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


  // 跳转到项目列表
  goProjectList = () => {
    window.location.href = `${window.__onerConfig.pathPrefix || '/'}/project`
  }

  renderNodata = () => {
    const {spaceInfo} = window

    const noProjectDataConfig = {
      btnText: '去创建项目',
      onClick: this.goProjectList,
      text: '没有任何项目，去项目列表页创建项目吧！',
    }

    if (spaceInfo && spaceInfo.finish && !spaceInfo.projectList.length) {
      return (
        <NoData
          {...noProjectDataConfig}
        />
      )
    }

    return <Loading mode="block" height={200} />
  }


  render() {
    const {useProjectId, list} = store

    const rowSelection = {
      selectedRowKeys: store.rowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.status === 2, // 标签权限状态为无效 不可添加到业务场景
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
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    const {spaceInfo} = window

    return (
      <div>
        <div className="content-header">{navListMap.tagSearch.text}</div>
        {
          spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length ? (
            <Fragment>
              <Search store={store} />
              <div className="search-list">
                <ListContent {...listConfig} />
                <ModalApply store={store} />
              </div>
            </Fragment>
          ) : this.renderNodata()
        }
      </div>
    )
  }
}