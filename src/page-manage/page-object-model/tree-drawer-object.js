import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Button, Drawer, Input, Select, Radio, TreeSelect} from 'antd'
import {enNameReg} from '../../common/util'
import {
  targetTypeMap, nameTypeMap, typeCodeMap,
} from './util'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
}

const createTreeNode = (data = [], selectCon) => {
  if (!data.length) return null

  return data.map(node => (
    <TreeSelect.TreeNode
      value={node.aId}
      title={node.name}
      key={node.aId}
      selectable={selectCon ? (node[selectCon[0]] === selectCon[1]) : node.isLeaf === 2}
    >
      {
        createTreeNode(node.children, selectCon)
      }
    </TreeSelect.TreeNode>
  ))
}

@inject('bigStore')
@Form.create()
@observer
class ModalObject extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
  }

  /**
   * @description checkEntityNum
   */
  @action checkEntityNum = (rule, value, callback) => {
    if (value && value.length !== 2) {
      callback('请选择两个关联的实体')
    } else {
      callback()
    }
  }

  /**
   * @description 中英文名 重名校验
   */
  @action checkName = (rule, value, callback) => {
    const {
      objModal: {
        detail,
        editType,
      },
    } = this.store

    const params = {
      name: value,
      type: targetTypeMap.obj, // 类型:0 类目 1 对象 
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
    }

    if (rule.field === 'tagName' || rule.field === 'tagEnName') {
      params.type = 2 // 校验主标签
    }

    if (editType === 'edit') {
      // // 对象编辑状态;判断所属类目objCatId不为0; 则为对象
      // if (detail.id && detail.objCatId) {
      //   params.id = detail.id
      // } 

      if (rule.field === 'name' || rule.field === 'enName') {
        params.id = detail.id
      }

      if (rule.field === 'tagName' || rule.field === 'tagEnName') {
        params.id = detail.tagId
      }
    }
   
    this.store.checkName(params, callback)
  }

  @action.bound handleCancel() {
    this.store.objModal.visible = false
    this.store.confirmLoading = false
  }

  submit = () => {
    const t = this
    const {store} = t

    const {
      objModal: {
        editType,
        detail,
        type,
      },
      typeCode,
    } = store

    const {form: {validateFields}} = this.props

    validateFields((err, values) => {
      if (!err) {
        const param = {
          ...values,
          objTypeCode: typeCode,
        }
        // 编辑 
        if (editType === 'edit') {
          const params = {id: detail.id, ...param}
          store.editNode(params, type, () => {
            t.handleCancel()
            // 编辑节点为当前选中节点
            if (detail.id === t.bigStore.objId) {
              // 刷新对象详情
              t.bigStore.updateDetailKey = Math.random()
            }
          })
        } else {
          // 新增
          store.addNode(param, type, () => {
            t.handleCancel()
            t.bigStore.objId = store.objId
          })
        }
      }
    })
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      },
      store: {
        objModal: {
          detail,
          visible,
          editType,
        },
        confirmLoading,
      },
    } = this.props

    const {
      typeCode,
      relToEntityData,
    } = this.store

    const data = editType === 'edit' ? detail : {objCatId: detail.aId, objCatName: detail.name}

    // 抽屉配置
    const drawerConfig = {
      title: editType === 'edit' ? `编辑${typeCodeMap[typeCode]}` : `添加${typeCodeMap[typeCode]}`,
      visible,
      width: 560,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.handleCancel,
      className: 'object-drawer',
    }
    
    return (
      <Drawer
        {...drawerConfig}
      >
        <Form style={{paddingBottom: '50px'}}>
          <h4 className="mb24">基础信息</h4>
          <FormItem {...formItemLayout} label="对象名称">
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '对象名称不能为空'},
                {max: 32, message: '输入不能超过32个字符'},
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input autoComplete="off" placeholder="请输入对象名称" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="唯一标识">
            {getFieldDecorator('enName', {
              initialValue: data.enName,
              rules: [
                {transform: value => value && value.trim()},
                {required: true, message: '唯一标识不能为空'},
                {max: 32, message: '输入不能超过32个字符'},
                {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
                {
                  validator: this.checkName,
                }],
              validateFirst: true,
            })(
              <Input autoComplete="off" placeholder="请输入唯一标识" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属类目">
            {getFieldDecorator('objCatId', {
              initialValue: data.objCatId,
              rules: [{required: true, message: '请选择所属类目'}],
            })(
              <Select placeholder="请选择所属类目" showSearch optionFilterProp="children">
                {
                  this.store.categoryData.map(item => (
                    <Option key={item.aId} value={item.aId}>{item.name}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="对象描述">
            {getFieldDecorator('descr', {
              initialValue: data.descr,
              rules: [
                {transform: value => value && value.trim()},
                {max: 128, whitespace: true, message: '输入不能超过128个字符'},
              ],
            })(
              <TextArea placeholder="请输入对象描述" />
            )}
          </FormItem>

          {
            typeCode === '4' ? (
              <FormItem {...formItemLayout} label="实体类型">
                {getFieldDecorator('type', {
                  initialValue: 2,
                  rules: [
                    {required: true, message: '请选择实体类型'},
                  ],
                })(
                  <Radio.Group>
                    <Radio value={2}>常规实体</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            ) : (
              <FormItem {...formItemLayout} label="关系类型">
                {getFieldDecorator('type', {
                  initialValue: typeof data.type === 'undefined' ? 0 : data.type,
                  rules: [
                    {required: true, message: '请选择关系类型'},
                  ],
                })(
                  <Radio.Group>
                    <Radio value={0}>简单关系</Radio>
                    <Radio value={1}>复杂关系</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            )
          }

          <h4 className="mb24">主标签配置</h4>
          {
            typeCode === '4' ? (
              <Fragment>
                <FormItem {...formItemLayout} label="标签名称">
                  {getFieldDecorator('tagName', {
                    initialValue: data.tagName,
                    rules: [
                      {transform: value => value && value.trim()},
                      {required: true, message: '标签名称不能为空'},
                      {max: 32, message: '输入不能超过32个字符'},
                      {
                        validator: this.checkName,
                      }],
                    validateFirst: true,
                  })(
                    <Input autoComplete="off" placeholder="请输入标签名称" />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="唯一标识">
                  {getFieldDecorator('tagEnName', {
                    initialValue: data.tagEnName,
                    rules: [
                      {transform: value => value && value.trim()},
                      {required: true, message: '唯一标识不能为空'},
                      {max: 32, message: '输入不能超过32个字符'},
                      {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
                      {
                        validator: this.checkName,
                      }],
                    validateFirst: true,
                  })(
                    <Input autoComplete="off" placeholder="请输入唯一标识" />
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="数据类型">
                  {getFieldDecorator('tagValueType', {
                    initialValue: data.tagValueType,
                    rules: [{required: true, message: '请选择数据类型'}],
                  })(
                    <Select placeholder="请选择数据类型" showSearch optionFilterProp="children">
                      {
                        window.njkData.dict.dataType.map(item => (
                          <Option key={item.key} value={item.key}>{item.value}</Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="业务逻辑">
                  {getFieldDecorator('tagDescr', {
                    initialValue: data.tagDescr,
                    rules: [
                      {transform: value => value && value.trim()},
                      {max: 128, whitespace: true, message: '输入不能超过128个字符'},
                    ],
                  })(
                    <TextArea placeholder="请输入业务逻辑" />
                  )}
                </FormItem>
              </Fragment>
            ) : (
              <FormItem {...formItemLayout} label="关联实体">
                {getFieldDecorator('objIds', {
                  initialValue: toJS(data.objIds),
                  rules: [
                    {required: true, message: '请选择关联实体'},
                    {validator: this.checkEntityNum},
                  ],
                })(
                  // antd 3.x TreeSelect 无节点情况bug
                  relToEntityData.length 
                    ? (
                      <TreeSelect
                        placeholder="请选择关联实体"
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                        allowClear
                        multiple
                        treeDefaultExpandAll
                        treeNodeFilterProp="title"
                      >
                        {
                          createTreeNode(toJS(relToEntityData), ['type', 2])
                        }
                      </TreeSelect>
                    )
                    : (
                      <TreeSelect
                        placeholder="请选择关联实体"
                        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                      />
                    )
                )}
              </FormItem>
            )
          }

        </Form>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.handleCancel}>取消</Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.submit}
            loading={confirmLoading}
          >
            确定
          </Button>
        </div>
      </Drawer>
    )
  }
}

export default ModalObject
