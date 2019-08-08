import React from 'react'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'
import {
  Modal, Form, Select, Row, Col, Icon, Tooltip,
} from 'antd'

const FormItem = Form.Item
const {Option} = Select

/**
 * @description 标签搜索 - 批量添加弹框
 * @author 三千
 * @date 2019-08-06
 * @class SearchModal
 * @extends {React.Component}
 */
@observer
class SearchModal extends React.Component {
  // props类型校验
  // static propTypes = {
  //   visible: PropTypes.bool.isRequired,
  //   onCancel: PropTypes.func.isRequired,
  //   onOk: PropTypes.func.isRequired,
  // }

  // 点击确定
  onOk = () => {
    const {form, store} = this.props
    form.validateFields((errs, values) => {
      if (!errs) {
        store.saveTags(() => {
          store.toggleModal(false)
        })
      } else {
        console.log('error in [SearchModal]: ', errs)
      }
    })
  }

  render() {
    const {store, form} = this.props
    const {getFieldDecorator} = form

    return (
      <Modal
        visible={store.modalVisible}
        title="批量添加至场景"
        onOk={this.onOk}
        onCancel={() => store.toggleModal(false)}
      >
        <div className="search-modal-content">
          <Row>
            <Col span={4} className="far mt10">
              场景：
            </Col>
            <Col span={12}>
              <FormItem>
                {
                  getFieldDecorator('scene', {
                    initialValue: '',
                    rules: [
                      {
                        isRequired: true,
                        messgae: '必选',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请选择场景"
                      style={{width: '100%'}}
                      // onSearch={value => console.log(value)}
                    />
                  )
                }
              </FormItem>
            </Col>
            <Col span={3} className="ml10 mt10">
              <Tooltip placement="top" title="若场景中已添加过对象，则选择的对象必须与已添加的对象有关联关系">
                <Icon type="question-circle" />
              </Tooltip>
            </Col>
          </Row>

          <Row>
            <Col span={4} className="far mt10">
              场景类目：
            </Col>
            <Col span={12}>
              <FormItem>
                {
                  getFieldDecorator('scene-category', {
                    initialValue: '',
                    rules: [
                      {
                        isRequired: true,
                        messgae: '必选',
                      },
                    ],
                  })(
                    <Select
                      placeholder="请选择场景类目"
                      style={{width: '100%'}}
                    />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    )
  }
}

export default Form.create()(SearchModal)
