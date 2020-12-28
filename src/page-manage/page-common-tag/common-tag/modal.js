/**
 * @description 标签申请
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, DatePicker, Select, Radio, Space} from 'antd'

const FormItem = Form.Item
const {TextArea} = Input
const {Option} = Select
const {RangePicker} = DatePicker

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
    const {
      form: {
        validateFieldsAndScroll,
      }, 
    } = this.props
    
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
        params.startTime = moment().format('YYYY-MM-DD')
        params.endTime = values.timeRange[1].format('YYYY-MM-DD')
      }

      params.tagIds = toJS(this.store.tagIds)
      
      this.store.applyTag(params, () => {
        this.handleCancel()
      })
      this.store.modalVisible = false
    })
  }

  @action handleCancel() {
    this.store.modalVisible = false
    this.store.modalType = undefined
    this.store.selectItem = {}

    this.handleReset()
  }

  // 表单重置
  @action handleReset() {
    const {form: {resetFields}} = this.props
    this.store.tagIds.clear()
    resetFields()
  }


  render() {
    const {form: {getFieldDecorator, getFieldValue}} = this.props
    const {
      confirmLoading, 
      modalVisible, 
      useProjectList, 
      useProjectId, 
      // useProjectName, 
      // modalType,
      selectedRows,
      selectItem,
      tagIds,
    } = this.store
    const defaultSelectDate = {
      startDate: toJS(selectItem.endTime) ? moment(moment(toJS(selectItem.endTime)).format()) : moment(),
      // endDate: moment(),
    }

    const disabledDate = (current) => {
      return current && current < moment(defaultSelectDate.startDate).endOf('day')
    }

    const selectName = selectItem && selectItem.name

    const modalConfig = {
      width: 525,
      maskClosable: false,
      destroyOnClose: true,
      title: '标签申请',
      confirmLoading,
      visible: modalVisible,
      onOk: e => this.handleOk(e),
      onCancel: () => this.handleCancel(),
    }

    const {useProjectName} = useProjectList.filter(d => d.useProjectId === useProjectId)[0] || {}
    return (
      <Modal
        {...modalConfig}
      >
        <Form className="FBV">
          {
            this.store.modalType === 'one' ? (
              <FormItem {...formItemLayout} label="选择的标签">
                <span className="fs12">{selectName}</span>
              </FormItem>
            ) : (
              <FormItem {...formItemLayout} label="选择的标签">
                {getFieldDecorator('dataStorageId', {
                  initialValue: tagIds,
                })(
                  <Select  
                    mode="multiple"
                    disabled
                    size="small"
                  >
                    {
                      selectedRows.map(item => (
                        <Option key={item.id} value={item.id}>{item.name}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            )
          }
          
          <FormItem {...formItemLayout} label="使用项目">
            <span className="fs12">{useProjectName}</span>
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
                <Radio value={0}>
                  自定义
                </Radio>
              </Radio.Group>
            )}
          </FormItem>
          {!getFieldValue('forever') ? (
            <FormItem
              {...formItemLayout}
              label="自定义时长"
            >
              {getFieldDecorator('timeRange', {
                initialValue: [defaultSelectDate.startDate],
                rules: [
                  {required: true, message: '请选择申请时长'},
                  {type: 'array', required: true, message: '请选择自定义时长'},
                  {
                    // 自定义校验规则
                    validator: (rule, value, callback) => {
                      if (value.length === 2) {
                        if (!value[0] || !value[1]) {
                          callback('请选择申请时间')
                        } else {
                          // callback不传参数表示校验通过
                          callback()
                        }
                      } else {
                        callback('请选择申请时间')
                      }
                    }
                  },
                ],
              })(
                <RangePicker disabled={[true, false]} disabledDate={disabledDate} />
              )}
            </FormItem>
          )
            : null }
         
          <FormItem
            {...formItemLayout}
            label="申请理由"
          >
            {getFieldDecorator('applyDescr', {
              rules: [
                {required: true, message: '请输入申请理由'},
                {max: 128, message: '输入不能超过128个字符'},
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
