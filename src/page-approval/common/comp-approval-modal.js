/**
 * @description 审批详情-弹窗
 */
import {Component} from 'react'
import {Modal, Form, Input} from 'antd'
import {Time} from '../../common/util'
import {Tag} from '../../component'

const FormItem = Form.Item
const {TextArea} = Input

const foreverMap = {
  0: '非永久',
  1: '永久',
}

// const applyInfo = [{
//   label: '权限归属',
//   key: 'projectName',
// }, {
//   label: '申请内容',
//   key: 'content', 
// }, {
//   label: '申请时长',
//   key: 'forever',
//   map: foreverMap,
// }, {
//   label: '申请人',
//   key: 'applyUserName',
// }, {
//   label: '申请时间',
//   key: 'cTime',
// }, {
//   label: '申请理由',
//   key: 'applyDescr',
// }]

const approvalInfo = [{
  label: '操作人',
  key: 'reviewUserName',
}, {
  label: '操作时间',
  key: 'mTime',
}, {
  label: '描述',
  key: 'approvalDescr',
}]

const backoutInfo = [{
  label: '操作人',
  key: 'applyUserName',
}, {
  label: '操作时间',
  key: 'mTime',
}, {
  label: '描述',
  key: 'revokeDescr',
}]

const statusMap = {
  0: {
    text: '审核中',
    status: 'wait',
  }, 
  1: {
    text: '审批通过',
    status: 'success',
  },
  2: {
    text: '审批不通过',
    status: 'error',
  },
  3: {
    text: '已撤销',
    status: 'default',
  },
}

const LableItem = ({
  data, label, keyName, map,
}) => {
  console.log(keyName)
  return (
    <div className="mb8">
      <span className="approval-detail-label">
        {label}
   ：
      </span>
      {
        (keyName === 'mTime' || keyName === 'cTime') 
          ? <Time timestamp={data[keyName]} /> 
          : <span>{map ? map[data[keyName]] : data[keyName]}</span>
      }
    </div>
  )
}


const NormalLableItem = ({label, value}) => (
  <div className="mb8">
    <span className="approval-detail-label">
      {label}
      ：
    </span>
    <span>{value}</span>
  </div>
)

@Form.create()
export default class ModalDetail extends Component {
  submit = () => {
    const {form: {validateFields}, handleSubmit} = this.props
    validateFields((err, params) => {
      if (err) {
        return
      }
      handleSubmit(params)
    })
  }

  /**
   * @description 渲染申请信息
   */
  renderApplyInfo() {
    const {data} = this.props

    return (
      <div className="approval-detail">
        <div className="approval-detail-title">申请信息</div>
        {/* {
          applyInfo.map(({label, key, map}) => <LableItem data={data} label={label} keyName={data.status === 3 && key === 'reviewUserName' ? 'applyUserName' : key} map={map} />)
        } */}
        <NormalLableItem label="权限归属" value={data.projectName} />
        <NormalLableItem label="申请内容" value={data.content} />
        <NormalLableItem label="申请时长" value={foreverMap[+data.forever]} />
        {/* {
          data.forever !== 1
          && <NormalLableItem label="自定义时长" value={`${moment(+data.startTime).format('YYYY-MM-DD')} ~ ${moment(+data.endTime).format('YYYY-MM-DD')}`} />
        } */}
        <NormalLableItem label="申请人" value={data.applyUserName} />
        <NormalLableItem label="申请时间" value={moment(+data.cTime).format('YYYY-MM-DD HH:mm:ss')} />
        <NormalLableItem label="申请理由" value={data.applyDescr} />
      </div>
    )
  }

  /**
   * @description 渲染审批信息
   */
  renderApprovalInfo() {
    const {fromPage, data} = this.props

    // 待我审批与我的申请（未审批）页面；不渲染审批信息
    // if (fromPage === 'willApproval' || fromPage === 'application') return null
    if (fromPage === 'willApproval' || data.status === 3 || data.status === 0) return null

    return (
      <div className="approval-detail">
        <div className="approval-detail-title">
          <span className="mr32">审批信息</span>
          <Tag {...statusMap[data.status]} />
        </div>
        {
          approvalInfo.map(({label, key}) => <LableItem data={data} label={label} keyName={key} />)
        }
      </div>
    )
  }

  /**
   * @description 渲染撤销信息
   */
  renderBackoutInfo() {
    const {fromPage, data} = this.props

    if (data.status !== 3) return null

    return (
      <div className="approval-detail">
        <div className="approval-detail-title">
          <span className="mr32">审批信息</span>
          <Tag {...statusMap[data.status]} />
        </div>
        {
          backoutInfo.map(({label, key}) => <LableItem data={data} label={label} keyName={key} />)
        }
      </div>
    )
  }

  /**
   * @description 渲染审批信息form
   */
  renderApprovalDescr() {
    const {form: {getFieldDecorator}, fromPage} = this.props

    if (fromPage !== 'willApproval') return null

    return (
      <div className="approval-detail">
        <div className="approval-detail-title">
          审批描述
        </div>
        <Form className="pl16 pr16">
          <FormItem>
            {getFieldDecorator('approvalDescr', {
              rules: [
                {transform: value => value && value.trim()},
                {required: true, whitespace: true, message: '审批描述不可为空'},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入审批描述" />
            )}
          </FormItem>
        </Form>
      </div>
     
    )
  }

  render() {
    const {
      visible, title, handleCancel, footer, confirmLoading,
    } = this.props

    const modalConfig = {
      title,
      visible,
      width: 525,
      maskClosable: false,
      destroyOnClose: true,
      onCancel: handleCancel,
      onOk: this.submit,
      footer,
      confirmLoading,
    }
    return (
      <Modal {...modalConfig}>
        {
          this.renderApplyInfo()
        }
        {
          this.renderBackoutInfo()
        }
        {
          this.renderApprovalInfo()
        }
        {
          this.renderApprovalDescr()
        }
      </Modal>
    )
  }
}
