/**
 * @description 标签申请
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Radio} from 'antd'

const FormItem = Form.Item
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 19},
  colon: false,
}

@Form.create()
@observer
export default class TagApply extends Component {
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
    this.store.modalApplyVisible = false
    this.handleReset()
  }

  // 表单重置
  @action handleReset() {
    const {form: {resetFields}} = this.props
    this.store.tagIds.clear()
    resetFields()
  }

  render() {
    const {form: {getFieldDecorator}} = this.props
    const {
      confirmLoading, modalApplyVisible, projectName,
    } = this.store

    const modalConfig = {
      width: 525,
      maskClosable: false,
      title: '权限申请',
      confirmLoading,
      visible: modalApplyVisible,
      onOk: e => this.handleOk(e),
      onCancel: () => this.handleCancel(),
    }

    return (
      <Modal
        {...modalConfig}
      >
        <Form className="FBV">
          <FormItem {...formItemLayout} label="使用项目">
            {projectName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="申请时长"
          >
            {getFieldDecorator('forever', {
              rules: [
                {required: true, message: '请选择申请时长'},
              ],
              initialValue: 1,
            })(
              <Radio.Group>
                <Radio value={1}>永久</Radio>
              </Radio.Group>
            )}
          </FormItem>
    
          <FormItem
            {...formItemLayout}
            label="申请理由"
          >
            {getFieldDecorator('applyDescr', {
              rules: [
                {required: true, message: '请输入申请理由'},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入申请理由" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
