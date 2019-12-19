import {Component} from 'react'
import {observer} from 'mobx-react'
import {action, toJS} from 'mobx'
import {
  Modal, Input, Form,
} from 'antd'
import {getNamePattern} from '../../common/util'

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

  // 名称查重校验
  @action handleNameValidator = (rule, value = '', callback) => {
    const {store} = this.props

    if (value) {
      // 后端校验
      const params = {
        name: value,
      }

      if (store.info.id) params.occasionId = store.info.id

      store.checkName(params, res => {
        if (!res) {
          return callback('名称已存在')
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
        confirmLoading,
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
        confirmLoading={confirmLoading}
      >
        <Form>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{
                required: true,
                message: '名称不能为空',
              },  
              ...getNamePattern(),
              {
                validator: this.handleNameValidator,
              }],
              validateFirst: true,
            })(
              <Input autoComplete="off" placeholder="不超过20个字，允许中文、英文、数字或下划线" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="描述">
            {getFieldDecorator('descr', {
              initialValue: data.descr,
              rules: [{
                transform: value => value.trim(),
              }, {
                required: true, message: '描述不能为空',
              }, {
                max: 100, message: '描述不超过100个字符',
              }],
            })(
              <TextArea autoComplete="off" placeholder="不超过100个字" />
            )}
          </FormItem>
        </Form>
      </Modal>

    )
  }
}

export default ModalAdd
