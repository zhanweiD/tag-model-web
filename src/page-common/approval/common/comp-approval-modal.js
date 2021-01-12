import intl from 'react-intl-universal'
/**
 * @description 审批详情-弹窗
 */
import { Component } from 'react'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, Input, Spin } from 'antd'
import { Time } from '../../../common/util'
import { Tag } from '../../../component'

const FormItem = Form.Item
const { TextArea } = Input

const foreverMap = {
  0: intl
    .get('ide.src.page-common.approval.common.comp-approval-modal.t3wro86m2b')
    .d('非永久'),
  1: intl
    .get('ide.src.page-common.approval.common.comp-approval-modal.5ltr1685i6c')
    .d('永久'),
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
//   key: 'ctime',
// }, {
//   label: '申请理由',
//   key: 'applyDescr',
// }]

const approvalInfo = [
  {
    label: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.aykj300xgpu'
      )
      .d('操作人'),
    key: 'reviewUserName',
  },
  {
    label: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.hk7pcchhcif'
      )
      .d('操作时间'),
    key: 'mtime',
  },
  {
    label: intl
      .get('ide.src.component.modal-stroage-detail.main.lyqo7nv5t9h')
      .d('描述'),
    key: 'approvalDescr',
  },
]

const backoutInfo = [
  {
    label: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.aykj300xgpu'
      )
      .d('操作人'),
    key: 'applyUserName',
  },
  {
    label: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.hk7pcchhcif'
      )
      .d('操作时间'),
    key: 'mtime',
  },
  {
    label: intl
      .get('ide.src.component.modal-stroage-detail.main.lyqo7nv5t9h')
      .d('描述'),
    key: 'revokeDescr',
  },
]

const statusMap = {
  0: {
    text: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.nb8qntq7vug'
      )
      .d('审批中'),
    status: 'wait',
  },

  1: {
    text: intl
      .get('ide.src.page-common.approval.common.comp-approval-modal.mf9x2yuz9r')
      .d('审批通过'),
    status: 'success',
  },

  2: {
    text: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.rngqapn411l'
      )
      .d('审批不通过'),
    status: 'error',
  },

  3: {
    text: intl
      .get(
        'ide.src.page-common.approval.common.comp-approval-modal.2uelr28l96w'
      )
      .d('已撤销'),
    status: 'default',
  },
}

const LableItem = ({ data, label, keyName, map }) => (
  <div className="mb8">
    <span className="approval-detail-label">{label}：</span>
    {keyName === 'mtime' || keyName === 'ctime' ? (
      <Time timestamp={data[keyName]} />
    ) : (
      <span>{map ? map[data[keyName]] : data[keyName]}</span>
    )}
  </div>
)

const NormalLableItem = ({ label, value }) => (
  <div className="mb8">
    <span className="approval-detail-label">{label}：</span>
    <span>{value}</span>
  </div>
)

@Form.create()
class ModalDetail extends Component {
  submit = () => {
    const {
      form: { validateFields },
      handleSubmit,
    } = this.props
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
    const { data } = this.props

    return (
      <div className="approval-detail">
        <div className="approval-detail-title">
          {intl
            .get(
              'ide.src.page-common.approval.common.comp-approval-modal.krqu94eqqa'
            )
            .d('申请信息')}
        </div>
        {/* {
           applyInfo.map(({label, key, map}) => <LableItem data={data} label={label} keyName={data.status === 3 && key === 'reviewUserName' ? 'applyUserName' : key} map={map} />)
          } */}
        <NormalLableItem
          label={intl
            .get(
              'ide.src.page-common.approval.common.comp-approval-modal.csu4sgzdban'
            )
            .d('权限归属')}
          value={data.projectName}
        />
        <NormalLableItem
          label={intl
            .get('ide.src.component.comp.search.9dwmj8rn5ha')
            .d('申请内容')}
          value={data.content}
        />
        <NormalLableItem
          label={intl
            .get(
              'ide.src.page-common.approval.common.comp-approval-modal.4nobznc4k2w'
            )
            .d('申请时长')}
          value={foreverMap[+data.forever]}
        />
        {/* {
           data.forever !== 1
           && <NormalLableItem label="自定义时长" value={`${moment(+data.startTime).format('YYYY-MM-DD')} ~ ${moment(+data.endTime).format('YYYY-MM-DD')}`} />
          } */}
        <NormalLableItem
          label={intl
            .get('ide.src.component.comp.search.bvm9ca9vbu')
            .d('申请人')}
          value={data.applyUserName}
        />
        <NormalLableItem
          label={intl
            .get('ide.src.component.comp.search.bld1br247f')
            .d('申请时间')}
          value={moment(+data.ctime).format('YYYY-MM-DD HH:mm:ss')}
        />
        <NormalLableItem
          label={intl
            .get(
              'ide.src.page-common.approval.common.comp-approval-modal.qskkf95ea1k'
            )
            .d('申请理由')}
          value={data.applyDescr}
        />
      </div>
    )
  }

