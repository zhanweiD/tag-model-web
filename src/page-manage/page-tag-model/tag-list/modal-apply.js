/**
 * @description 标签申请
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Radio, DatePicker, Space, Select} from 'antd'

const FormItem = Form.Item
const {TextArea} = Input
const {RangePicker} = DatePicker
const {Option} = Select

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
      title: '标签授权',
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
          <FormItem {...formItemLayout} label="标签名称">
            {/* {projectName} */}
          </FormItem>
          <FormItem {...formItemLayout} label="标签标识">
            {/* {projectName} */}
          </FormItem>
          <FormItem {...formItemLayout} label="授权项目">
            {getFieldDecorator('projectId', {
              rules: [{required: true, message: '请选择授权项目'}],
            })(
              <Select 
                placeholder="请选择授权项目" 
                showSearch
                optionFilterProp="children"
                // onSelect={e => this.dataSourceSelect(e)}
              >
                {/* {
                  dataSourceList.map(item => (
                    <Option key={item.storageId} value={item.storageId} disabled={item.isUsed}>{item.storageName}</Option>
                  ))
                } */}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="有效时长"
          >
            {getFieldDecorator('time', {
              rules: [
                {required: true, message: '请选择申请时长'},
              ],
              initialValue: 1,
            })(
              <Radio.Group>
                <Radio value={1}>永久</Radio>
                <Radio value={2}>
                  自定义
                  <Space direction="vertical" size={12}>
                    <RangePicker />
                  </Space>
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
