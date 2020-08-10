/**
 * @description 审批管理-待我审批
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {observable, action} from 'mobx'
import {ListContent, OmitTooltip} from '../../../component'
import {Time, keyToName} from '../../../common/util'
import {APPLY_TYPE} from '../common/comp-approval-status'
import ModalDetail from '../common/comp-approval-modal'
import seach from './search'

import store from './store'

const statusMap = {
  agree: 1,
  oppose: 2,
}

@observer
export default class PendingApproval extends Component {
  @observable visible = false // 详情弹窗控制

  status // 操作类型  1 通过 2 拒绝

  columns = [
    {
      title: '申请类型',
      key: 'type',
      dataIndex: 'type',
      render: text => keyToName(APPLY_TYPE, text),
    }, {
      title: '所属项目',
      key: 'projectName',
      dataIndex: 'projectName',
    }, {
      title: '申请内容',
      key: 'content',
      dataIndex: 'content',
      render: text => <OmitTooltip maxWidth={120} text={text} />,
    }, {
      title: '申请人',
      key: 'applyUserName',
      dataIndex: 'applyUserName',
    }, {
      title: '申请时间',
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '操作',
      key: 'action',
      width: 150,
      dataIndex: 'action',
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* eslint-disable-next-line no-underscore-dangle */}
          <a className="mr16" href onClick={() => this.viewDetail(record, statusMap.agree)}>同意</a>
          {/* <span className="table-action-line" /> */}
          <a href onClick={() => this.viewDetail(record, statusMap.oppose)}>拒绝</a>
        </div> 
      ),
    },
  ]

  componentWillMount() {
    store.getProject()
    store.getApplicant()
  }

  /**
   * @description 查看详情
   */
  @action viewDetail = (data, status) => {
    store.getDetail(data.id)
    this.visible = true
    this.status = status
  }

  @action modalCancel = () => {
    this.visible = false 
    store.detail = {}
  } 

  handleSubmit = params => {
    const {detail} = store
    const t = this

    store.goApproval({
      id: detail.id,
      status: this.status,
      ...params,
    }, () => {
      t.modalCancel()
    })
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
      projectList, applicant, detail, confirmLoading, detailLoading,
    } = store
    const listConfig = {
      columns: this.columns,
      searchParams: seach({projectList, applicant}),
      beforeSearch: this.beforeSearch,
      store, // 必填属性
    }

    // 申请详情弹窗属性配置
    const modalConfig = {
      visible: this.visible,
      title: keyToName(APPLY_TYPE, detail.type),
      data: detail,
      handleCancel: this.modalCancel,
      handleSubmit: this.handleSubmit,
      fromPage: 'willApproval',
      confirmLoading,
      detailLoading,
    }

    return (
      <div className="page-approval">
        <div className="list-content">
          <ListContent {...listConfig} />
        </div>
        <ModalDetail {...modalConfig} />
      </div>
    )
  }
}
