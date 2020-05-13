import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
// import {Link} from 'react-router-dom'
import {ListContent, Loading, NoData} from '../../component'
import {Time} from '../../common/util'
import * as navListMap from '../../common/navList'
import seach from './search'
// import DrawerAddSync from './drawer'
// import DrawerEditSync from './drawer-edit'
// import ModalLog from './modal-log'
// import ModalStart from './modal-start'

import {
  geVisualStatus,
  getLastStatus,
} from '../util'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.tagSync,
  {text: navListMap.syncPlan.text},
]

@inject('frameChange')
@observer
export default class VisualList extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId
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
    render: (text, record) => `${record.tagUsedCount}/${record.tagTotalCount}`,
  }, {
    title: '创建时间',
    dataIndex: 'ctime',
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
    width: 120,
    render: (text, record) => (
      <div>
        <a>11</a>
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

  @action.bound addScheme() {
    store.visible = true
  }

  @action.bound editScheme(data) {
    store.selectItem = data
    store.visibleEdit = true
  }

  // 查看
  @action.bound viewVisual(data) {

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
    const {objList, projectId, visibleEdit} = store

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
                  {/* <DrawerAddSync projectId={projectId} />
                  <DrawerEditSync projectId={projectId} visible={visibleEdit} />
                  <ModalLog />
                  <ModalStart /> */}
                </Fragment>
              ) : this.renderNodata()
          }
         
        </div>
      </Provider>
    )
  }
}
