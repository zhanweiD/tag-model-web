import intl from 'react-intl-universal'
/**
 * @description 公共标签（标签集市）
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Button} from 'antd'
import {Link} from 'react-router-dom'
import {ListContent, Tag, Authority, OmitTooltip} from '../../../component'
import {getDataTypeName} from '../../../common/util'
import Search from './search'
import Modal from './modal'

import store from './store'

@observer
class Market extends Component {
  constructor(props) {
    super(props)
    store.useProjectId = props.projectId
  }

  componentDidMount() {
    // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
    // 若返回数据为空[]。则渲染 NoData 组件。
    // 要是请求放在列表组件ListContent中的话, 就必须渲染表格的dom 影响体验
    if (store.useProjectId) {
      store.getList({
        useProjectId: store.useProjectId,
        type: 2,
      })

      store.initParams = {
        useProjectId: store.useProjectId,
        type: 2,
      }
    } else {
      store.getList()
    }
  }

  componentWillUnmount() {
    store.tagIds.clear()
    store.selectedRows.clear()
    store.rowKeys.clear()
    store.selectItem = {}

    store.objectId = ''
    store.ownProjectId = ''
    store.projectPermission = 2

    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
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
      fixed: 'left',
      render: (text, record) => (
        <div className="FBH">
          <Link
            target="_blank"
            to={`/manage/common-tag/${record.id}/${store.useProjectId}`}
          >
            {text}
          </Link>
          {(() => {
            if (record.status === 1) {
              return (
                <Tag
                  status="process"
                  className="ml8"
                  text={intl
                    .get(
                      'ide.src.page-common.approval.common.comp-approval-modal.nb8qntq7vug'
                    )
                    .d('审批中')}
                />
              )
            }
            //    "status":0, //状态 0：可以申请 1 审批中 2 不可以申请 3 可以申请当前有权限
            if (record.status === 2 || record.status === 3) {
              return (
                <Tag
                  status="success"
                  className="ml8"
                  text={intl
                    .get(
                      'ide.src.page-manage.page-common-tag.common-tag.list.imf5yhtwj8c'
                    )
                    .d('有权限')}
                />
              )
            }
            return null
          })()}
        </div>
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
      key: 'objName',
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
        )
        .d('对象'),
      dataIndex: 'objName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    },
    {
      key: 'valueType',
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
        .d('数据类型'),
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    },
    {
      key: 'projectName',
      title: intl
        .get('ide.src.component.comp.search.h5l3m6s8dn7')
        .d('所属项目'),
      dataIndex: 'projectName',
      render: (text, record) => (
        <span>
          {record.projectName
            ? record.projectName
            : intl
              .get(
                'ide.src.page-manage.page-common-tag.common-tag.list.bty454nguz'
              )
              .d('租户')}
        </span>
      ),
    },
    {
      key: 'action',
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      width: 150,
      fixed: 'right',
      render: (text, record) => (
        <div className="FBH FBAC">
          <Authority authCode="tag_model:apply_tag[c]">
            {(() => {
              if (store.useProjectId) {
                if (
                  (record.status === 1 || record.status === 2)
                  && !record.endTime
                ) {
                  // 状态 0：可以申请 1 审批中 2 不可以申请 3 可以申请当前有权限
                  return (
                    <Fragment>
                      {/* <span className="table-action-line" />  */}
                      <span className="disabled">
                        {intl
                          .get(
                            'ide.src.page-manage.page-common-tag.common-tag.list.0ho0lb3mlo86'
                          )
                          .d('申请')}
                      </span>
                    </Fragment>
                  )
                }
                return (
                  <Fragment>
                    {/* <span className="table-action-line" />  */}
                    <a href onClick={() => this.openModal(record, 'one')}>
                      {intl
                        .get(
                          'ide.src.page-manage.page-common-tag.common-tag.list.0ho0lb3mlo86'
                        )
                        .d('申请')}
                    </a>
                  </Fragment>
                )
              }
              return null
            })()}
          </Authority>
        </div>
      ),
    },
  ]

  columnsP = [
    {
      key: 'name',
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'name',
      render: (text, record) => (
        <div className="FBH">
          {/* <OmitTooltip maxWidth={120} text={text} /> */}
          <Link
            target="_blank"
            to={`/manage/common-tag/${record.id}/${store.useProjectId}`}
          >
            {text}
          </Link>
          {(() => {
            if (record.status === 1) {
              return (
                <Tag
                  status="process"
                  className="ml8"
                  text={intl
                    .get(
                      'ide.src.page-common.approval.common.comp-approval-modal.nb8qntq7vug'
                    )
                    .d('审批中')}
                />
              )
            }
            //    "status":0, //状态 0：可以申请 1 审批中 2 不可以申请 3 可以申请当前有权限
            if (record.status === 2 || record.status === 3) {
              return (
                <Tag
                  status="success"
                  className="ml8"
                  text={intl
                    .get(
                      'ide.src.page-manage.page-common-tag.common-tag.list.imf5yhtwj8c'
                    )
                    .d('有权限')}
                />
              )
            }
            return null
          })()}
        </div>
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
      key: 'objName',
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.modal.hdb36gt6rzf'
        )
        .d('对象'),
      dataIndex: 'objName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    },
    {
      key: 'valueType',
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
        .d('数据类型'),
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    },
    {
      key: 'projectName',
      title: intl
        .get('ide.src.component.comp.search.h5l3m6s8dn7')
        .d('所属项目'),
      dataIndex: 'projectName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    },
  ]

  @action.bound openModal(data, type) {
    store.modalType = type
    store.selectItem = data
    store.tagIds.replace([data.id])
    store.modalVisible = true
  }

  @action.bound onTableCheck(selectedRowKeys, selectedRows) {
    // 表格 - 已选项
    store.selectedRows = selectedRows

    // 表格 - 已选项key数组
    store.rowKeys = selectedRowKeys
  }

  /*
   * @description 批量申请
   */
  @action.bound batchApply() {
    store.modalType = 'batch'
    store.tagIds.replace(store.rowKeys)
    store.modalVisible = true
  }

  // // 跳转到标签模型
  // goTagManager = () => {
  //   window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/tag-model`
  // }

  render() {
    const {useProjectId, isProject} = store

    const rowSelection = {
      selectedRowKeys: store.rowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.status, // 权限审批中的，不可进行申请、批量申请，且显示审批中
      }),
    }

    const rowKeysLength = store.rowKeys.length
    const listConfig = {
      columns: isProject ? this.columns : this.columnsP,
      buttons: useProjectId
        ? [
          <Authority authCode="tag_model:apply_tag[c]">
            <Button
              type="primary"
              disabled={!rowKeysLength}
              onClick={this.batchApply}
            >
              {intl
                .get(
                  'ide.src.page-manage.page-common-tag.common-tag.list.hkbkoz3q5y',
                  {rowKeysLength}
                )
                .d('批量申请({rowKeysLength})')}
            </Button>
          </Authority>,
          // ,
          // <span className="ml8">
          //   已选择
          //   <span style={{color: '#0078FF'}} className="mr4 ml4">{store.rowKeys.length}</span>
          //   项
          // </span>,
        ]
        : null,
      rowSelection: useProjectId ? rowSelection : null,
      rowKey: 'id',
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    return (
      <div>
        <Search store={store} />
        {isProject ? (
          <div className="search-list box-border">
            <ListContent {...listConfig} />
            <Modal store={store} />
          </div>
        ) : (
          <div className="search-list-p box-border">
            <ListContent {...listConfig} />
            <Modal store={store} />
          </div>
        )}

        {/* <div className="search-list box-border">
           <ListContent {...listConfig} />
           <Modal store={store} />
          </div> */}
      </div>
    )
  }
}
export default Market
