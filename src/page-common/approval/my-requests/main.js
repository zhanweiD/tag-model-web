/**
 * @description 审批管理-我的申请
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {observable, action} from 'mobx'
import {Button} from 'antd'
import {ListContent, OmitTooltip} from '../../../component'
import {Time, keyToName} from '../../../common/util'
import {getTableStatus, APPLY_TYPE} from '../common/comp-approval-status'
import ModalDetail from '../common/comp-approval-modal'
import ModalBackout from './modal-backout'
import seach from './search'

import store from './store'

@observer
export default class MyRequests extends Component {
  @observable visible = false // 详情弹窗控制
  @observable modalBackoutVisible = false // 撤销弹窗控制

  backoutId // 撤销申请id

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
      title: '申请时间',
      key: 'ctime',
      dataIndex: 'ctime',
      render: text => <Time timestamp={text} />,
    }, {
      title: '申请状态',
      key: 'status',
      dataIndex: 'status',
      render: v => getTableStatus({status: v}),
    }, {
      title: '操作',
      key: 'action',
      width: 150,
      dataIndex: 'action',
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* eslint-disable-next-line no-underscore-dangle */}
          <a href onClick={() => this.viewDetail(record)}>查看详情</a>
          {
            (record.status === 0) ? (
              <Fragment>
                <span className="table-action-line" />
                <a href onClick={() => this.backout(record.id)}>撤销</a>
              </Fragment>
            ) : null
          }
         
        </div> 
      ),
    },
  ]

  componentWillMount() {
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
    store.backout({
      id: this.backoutId,
      ...params,
    }, () => {
      t.modalBackoutVisible = false
      t.modalCancel()
    })
  }

  /**
   * @description 撤销
   */
  @action backout = id => {
    this.backoutId = id
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
      projectList, detail, confirmLoading, detailLoading,
    } = store
    
    const listConfig = {
      columns: this.columns,
      searchParams: seach({projectList}),
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
        ? [<Button onClick={this.modalCancel}>关闭</Button>]
        : [
          <Button onClick={this.modalCancel}>关闭</Button>,
          <Button type="primary" onClick={() => this.backout(detail.id)}>撤销申请</Button>,
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
