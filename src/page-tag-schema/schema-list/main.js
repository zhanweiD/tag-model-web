/**
 * @description 标签加工列表
 */
import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent} from '../../component'
import seach from './search'
import DrawerConfig from './drawer' 
import {
  getSchemeStatus, 
  getSchemeRunStatus,
  scheduleTypeObj,
  schemeTypeObj,
} from '../util'

import Store from './store'

@observer
export default class SchemaList extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window

    this.rootStore = new Store()
    this.projectId = spaceInfo && spaceInfo.projectId
    const {
      listStore,
      drawerStore, 
      // prodectId,
    } = this.rootStore

    this.drawerStore = drawerStore
    this.store = listStore
    this.store.projectId = spaceInfo && spaceInfo.projectId
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
      render: v => getSchemeStatus({status: v}),
    }, {
      title: '最近运行状态',
      dataIndex: 'lastStatus',
      render: v => (v === null ? '' : getSchemeRunStatus({status: v})),
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <div>
          {/* 方案状态: 提交成功/提交失败  操作: 查看 */}
          {
            (record.status === 2 || record.status === 3) && (
              <Fragment>
                <Link to={`/detail/${record.id}}`}> 查看</Link>
                <span className="table-action-line" />
              </Fragment>
            )
          }
         
          {/* 方案状态: 待提交/提交失败  操作: 提交 */}
          {
            (record.status === 1 || record.status === 3) && (
              <Fragment>
                <Popconfirm placement="topRight" title="你确定要提交吗？" onConfirm={() => this.submit(record)}>
                  <a href>提交</a>
                </Popconfirm>
                <span className="table-action-line" />
              </Fragment>
            )
          }

          {/* 方案状态: 未完成  操作: 编辑 */}
          {
            record.status === 0 && (
              <Fragment>
                <a href onClick={() => this.edit(record)}>编辑</a>
                <span className="table-action-line" />
              </Fragment>
            )
          }
          {/* 方案状态: 提交成功 调度类型: 手动执行  操作: 执行 */}
          {
            (record.status === 2 && record.scheduleType === 2) && (
              <Fragment>
                <Popconfirm placement="topRight" title="你确定要执行吗？" onConfirm={() => this.operation(record)}>
                  <a href>执行</a>
                </Popconfirm>
                <span className="table-action-line" />
              </Fragment>
             
            )
          }
          
          <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.remove(record)}>
            <a href>删除</a>
          </Popconfirm>
          <span className="table-action-line" />
          <a href onClick={() => this.clone(record)}>克隆</a>
        </div>
      ),
    },
  ]

  componentWillMount() {
    this.store.getObjList()
  }

  @action.bound edit(data) {
    const params = {
      id: data.id,
    }
    this.drawerStore.getSchemeDetail(params)
    this.drawerStore.getSchemeConfigInfo(params)
    this.drawerStore.drawerType = 'edit'
    this.drawerStore.drawerVisible = true
  }

  @action.bound submit(data) {
    this.store.submitScheme({
      id: data.id,
    })
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
          <div className="list-content">
            <ListContent {...listConfig} />
          </div>
          <DrawerConfig projectId={this.projectId} />
        </div>
      </Provider>
    
    )
  }
}
