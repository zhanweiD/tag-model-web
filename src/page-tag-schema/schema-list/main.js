/**
 * @description 标签加工列表
 */
import {Component, Fragment} from 'react'
import {action} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import * as navListMap from '../../common/navList'
import {
  ListContent, AuthBox, NoData, Loading,
} from '../../component'
import seach from './search'
import DrawerConfig from './drawer' 
import ModalSubmitLog from './modal-submit-log'
import {
  getSchemeStatus, 
  getSchemeRunStatus,
  scheduleTypeObj,
  schemeTypeObj,
} from '../util'

import Store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.tagSchema,
  {text: navListMap.schemaList.text},
]

@inject('frameChange')
@observer
class SchemaList extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    this.projectId = spaceInfo && spaceInfo.projectId

    this.rootStore = new Store()
    const {
      listStore,
      drawerStore, 
    } = this.rootStore

    this.drawerStore = drawerStore
    this.store = listStore
    this.store.projectId = spaceInfo && spaceInfo.projectId


    if (spaceInfo && spaceInfo.projectId) {
      listStore.getAuthCode()
    }
  }

  columns = [
    {
      title: '加工方案',
      dataIndex: 'name',
    }, {
      title: '对象',
      dataIndex: 'objName',
    }, {
      title: '方案类型',
      dataIndex: 'type',
      render: text => <span>{schemeTypeObj[text]}</span>, 
    }, {
      title: '调度类型',
      dataIndex: 'scheduleType',
      render: text => <span>{scheduleTypeObj[text]}</span>, 

    }, {
      title: '标签数/字段数',
      dataIndex: 'tagCount',
      render: (text, render) => `${render.tagCount}/${render.fieldCount}`,
    }, {
      title: '方案状态',
      dataIndex: 'status',
      render: (v, r) => getSchemeStatus({status: v}, () => this.getSubmitLog({
        id: r.id,
      })),
    }, {
      title: '最近运行状态',
      dataIndex: 'lastStatus',
      render: (v, r) => (v === null ? '' : getSchemeRunStatus({status: v}, () => this.getSubmitLog({
        id: r.id,
      }))),
    }, {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      render: (text, record) => (
        <AuthBox
          code="asset_tag_project_scheme_operator" 
          myFunctionCodes={this.store.functionCodes}
          isButton={false}
        >
          <div>
            {/* 方案状态: 提交成功  操作: 查看 */}
            {
              (record.status === 1) && (
                <Fragment>
                  <Link to={`/detail/${record.id}`}> 查看</Link>
                  <span className="table-action-line" />
                </Fragment>
              )
            }

            {/* 方案状态: 未完成/提交失败  操作: 编辑 */} 
            {
              (record.status === 0 || record.status === 2) && (
                <Fragment>
                  <a href onClick={() => this.edit(record)}>编辑</a>
                  <span className="table-action-line" />
                </Fragment>
              )
            }
            
            {/* 方案状态: 提交成功 调度类型: 周期调度  操作: 禁止执行 */}
            {
              (record.status === 1 && record.scheduleType === 1) && (
                <Fragment>
                  <span className="disabled">执行</span>
                  <span className="table-action-line" />
                </Fragment>
             
              )
            }

            {/* 方案状态: 提交成功 调度类型:手动执行   操作: 执行 */}
            {
              (record.status === 1 && record.scheduleType === 2) && (
                <Fragment>
                  <Popconfirm placement="topRight" title="你确定要执行吗？" onConfirm={() => this.operation(record)}>
                    <a href>执行</a>
                  </Popconfirm>
                  <span className="table-action-line" />
                </Fragment>
             
              )
            }
            {/* 方案状态: 提交成功 调度类型:周期执行 运行状态  操作: 删除 */}
            {
              (record.status === 1 && (record.tagCount || record.lastStatus === 1)) ? <span className="disabled">删除</span> : (
                <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.remove(record)}>
                  <a href>删除</a>
                </Popconfirm>
              )
            }
          
           
            <span className="table-action-line" />
            <Popconfirm placement="topRight" title="你确定要克隆吗？" onConfirm={() => this.clone(record)}>
              <a href>克隆</a>
            </Popconfirm>
          </div>
        </AuthBox>
        
      ),
    },
  ]

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    
    if (this.projectId) {
      this.store.getObjList()
    }
  }

  @action.bound edit(data) {
    const params = {
      id: data.id,
    }
    this.drawerStore.getSchemeDetail(params) 
    this.drawerStore.getSchemeConfigInfo(params, () => {
      this.drawerStore.drawerVisible = true
    })
    this.drawerStore.drawerType = 'edit'
  }

  @action.bound operation(data) {
    this.store.operationScheme({
      id: data.id,
    })
  }

  @action.bound clone(data) {
    this.store.cloneScheme({
      id: data.id,
    })
  }

  @action.bound remove(data) {
    this.store.deleteScheme({
      deleteIds: [data.id],
    })
  }

  @action.bound create() {
    this.drawerStore.drawerVisible = true
  }

  @action.bound getSubmitLog(data) {
    this.store.modalLogVisible = true

    this.store.getSubmitLog({
      id: data.id,
    })
  }

   // 跳转到项目列表
   goProjectList = () => {
     window.location.href = `${window.__keeper.pathPrefix || '/'}/project`
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
    const {objList} = this.store
    const listConfig = {
      columns: this.columns,
      initParams: {projectId: this.projectId},
      searchParams: seach({objList}),
      buttons: [<Button type="primary" onClick={this.create}>创建加工方案</Button>],
      rowKey: 'id',
      store: this.store, // 必填属性
    }
    return (
      <Provider rootStore={this.rootStore}>
        <div className="page-tag-processe">
          <div className="content-header">加工方案</div>
          {
            this.projectId ? (
              <Fragment>
                <div className="list-content">
                  <ListContent {...listConfig} />
                </div>
                <DrawerConfig projectId={this.projectId} />
                <ModalSubmitLog store={this.store} />
              </Fragment>
            ) : this.renderNodata()
          }
         
        </div>
      </Provider>
    
    )
  }
}
export default SchemaList
