import intl from 'react-intl-universal'
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
import {ListContent, Authority, projectProvider} from '../../component'
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

    const {listStore, drawerStore, configStore} = this.rootStore

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
          })
          }
        >
          {intl
            .get('ide.src.page-manage.page-tag-sync.sync-list.main.r93qum4tmg')
            .d('提交日志')}
        </a>
      </Menu.Item>
    </Menu>
  )

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-two.xcpjx1nr71n'
        )
        .d('加工方案'),
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
        )
        .d('对象'),
      dataIndex: 'objName',
    },
    {
      title: intl
        .get('ide.src.page-process.schema-detail.main.tua55dlv62t')
        .d('方案类型'),
      dataIndex: 'type',
      render: text => <span>{schemeTypeObj[text]}</span>,
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-sync.sync-detail.config-info.y6c22kjlsuj'
        )
        .d('调度类型'),
      dataIndex: 'scheduleType',
      render: text => <span>{scheduleTypeObj[text]}</span>,
    },

    {
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.data-table.u90bcgs8ckr'
        )
        .d('标签数/字段数'),
      dataIndex: 'tagCount',
      render: (text, render) => `${render.tagCount}/${render.fieldCount}`,
    },
    {
      title: intl
        .get('ide.src.page-process.schema-list.main.q0jida1yspd')
        .d('方案状态'),
      dataIndex: 'status',
      render: v => getSchemeStatus({status: v}),
    },
    {
      title: intl
        .get('ide.src.page-manage.page-tag-sync.sync-list.main.5y9seazaxhc')
        .d('最近运行状态'),
      dataIndex: 'lastStatus',
      render: v => (v === null ? '-' : getSchemeRunStatus({status: v})),
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.2vp94m4091h'
        )
        .d('创建时间'),
      dataIndex: 'createTime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      dataIndex: 'action',
      width: 300,
      fixed: 'right',
      render: (text, record) => (
        <div>
          {/* 方案状态: 提交成功  操作: 查看 */}
          {record.status === 1 && (
            <Fragment>
              <Authority authCode="tag_derivative:tql_detail[r]">
                <Link
                  target="_blank"
                  className="mr16"
                  to={`/process/tql/${record.id}/${this.projectId}`}
                >
                  {intl
                    .get('ide.src.page-process.schema-list.main.5jkkr5q47o3')
                    .d('查看')}
                </Link>
              </Authority>
              {/* <span className="table-action-line" /> */}
            </Fragment>
          )}

          {/* 方案状态: 提交成功  操作: 标签配置 */}
          {record.status === 1 && (
            <Fragment>
              <Authority authCode="tag_derivative:config_tag[c]">
                <a
                  className="mr16"
                  onClick={() => this.configDrawerShow(record)}
                >
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.data-sheet.config-field.7i73j0om993'
                    )
                    .d('标签配置')}
                </a>
              </Authority>
              {/* <span className="table-action-line" /> */}
            </Fragment>
          )}

          {/* 方案状态: 未完成/提交失败  操作: 编辑 */}
          <Authority authCode="tag_derivative:create_tql[c]">
            {(record.status === 0 || record.status === 2) && (
              <Fragment>
                <a className="mr16" href onClick={() => this.edit(record)}>
                  {intl
                    .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                    .d('编辑')}
                </a>
                {/* <span className="table-action-line" /> */}
              </Fragment>
            )}
          </Authority>

          {/* 方案状态: 提交成功 调度类型: 周期调度  操作: 禁止执行 */}
          {record.status === 1 && record.scheduleType === 1 && (
            <Fragment>
              <Authority authCode="tag_derivative:run_tql[x]">
                <span className="disabled mr16">
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.main.ico2ygdkj9'
                    )
                    .d('执行')}
                </span>
              </Authority>
              {/* <span className="table-action-line" /> */}
            </Fragment>
          )}

          {/* 方案状态: 提交成功 调度类型:手动执行 运行状态: 运行中   操作: 禁止执行 */}
          {record.status === 1
            && record.scheduleType === 2
            && record.lastStatus === 0 && (
            <Fragment>
              <Authority authCode="tag_derivative:run_tql[x]">
                <span className="disabled mr16">
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.main.ico2ygdkj9'
                    )
                    .d('执行')}
                </span>
              </Authority>
              {/* <span className="table-action-line" /> */}
            </Fragment>
          )}

          {/* 方案状态: 提交成功 调度类型:手动执行   操作: 执行 */}
          {record.status === 1
            && record.scheduleType === 2
            && record.lastStatus !== 0 && (
            <Fragment>
              <Authority authCode="tag_derivative:run_tql[x]">
                <Popconfirm
                  placement="topRight"
                  title={intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.main.xovkki7ebu'
                    )
                    .d('你确定要执行吗？')}
                  onConfirm={() => this.operation(record)}
                >
                  <a className="mr16" href>
                    {intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-list.main.ico2ygdkj9'
                      )
                      .d('执行')}
                  </a>
                </Popconfirm>
              </Authority>

              {/* <span className="table-action-line" /> */}
            </Fragment>
          )}

          {/* 方案状态: 提交成功 调度类型:周期执行 运行状态 运行成功 操作: 删除 */}
          {/* 标签数只要为0 方案均可删除 */}
          {(() => {
            if (record.tagCount === 0) {
              return (
                <Authority authCode="tag_derivative:delete_tql[d]">
                  <Popconfirm
                    placement="topRight"
                    title={intl
                      .get(
                        'ide.src.page-manage.page-tag-sync.sync-list.main.wpy3sz11tp'
                      )
                      .d('你确定要删除吗？')}
                    onConfirm={() => this.remove(record)}
                  >
                    <a href>
                      {intl
                        .get(
                          'ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi'
                        )
                        .d('删除')}
                    </a>
                  </Popconfirm>
                </Authority>
              )
            }

            if (record.status === 1) {
              return (
                <Authority authCode="tag_derivative:delete_tql[d]">
                  <span className="disabled">
                    {intl
                      .get(
                        'ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi'
                      )
                      .d('删除')}
                  </span>
                </Authority>
              )
            }

            return (
              <Authority authCode="tag_derivative:delete_tql[d]">
                <Popconfirm
                  placement="topRight"
                  title={intl
                    .get(
                      'ide.src.page-manage.page-tag-sync.sync-list.main.wpy3sz11tp'
                    )
                    .d('你确定要删除吗？')}
                  onConfirm={() => this.remove(record)}
                >
                  <a href>
                    {intl
                      .get(
                        'ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi'
                      )
                      .d('删除')}
                  </a>
                </Popconfirm>
              </Authority>
            )
          })()}

          {/* <span className="table-action-line" /> */}
          <Authority authCode="tag_derivative:clone_tql[c]">
            <Popconfirm
              placement="topRight"
              title={intl
                .get('ide.src.page-process.schema-list.main.egyy3dmbujw')
                .d('你确定要克隆吗？')}
              onConfirm={() => this.clone(record)}
            >
              <a className="ml16 mr16" href>
                {intl
                  .get('ide.src.page-process.schema-list.main.amp58hp8b94')
                  .d('克隆')}
              </a>
            </Popconfirm>
          </Authority>

          {/* 方案状态: 提交成功 提交失败  操作: 提交日志 */}
          {record.status === 2 ? (
            <Fragment>
              {/* <span className="table-action-line" /> */}
              <Authority authCode="tag_derivative:tql_submit_log[r]">
                <Dropdown overlay={() => this.menu(record)}>
                  <a href>
                    {intl
                      .get('ide.src.page-process.schema-list.main.39hadb4qi1x')
                      .d('更多')}

                    <DownOutlined />
                  </a>
                </Dropdown>
              </Authority>
            </Fragment>
          ) : null}
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

    // 基础信息
    this.drawerStore.getSchemeDetail(params)
    // 配置逻辑信息
    this.drawerStore.getSchemeConfigInfo(params, () => {
      this.drawerStore.drawerVisible = true
    })
    this.drawerStore.drawerType = 'edit'
  }

  // 执行加工方案
  @action.bound operation(data) {
    this.store.operationScheme({
      id: data.id,
    })
  }

  // 克隆
  @action.bound clone(data) {
    this.store.cloneScheme({
      id: data.id,
    })
  }

  // 删除
  @action.bound remove(data) {
    this.store.deleteScheme({
      deleteIds: [data.id],
    })
  }

  // 新建加工打开窗口
  @action.bound create() {
    this.drawerStore.drawerVisible = true
  }

  // 提交日志
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
      scroll: {x: 1300},
      buttons: [
        <Authority authCode="tag_derivative:create_tql[c]">
          <Button
            type="primary"
            // myFunctionCodes={functionCodes}
            onClick={this.create}
          >
            {intl
              .get('ide.src.page-process.schema-list.drawer.exqsb5ca7ap')
              .d('新建加工方案')}
          </Button>
        </Authority>,
      ],

      rowKey: 'id',
      store: this.store, // 必填属性
    }

    return (
      <Provider rootStore={this.rootStore}>
        <div className="page-tag-processe">
          <div className="content-header">
            {intl.get('ide.src.common.navList.stsyfv7j7wk').d('TQL加工方案')}
          </div>
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
