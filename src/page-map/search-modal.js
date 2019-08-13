import React from 'react'
import {observer} from 'mobx-react'
import {
  Modal, Form, Select, Row, Col, Icon, Tooltip,
} from 'antd'
import {action} from 'mobx'

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
  state = {
    cateLoading: false, // 场景类目的加载动画
  }

  render() {
    const {store, form} = this.props
    const {getFieldDecorator} = form

    const {cateLoading} = this.state

    // 场景Options
    const sceneOptions = store.sceneList.map(scene => (
      <Option key={scene.id} value={Number(scene.id)}>{scene.name}</Option>
    ))

    // 场景类目Options
    const cateOptions = (store.cateList || []).map(cate => (
      <Option key={cate.id} value={Number(cate.id)}>{cate.name}</Option>
    ))

    return (
      <Modal
        visible={store.modalVisible}
        title="批量添加至场景"
        onOk={this.onOk}
        onCancel={() => store.toggleModal(false)}
        destroyOnClose
        wrapClassName="map-search-modal"
      >
        <div className="search-modal-content">
          <Form>
            <Row>
              <Col span={4} className="far mt10">
                场景：
              </Col>
              <Col span={14}>
                <FormItem>
                  {
                    getFieldDecorator('scene', {
                      initialValue: store.selectedSceneId,
                      rules: [
                        {
                          required: true,
                          type: 'number', // antd蜜汁默认做类型校验，还不能允许多个类型；场景id是number，改成number吧
                          message: '必选',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择场景"
                        style={{width: '100%'}}
                        onChange={this.onSceneSelect}
                      >
                        {sceneOptions}
                      </Select>
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
              <Col span={14}>
                <FormItem>
                  {
                    getFieldDecorator('scene-category', {
                      initialValue: store.selectedCateId,
                      rules: [
                        {
                          required: true,
                          type: 'number', // 同上
                          message: '必选',
                        },
                      ],
                    })(
                      <Select
                        placeholder="请选择场景类目"
                        style={{width: '100%'}}
                        loading={cateLoading}
                        onChange={this.onCateSelect}
                      >
                        {cateOptions}
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    )
  }

  // 选择场景
  @action.bound onSceneSelect(value) {
    const {store} = this.props
    store.selectedSceneId = value

    this.setState({
      cateLoading: true,
    })
    store.getCateList(() => {
      this.setState({
        cateLoading: false,
      })
    })
  }

  // 选择场景类目
  @action.bound onCateSelect(value) {
    const {store} = this.props
    store.selectedCateId = value
  }

  // 点击确定
  @action.bound onOk() {
    const {form, store} = this.props
    form.validateFields((errs, values) => {
      if (!errs) {
        store.saveTags(() => {
          store.toggleModal(false)

          // 数据重置
          store.selectedSceneId = undefined
          store.selectedCateId = undefined
          store.cateList = []
          // store.selectedTags = {
          //   [store.currentPage]: [],
          // }
          store.resetSelectedTags()
        })
      } else {
        console.log('error in [SearchModal]: ', errs)
      }
    })
  }
}

export default Form.create()(SearchModal)
