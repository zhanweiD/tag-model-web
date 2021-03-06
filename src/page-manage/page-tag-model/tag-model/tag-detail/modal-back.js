import intl from 'react-intl-universal'
/**
 * @description 标签申请
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Radio, DatePicker, Space} from 'antd'
import {ExclamationCircleOutlined} from '@ant-design/icons'

const FormItem = Form.Item
const {TextArea} = Input
const {RangePicker} = DatePicker

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 19},
  colon: false,
}

@Form.create()
@observer
class TagBack extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 表单提交
  @action handleOk() {
    const t = this
    const {store} = t
    store.backAppltTag(t.handleCancel)
  }

  @action.bound handleCancel() {
    this.store.modalBackVisible = false
    this.store.backProjectId.clear()
  }

  render() {
    const {confirmLoading, modalBackVisible} = this.store

    const modalConfig = {
      width: 525,
      maskClosable: false,
      title: intl
        .get('ide.src.page-manage.page-project-tag.tag-list.main.68om79cer04')
        .d('交回权限'),
      confirmLoading,
      visible: modalBackVisible,
      onOk: e => this.handleOk(e),
      onCancel: () => this.handleCancel(),
    }

    return (
      <Modal {...modalConfig}>
        <div
          className="FBV"
          style={{
            display: 'grid',
            gridTemplateColumns: '40px auto',
            gridGap: '8px 8px',
          }}
        >
          <div>
            <ExclamationCircleOutlined
              style={{color: '#DAA520', fontSize: '25px'}}
            />
          </div>
          <div>
            <p style={{fontSize: '10px', fontWeight: 'bold'}}>
              {intl
                .get(
                  'ide.src.page-manage.page-project-tag.tag-list.modal-back.ruudwdz5she'
                )
                .d('确定交回该标签的使用权限吗？')}
            </p>
          </div>
          <div
            style={{
              fontSize: '10px',
              gridColumnStart: '2',
              gridColumnEnd: '3',
            }}
            className="mb16"
          >
            <p>
              {intl
                .get(
                  'ide.src.page-manage.page-project-tag.tag-list.modal-back.9bqnlzr28p'
                )
                .d('交回权限后将导致该项目无法使用该标签，请谨慎操作。')}
            </p>
          </div>
        </div>
      </Modal>
    )
  }
}
export default TagBack
