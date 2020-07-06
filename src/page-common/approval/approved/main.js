/**
 * @description 审批管理-我已审批
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {observable, action} from 'mobx'
import {Button} from 'antd'
import {ListContent, OmitTooltip} from '../../../component'
import {Time, keyToName} from '../../../common/util'
import {getTableStatus, APPLY_TYPE} from '../common/comp-approval-status'
import ModalDetail from '../common/comp-approval-modal'
import seach from './search'

import store from './store'

@observer
export default class Approved extends Component {
  @observable visible = false // 详情弹窗控制

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
      title: '申请状态',
      key: 'status',
      dataIndex: 'status',
      render: v => getTableStatus({status: v}),
    }, {
      title: '操作',
      key: 'action',
      width: 80,
      dataIndex: 'action',
      render: (text, record) => <a href onClick={() => this.viewDetail(record)}>查看详情</a>,
    },
  ]

  componentWillMount() {
    store.getApplicant()
    store.getProject()
  }

  /**
   * @description 查看详情
   */
  @action viewDetail = data => {
    store.getDetail(data.id)
    this.visible = true
  }

  @action modalCancel = () => {
    this.visible = false 
    store.detail = {}
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
      projectList, applicant, detail, detailLoading,
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
      footer: [<Button onClick={this.modalCancel}>关闭</Button>], 
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
