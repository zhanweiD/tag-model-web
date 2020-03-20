/**
 * @description  标签仓库
 */
import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action} from 'mobx'
import * as navListMap from '../common/navList'
import {
  ListContent, Loading, NoData, OmitTooltip, AuthBox,
} from '../component'
import {getDataTypeName} from '../common/util'
import ModalApply from './modal-apply'
import ModalScene from './modal-scene'

import store from './store'
import './main.styl'

import Search from './search'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.tagManagement,
  navListMap.tagWarehouse,
]

const statusMap = {
  0: '有效',
  1: '有效',
  2: '失效',
}

@inject('frameChange')
@observer
export default class TagWarehouse extends Component {
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

    if (store.useProjectId) {
      store.getAuthCode()
    }
  }

  componentDidMount() {
    if (store.useProjectId) {
      // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
    // 若返回数据为空[]。则渲染 NoData 组件。
    // 要是请求放在列表组件ListContent中的话, 就必须渲染表格的dom 影响体验
      store.getList({
        useProjectId: store.useProjectId,
      })
      // 设置列表默认参数；因为列表请求放在列表组件外部，所以 设置默认参数也在列表组件外部
      store.initParams = {
        useProjectId: store.useProjectId,
      }
    }
    store.tableLoading = true
  }

  componentWillUnmount() {
    store.tagIds.clear()
    store.selectedRows.clear()
    store.rowKeys.clear()
    store.expand = false
    store.permissionType = '' // 使用权限状态
    store.ownProjectId = '' // 所属项目id
    store.objectId = '' // 对象id
    store.hotWord = undefined // 关键词
    store.selectItem = {}
    store.sceneType = undefined
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  columns = [
    {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
      render: text => <OmitTooltip maxWidth={120} text={text} />,
    }, {
      key: 'enName',
      title: '唯一标识',
      dataIndex: 'enName',
      render: text => <OmitTooltip maxWidth={120} text={text} />,
    }, {
      key: 'valueType',
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    }, {
      key: 'objName',
      title: '对象名称',
      dataIndex: 'objName',
      render: text => <OmitTooltip maxWidth={120} text={text} />,
    }, {
      key: 'projectName',
      title: '所属项目',
      dataIndex: 'projectName',
      render: text => <OmitTooltip maxWidth={120} text={text} />,
    }, {
      key: 'status',
      title: '使用权限状态',
      dataIndex: 'status',
      render: text => statusMap[+text] || '失效',
    }, {
      key: 'action',
      title: '操作',
      width: 120,
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* eslint-disable-next-line no-underscore-dangle */}
          <a href={`${window.__keeper.pathHrefPrefix}/tag-model#/${record.id}`}>标签详情</a>
          <AuthBox 
            code="asset_tag_project_tag_search_add_occ" 
            myFunctionCodes={store.functionCodes}
            isButton={false}
          >
            <span className="table-action-line" />

            {
              record.status === 2
                ? <a href onClick={() => this.openApplyModal(record)}>权限申请</a>
                : <a href onClick={() => this.openSceneModal(record)}>添加到业务场景</a>
            }
          </AuthBox>
        
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

  @action.bound openSceneModal(data) {
    store.selectItem = data
    store.sceneType = 'one'
    store.getSceneList({
      objId: data.objId,
    })
    store.tagIds.replace([this.rowKeys])
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
    store.getSceneList()
    store.sceneType = 'batch'
    store.tagIds.replace(store.rowKeys)
    store.modalSceneVisible = true
  }

  // 是否有进行搜索操作
  isSearch = () => {
    const {
      hotWord,
      objectId,
      ownProjectId,
      // projectPermission,
    } = store

    if (
      typeof hotWord === 'undefined'
      && ownProjectId === ''
      && objectId === ''
    ) {
      return false
    }
    return true
  }


  // 跳转到项目列表
  goProjectList = () => {
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/project`
  }

  // 跳转到标签管理
  goTagManager = () => {
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/tag-model`
  }

  renderNodata = () => {
    const {spaceInfo} = window

    const noProjectDataConfig = {
      btnText: '去创建项目',
      onClick: this.goProjectList,
      text: '没有任何项目，去项目列表页创建项目吧！',
      code: 'asset_tag_project_add',
      noAuthText: '没有任何项目',
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
    const {
      useProjectId, list, objectId, functionCodes, tableLoading,
    } = store

    const rowSelection = objectId && functionCodes.includes('asset_tag_project_tag_search_add_occ') ? {
      selectedRowKeys: store.rowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.status === 2, // 标签权限状态为无效 不可添加到业务场景
      }),
    } : null

    const buttons = list.length && objectId ? [
      <AuthBox 
        code="asset_tag_project_tag_search_add_occ" 
        myFunctionCodes={functionCodes}
        type="primary"
        disabled={!store.rowKeys.length} 
        onClick={this.batchAction}
      >
        批量添加到业务场景

      </AuthBox>,
      <AuthBox 
        code="asset_tag_project_tag_search_add_occ" 
        myFunctionCodes={functionCodes}
        isButton={false}
      >
        <span className="ml8">
          已选择
          <span style={{color: '#0078FF'}} className="mr4 ml4">{store.rowKeys.length}</span>
          项
        </span>
      </AuthBox>,    
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

    const noDataConfig = {
      btnText: '去创建标签',
      onClick: this.goTagManager,
      text: '没有任何标签，去标签模型创建标签吧!',
      code: 'asset_tag_project_tag_operator',
      noAuthText: '没有任何标签',
      myFunctionCodes: functionCodes,
    }

    const {spaceInfo} = window
    
    return (
      <div>
        <div className="content-header">{navListMap.tagWarehouse.text}</div>
        {
          spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length ? (
            <div>
              {
                !list.length && !this.isSearch() ? (
                  <NoData
                    isLoading={tableLoading}
                    {...noDataConfig}
                  />
                ) : (
                  <Fragment>
                    <Search store={store} />
                    <div className="search-list open-height">
                      <ListContent {...listConfig} />
                      <ModalApply store={store} />
                      <ModalScene store={store} />
                    </div>
                  </Fragment>
                ) 
              }  
            </div>
          ) : this.renderNodata()
        }
      </div>
    )
  }
}
