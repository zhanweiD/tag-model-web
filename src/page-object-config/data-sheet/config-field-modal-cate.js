import React from 'react'
import PropTypes from 'prop-types'
import {Modal, Form, Cascader} from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {span: 5},
  wrapperCol: {span: 19},
  colon: false,
}

// 所属类目弹框
class ModalCateSelect extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired, //
    options: PropTypes.array.isRequired, // 下拉框选择项
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  state = {
    confirmLoading: false,
  }

  render() {
    const {
      visible,
      options,
      onCancel,
      form: {getFieldDecorator},
    } = this.props

    const {confirmLoading} = this.state

    return (
      <Modal
        title="选择所属类目"
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        width={520}
        confirmLoading={confirmLoading}
      >
        <Form hideRequiredMark>
          <FormItem
            {...formItemLayout}
            label="所属类目"
          >
            {
              getFieldDecorator('pathIds', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择所属类目',
                  },
                ],
              })(
                <Cascader
                  options={options}
                  style={{width: 360}}
                  placeholder="请选择"
                  // onChange={(values, selectedOptions) => {
                  //   console.log(values, selectedOptions)
                  // }}
                />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }

  // 确定
  handleOk = () => {
    const {form, onOk} = this.props

    form.validateFields((errs, values) => {
      if (!errs) {
        // console.log(values)

        this.setState({
          confirmLoading: true,
        })

        onOk(values, () => {
          this.setState({
            confirmLoading: false,
          })
        })
      } else {
        console.log('[ModalCateSelect] validateFiels Errors: ', errs)
      }
    })
  }
}

export default Form.create()(ModalCateSelect)
