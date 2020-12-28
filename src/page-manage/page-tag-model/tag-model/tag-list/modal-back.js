/**
 * @description 标签回收
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Radio, DatePicker, Spin, Select} from 'antd'

const FormItem = Form.Item
const {TextArea} = Input
// const {RangePicker} = DatePicker
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

      store.backAppltTag(t.handleCancel())
    })
  }

  @action handleCancel() {
    this.store.modalBackVisible = false
    // this.store.backProjectId = []
    this.handleReset()
  }

  // 表单重置
  @action handleReset() {
    const {form: {resetFields}} = this.props
    resetFields()
  }

  @action.bound applyProjectSelect(v) {
    this.store.backProjectId.push(v)
  }


  render() {
    const {form: {getFieldDecorator, getFieldValue}} = this.props
    const {
      confirmLoading, modalBackVisible, selectItem, applyProjectList, backProjectId, applyProjectLoading,
    } = this.store
    console.log(toJS(backProjectId), 111)
    const selectName = selectItem && selectItem.name
    const selectEnName = selectItem && selectItem.enName
    const applyedProjectList = applyProjectList.filter(d => d.config === 1)

    const modalConfig = {
      width: 525,
      maskClosable: false,
      title: '回收权限',
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
          <FormItem {...formItemLayout} label="标签名称">
            {selectName}
          </FormItem>
          <FormItem {...formItemLayout} label="标签标识">
            {selectEnName}
          </FormItem>
          <FormItem {...formItemLayout} label="回收项目">
            {getFieldDecorator('backprojectId', {
              rules: [{required: true, message: '请选择回收项目'}],
            })(
              <Select 
                placeholder="请选择回收项目" 
                showSearch
                optionFilterProp="children"
                notFoundContent={applyProjectLoading ? <div style={{textAlign: 'center'}}><Spin /></div> : null}
                onSelect={v => this.applyProjectSelect(v)}
                mode="multiple"
              >
                {
                  applyedProjectList.map(item => (
                    <Option key={item.id} value={item.id}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
