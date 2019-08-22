import React from 'react'
import {observer} from 'mobx-react'
import {
  Modal, Form, Select, Row, Col, Icon, Tooltip, Cascader,
} from 'antd'
import {action} from 'mobx'
import {pathPrefix} from '../common/util'

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
  render() {
    const {store, form} = this.props
    
    const {getFieldDecorator} = form

    // 场景Options
    const sceneOptions = store.sceneList.map(scene => (
      <Option key={scene.id} value={Number(scene.id)}>{scene.name}</Option>
    ))

    return (
      <Modal
        visible={store.modalVisible}
        title="批量添加至场景"
        onOk={this.onOk}
        onCancel={this.onCancel}
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
                          message: '必选',
                        },
                      ],
                    })(
                      <Cascader
                        placeholder="请选择场景类目"
                        options={store.cateList}
                        onChange={values => {
                          // 取最后一个值
                          this.onCateSelect(values[values.length - 1])
                        }}
                        showSearch
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>

            {
              store.selectedSceneId && !store.cateList.length && (
                <Row>
                  <Col span={14} offset={4}>
                    <div>
                      <span className="fca">没有类目？</span>
                      <a href={`${pathPrefix}/scene#/detail/${store.selectedSceneId}`}>去创建类目</a>
                    </div>
                  </Col>
                </Row>
              )
            }
          </Form>
        </div>
      </Modal>
    )
  }

  // 选择场景
  @action.bound onSceneSelect(value) {
    const {store} = this.props
    store.selectedSceneId = value
    store.selectedCateId = undefined

    store.getCateList()
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

          store.resetSelectedTags()
        })
      } else {
        console.log('error in [SearchModal]: ', errs)
      }
    })
  }

  // 取消
  @action.bound onCancel() {
    const {store} = this.props

    store.toggleModal(false)
  }
}

export default Form.create()(SearchModal)
