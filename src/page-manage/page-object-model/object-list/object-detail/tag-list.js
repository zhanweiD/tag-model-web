import intl from 'react-intl-universal'
import {Component, Fragment} from 'react'
import {Input, Popconfirm, Button} from 'antd'
import {action, toJS} from 'mobx'
import {inject} from 'mobx-react'
import {SearchOutlined} from '@ant-design/icons'
import {
  ListContent,
  Authority,
} from '../../../../component'
import {tagStatusBadgeMap} from '../../../page-tag-model/tag-model/util'
import DrawerCreate from './drawer-create'
import store from './store-tag-list'


@inject('bigStore')
class TagList extends Component {
  constructor(props) {
    super(props)
    const {bigStore} = props
    this.bigStore = bigStore
    store.projectId = undefined
    // store.projectId = bigStore.projectId
    store.objId = bigStore.objId
  }

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'name',
      // render: (text, record) => <Link target="_blank" to={`/manage/object-model/${record.id}/${store.projectId}`}><OmitTooltip maxWidth={120} text={text} /></Link>,
    },
    {
      title: intl
        .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
        .d('绑定方式'),
      dataIndex: 'configType',
      render: text => (text === 1
        ? intl
          .get(
            'ide.src.page-manage.page-common-tag.detail.main.mfs279f7xcc'
          )
          .d('衍生标签')
        : intl
          .get(
            'ide.src.page-manage.page-common-tag.detail.main.vwwmvcib39m'
          )
          .d('基础标签')),
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
        .d('标签标识'),
      dataIndex: 'enName',
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
      key: 'action',
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      width: 180,
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* 标签状态: 待绑定  操作: 编辑/删除 */}
          {record.status === 0 && (
            <Fragment>
              <Authority
                authCode="tag_model:update_tag_cate[cud]"
                isCommon
              >
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
            </Fragment>
          )}

          {/* 标签状态: 待发布  操作: 编辑/删除 */}
          {record.status === 1 && (
            <Fragment>
              {/* <a href onClick={() => store.openDrawer('edit', record)}>编辑</a> */}
              <Authority
                authCode="tag_model:update_tag_cate[cud]"
                isCommon
              >
                <span className="disabled mr16">
                  {intl
                    .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                    .d('编辑')}
                </span>

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
            </Fragment>
          )}

          {/* 标签状态: 已发布  操作: 编辑/删除 */}
          {/* {record.status === 2 && record.isUsed === 0 && record.publish === 0 && ( */}
          {record.status === 2 && (
            <Fragment>
              <Authority
                authCode="tag_model:update_tag_cate[cud]"
                isCommon
              >
                {/* <a href onClick={() => store.openDrawer('edit', record)} className="mr16">编辑</a> */}
                <span className="disabled mr16">
                  {intl
                    .get('ide.src.component.label-item.label-item.slnqvyqvv7')
                    .d('编辑')}
                </span>
                <span className="disabled mr16">
                  {intl
                    .get(
                      'ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi'
                    )
                    .d('删除')}
                </span>
                {/* <Popconfirm placement="topRight" title="标签被删除后不可恢复，确定删除？" onConfirm={() => this.remove(record)}>
           <a href>删除</a>
          </Popconfirm> */}
              </Authority>
            </Fragment>
          )}
        </div>
      ),
    },
  ]

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    if (
      !_.isEqual(updateDetailKey, next.updateDetailKey)
      || !_.isEqual(+objId, +next.objId)
    ) {
      store.objId = next.objId
      store.getList({objId: next.objId, currentPage: 1})
    }
  }

  @action.bound remove(data) {
    store.deleteTag({
      deleteIds: [data.id],
    })
  }

  @action.bound onChange(e) {
    const searchKey = e.target.value
    store.getList({
      currentPage: 1,
      searchKey,
    })
  }

  componentWillMount() {
    // if (store.projectId) {
    // store.getAuthCode()
    //   this.initData()
    //   store.checkKeyWord()
    // }
    if (store.objId) {
      // store.getAuthCode()
      this.initData()
      store.checkKeyWord()
    }
  }

  componentDidMount() {
    // if (store.projectId) {
    // 获取所属对象下拉数据
    // store.getObjectSelectList()

    // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
    // 若返回数据为空[]。则渲染 NoData 组件。
    // store.initParams = {projectId: store.projectId}
    // store.getList({
    //   projectId: store.projectId,
    // })
    // }
    if (store.projectId) {
      // 获取所属对象下拉数据
      store.getObjectSelectList()

      // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
      // 若返回数据为空[]。则渲染 NoData 组件。
      // store.initParams = {projectId: store.projectId}
      store.getList({
        objId: store.objId,
      })
    }
  }

  @action initData() {
    store.list.clear()
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  isSearch = () => {
    const {searchParams} = store

    if (JSON.stringify(searchParams) === '{}') {
      return false
    }
    return true
  }

  render() {
    const listConfig = {
      columns: this.columns,
      initParams: {objId: +store.objId},
      buttons: [
        <div className="pr24 far" style={{display: 'float'}}>
          <div style={{float: 'left', marginBottom: '8px'}}>
            <Authority
              authCode="tag_model:update_tag_cate[cud]"
              isCommon
            >
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
            </Authority>
          </div>
          <div style={{float: 'right', marginBottom: '8px'}}>
            <Input
              onChange={e => this.onChange(e)}
              style={{width: 200}}
              size="small"
              placeholder={intl
                .get(
                  'ide.src.page-manage.page-object-model.object-list.object-detail.tag-list.ncn8t6qj01d'
                )
                .d('请输入标签名称关键字')}
              suffix={<SearchOutlined />}
            />
          </div>
        </div>,
      ],
      store,
    }

    return (
      <div>
        <ListContent {...listConfig} />
        <DrawerCreate store={store} />
      </div>
    )
  }
}
export default TagList
