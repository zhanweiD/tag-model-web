import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'
import {Button, Popconfirm, Dropdown, Icon, Menu} from 'antd'
import {ListContent, Loading, NoData, projectProvider} from '../../../component'
import {Time} from '../../../common/util'
import seach from './search'
import ModalSubmitLog from './modal-submit-log'

import {
  geVisualStatus,
  getLastStatus,
} from '../util'

import store from './store'

@inject()
@observer
class VisualList extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }

  columns = [{
    title: '衍生标签方案',
    dataIndex: 'name',
    // render: (text, record) => <Link to={`/tag-sync/${record.id}`}>{text}</Link>,
  }, {
    title: '对象',
    dataIndex: 'objName',
  }, {
    title: '使用中/标签数',
    dataIndex: 'tagUsedCount',
    render: (text, record) => `${record.tagUsedCount}/${record.tagCount}`,
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '方案状态',
    dataIndex: 'status',
    render: v => (v === null ? '-' : geVisualStatus({status: v})),
  }, {
    title: '最近运行状态',
    dataIndex: 'lastStatus',
    render: v => (v === null ? '-' : getLastStatus({status: v})),
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 180,
    render: (text, record) => (
      <div>
        {(() => {
          // 方案状态 未完成 0
          if (record.status === 0) {
            return (
              <Fragment>
                <a className="mr8" href onClick={() => this.editScheme(record)}>编辑</a>
                {/* <span className="table-action-line" /> */}
                <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                  <a href>删除</a>
                </Popconfirm>
                {/* <span className="table-action-line" />
                <a href onClick={() => this.clone(record.id)}>克隆</a> */}
              </Fragment>
            )
          }

          // 方案状态 提交失败  2
          if (record.status === 2) {
            return (
              <Fragment>
                <a className="mr8" href onClick={() => this.editScheme(record)}>编辑</a>
                {/* <span className="table-action-line" /> */}
                <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                  <a className="mr8" href>删除</a>
                </Popconfirm>
                {/* <span className="table-action-line" />
                <a href onClick={() => this.clone(record.id)}>克隆</a> */}
                {/* <span className="table-action-line" /> */}
                <a href onClick={() => this.getLog(record.id)}>提交日志</a>
              </Fragment>
            )
          }

          // 方案状态 提交成功  1 运行中
          if (record.status === 1 && record.lastStatus === 0) {
            return (
              <Fragment>
                <a className="mr8" href onClick={() => this.viewVisual(record)}>查看</a>
                {/* <span className="table-action-line" /> */}
                <span className="disabled mr8">执行</span>
                {/* <span className="table-action-line" /> */}
                <span className="disabled mr8">删除</span>
                {/* <span className="table-action-line" /> */}
                <a href onClick={() => this.getLog(record.id)}>提交日志</a>
               
                {/* <Dropdown overlay={() => this.menu(record)}>
                  <a href>
                      更多
                    <Icon type="down" />
                  </a>
                </Dropdown> */}
              </Fragment>
            )
          }


          // 方案状态 提交成功  1
          if (record.status === 1) {
            return (
              <Fragment>
                <a className="mr8" href onClick={() => this.viewVisual(record)}>查看</a>
                {/* <span className="table-action-line" /> */}
                <a className="mr8" href onClick={() => this.runVisual(record)}>执行</a>
                {/* <span className="table-action-line" /> */}
                {
                  !record.tagUsedCount
                    ? (
                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                        <a href>删除</a>
                      </Popconfirm>
                    ) : <span className="disabled">删除</span>
                }
                {/* <span className="table-action-line" /> */}
                <a className="ml8" href onClick={() => this.getLog(record.id)}>提交日志</a>
              </Fragment>
            )
          }
        })()}
      </div>
    ),
  }]

  componentWillMount() {
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

  // 新增
  @action.bound addScheme() {
    // window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/process/visual/config/${store.projectId}`
    window.open(`${window.__keeper.pathHrefPrefix || '/'}/process/visual/config/${store.projectId}`)
  }

  // 编辑
  @action.bound editScheme(data) {
    // window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/process/visual/config/${store.projectId}/${data.id}`
    window.open(`${window.__keeper.pathHrefPrefix || '/'}/process/visual/config/${store.projectId}/${data.id}`)
  }

  // 查看
  @action.bound viewVisual(data) {
    // window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/process/visual/detail/${store.projectId}/${data.id}`
    window.open(`${window.__keeper.pathHrefPrefix || '/'}/process/visual/detail/${store.projectId}/${data.id}`)
  }

  // 克隆
  @action.bound clone(id) {
    store.clone(id)
  }

  // 执行
  @action.bound runVisual(data) {
    store.runVisual(data.id)
  }

  // 删除
  @action.bound delList(id) {
    store.delList(id)
  }

  // 提交日志
  @action.bound getLog(id) {
    store.visibleLog = true
    store.getLog(id)
  }

  render() {
    const {objList, projectId} = store

    const listConfig = {
      columns: this.columns,
      initParams: {projectId},
      searchParams: seach({
        objList: toJS(objList),
      }),
      buttons: [<Button type="primary" onClick={() => this.addScheme()}>新建方案</Button>],
      store, // 必填属性
    }

    return (
      <Provider bigStore={store}>
        <div className="page-visual-list">
          <div className="content-header">可视化加工方案</div>
          <Fragment>
            <div className="list-content">
              <ListContent {...listConfig} />
            </div>
          </Fragment>
          <ModalSubmitLog store={store} />
        </div>
      </Provider>
    )
  }
}

export default projectProvider(VisualList)
