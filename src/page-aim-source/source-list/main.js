import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent, NoData, Loading} from '../../component'
import {Time} from '../../common/util'
import * as navListMap from '../../common/navList'
import seach from './search'
import AddSource from './drawer'
import DrawerTagConfig from '../tag-config'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.tagSync,
  {text: navListMap.aimSource.text},
]

@inject('frameChange')
@observer
export default class SourceList extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window

    store.projectId = spaceInfo && spaceInfo.projectId
  }

  columns = [{
    title: '目的源名称',
    dataIndex: 'name',
    render: (text, record) => <Link to={`/aim-source/${record.id}`}>{text}</Link>,
  }, {
    title: '对象',
    dataIndex: 'objName',
  }, {
    title: '数据表',
    dataIndex: 'dataTableName',
  }, {
    title: '数据源',
    dataIndex: 'storageName',
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '已映射/字段数',
    dataIndex: 'tagUsedCount',
    render: (text, record) => `${record.tagUsedCount}/${record.fieldTotalCount}`,
  }, {
    title: '已被使用',
    dataIndex: 'status',
    render: text => (text ? '是' : '否'),
  }, {
    title: '创建时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    render: (text, record) => (
      <div>
        <a href onClick={() => this.openTagConfig(record)}>标签映射</a>
        <span className="table-action-line" />
        {
          record.status ? <span className="disabled">删除</span> : (
            <Popconfirm placement="topRight" title="你确定要删除该目的源吗？" onConfirm={() => this.delItem(record.id)}>
              <a href>删除</a>
            </Popconfirm>
          )
        }
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

  @action.bound addSource() {
    store.getStorageType()
    store.visible = true
  }

  @action.bound openTagConfig(record) {
    store.drawerTagConfigInfo = record
    store.drawerVisible = true
  }

  // 删除目的源
  delItem = id => {
    store.delList(id)
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
    const {
      projectId,
      objList,
      drawerVisible,
      drawerTagConfigInfo,
      closeTagConfig,
      updateTagConfig,
    } = store

    const listConfig = {
      columns: this.columns,
      searchParams: seach({
        objList: toJS(objList),
      }),
      initParams: {projectId},
      buttons: [<Button type="primary" onClick={() => this.addSource()}>添加目的源</Button>],
      store, // 必填属性
    }

    const {spaceInfo} = window

    return (
      <div className="page-aim-source">
        <div className="content-header">目的源管理</div>
        {
          spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length
            ? (
              <Fragment>
                <div className="list-content">
                  <ListContent {...listConfig} />
                </div>
                <AddSource store={store} />
                <DrawerTagConfig
                  visible={drawerVisible}
                  info={drawerTagConfigInfo}
                  onClose={closeTagConfig}
                  onUpdate={updateTagConfig}
                />
              </Fragment>
            ) : this.renderNodata()
        }
      </div>

    )
  }
}
