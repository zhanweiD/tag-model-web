/**
 * @description 项目空间-标签管理
 */
import {Component, Fragment} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Button, Popconfirm} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent, Loading, NoData} from '../../component'
import {
  tagStatusBadgeMap,
  usedStatusBadgeMap,
  publishStatusBadgeMap,
  tagConfigMethodTableMap,
} from './util'
import seach from './search'
import ModalTagApply from './modal-tag-apply'
import DrawerCreate from './drawer-create'
import DrawerTagConfig from '../tag-config'

import store from './store'

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const {navListMap} = window.__keeper
const navList = [
  navListMap.tagCenter,
  {text: navListMap.tagManagement.text},
]

@inject('frameChange')
@observer
export default class TagManagement extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId
  }

  columns = [{
    key: 'name',
    title: '标签名称',
    dataIndex: 'name',
    render: (text, record) => <Link to={`/${record.id}`}>{text}</Link>,
  }, {
    key: 'configType',
    title: '配置方式',
    dataIndex: 'configType',
    render: v => <span>{tagConfigMethodTableMap[+v]}</span>,
  }, {
    key: 'objName',
    title: '对象',
    dataIndex: 'objName',
  }, {
    key: 'creator',
    title: '创建人',
    dataIndex: 'creator',
  }, {
    key: 'status',
    title: '标签状态',
    dataIndex: 'status',
    render: v => tagStatusBadgeMap(+v),
  }, {
    key: 'isUsed',
    title: '使用状态',
    dataIndex: 'isUsed',
    render: v => usedStatusBadgeMap(+v),
  }, {
    key: 'publish',
    title: '公开状态',
    dataIndex: 'publish',
    render: v => publishStatusBadgeMap(+v),
  }, {
    key: 'action',
    title: '操作',
    width: 150,
    render: (text, record) => (
      <div className="FBH FBAC">
        {/* 标签状态: 待配置 未使用  操作: 配置/编辑/删除 */}
        {record.status === 0 && (
          <Fragment>
            <a href onClick={() => store.openTagConfig(record)}>配置</a>
            <span className="table-action-line" />
            <a href onClick={() => store.openDrawer('edit', record)}>编辑</a>
            <span className="table-action-line" />
            <Popconfirm placement="topRight" title="确认删除？" onConfirm={() => this.remove(record)}>
              <a href>删除</a>
            </Popconfirm>
          </Fragment>
        )}

        {/* 标签状态: 待发布 未使用  操作: 发布/配置/编辑/删除 */}
        {record.status === 1 && (
          <Fragment>
            <Popconfirm
              placement="topRight"
              title="确认发布？"
              onConfirm={() => store.updateTagStatus({
                status: 2,
                id: record.id,
              })}
            >
              <a href>发布</a>
            </Popconfirm>
            <span className="table-action-line" />
            <a href onClick={() => store.openTagConfig(record)}>配置</a>
            <span className="table-action-line" />
            <a href onClick={() => store.openDrawer('edit', record)}>编辑</a>
            <span className="table-action-line" />
            <Popconfirm placement="topRight" title="确认删除？" onConfirm={() => this.remove(record)}>
              <a href>删除</a>
            </Popconfirm>
          </Fragment>
        )}

        {/* 标签状态: 已发布 未使用 下架  操作: 取消发布/上架申请 */}
        {record.status === 2 && record.isUsed === 0 && record.publish === 0 && (
          <Fragment>
            <Popconfirm
              placement="topRight"
              title="确认取消发布？"
              onConfirm={() => store.updateTagStatus({
                status: 1,
                id: record.id,
              })}
            >
              <a href>取消发布</a>
            </Popconfirm>
            <span className="table-action-line" />
            <a href onClick={() => store.openModal({type: 1, id: record.id})}>上架申请</a>
          </Fragment>
        )}

        {/* 标签状态: 已发布 未使用 上架审核中 操作: 取消申请 */}
        {record.status === 2 && record.isUsed === 0 && record.publish === 2 && (
          <Popconfirm
            placement="topRight"
            title="确认取消申请？"
            onConfirm={() => store.tagApply({
              type: 3,
              id: record.id,
            })}
          >
            <a href>取消申请</a>
          </Popconfirm>
        )}
        {/* 标签状态: 已发布 未使用 上架 操作: 下架申请 */}
        {record.status === 2
          && record.isUsed === 0
          && record.publish === 1
          && <a href onClick={() => store.openModal({type: 0, id: record.id})}>下架申请</a>}

        {/* 标签状态: 已发布 未使用 下架审核中 操作: 取消申请 */}
        {record.status === 2 && record.isUsed === 0 && record.publish === 3 && (
          <Popconfirm
            placement="topRight"
            title="确认取消申请？"
            onConfirm={() => store.tagApply({
              type: 3,
              id: record.id,
            })}
          >
            <a href>取消申请</a>
          </Popconfirm>
        )}

        {/* 标签状态: 已发布 已使用 下架 操作: 上架申请 */}
        {record.status === 2
          && record.isUsed === 1
          && record.publish === 0
          && <a href onClick={() => store.openModal({type: 1, id: record.id})}>上架申请</a>}

        {/* 标签状态: 已发布 已使用 上架审核中 操作: 取消申请 */}
        {record.status === 2 && record.isUsed === 1 && record.publish === 2 && (
          <Popconfirm
            placement="topRight"
            title="确认取消申请？"
            onConfirm={() => store.tagApply({
              type: 3,
              id: record.id,
            })}
          >
            <a href>取消申请</a>
          </Popconfirm>
        )}

        {/* 标签状态: 已发布 已使用 上架 操作: 下架申请 */}
        {record.status === 2
          && record.isUsed === 1
          && record.publish === 1
          && <a href onClick={() => store.openModal({type: 0, id: record.id})}>下架申请</a>}

        {/* 标签状态: 已发布 已使用 下架审核中 操作: 取消申请 */}
        {record.status === 2 && record.isUsed === 1 && record.publish === 3 && (
          <Popconfirm
            placement="topRight"
            title="确认取消申请？"
            onConfirm={() => store.tagApply({
              type: 3,
              id: record.id,
            })}
          >
            <a href>取消申请</a>
          </Popconfirm>
        )}
      </div>
    ),
  }]

  @action remove(data) {
    store.deleteTag({
      deleteId: data.id,
    })
  }

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    // 获取所属对象下拉数据
    store.getObjectSelectList() 
  }

  // 跳转到项目列表
  goProjectList = () => {
    window.location.href = `${window.__onerConfig.pathPrefix || '/'}/project`
  }

  renderNodata =() => {
    const {spaceInfo} = window

    const noProjectDataConfig = {
      btnText: '去创建项目',
      onClick: this.goProjectList,
      text: '没有任何项目，去项目列表页创建项目吧！',
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
      drawerTagConfigInfo,
      drawerTagConfigVisible,
      closeTagConfig,
      updateTagConfig,
      objectSelectList,
      openDrawer,
    } = store

    const listConfig = {
      columns: this.columns,
      initParams: {projectId},
      searchParams: seach({objectSelectList}),
      buttons: [<Button type="primary" onClick={() => openDrawer('add')}>创建标签</Button>],
      rowKey: 'id',
      store, // 必填属性
    }

    const {spaceInfo} = window

    return (
      <div>
        <div className="content-header">{navListMap.tagManagement.text}</div>
        {
          spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length
            ? (
              <Fragment>
                <div className="m16">
                  <ListContent {...listConfig} />
                </div>
                <ModalTagApply store={store} />
                <DrawerCreate store={store} />
                <DrawerTagConfig
                  projectId={projectId}
                  visible={drawerTagConfigVisible}
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
