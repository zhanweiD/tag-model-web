import intl from 'react-intl-universal'
/**
 * @description 标签模型 - 标签维护
 */
import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import {Popconfirm, Button} from 'antd'
import {Link} from 'react-router-dom'

import {
  ListContent,
  projectProvider,
  OmitTooltip,
  Authority,
  NoData,
} from '../../../../component'
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
import DrawerInherit from './drawer-inherit'
import ModalApply from './modal-apply'
import ModalBack from './modal-back'

import store from './store'

@inject('bigStore')
@observer
class TagList extends Component {
  constructor(props) {
    super(props)
    store.projectId = props.projectId
    store.objId = +props.objId
    store.bigStore = props.bigStore
  }

  columns = [
    {
      key: 'name',
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'name',
      render: (text, record) => (
        <Link
          target="_blank"
          to={`/manage/tag-maintain/${record.id}/${store.projectId}`}
        >
          <OmitTooltip maxWidth={120} text={text} />
        </Link>
      ),
    },
    {
      key: 'enName',
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
        .d('标签标识'),
      dataIndex: 'enName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    },
    {
      key: 'configType',
      title: intl
        .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
        .d('绑定方式'),
      dataIndex: 'configType',
      render: v => <span>{tagConfigMethodTableMap[+v]}</span>,
    },
    {
      key: 'creator',
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.tag-list.hyc6hqhiwj8'
        )
        .d('创建方'),
      dataIndex: 'creator',
      render: (text, record) => (
        <span>
          {record.createType === 1
            ? intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.list.bty454nguz'
              )
              .d('租户')
            : record.projectName}
        </span>
      ),
    },
    {
      key: 'status',
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.16o5qwy427p'
        )
        .d('标签状态'),
      dataIndex: 'status',
      render: v => tagStatusBadgeMap(+v),
    },
    {
      key: 'isUsed',
      title: intl
        .get('ide.src.page-config.workspace-config.main.4eyw4o6e3dr')
        .d('使用状态'),
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
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      width: 180,
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* createType 0 自建 1 租户创建 */}
          {/* 标签状态: 待绑定 未使用  操作: 绑定/编辑/删除 */}

          {record.status === 0 && record.isVisual === 0 && (
            <Fragment>
              <Authority authCode="tag_model:bind_tag[cud]">
                <a
                  href
                  onClick={() => store.openTagConfig('one', record)}
                  className="mr16"
                >
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.08fwpftty43c'
                    )
                    .d('绑定')}
                </a>
              </Authority>
              {record.createType === 0 && (
                <Authority authCode="tag_model:create_tag[c]">
                  <a
                    href
                    onClick={() => store.openDrawer('edit', record)}
                    className="mr16"
                  >
                    {intl
                      .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                      .d('编辑')}
                  </a>
                  <Popconfirm
                    placement="topRight"
                    title={intl
                      .get(
                        'ide.src.page-manage.page-object-model.object-list.object-detail.tag-list.l8szpls536'
                      )
                      .d('标签被删除后不可恢复，确定删除？')}
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
              )}

              {record.createType === 1 && (
                <Authority authCode="tag_model:create_tag[c]">
                  <Popconfirm
                    placement="topRight"
                    title={intl
                      .get(
                        'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.v8o61gr7eeb'
                      )
                      .d('确定移除租户下标签？')}
                    onConfirm={() => this.removeTenant(record)}
                  >
                    <a href>
                      {intl
                        .get(
                          'ide.src.page-config.workspace-config.main.i53j7u2d9hs'
                        )
                        .d('移除')}
                    </a>
                  </Popconfirm>
                </Authority>
              )}
            </Fragment>
          )}

          {/* 标签状态: 待发布 未使用  操作: 发布/绑定/编辑/删除 */}
          {record.status === 1 && record.isVisual === 0 && (
            <Fragment>
              <Authority authCode="tag_model:publish_tag[u]">
                <Popconfirm
                  placement="topRight"
                  title={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.9cobnm296j6'
                    )
                    .d('确认发布？')}
                  onConfirm={() => store.updateTagStatus({
                    status: 2,
                    tagIdList: [record.id],
                  })
                  }
                >
                  <a className="mr16" href>
                    {intl
                      .get(
                        'ide.src.page-manage.page-object-model.detail.xs4lzzgw79d'
                      )
                      .d('发布')}
                  </a>
                </Popconfirm>
              </Authority>

              <Authority authCode="tag_model:bind_tag[cud]">
                <Popconfirm
                  placement="topRight"
                  title={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.e2m7j9snhbg'
                    )
                    .d('确认解绑？')}
                  onConfirm={() => this.cancelTagConfig(record)}
                >
                  <a href className="mr16">
                    {intl
                      .get(
                        'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.5n4f0xo7uzf'
                      )
                      .d('解绑')}
                  </a>
                </Popconfirm>
              </Authority>

              {/* <a href onClick={() => store.openDrawer('edit', record)}>编辑</a> */}
              {record.createType === 0 && (
                <Authority authCode="tag_model:create_tag[c]">
                  <a
                    href
                    onClick={() => store.openDrawer('edit', record)}
                    className="mr16"
                  >
                    {intl
                      .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                      .d('编辑')}
                  </a>

                  <Popconfirm
                    placement="topRight"
                    title={intl
                      .get(
                        'ide.src.page-manage.page-object-model.object-list.object-detail.tag-list.l8szpls536'
                      )
                      .d('标签被删除后不可恢复，确定删除？')}
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
              )}

              {record.createType === 1 && (
                <Authority authCode="tag_model:create_tag[c]">
                  {/* <Popconfirm placement="topRight" title="确定移除租户下标签？" onConfirm={() => this.removeTenant(record)}> */}
                  <a disabled href>
                    {intl
                      .get(
                        'ide.src.page-config.workspace-config.main.i53j7u2d9hs'
                      )
                      .d('移除')}
                  </a>
                  {/* </Popconfirm> */}
                </Authority>
              )}
            </Fragment>
          )}

          {/* 标签状态: 已发布 未使用 下架  操作: 取消发布/上架申请 */}
          {/* {record.status === 2 && record.isUsed === 0 && record.publish === 0 && ( */}
          {record.status === 2 && record.isUsed === 0 && record.isVisual === 0 && (
            <Fragment>
              <Authority authCode="tag_model:publish_tag[u]">
                <Popconfirm
                  placement="topRight"
                  title={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.8qsv9py158c'
                    )
                    .d('确认取消发布？')}
                  onConfirm={() => store.updateTagStatus({
                    status: 1,
                    tagIdList: [record.id],
                  })
                  }
                >
                  <a href>
                    {intl
                      .get(
                        'ide.src.page-manage.page-object-model.detail.a24dcsgx9g8'
                      )
                      .d('取消发布')}
                  </a>
                </Popconfirm>
              </Authority>
              <Authority authCode="tag_model:apply_project_tag[c]">
                <a href onClick={() => this.openModal(record)} className="ml16">
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.akndhvsabkj'
                    )
                    .d('授权')}
                </a>
                <a
                  href
                  onClick={() => this.openBackModal(record)}
                  className="ml16"
                >
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.sanswpjatfc'
                    )
                    .d('回收')}
                </a>
              </Authority>
            </Fragment>
          )}

          {/* 标签状态: 已发布 已使用 */}
          {record.status === 2 && record.isUsed === 1 && record.isVisual === 0 && (
            <Fragment>
              <Authority authCode="tag_model:publish_tag[u]">
                <span className="disabled">
                  {intl
                    .get(
                      'ide.src.page-manage.page-object-model.detail.a24dcsgx9g8'
                    )
                    .d('取消发布')}
                </span>
              </Authority>
              <Authority authCode="tag_model:apply_project_tag[c]">
                <a href onClick={() => this.openModal(record)} className="ml16">
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.akndhvsabkj'
                    )
                    .d('授权')}
                </a>
                <a
                  href
                  onClick={() => this.openBackModal(record)}
                  className="ml16"
                >
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.sanswpjatfc'
                    )
                    .d('回收')}
                </a>
              </Authority>
            </Fragment>
          )}

          {/* 可视化加工标签 待发布 */}
          {record.isVisual === 1 && record.status === 1 && (
            <Authority authCode="tag_model:publish_tag[u]">
              <Popconfirm
                placement="topRight"
                title={intl
                  .get(
                    'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.9cobnm296j6'
                  )
                  .d('确认发布？')}
                onConfirm={() => store.updateTagStatus({
                  status: 2,
                  tagIdList: [record.id],
                })
                }
              >
                <a href>
                  {intl
                    .get(
                      'ide.src.page-manage.page-object-model.detail.xs4lzzgw79d'
                    )
                    .d('发布')}
                </a>
              </Popconfirm>
            </Authority>
          )}

          {/* 可视化加工标签 发布 */}
          {record.isVisual === 1 && record.status === 2 && record.isUsed === 0 && (
            <Fragment>
              <Authority authCode="tag_model:publish_tag[u]">
                <Popconfirm
                  placement="topRight"
                  title={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.8qsv9py158c'
                    )
                    .d('确认取消发布？')}
                  onConfirm={() => store.updateTagStatus({
                    status: 1,
                    tagIdList: [record.id],
                  })
                  }
                >
                  <a href>
                    {intl
                      .get(
                        'ide.src.page-manage.page-object-model.detail.a24dcsgx9g8'
                      )
                      .d('取消发布')}
                  </a>
                </Popconfirm>
              </Authority>
              <Authority authCode="tag_model:apply_project_tag[c]">
                <a href onClick={() => this.openModal(record)} className="ml16">
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.akndhvsabkj'
                    )
                    .d('授权')}
                </a>
                <a
                  href
                  onClick={() => this.openBackModal(record)}
                  className="ml16"
                >
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.sanswpjatfc'
                    )
                    .d('回收')}
                </a>
              </Authority>
            </Fragment>
          )}

          {/* 可视化加工标签 发布 已使用 */}
          {record.status === 2 && record.isUsed === 1 && record.isVisual === 1 && (
            <Fragment>
              <Authority authCode="tag_model:publish_tag[u]">
                <span className="disabled">
                  {intl
                    .get(
                      'ide.src.page-manage.page-object-model.detail.a24dcsgx9g8'
                    )
                    .d('取消发布')}
                </span>
              </Authority>
              <Authority authCode="tag_model:apply_project_tag[c]">
                <a href onClick={() => this.openModal(record)} className="mr16">
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.akndhvsabkj'
                    )
                    .d('授权')}
                </a>
                <a
                  href
                  onClick={() => this.openBackModal(record)}
                  className="ml16"
                >
                  {intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.sanswpjatfc'
                    )
                    .d('回收')}
                </a>
              </Authority>
            </Fragment>
          )}
        </div>
      ),
    },
  ]

  @action.bound remove(data) {
    store.deleteTag({
      deleteIds: [data.id],
    })
  }

  @action.bound removeTenant(data) {
    store.deleteTenantTag({
      tagId: data.id,
    })
  }

  @action.bound cancelTagConfig(data) {
    store.cancelTagConfig({
      tagId: data.id,
      configType: data.configType,
    })
  }

  @action.bound openModal(data) {
    // if (!store.projectName) {
    //   store.getProjectDetail()
    // }
    store.tagId = data.id
    store.selectItem = data
    store.modalApplyVisible = true
    store.getApplyProject()
  }

  @action.bound openBackModal(data) {
    store.tagId = data.id
    store.selectItem = data
    store.modalBackVisible = true
    store.getApplyProject()
  }

  componentWillMount() {
    if (store.projectId) {
      // store.getAuthCode()
      this.initData()
      store.checkKeyWord()
    }
  }

  componentDidMount() {
    if (store.projectId) {
      // 获取所属对象下拉数据
      store.getObjectSelectList()

      // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
      // 若返回数据为空[]。则渲染 NoData 组件。
      // store.initParams = {projectId: store.projectId, objId: store.objId}
      store.getList({
        projectId: store.projectId,
        objId: store.objId,
      })
    }
  }

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    if (
      !_.isEqual(updateDetailKey, next.updateDetailKey)
      || !_.isEqual(+objId, +next.objId)
    ) {
      store.objId = +next.objId
      store.initParams = {projectId: store.projectId, objId: store.objId}
      store.getList({objId: next.objId, currentPage: 1})
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
    const {searchParams} = store

    if (JSON.stringify(searchParams) === '{}') {
      return false
    }
    return true
  }

  // 继承标签
  inheritTag = () => {
    store.getTagTree()

    store.drawerInheritVis = true
  }

  render() {
    const {
      projectId,
      objId,
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
    const publishRowKeysLength = publishRowKeys.length
    // console.log(list)
    const rowSelection = {
      selectedRowKeys: publishRowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.status !== 1, // 权限审批中的，不可进行申请、批量申请，且显示审批中
      }),
    }

    const noDataConfig = {
      btnText: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.s5rfkq7s99'
        )
        .d('新建标签'),
      onClick: () => store.openDrawer('add'),
      text: intl
        .get(
          'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.2mn8z380crc'
        )
        .d('没有任何标签，去新建标签吧'),
      code: 'tag_model:create_tag[c]',
      noAuthText: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.tag-class-list.vzvrj7cdfdm'
        )
        .d('没有任何标签'),
      isLoading: tableLoading,
    }

    const listConfig = {
      rowSelection,
      columns: this.columns,
      scroll: {x: 800},
      initParams: {projectId, objId: store.objId},
      searchParams: seach({objectSelectList: toJS(objectSelectList)}),
      buttons: [
        <Authority authCode="tag_model:create_tag[c]">
          <Button
            type="primary"
            className="mr8"
            onClick={() => store.openDrawer('add')}
          >
            {intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.s5rfkq7s99'
              )
              .d('新建标签')}
          </Button>
        </Authority>,
        <Authority authCode="tag_model:publish_tag[u]">
          <Button
            className="mr8"
            onClick={() => store.batchPublish()}
            disabled={!publishRowKeysLength}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.cen2ew5ntnr',
                {publishRowKeysLength}
              )
              .d('批量发布({publishRowKeysLength})')}
          </Button>
        </Authority>,
        <Authority authCode="tag_model:bind_tag[cud]">
          <Button className="mr8" onClick={() => store.openBatchConfig()}>
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.k6710jvgtnk'
              )
              .d('批量绑定')}
          </Button>
        </Authority>,
        <Authority authCode="tag_model:create_tag[c]">
          <Button onClick={() => this.inheritTag()}>
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.main.l43rimqp13'
              )
              .d('继承标签')}
          </Button>
        </Authority>,
      ],

      rowKey: 'id',
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    return (
      <Provider bigStore={store}>
        <div>
          {/* <div className="content-header">标签维护</div> */}
          <div className="config-tag">
            <ListContent {...listConfig} />
          </div>
          {/* {
             !list.length && !this.isSearch() ? (
               <div style={{paddingTop: '15%'}}>
                 <NoData
                 // isLoading={tableLoading}
                   {...noDataConfig}
                   // style={{marginTop: '15%'}}
                 />
               </div>
             ) : <div className="config-tag"><ListContent {...listConfig} /></div>
            } */}

          <ModalTagApply store={store} />
          <DrawerCreate store={store} />
          <ModalApply store={store} />
          <ModalBack store={store} />
          <DrawerTagConfig
            objId={store.objId}
            projectId={projectId}
            visible={drawerTagConfigVisible}
            info={drawerTagConfigInfo}
            onClose={closeTagConfig}
            onUpdate={updateTagConfig}
            type={drawerTagConfigType}
          />

          <DrawerBatchConfig
            objId={store.objId}
            objStore={store.bigStore}
            projectId={projectId}
            visible={batchConfigVisible}
            objectSelectList={objectSelectList}
          />

          <DrawerInherit />
        </div>
      </Provider>
    )
  }
}

export default projectProvider(TagList)
