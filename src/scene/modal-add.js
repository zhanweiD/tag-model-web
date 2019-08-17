import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {
  Modal, Input, Form,
} from 'antd'
import {isExitMsg} from '../common/constants'

const FormItem = Form.Item
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 18},
}

@Form.create()
@observer
class ModalAdd extends Component {
  handleSubmit(e) {
    const {
      form: 
      {
        validateFields,
      }, 
      store,
    } = this.props

    e.preventDefault()

    validateFields((err, params) => {
      if (err) {
        return
      }
    
      if (store.isEdit) {
        store.editScene({
          occasionId: store.info.id,
          ...params,
        }, () => {
          this.handleReset()
        })
      } else {
        store.addScene(params, () => {
          this.handleReset()
        })
      }
    })
  }

  // 中文名称查重校验
  @action handleNameValidator = (rule, value = '', callback) => {
    const {store} = this.props

    if (value) {
      // 后端校验
      store.checkName(value, res => {
        console.log(res)
        if (res) {
          return callback(isExitMsg)
        }
        callback()
      }) 
    } else {
      callback()
    }
  }


  @action handleCancel() {
    const {store} = this.props
    this.handleReset()
    store.modalVisible = false
  }

  @action handleReset = () => {
    const {form: {resetFields}} = this.props
    resetFields()
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      },
      store: {
        info,
        modalVisible,
        isEdit,
      }, 
    } = this.props

    const data = toJS(info)

    return (
      <Modal
        visible={modalVisible}
        maskClosable={false}
        destroyOnClose
        title={isEdit ? '编辑场景' : '添加场景'}
        onOk={e => this.handleSubmit(e)}
        onCancel={() => this.handleCancel()}
      >
        <Form>
          <FormItem {...formItemLayout} label="中文名">
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{
                required: true,
                message: '中文名不能为空',
              }, {
                max: 20, 
                message: '中文名不能超过20个字符',
              }, {
                pattern: /^[\u4e00-\u9fa5]{1,30}$/, message: '输入限制为中文字符',
              }, {
                validator: this.handleNameValidator,
              }],
              validateFirst: true,
            })(
              <Input autoComplete="off" placeholder="请输入" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator('descr', {
              initialValue: data.descr,
              rules: [{
                required: true, message: '描述不能为空',
              }, {
                max: 100, message: '描述不能超过100个字符',
              }],
            })(
              <TextArea autoComplete="off" placeholder="请输入" />
            )}
          </FormItem>
        </Form>
      </Modal>

    )
  }
}

export default ModalAdd
