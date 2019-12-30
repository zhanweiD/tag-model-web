/**
 * @description 项目列表
 */
import {Component, Fragment} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Popconfirm, Badge} from 'antd'
import {Link} from 'react-router-dom'
import {Time, pathPrefix} from '../../common/util'
import {
  ListContent, NoData, OmitTooltip, AuthBox,
} from '../../component'
import storage from '../../common/nattyStorage'

import seach from './search'
import ModalProject from './modal'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  {text: navListMap.project.text},
]

@inject('frameChange')
@observer
export default class ProjectList extends Component {
  columns = [
    {
      key: 'name',
      title: '项目名称',
      dataIndex: 'name',
      render: (text, record) => (
        <Link to={`/${record.id}`}> 
          <OmitTooltip maxWidth={100} text={text} />
        </Link>
      ),
    }, {
      key: 'cUserName',
      title: '所有者',
      dataIndex: 'cUserName',
    }, {
      key: 'status',
      title: '项目状态',
      dataIndex: 'status',
      render: v => (
        +v === 1
          ? <Badge color="#1890FF" text="使用中" />
          : <Badge color="rgba(0,0,0,0.25)" text="未使用" />
      ),
    }, {
      key: 'descr',
      title: '项目描述',
      dataIndex: 'descr',
      render: text => <OmitTooltip maxWidth={120} text={text} />,
    }, {
      key: 'cTime',
      title: '创建时间',
      dataIndex: 'cTime',
      render: text => <Time timestamp={text} />,
    }, {
      key: 'action',
      title: '操作',
      width: 210,
      dataIndex: 'action',
      render: (text, record) => (
        <div className="FBH FBAC">
          {record.config === 1 && (
            <Fragment>
              <Link to={`/${record.id}`}>项目配置</Link>
              <span className="table-action-line" />
            </Fragment>
          )}

          <a href onClick={() => this.toSpace(record)}>项目空间</a>

          {(() => {
            if (record.edit) {
              if (record.status === 1) {
                return (
                  <Fragment>
                    <span className="table-action-line" />
                    <span className="disabled">编辑</span> 
                  </Fragment>
                )
              } 
              return (
                <Fragment>
                  <span className="table-action-line" />
                  <a href onClick={() => this.openModal('edit', record)}>编辑</a>
                </Fragment>
              ) 
            } 
            return null
          })()}

          {(() => {
            if (record.del) {
              if (record.status === 1) {
                return (
                  <Fragment>
                    <span className="table-action-line" />
                    <span className="disabled">删除</span> 
                  </Fragment>
                )
              } 
              return (
                <Fragment>
                  <span className="table-action-line" />
                  <Popconfirm placement="topRight" title="项目被删除后不可恢复，确认删除？" onConfirm={() => this.delItem(record.id)}>
                    <a href>删除</a>
                  </Popconfirm>
                </Fragment>
              )
            } 
            return null
          })()}
        </div>
      ),
    },
  ]

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)

    // 页面初始化
    store.getCuser() // 获取项目所有者列表

    // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
    // 若返回数据为空[]。则渲染 NoData 组件。
    // 要是请求放在列表组件ListContent中的话, 就必须渲染表格的dom 影响体验
    store.getList()
  }

  /**
   * @description 打开弹窗
   * @param type 弹窗类型 编辑 / 添加(edit / add)
   */
  @action openModal = (type, data = {}) => {
    store.detail = data
    store.visible = true
    store.type = type
    store.getDataSource()
  }

  /**
   * @description 删除项目
   * @param id 项目ID
   */
  delItem = id => {
    store.delList(id)
  }

  /**
   * @description 跳转到项目空间
   */
  toSpace = data => {
    storage.set('tag_projectId', data.id)
    window.location.href = `${pathPrefix}/object-config`
  }

  /**
   * @description 列表请求前搜索参数处理
   * @param values 搜索内容
   */
  beforeSearch = values => {
    if (values.time) {
      values.startTime = values.time[0].format('YYYY-MM-DD')
      values.endTime = values.time[1].format('YYYY-MM-DD')
      delete values.time
    }
    return values
  }

  render() {
    const {
      cUser, list, tableLoading, searchParams,
    } = store

    const noDataConfig = {
      btnText: '创建项目',
      onClick: () => this.openModal('add'),
      text: '没有任何项目，请在当前页面创建项目！',
      code: 'asset_tag_project_add',
      noAuthText: '没有任何项目',
    }

    const listConfig = {
      columns: this.columns,
      searchParams: seach({cUser}),
      beforeSearch: this.beforeSearch,
      buttons: [<AuthBox code="asset_tag_project_add" type="primary" onClick={() => this.openModal('add')}>添加项目</AuthBox>],
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    return (
      <div className="page-project">
        <div className="content-header">{navListMap.project.text}</div>
        {/* <div className="list-content">
          <ListContent {...listConfig} />
        </div> */}
        {
          list.length || JSON.stringify(searchParams) !== '{}' ? (
            <div className="list-content">
              <ListContent {...listConfig} />
            </div>
          ) : (
            <NoData
              isLoading={tableLoading}
              {...noDataConfig}
            />
          )
        }
        <ModalProject store={store} />
      </div>
    )
  }
}
