import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'
import {Button, Popconfirm, Dropdown, Icon, Menu} from 'antd'
import {ListContent, Loading, NoData} from '../../component'
import {Time} from '../../common/util'
import * as navListMap from '../../common/navList'
import seach from './search'
import ModalSubmitLog from './modal-submit-log'

import {
  geVisualStatus,
  getLastStatus,
} from '../util'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  {text: navListMap.visual.text},
]

@inject('frameChange')
@observer
export default class VisualList extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId
  }

  menu = data => (
    <Menu>
      <Menu.Item>
        <a
          href
          onClick={() => this.getLog({
            id: data.id,
          })}
        >
          提交日志
        </a>
      </Menu.Item>

      <Menu.Item>

        {
          data.tagUsedCount
            ? (
              <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(data.id)}>
                <a href>删除</a>
              </Popconfirm>
            ) : <span className="disabled">删除</span>
        }
        
      </Menu.Item>
     
    </Menu>
  )

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
    render: v => (v === null ? '' : geVisualStatus({status: v})),
  }, {
    title: '最近运行状态',
    dataIndex: 'lastStatus',
    render: v => (v === null ? '' : getLastStatus({status: v})),
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
                <a href onClick={() => this.editScheme(record)}>编辑</a>
                <span className="table-action-line" />
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
                <a href onClick={() => this.editScheme(record)}>编辑</a>
                <span className="table-action-line" />
                <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(record.id)}>
                  <a href>删除</a>
                </Popconfirm>
                {/* <span className="table-action-line" />
                <a href onClick={() => this.clone(record.id)}>克隆</a> */}
                <span className="table-action-line" />
                <a href onClick={() => this.getLog(record.id)}>提交日志</a>
              </Fragment>
            )
          }

          // 方案状态 提交成功  1
          if (record.status === 1) {
            return (
              <Fragment>
                <a href onClick={() => this.viewVisual(record)}>查看</a>
                <span className="table-action-line" />
                <a href onClick={() => this.runVisual(record)}>执行</a>
                {/* <span className="table-action-line" />
                <a href onClick={() => this.clone(record.id)}>克隆</a> */}
                <span className="table-action-line" />
                <a href onClick={() => this.getLog(record.id)}>提交日志</a>
                <span className="table-action-line" />
                {
                  record.tagUsedCount
                    ? (
                      <Popconfirm placement="topRight" title="你确定要删除吗？" onConfirm={() => this.delList(data.id)}>
                        <a href>删除</a>
                      </Popconfirm>
                    ) : <span className="disabled">删除</span>
                }
                {/* <Dropdown overlay={() => this.menu(record)}>
                  <a href>
                      更多
                    <Icon type="down" />
                  </a>
                </Dropdown> */}
              </Fragment>
            )
          }
        })()}
      </div>
    ),
  }]

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)

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
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/visual/config`
  }

  // 编辑
  @action.bound editScheme(data) {
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/visual/config/${data.id}`
  }

  // 查看
  @action.bound viewVisual(data) {
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/visual/detail/${data.id}`
  }

  // 克隆
  @action.bound clone(id) {
    store.clone(id)
  }

  // 执行
  @action.bound runVisual(id) {
    store.runVisual(id)
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

  // 跳转到项目列表
  goProjectList = () => {
    window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/project`
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

    const {spaceInfo} = window

    return (
      <Provider bigStore={store}>
        <div className="page-visual-list">
          <div className="content-header">可视化加工方案</div>
          {
            spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length
              ? (
                <Fragment>
                  <div className="list-content">
                    <ListContent {...listConfig} />
                  </div>
                </Fragment>
              ) : this.renderNodata()
          }
          <ModalSubmitLog store={store} />
        </div>
      </Provider>
    )
  }
}
