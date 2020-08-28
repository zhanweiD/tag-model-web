/**
 * @description 标签加工列表
 */
import {Component, Fragment} from 'react'
import {action} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {DownOutlined} from '@ant-design/icons'
import {Popconfirm, Dropdown, Menu, Button} from 'antd'
import {Link} from 'react-router-dom'

import {Time} from '../../common/util'
import {
  ListContent, Authority, projectProvider,
} from '../../component'
import seach from './search'
import DrawerConfig from './drawer'
import ConfigDrawer from './config-drawer'
import ModalSubmitLog from './modal-submit-log'
import {
  getSchemeStatus,
  getSchemeRunStatus,
  scheduleTypeObj,
  schemeTypeObj,
} from '../util'

import Store from './store'

@observer
class SchemaList extends Component {
  constructor(props) {
    super(props)

    this.projectId = props.projectId

    this.rootStore = new Store()
    
    const {
      listStore,
      drawerStore,
      configStore,
    } = this.rootStore

    this.drawerStore = drawerStore
    this.configStore = configStore
    this.store = listStore
    this.store.projectId = props.projectId


    if (props.projectId) {
      listStore.getAuthCode()
    }
  }

  menu = data => (
    <Menu>
      <Menu.Item>
        <a
          href
          onClick={() => this.getSubmitLog({
            id: data.id,
          })}
        >
          提交日志
        </a>
      </Menu.Item>
    </Menu>
  )

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
      render: v => (v === null ? '-' : getSchemeRunStatus({status: v})),
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '操作',
      dataIndex: 'action',
      width: 300,
      render: (text, record) => (
        <div>
          {/* 方案状态: 提交成功  操作: 查看 */}
          {
            (record.status === 1) && (
              <Fragment>
                <Authority authCode="tag_derivative:tql_detail[r]">
                  <Link target="_blank" className="mr16" to={`/process/tql/${record.id}/${this.projectId}`}>查看</Link>
                </Authority>
                {/* <span className="table-action-line" /> */}
              </Fragment>
            )
          }

          {/* 方案状态: 提交成功  操作: 标签配置 */}
          {
            (record.status === 1) && (
              <Fragment>
                <Authority authCode="tag_derivative:config_tag[c]">
                  <a className="mr16" onClick={() => this.configDrawerShow(record)}> 标签配置</a>
                </Authority>
                {/* <span className="table-action-line" /> */}
              </Fragment>
            )
          }

          {/* 方案状态: 未完成/提交失败  操作: 编辑 */}
          <Authority authCode="tag_derivative:create_tql[c]">
            {
              (record.status === 0 || record.status === 2) && (
                <Fragment>
                  <a className="mr16" href onClick={() => this.edit(record)}>编辑</a>
                  {/* <span className="table-action-line" /> */}
                </Fragment>
              )
            }
          </Authority>
          

          {/* 方案状态: 提交成功 调度类型: 周期调度  操作: 禁止执行 */}
          {
            (record.status === 1 && record.scheduleType === 1) && (
              <Fragment>
                <Authority authCode="tag_derivative:run_tql[x]">
                  <span className="disabled mr16">执行</span>
                </Authority>
                {/* <span className="table-action-line" /> */}
              </Fragment>
            )
          }

          {/* 方案状态: 提交成功 调度类型:手动执行 运行状态: 运行中   操作: 禁止执行 */}
          {
            (record.status === 1 && record.scheduleType === 2 && record.lastStatus === 0) && (
              <Fragment>
                <Authority authCode="tag_derivative:run_tql[x]">
                  <span className="disabled mr16">执行</span>
                </Authority>
                {/* <span className="table-action-line" /> */}
              </Fragment>
            )
          }

          {/* 方案状态: 提交成功 调度类型:手动执行   操作: 执行 */}
          {
            (record.status === 1 && record.scheduleType === 2 && record.lastStatus !== 0) && (
              <Fragment>
                <Authority authCode="tag_derivative:run_tql[x]">
                  <Popconfirm placement="topRight" title="你确定要执行吗？" onConfirm={() => this.operation(record)}>
                    <a className="mr16" href>执行</a>
                  </Popconfirm>
                </Authority>
                
                {/* <span className="table-action-line" /> */}
              </Fragment>

            )
          }
          {/* 方案状态: 提交成功 调度类型:周期执行 运行状态 运行成功 操作: 删除 */}
          {/* 标签数只要为0 方案均可删除 */}
          {(() => {
            if (record.tagCount === 0) {
              return (
                <Authority authCode="tag_derivative:delete_tql[d]">
                  <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.remove(record)}>
                    <a href>删除</a>
                  </Popconfirm>
                </Authority>
              )
            }

            if (record.status === 1) {
              return (
                <Authority authCode="tag_derivative:delete_tql[d]">
                  <span className="disabled">删除</span>
                </Authority>
              )
            }

            return (
              <Authority authCode="tag_derivative:delete_tql[d]">
                <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.remove(record)}>
                  <a href>删除</a>
                </Popconfirm>
              </Authority>
            )
          })()}

          {/* <span className="table-action-line" /> */}
          <Authority authCode="tag_derivative:clone_tql[c]">
            <Popconfirm placement="topRight" title="你确定要克隆吗？" onConfirm={() => this.clone(record)}>
              <a className="ml16 mr16" href>克隆</a>
            </Popconfirm>
          </Authority>

          {/* 方案状态: 提交成功 提交失败  操作: 提交日志 */}
          {
            record.status === 2 ? (
              <Fragment>
                {/* <span className="table-action-line" /> */}
                <Authority authCode="tag_derivative:tql_submit_log[r]">
                  <Dropdown overlay={() => this.menu(record)}>
                    <a href>
                      更多
                      <DownOutlined />
                    </a>
                  </Dropdown>
                </Authority>
              </Fragment>
            ) : null
          }

        </div>

      ),
    },
  ]

  componentWillMount() {
    // 面包屑设置
    // const {frameChange} = this.props
    // frameChange('nav', navList)

    if (this.projectId) {
      this.store.getObjList()
      this.initData()
    }
  }

  // 显示标签配置抽屉
  @action configDrawerShow = record => {
    this.configStore.currentStep = 0
    this.configStore.tagId = 0
    this.configStore.tagBaseInfo = {}
    this.configStore.list = []
    this.configStore.ownObject = record.objId
    this.configStore.processId = record.id
    this.configStore.configDrawerVisible = true
    this.configStore.disNext = true
    this.configStore.fieldName = ''
    this.configStore.getNoConList()
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    this.store.list.clear()
    this.store.searchParams = {}
    this.store.pagination = {
      pageSize: 10,
      currentPage: 1,
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

  render() {
    const {objList, functionCodes} = this.store
    const listConfig = {
      columns: this.columns,
      initParams: {projectId: this.projectId},
      searchParams: seach({objList}),
      buttons: [<Authority authCode="tag_derivative:create_tql[c]">
        <Button
          type="primary"
          // myFunctionCodes={functionCodes}
          onClick={this.create}
        >
        新建加工方案
        </Button>
                </Authority>,
      ],
      rowKey: 'id',
      store: this.store, // 必填属性
    }

    return (
      <Provider rootStore={this.rootStore}>

        <div className="page-tag-processe">
          <div className="content-header">TQL加工方案</div>
          <div className="header-page">
            <ListContent {...listConfig} />
            <DrawerConfig projectId={this.projectId} />
            <ConfigDrawer projectId={this.projectId} />
            <ModalSubmitLog store={this.store} />
          </div>

        </div>
      </Provider>

    )
  }
}
export default projectProvider(SchemaList)
