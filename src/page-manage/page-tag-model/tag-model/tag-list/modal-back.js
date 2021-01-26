import intl from 'react-intl-universal'
/**
 * @description 标签回收
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Radio, DatePicker, Spin, Select, Button} from 'antd'

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
class TagApply extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 表单提交
  @action handleOk = e => {
    const t = this
    const {store} = t
    const {
      form: {validateFieldsAndScroll},
    } = t.props

    validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      store.backAppltTag(t.handleCancel)
    })
  }

  @action handleCancel = () => {
    this.store.modalBackVisible = false
    this.store.backProjectId.clear()
    this.handleReset()
  }

  // 表单重置
  @action handleReset = () => {
    const {
      form: {resetFields},
    } = this.props
    resetFields()
  }

  @action.bound applyProjectSelect(v) {
    this.store.backProjectId.push(v)
  }

  render() {
    const {
      form: {getFieldDecorator, getFieldValue},
    } = this.props
    const {
      confirmLoading,
      modalBackVisible,
      selectItem,
      applyProjectList,
      backProjectId,
      applyProjectLoading,
    } = this.store
    const selectName = selectItem && selectItem.name
    const selectEnName = selectItem && selectItem.enName
    const applyedProjectList = applyProjectList.filter(d => d.config === 1)

    // const modalConfig = {
    //   width: 525,
    //   maskClosable: false,
    //   title: '回收权限',
    //   confirmLoading,
    //   visible: modalBackVisible,
    //   onOk: e => this.handleOk(e),
    //   onCancel: () => this.handleCancel(),
    // }

    return (
      <Modal
        width={525}
        maskClosable={false}
        title={intl
          .get(
            'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-back.oh88gcracm'
          )
          .d('回收权限')}
        confirmLoading
        visible={modalBackVisible}
        // onOk: e => this.handleOk(e)
        onCancel={this.handleCancel}
        footer={[
          <Button onClick={this.handleCancel}>
            {intl
              .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
              .d('取消')}
          </Button>,
          <Button
            disabled={!backProjectId.length}
            type="primary"
            loading={confirmLoading}
            onClick={this.handleOk}
          >
            {intl
              .get('ide.src.page-config.workspace-config.modal.osxrfhrriz')
              .d('确认')}
          </Button>,
        ]}
      >
        <Form className="FBV">
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
              )
              .d('标签名称')}
          >
            {selectName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
              .d('标签标识')}
          >
            {selectEnName}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-back.unqv1x1j6g'
              )
              .d('回收项目')}
          >
            {getFieldDecorator('backprojectId', {
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-back.72y75x63q2g'
                    )
                    .d('请选择回收项目'),
                },
              ],
            })(
              <Select
                placeholder={
                  applyedProjectList.length
                    ? intl
                      .get(
                        'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-back.72y75x63q2g'
                      )
                      .d('请选择回收项目')
                    : intl
                      .get(
                        'ide.src.page-manage.page-tag-model.tag-model.tag-list.modal-back.95o5szgswfe'
                      )
                      .d('当前标签未授权给任何项目')
                }
                showSearch
                optionFilterProp="children"
                notFoundContent={
                  applyProjectLoading ? (
                    <div style={{textAlign: 'center'}}>
                      <Spin />
                    </div>
                  ) : null
                }
                disabled={!applyedProjectList.length}
                onSelect={v => this.applyProjectSelect(v)}
                mode="multiple"
                size="small"
              >
                {applyedProjectList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
export default TagApply