  /**
   * @description 渲染审批信息
   */
  renderApprovalInfo() {
    const { fromPage, data } = this.props

    // 待我审批与我的申请（未审批）页面；不渲染审批信息
    // if (fromPage === 'willApproval' || fromPage === 'application') return null
    if (fromPage === 'willApproval' || data.status === 3 || data.status === 0)
      return null

    return (
      <div className="approval-detail">
        <div className="approval-detail-title">
          <span className="mr32">
            {intl
              .get(
                'ide.src.page-common.approval.common.comp-approval-modal.5nya8zx0b8'
              )
              .d('审批信息')}
          </span>
          <Tag {...statusMap[data.status]} />
        </div>
        {approvalInfo.map(({ label, key }) => (
          <LableItem data={data} label={label} keyName={key} />
        ))}
      </div>
    )
  }

  /**
   * @description 渲染撤销信息
   */
  renderBackoutInfo() {
    const { fromPage, data } = this.props

    if (data.status !== 3) return null

    return (
      <div className="approval-detail">
        <div className="approval-detail-title">
          <span className="mr32">
            {intl
              .get(
                'ide.src.page-common.approval.common.comp-approval-modal.5nya8zx0b8'
              )
              .d('审批信息')}
          </span>
          <Tag {...statusMap[data.status]} />
        </div>
        {backoutInfo.map(({ label, key }) => (
          <LableItem data={data} label={label} keyName={key} />
        ))}
      </div>
    )
  }

  /**
   * @description 渲染审批信息form
   */
  renderApprovalDescr() {
    const {
      form: { getFieldDecorator },
      fromPage,
    } = this.props

    if (fromPage !== 'willApproval') return null

    return (
      <div className="approval-detail">
        <div className="approval-detail-title approval-required">
          {intl
            .get(
              'ide.src.page-common.approval.common.comp-approval-modal.4yb7bvinvwv'
            )
            .d('审批描述')}
        </div>
        <Form className="pl16 pr16">
          <FormItem>
            {getFieldDecorator('approvalDescr', {
              rules: [
                { transform: value => value && value.trim() },
                {
                  required: true,
                  whitespace: true,
                  message: intl
                    .get(
                      'ide.src.page-common.approval.common.comp-approval-modal.95e7aggc84w'
                    )
                    .d('审批描述不可为空'),
                },
                {
                  max: 128,
                  whitespace: true,
                  message: intl
                    .get('ide.src.component.form-component.8ftxftczpk7')
                    .d('输入不能超过128个字符'),
                },
              ],
            })(
              <TextArea
                placeholder={intl
                  .get(
                    'ide.src.page-common.approval.common.comp-approval-modal.pmbnoce2en'
                  )
                  .d('请输入审批描述')}
              />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }

  render() {
    const {
      visible,
      title,
      handleCancel,
      footer,
      confirmLoading,
      detailLoading,
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
        <Spin spinning={detailLoading}>
          {this.renderApplyInfo()}

          {this.renderBackoutInfo()}

          {this.renderApprovalInfo()}

          {this.renderApprovalDescr()}
        </Spin>
      </Modal>
    )
  }
}
export default ModalDetail
