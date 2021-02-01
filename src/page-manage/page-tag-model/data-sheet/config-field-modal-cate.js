import intl from 'react-intl-universal'
import React from 'react'
import PropTypes from 'prop-types'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, Cascader } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
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
      form: { getFieldDecorator },
    } = this.props

    const { confirmLoading } = this.state

    const defaultCate = options.filter(d => d.aId === -1)
    const defaultCateV = defaultCate.length ? [defaultCate[0].id] : undefined

    return (
      <Modal
        title={intl
          .get(
            'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-cate.2cyv7gh30h3'
          )
          .d('选择所属类目')}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        width={520}
        confirmLoading={confirmLoading}
      >
        <Form hideRequiredMark>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.4t6c1m6rpnr'
              )
              .d('所属类目')}
          >
            {getFieldDecorator('pathIds', {
              initialValue: defaultCateV,
              rules: [
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-object-model.tree-drawer-object.krbi0krgz8l'
                    )
                    .d('请选择所属类目'),
                },
              ],
            })(
              <Cascader
                size="small"
                options={options}
                style={{ width: 360 }}
                placeholder={intl
                  .get(
                    'ide.src.component.project-provider.configModal.huo38php0h'
                  )
                  .d('请选择')}
                // onChange={(values, selectedOptions) => {
                //   console.log(values, selectedOptions)
                // }}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  // 确定
  handleOk = () => {
    const { form, onOk } = this.props

    form.validateFields((errs, values) => {
      if (!errs) {
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
