import intl from 'react-intl-universal'
/**
 * @description 审批管理-我的申请
 */
import { Component, useEffect } from 'react'
import { observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { Button } from 'antd'
import OnerFrame from '@dtwave/oner-frame'
import { ListContent, OmitTooltip, Authority } from '../../../component'
import { Time, keyToName } from '../../../common/util'
import { getTableStatus, APPLY_TYPE } from '../common/comp-approval-status'
import ModalDetail from '../common/comp-approval-modal'
import ModalBackout from './modal-backout'
import seach from './search'

import store from './store'

@observer
class MyRequests extends Component {
  @observable visible = false // 详情弹窗控制
  @observable modalBackoutVisible = false // 撤销弹窗控制

  backoutId // 撤销申请id
  projectId // 撤销申请id

  columns = [
    {
      title: intl
        .get('ide.src.component.comp.search.w8q224fq9jt')
        .d('申请类型'),
      key: 'type',
      dataIndex: 'type',
      render: text => keyToName(APPLY_TYPE, text),
    },
    {
      title: intl
        .get('ide.src.component.comp.search.h5l3m6s8dn7')
        .d('所属项目'),
      key: 'projectName',
      dataIndex: 'projectName',
    },
    {
      title: intl
        .get('ide.src.component.comp.search.9dwmj8rn5ha')
        .d('申请内容'),
      key: 'content',
      dataIndex: 'content',
      render: text => <OmitTooltip maxWidth={120} text={text} />,
    },
    {
      title: intl.get('ide.src.component.comp.search.bld1br247f').d('申请时间'),
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    },
    {
      title: intl
        .get('ide.src.component.comp.search.plbscsdczmg')
        .d('申请状态'),
      key: 'status',
      dataIndex: 'status',
      render: v => getTableStatus({ status: v }),
    },
    {
      title: intl
        .get('ide.src.page-common.approval.approved.main.1tcpwa6mu1')
        .d('操作'),
      key: 'action',
      width: 150,
      dataIndex: 'action',
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* eslint-disable-next-line no-underscore-dangle */}
          <Authority authCode="tag_common:apply_detail[r]">
            <a href onClick={() => this.viewDetail(record)}>
              {intl
                .get('ide.src.page-common.approval.approved.main.yg5wf502tu')
                .d('查看详情')}
            </a>
          </Authority>
          <Authority authCode="tag_common:revert_apply[u]">
            {record.status === 0 ? (
              <a
                href
                className="ml16"
                onClick={() => this.backout(record.id, record.projectId)}
              >
                {intl
                  .get(
                    'ide.src.page-common.approval.my-requests.main.lx12rulh52h'
                  )
                  .d('撤销')}
              </a>
            ) : null}
          </Authority>
        </div>
      ),
    },
  ]

  componentWillMount() {
    // store.projectId = this.props.projectId
    store.getProject()
  }

  /**
   * @description 查看详情
   */
  @action viewDetail = data => {
    store.getDetail(data.id)
    this.visible = true
  }

  @action handleSubmit = params => {
    const t = this
    console.log(this.projectId)
    store.backout(
      {
        id: this.backoutId,
        projectId: this.projectId,
        ...params,
      },
      () => {
        t.modalBackoutVisible = false
        t.modalCancel()
      }
    )
  }

  /**
   * @description 撤销
   */
  @action backout = (id, projectId) => {
    this.backoutId = id
    this.projectId = projectId
    this.modalBackoutVisible = true
  }

  @action modalCancel = () => {
    this.visible = false
    store.detail = {}
  }

  @action modalBackoutCancel = () => {
    this.modalBackoutVisible = false
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
      projectList,
      detail,
      confirmLoading,
      detailLoading,
      projectId,
    } = store

    const listConfig = {
      columns: this.columns,
      searchParams: seach({ projectList }),
      // initParams: {projectId},
      beforeSearch: this.beforeSearch,
      store, // 必填属性
    }

    // 申请详情弹窗属性配置
    const modalConfig = {
      visible: this.visible,
      title: keyToName(APPLY_TYPE, detail.type),
      data: detail,
      handleCancel: this.modalCancel,
      fromPage: 'application',
      footer: detail.status
        ? [
            <Button onClick={this.modalCancel}>
              {intl
                .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
                .d('关闭')}
            </Button>,
          ]
        : [
            <Button onClick={this.modalCancel}>
              {intl
                .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
                .d('关闭')}
            </Button>,
            <Button type="primary" onClick={() => this.backout(detail.id)}>
              {intl
                .get('ide.src.page-common.approval.my-requests.main.bdgrq9qdii')
                .d('撤销申请')}
            </Button>,
          ],

      detailLoading,
    }

    // 撤销弹窗属性配置
    const modalBackoutConfig = {
      confirmLoading,
      visible: this.modalBackoutVisible,
      handleCancel: this.modalBackoutCancel,
      handleSubmit: this.handleSubmit,
    }

    return (
      <div className="page-approval">
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        <ModalDetail {...modalConfig} />
        <ModalBackout {...modalBackoutConfig} />
      </div>
    )
  }
}

export default props => {
  const ctx = OnerFrame.useFrame()
  // const projectId = ctx.useProjectId()

  useEffect(() => {
    ctx.useProject(true, null, { visible: false })
  }, [])

  return <MyRequests {...props} />
}
