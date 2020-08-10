/**
 * @description 标签管理 - 标签模型
 */
import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, Provider} from 'mobx-react'
import {Popconfirm, Button} from 'antd'
import {Link} from 'react-router-dom'

import {
  ListContent, projectProvider, OmitTooltip, Authority, NoData,
} from '../../../component'
import {
  tagStatusBadgeMap,
  usedStatusBadgeMap,
  // publishStatusBadgeMap,
  tagConfigMethodTableMap,
} from '../util'
import seach from './search'
import ModalTagApply from './modal-tag-apply'
import DrawerCreate from './drawer-create'
import DrawerTagConfig from '../tag-config'
import DrawerBatchConfig from '../tag-config-batch'

import store from './store'

@observer
class TagList extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
  }

  columns = [{
    key: 'name',
    title: '标签名称',
    dataIndex: 'name',
    render: (text, record) => <Link to={`/manage/tag-maintain/${record.id}`}><OmitTooltip maxWidth={120} text={text} /></Link>,
  }, {
    key: 'configType',
    title: '绑定方式',
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
  }, 
  // {
  //   key: 'publish',
  //   title: '公开状态',
  //   dataIndex: 'publish',
  //   render: v => publishStatusBadgeMap(+v),
  // }, 
  {
    key: 'action',
    title: '操作',
    width: 180,
    render: (text, record) => (
      <div className="FBH FBAC">
        <Authority
          code="asset_tag_project_tag_operator"
          myFunctionCodes={store.functionCodes}
          isButton={false}
        >
          {/* 标签状态: 待绑定 未使用  操作: 绑定/编辑/删除 */}
          {record.status === 0 && record.isVisual === 0 && (
            <Fragment>
              <a href onClick={() => store.openTagConfig('one', record)}>绑定</a>
              <span className="table-action-line" />
              <a href onClick={() => store.openDrawer('edit', record)}>编辑</a>
              <span className="table-action-line" />
              <Popconfirm placement="topRight" title="标签被删除后不可恢复，确定删除？" onConfirm={() => this.remove(record)}>
                <a href>删除</a>
              </Popconfirm>
            </Fragment>
          )}

          {/* 标签状态: 待发布 未使用  操作: 发布/绑定/编辑/删除 */}
          {record.status === 1 && record.isVisual === 0 && (
            <Fragment>
              <Popconfirm
                placement="topRight"
                title="确认发布？"
                onConfirm={() => store.updateTagStatus({
                  status: 2,
                  tagIdList: [record.id],
                })}
              >
                <a href>发布</a>
              </Popconfirm>
              <span className="table-action-line" />
              <a href onClick={() => store.openTagConfig('one', record)}>解绑</a>
              <span className="table-action-line" />
              {/* <a href onClick={() => store.openDrawer('edit', record)}>编辑</a> */}
              <span className="disabled">编辑</span>
              <span className="table-action-line" />
              <Popconfirm placement="topRight" title="标签被删除后不可恢复，确定删除？" onConfirm={() => this.remove(record)}>
                <a href>删除</a>
              </Popconfirm>
            </Fragment>
          )}

          {/* 标签状态: 已发布 未使用 下架  操作: 取消发布/上架申请 */}
          {/* {record.status === 2 && record.isUsed === 0 && record.publish === 0 && ( */}
          {record.status === 2 && record.isUsed === 0 && record.isVisual === 0 && (
            <Fragment>
              <Popconfirm
                placement="topRight"
                title="确认取消发布？"
                onConfirm={() => store.updateTagStatus({
                  status: 1,
                  tagIdList: [record.id],
                })}
              >
                <a href>取消发布</a>
              </Popconfirm>
            </Fragment>
          )}

          {/* 标签状态: 已发布 已使用 */}
          {record.status === 2
          && record.isUsed === 1
          && record.isVisual === 0 
          && <span className="disabled">取消发布</span>}

          {/* 可视化加工标签 待发布 */}
          {record.isVisual === 1 && record.status === 1 && (
            <Popconfirm
              placement="topRight"
              title="确认发布？"
              onConfirm={() => store.updateTagStatus({
                status: 2,
                tagIdList: [record.id],
              })}
            >
              <a href>发布</a>
            </Popconfirm>
          )}

          {/* 可视化加工标签 发布 */}
          {record.isVisual === 1 
          && record.status === 2 
          && record.isUsed === 0
          && (
            <Popconfirm
              placement="topRight"
              title="确认取消发布？"
              onConfirm={() => store.updateTagStatus({
                status: 1,
                tagIdList: [record.id],
              })}
            >
              <a href>取消发布</a>

            </Popconfirm>
          )}

          {/* 可视化加工标签 发布 已使用 */}
          {record.status === 2
          && record.isUsed === 1
          && record.isVisual === 1
          && <span className="disabled">取消发布</span>}

        </Authority>
      </div>
    ),
  }]

  @action remove(data) {
    store.deleteTag({
      deleteIds: [data.id],
    })
  }

  componentWillMount() {
    if (store.projectId) {
      store.getAuthCode()
      this.initData()
    }
  }

  componentDidMount() {
    if (store.projectId) {
      // 获取所属对象下拉数据
      store.getObjectSelectList() 

      // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
      // 若返回数据为空[]。则渲染 NoData 组件。

      store.getList({
        projectId: store.projectId,
      })
    }
  }

  // 初始化数据，一般情况不需要，此项目存在项目空间中项目的切换，全局性更新，较为特殊
  @action initData() {
    store.list.clear()
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  @action.bound onTableCheck(selectedRowKeys) {
    // // 表格 - 已选项
    // store.selectedRows = selectedRows

    // 表格 - 已选项key数组
    store.publishRowKeys = selectedRowKeys
  }


  // 是否有进行搜索操作
  isSearch = () => {
    const {
      searchParams,
    } = store

    if (
      JSON.stringify(searchParams) === '{}'
    ) {
      return false
    }
    return true
  }

  render() {
    const {
      projectId,
      drawerTagConfigInfo,
      drawerTagConfigVisible,
      closeTagConfig,
      updateTagConfig,
      objectSelectList,
      // openDrawer, 
      list, 
      tableLoading,
      drawerTagConfigType,
      batchConfigVisible,
      publishRowKeys,
    } = store

    const rowSelection = {
      selectedRowKeys: publishRowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.status !== 1, // 权限审批中的，不可进行申请、批量申请，且显示审批中
      }),
    }

    const noDataConfig = {
      btnText: '新建标签',
      onClick: () => store.openDrawer('add'),
      text: '没有任何标签，去新建标签吧',
      // code: 'asset_tag_project_tag_operator',
      // myFunctionCodes: store.functionCodes,
      // noAuthText: '没有任何标签',
    }

    const listConfig = {
      rowSelection,
      columns: this.columns,
      initParams: {projectId},
      searchParams: seach({objectSelectList: toJS(objectSelectList)}),
      buttons: [
        <Authority
          authCode="tag_model:create_tag[c]"
          type="primary"
          onClick={() => store.openDrawer('add')}
          className="mr8"
        >
        新建标签
        </Authority>, 
        <Authority
          authCode="tag_model:publish_tag[u]"
        >
          <Button className="mr8" onClick={() => store.batchPublish()} disabled={!publishRowKeys.length}>批量发布</Button>
        </Authority>,
        <Authority
          authCode="tag_model:bind_tag[cud]"
        >
          <Button onClick={() => store.openBatchConfig()}>批量绑定</Button>
        </Authority>,

      ],
      rowKey: 'id',
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    return (
      <Provider bigStore={store}>
        <div>
          <div className="content-header">标签维护</div>
          {
            !list.length && !this.isSearch() ? (
              <NoData
                isLoading={tableLoading}
                {...noDataConfig}
              />
            ) : <div className="header-page box-border"><ListContent {...listConfig} /></div>
          }

          <ModalTagApply store={store} />
          <DrawerCreate store={store} />
          <DrawerTagConfig
            projectId={projectId}
            visible={drawerTagConfigVisible}
            info={drawerTagConfigInfo}
            onClose={closeTagConfig}
            onUpdate={updateTagConfig}
            type={drawerTagConfigType}
          />
          <DrawerBatchConfig 
            projectId={projectId}
            visible={batchConfigVisible}
            objectSelectList={objectSelectList}
          />
        </div>
      </Provider>
    )
  }
}

export default projectProvider(TagList)
