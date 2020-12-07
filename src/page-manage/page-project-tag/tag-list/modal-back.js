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
export default class TagBack extends Component {
  constructor(props) {
    super(props) 
    this.store = props.store
  }

  // 表单提交
  @action handleOk() {
    const t = this
    const {store} = t
    const {form: {validateFieldsAndScroll}} = t.props
    
    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }

      const params = {
        
        useProjectId: values.useProjectId || this.store.useProjectId,
        applyDescr: values.applyDescr,
      }
      // 申请时长为永远
      if (values.forever) {
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = null
      } else {
        params.startTime = values.timeRange[0].format('YYYY-MM-DD')
        params.endTime = values.timeRange[1].format('YYYY-MM-DD')
      }

      params.tagIds = toJS(store.tagIds)

      store.applyTag(params, () => {
        t.handleCancel()
      })
    })
  }

  @action handleCancel() {
    this.store.modalBackVisible = false
    this.handleReset()
  }

  // 表单重置
  @action handleReset() {
    const {form: {resetFields}} = this.props
    this.store.tagIds.clear()
    resetFields()
  }

  render() {
    // const {form: {getFieldDecorator}} = this.props
    const {
      confirmLoading, modalBackVisible,
    } = this.store

    const modalConfig = {
      width: 525,
      maskClosable: false,
      title: '交回权限',
      confirmLoading,
      visible: modalBackVisible,
      onOk: e => this.handleOk(e),
      onCancel: () => this.handleCancel(),
    }

    return (
      <Modal
        {...modalConfig}
      >
        <Form className="FBV">
          <FormItem style={{float: 'left', width: '100px'}}>
            <ExclamationCircleOutlined style={{color: 'yellow', fontSize: '60px'}} />
          </FormItem>
          <FormItem style={{marginLeft: '100px'}}>
            <p {...formItemLayout}>
              确定交回该标签的使用权限吗？
            </p>
            <p {...formItemLayout}>交回权限后将导致该项目无法使用该标签，请谨慎操作。</p>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
