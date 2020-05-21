import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider, inject} from 'mobx-react'
import {ListContent, Loading, NoData} from '../../component'
import {Time} from '../../common/util'
import * as navListMap from '../../common/navList'
import seach from './search'

import {
  getTagStatus,
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
export default class tagList extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId
  }

  columns = [{
    title: '标签名称',
    dataIndex: 'name',
  }, {
    title: '标签标识',
    dataIndex: 'enName',
  }, {
    title: '数据类型',
    dataIndex: 'objName',
  }, {
    title: '对象名称',
    dataIndex: 'objName',
  }, {
    title: '衍生标签方案',
    dataIndex: 'tagUsedCount',
  }, {
    title: '使用状态',
    dataIndex: 'status',
    render: v => (v === null ? '' : getTagStatus({status: v})),
  }]

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)

    if (store.projectId) {
      store.getObjList()
      store.getSchemeList()
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
    const {objList, schemeList, projectId} = store

    const listConfig = {
      columns: this.columns,
      initParams: {projectId},
      searchParams: seach({
        objList: toJS(objList),
        schemeList: toJS(schemeList),
      }),
      store, // 必填属性
    }

    const {spaceInfo} = window

    return (
      <Provider bigStore={store}>
        <div className="page-visual-tag">
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
         
        </div>
      </Provider>
    )
  }
}
