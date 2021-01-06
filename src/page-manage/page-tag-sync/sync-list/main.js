/**
 * @description 标签同步
 */
import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent, projectProvider, Authority, OmitTooltip} from '../../../component'
import {Time} from '../../../common/util'
import seach from './search'
import DrawerAddSync from './drawer'
import DrawerEditSync from './drawer-edit'
import ModalLog from './modal-log'
import ModalStart from './modal-start'

import {
  getLastStatus,
  getSyncStatus,
  // getScheduleType,
} from '../util'

import store from './store'

@observer
class SyncList extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }

  columns = [{
    title: '计划名称',
    dataIndex: 'name',
    fixed: 'left',
    render: (text, record) => (
      <Link target="_blank" to={`/manage/tag-sync/${record.id}/${store.projectId}`}><OmitTooltip maxWidth={200} text={text} /></Link>
    ),
  }, {
    title: '对象',
    dataIndex: 'objName',
    render: v => <OmitTooltip maxWidth={200} text={v} />,
  }, {
    title: '目的数据源',
    dataIndex: 'storageName',
  }, {
    title: '数据源类型',
    dataIndex: 'storageTypeName',
  }, {
    title: '使用中/标签数',
    dataIndex: 'tagUsedCount',
    render: (text, record) => `${record.tagUsedCount}/${record.tagTotalCount}`,
  }, {
    title: '最近提交时间',
    dataIndex: 'lastSubmitTime',
    width: 180,
    render: text => <Time timestamp={text} />,
  }, {
    title: '周期调度',
    dataIndex: 'scheduleType',
    // render: v => (v === null ? '' : getScheduleType({status: v})),
    render: v => (v ? '启动' : '暂停'),
  }, {
    title: '计划状态',
    dataIndex: 'status',
    render: v => (v === null ? '' : getSyncStatus({status: v})),
  }, {
    title: '最近运行状态',
    dataIndex: 'lastStatus',
    render: v => (v === null ? '' : getLastStatus({status: v})),
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 260,
    fixed: 'right',
    render: (text, record) => (
      <div>
        {/* 方案状态 0 未完成、1 提交成功 2 提交失败 3提交中 4更新成功 5更新失败 6更新中 */}
        {/* 最后一次运行状态 0 运行中  1 成功  2 失败 */}
        {/* 提交中 & 暂停 */}
        {(() => {
          if (record.status === 3 && record.scheduleType === 0) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <span className="disabled mr16">启动</span>
                </Authority>  
               
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <span className="disabled mr16">编辑</span>
                  {/* <span className="table-action-line" /> */}
                  <span className="disabled mr16">删除</span>
                </Authority>
                {/* <span className="table-action-line" /> */}
               
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <span className="disabled">提交日志</span>
                </Authority>
              </Fragment>

            )
          }

          /* 更新中 & 暂停 & 运行成功、运行失败 */
          if (record.status === 6 && record.scheduleType === 0 && (record.lastStatus === 1 || record.lastStatus === 2)) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <span className="disabled mr16">启动</span>
                </Authority> 
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <span className="disabled mr16">编辑</span>
                  {/* <span className="table-action-line" /> */}
                  <span className="disabled mr16">删除</span>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <span className="disabled">提交日志</span>
                </Authority>
              </Fragment>

            )
          }

          /* 提交失败 & 暂停 */
          if (record.status === 2 && record.scheduleType === 0) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <span className="disabled mr16">启动</span>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <a className="mr16" href onClick={() => this.editSync(record)}>编辑</a>
                  {/* <span className="table-action-line" /> */}
                  <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                    <a className="mr16" href>删除</a>
                  </Popconfirm>
                </Authority>

                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a href onClick={() => this.getLog(record.id)}>提交日志</a>

                </Authority>
              </Fragment>

            )
          }

          /* 提交失败 & 启动 */
          if (record.status === 2 && record.scheduleType === 1) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <a className="mr16" href onClick={() => this.startSync(record)}>启动</a>
                </Authority>               
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <Popconfirm placement="topRight" title="你确定要执行吗？" onConfirm={() => this.runSync(record.id)}>
                    <a className="mr16" href>执行</a>
                  </Popconfirm>
                </Authority>   
                
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <a className="mr16" href onClick={() => this.editSync(record)}>编辑</a>
                  {/* <span className="table-action-line" /> */}
                  <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                    <a className="mr16" href>删除</a>
                  </Popconfirm>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a href onClick={() => this.getLog(record.id)}>提交日志</a>
                </Authority>
              </Fragment>
            )
          }

          /* 提交成功 & 暂停 &  运行成功  & 运行失败 */
          if (record.status === 1 && record.scheduleType === 0 && (record.lastStatus === 1 || record.lastStatus === 2)) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <a className="mr16" href onClick={() => this.startSync(record)}>启动</a>
                </Authority>   
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <Popconfirm placement="topRight" title="你确定要执行吗？" onConfirm={() => this.runSync(record.id)}>
                    <a className="mr16" href>执行</a>
                  </Popconfirm>
                </Authority>  
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <a className="mr16" href onClick={() => this.editSync(record)}>编辑</a>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  {
                    !record.tagUsedCount ? (
                   
                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                        <a href>删除</a>
                      </Popconfirm>
                  
                    ) : <span className="disabled">删除</span>
                  }
                </Authority>  
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a className="ml16" href onClick={() => this.getLog(record.id)}>提交日志</a>

                </Authority>
              </Fragment>
            )
          }

          /* 更新失败 & 暂停 & 运行成功 */
          if (record.status === 5 && record.scheduleType === 0 && record.lastStatus === 1) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <a className="mr16" href onClick={() => this.startSync(record)}>启动</a>
                </Authority>   
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <Popconfirm placement="topRight" title="你确定要执行吗？" onConfirm={() => this.runSync(record.id)}>
                    <a className="mr16" href>执行</a>
                  </Popconfirm>
                </Authority>  
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <a className="mr16" href onClick={() => this.editSync(record)}>编辑</a>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  {
                    !record.tagUsedCount ? (
                   
                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                        <a href>删除</a>
                      </Popconfirm>
                    
                 
                    ) : <span className="disabled">删除</span>
                  }
                </Authority>
                {/* <span className="table-action-line" /> */}
                
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a className="ml16" href onClick={() => this.getLog(record.id)}>提交日志</a>

                </Authority>
              </Fragment>
            )
          }

          /* 更新失败 & 暂停 & 运行失败 */
          if (record.status === 5 && record.scheduleType === 0 && record.lastStatus === 2) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <span className="disabled mr16">启动</span>
                </Authority>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <span className="disabled mr16">执行</span>
                </Authority>
                
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <a href onClick={() => this.editSync(record)} className="mr16">编辑</a>
           
                  {
                    !record.tagUsedCount ? (
                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                        <a href className="mr16">删除</a>
                      </Popconfirm>
                    ) : <span className="disabled mr16">删除</span>
                  }
                </Authority>
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a href onClick={() => this.getLog(record.id)}>提交日志</a>
                </Authority>
              </Fragment>
            )
          }

          /* 更新失败 & 暂停 */
          if (record.status === 5 && record.scheduleType === 0) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <span className="mr16 disabled">启动</span>
                </Authority> 
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <a className="mr16" href onClick={() => this.editSync(record)}>编辑</a>
                  {/* <span className="table-action-line" /> */}
                  <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                    <a className="mr16" href>删除</a>
                  </Popconfirm>
                </Authority>
             
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a href onClick={() => this.getLog(record.id)}>提交日志</a>

                </Authority>
              </Fragment>
            )
          }

          /* 更新成功 & 启动 & 运行成功、运行失败 */
          if (record.status === 4 && record.scheduleType === 1 && (record.lastStatus === 1 || record.lastStatus === 2)) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <Popconfirm placement="topRight" title="你确定要暂停吗？" onConfirm={() => this.pauseSync(record.id)}>
                    <a className="mr16" href>暂停</a>
                  </Popconfirm>
                </Authority>

                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <span className="disabled mr16">编辑</span>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  {
                    !record.tagUsedCount ? (
                   
                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                        <a href>删除</a>
                      </Popconfirm>
                
               
                    ) : <span className="disabled">删除</span>
                  }
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a className="ml16" href onClick={() => this.getLog(record.id)}>提交日志</a>

                </Authority>
              </Fragment>
            )
          }

          /* 更新成功 & 暂停 &  运行成功、运行失败 */
          if (record.status === 4 && record.scheduleType === 0 && (record.lastStatus === 1 || record.lastStatus === 2)) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <a className="mr16" href onClick={() => this.startSync(record)}>启动</a>
                </Authority>   
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <Popconfirm placement="topRight" title="你确定要执行吗？" onConfirm={() => this.runSync(record.id)}>
                    <a className="mr16" href>执行</a>
                  </Popconfirm>
                </Authority>  
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <a className="mr16" href onClick={() => this.editSync(record)}>编辑</a>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  {
                    !record.tagUsedCount ? (

                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                        <a href>删除</a>
                      </Popconfirm>


                    ) : <span className="disabled">删除</span>
                  }
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a className="ml16" href onClick={() => this.getLog(record.id)}>提交日志</a>

                </Authority>
              </Fragment>

            )
          }

          /* 提交成功 & 启动  */
          if (record.status === 1 && record.scheduleType === 1) {
            return (
              <Fragment>
                <Authority
                  authCode="tag_model:run_transfer[x]"
                >
                  <a className="mr16" href onClick={() => this.pauseSync(record.id)}>暂停</a>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  <span className="disabled mr16">编辑</span>
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:update_transfer[u]"
                >
                  {
                    !record.tagUsedCount ? (
                   
                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                        <a href>删除</a>
                      </Popconfirm>
             
               
                    ) : <span className="disabled">删除</span>
                  }
                </Authority>
                {/* <span className="table-action-line" /> */}
                <Authority
                  authCode="tag_model:transfer_submit_log[r]"
                >
                  <a className="ml16" href onClick={() => this.getLog(record.id)}>提交日志</a>
                </Authority>
              </Fragment>
            )
          }

          return (
            <Fragment>
              <Authority
                authCode="tag_model:run_transfer[x]"
              >
                <span className="disabled mr16">启动</span>
              </Authority> 
              {/* <span className="table-action-line" /> */}
              <Authority
                authCode="tag_model:update_transfer[u]"
              >
                <span className="disabled mr16">编辑</span>
                {/* <span className="table-action-line" /> */}
                <span className="disabled mr16">删除</span>
              </Authority>
              {/* <span className="table-action-line" /> */}
              <Authority
                authCode="tag_model:transfer_submit_log[r]"
              >
                <span className="disabled">提交日志</span>
              </Authority>
            </Fragment>
          )
        })()}
      </div>
    ),
  }]

  componentWillMount() {
    // 面包屑设置
    // const {frameChange} = this.props
    // frameChange('nav', navList)

    if (store.projectId) {
      store.getObjList()
      this.initData()
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  @action.bound addSync() {
    store.visible = true
  }

  @action.bound editSync(data) {
    store.selectItem = data
    store.visibleEdit = true
  }

  // 启动
  @action.bound startSync(data) {
    store.selectItem = data
    store.visibleStart = true
  }

  // 暂停
  @action.bound pauseSync(id) {
    store.pauseSync(id)
  }

  // 执行
  @action.bound runSync(id) {
    store.runSync(id)
  }

  // 删除同步计划
  @action.bound delList(id) {
    store.delList(id)
  }

  @action.bound getLog(id) {
    store.visibleLog = true
    store.getLog(id)
  }
  
  render() {
    const {objList, projectId, visibleEdit} = store

    const listConfig = {
      columns: this.columns,
      initParams: {projectId},
      scroll: {x: 1400},
      searchParams: seach({
        objList: toJS(objList),
      }),
      buttons: [<Authority 
        authCode="tag_model:create_transfer[c]" 
      >
        <Button type="primary" onClick={() => this.addSync()}>新建同步计划</Button>
                </Authority>],
      store, // 必填属性
    }

    return (
      <Provider bigStore={store}>
        <div>
          <div className="content-header">标签同步</div>
          <div className="header-page">
            <ListContent {...listConfig} />
          </div>
          <DrawerAddSync projectId={projectId} />
          <DrawerEditSync projectId={projectId} visible={visibleEdit} />
          <ModalLog />
          <ModalStart />
        </div>
      </Provider>
    )
  }
}
export default projectProvider(SyncList)
