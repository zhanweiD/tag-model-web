import intl from 'react-intl-universal'
import {Component, Fragment} from 'react'
import {observer, inject} from 'mobx-react'
import {action, toJS} from 'mobx'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Button, Drawer, Input, Select, Radio, TreeSelect} from 'antd'
import {
  enNameReg,
  getNamePattern,
  getEnNamePattern,
  debounce,
} from '../../common/util'
import {targetTypeMap, nameTypeMap, typeCodeMap} from './util'

const FormItem = Form.Item
const Option = {Select}
const {TextArea} = Input

const formItemLayout = {
  labelCol: {span: 4},
  wrapperCol: {span: 20},
  colon: false,
}

const createTreeNode = (data = [], selectCon) => {
  if (!data.length) return null

  return data.map(node => (
    <TreeSelect.TreeNode
      value={node.aId}
      title={node.name}
      key={node.aId}
      selectable={
        selectCon ? node[selectCon[0]] === selectCon[1] : node.isLeaf === 2
      }
    >
      {createTreeNode(node.children, selectCon)}
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
      callback(
        intl
          .get(
            'ide.src.page-manage.page-object-model.tree-drawer-object.4vgxc3rn2u7'
          )
          .d('请选择两个关联的实体')
      )
    } else {
      callback()
    }
  }

  /**
   * @description 中英文名 重名校验
   */
  @action checkName = (rule, value, callback) => {
    const {
      objModal: {detail, editType},

      nameKeyWord,
    } = this.store

    if (nameKeyWord.includes(value)) {
      callback(
        intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.gw3veamtpvv'
          )
          .d('名称与关键字重复')
      )
      return
    }
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

    // debounce(() => this.store.checkName(params, callback), 500)
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
      objModal: {editType, detail, type},

      typeCode,
    } = store

    const {
      form: {validateFields},
    } = this.props
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
      form: {getFieldDecorator},

      store: {
        objModal: {detail, visible, editType},

        confirmLoading,
      },
    } = this.props

    const {typeCode, relToEntityData} = this.store

    const data = editType === 'edit'
      ? detail
      : {objCatId: detail.aId, objCatName: detail.name}

    const typeCodeMap3 = typeCodeMap[typeCode]
    // 抽屉配置
    const drawerConfig = {
      title:
        editType === 'edit'
          ? intl
            .get(
              'ide.src.page-manage.page-object-model.tree-drawer-object.yeikxw04gaf',
              {typeCodeMap3}
            )
            .d('编辑{typeCodeMap3}')
          : intl
            .get(
              'ide.src.page-manage.page-object-model.tree-drawer-object.9mjhaej02y4',
              {typeCodeMap3}
            )
            .d('添加{typeCodeMap3}'),
      visible,
      closable: true,
      width: 560,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.handleCancel,
      className: 'object-drawer',
    }

    return (
      <Drawer {...drawerConfig}>
        <Form style={{paddingBottom: '50px'}}>
          <h4 className="mb24">
            {intl
              .get(
                'ide.src.page-manage.page-object-model.tree-drawer-object.ptd7orh6gg'
              )
              .d('基础信息')}
          </h4>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-list.main.9c8ou0oxjir'
              )
              .d('对象名称')}
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [
                {transform: value => value && value.trim()},
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-object-model.tree-drawer-object.4z843gbk25j'
                    )
                    .d('对象名称不能为空'),
                },
                // {max: 32, message: '输入不能超过32个字符'},
                ...getNamePattern(),
                {
                  validator: this.checkName,
                },
              ],

              validateFirst: true,
            })(
              <Input
                size="small"
                autoComplete="off"
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-object-model.tree-drawer-object.vpc39wx5xms'
                  )
                  .d('请输入对象名称')}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get('ide.src.page-manage.page-object-model.detail.q19x51sjr7')
              .d('对象标识')}
          >
            {getFieldDecorator('enName', {
              initialValue: data.enName,
              rules: [
                {transform: value => value && value.trim()},
                {
                  required: true,
                  message: intl
                    .get(
                      'ide.src.page-manage.page-object-model.tree-drawer-object.0e0a01pvn6yg'
                    )
                    .d('对象标识不能为空'),
                },
                // {max: 32, message: '输入不能超过32个字符'},
                // {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
                ...getEnNamePattern(),
                {
                  validator: this.checkName,
                },
              ],

              validateFirst: true,
            })(
              <Input
                size="small"
                autoComplete="off"
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-object-model.tree-drawer-object.f62kn4hkjm4'
                  )
                  .d('请输入对象标识')}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.4t6c1m6rpnr'
              )
              .d('所属类目')}
          >
            {getFieldDecorator('objCatId', {
              initialValue: data.objCatId,
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
              <Select
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-object-model.tree-drawer-object.krbi0krgz8l'
                  )
                  .d('请选择所属类目')}
                showSearch
                optionFilterProp="children"
              >
                {this.store.categoryData.map(item => (
                  <Option key={item.aId} value={item.aId}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={intl
              .get(
                'ide.src.page-manage.page-object-model.tree-drawer-object.tk268r21mpn'
              )
              .d('对象描述')}
          >
            {getFieldDecorator('descr', {
              initialValue: data.descr,
              rules: [
                {transform: value => value && value.trim()},
                {
                  max: 128,
                  whitespace: true,
                  message: intl
                    .get('ide.src.component.form-component.8ftxftczpk7')
                    .d('输入不能超过128个字符'),
                },
              ],
            })(
              <TextArea
                placeholder={intl
                  .get(
                    'ide.src.page-manage.page-object-model.tree-drawer-object.4eqciox3yoa'
                  )
                  .d('请输入对象描述')}
              />
            )}
          </FormItem>

          {typeCode === '4' ? (
            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-object-model.tree-drawer-object.k1vpfaigngf'
                )
                .d('实体类型')}
            >
              {getFieldDecorator('type', {
                initialValue: 2,
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.t6yhosxc4j'
                      )
                      .d('请选择实体类型'),
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={2}>
                    {intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.a764wskap5b'
                      )
                      .d('常规实体')}
                  </Radio>
                </Radio.Group>
              )}
            </FormItem>
          ) : (
            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-object-model.tree-drawer-object.q2eaj356vef'
                )
                .d('关系类型')}
            >
              {getFieldDecorator('type', {
                initialValue: typeof data.type === 'undefined' ? 0 : data.type,
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.xhx4r3tcklg'
                      )
                      .d('请选择关系类型'),
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value={0}>
                    {intl
                      .get(
                        'ide.src.page-manage.page-object-model.object-list.util.b78dpbz8x4u'
                      )
                      .d('简单关系')}
                  </Radio>
                  <Radio value={1}>
                    {intl
                      .get(
                        'ide.src.page-manage.page-object-model.object-list.util.gc2qgcsh5xa'
                      )
                      .d('复杂关系')}
                  </Radio>
                </Radio.Group>
              )}
            </FormItem>
          )}

          <h4 className="mb24">
            {intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.modal-relate-table.m5inicr74ce'
              )
              .d('主标签配置')}
          </h4>
          {typeCode === '4' ? (
            <Fragment>
              <FormItem
                {...formItemLayout}
                label={intl
                  .get(
                    'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
                  )
                  .d('标签名称')}
              >
                {getFieldDecorator('tagName', {
                  initialValue: data.tagName,
                  rules: [
                    {transform: value => value && value.trim()},
                    {
                      required: true,
                      message: intl
                        .get(
                          'ide.src.page-manage.page-object-model.tree-drawer-object.38za17m6p8j'
                        )
                        .d('标签名称不能为空'),
                    },
                    // {max: 32, message: '输入不能超过32个字符'},
                    ...getNamePattern(),
                    {
                      validator: this.checkName,
                    },
                  ],

                  validateFirst: true,
                })(
                  <Input
                    size="small"
                    autoComplete="off"
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.c5eda83dykd'
                      )
                      .d('请输入标签名称')}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={intl
                  .get(
                    'ide.src.business-component.tag-relate.dag-box.xs30zaqk60p'
                  )
                  .d('标签标识')}
              >
                {getFieldDecorator('tagEnName', {
                  initialValue: data.tagEnName,
                  rules: [
                    {transform: value => value && value.trim()},
                    {
                      required: true,
                      message: intl
                        .get(
                          'ide.src.page-manage.page-object-model.tree-drawer-object.0p91suzxe2rc'
                        )
                        .d('标签标识不能为空'),
                    },
                    // {max: 32, message: '输入不能超过32个字符'},
                    // {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
                    ...getEnNamePattern(),
                    {
                      validator: this.checkName,
                    },
                  ],

                  validateFirst: true,
                })(
                  <Input
                    size="small"
                    autoComplete="off"
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.khev1cf6ibj'
                      )
                      .d('请输入标签标识')}
                  />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={intl
                  .get(
                    'ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh'
                  )
                  .d('数据类型')}
              >
                {getFieldDecorator('tagValueType', {
                  initialValue: data.tagValueType || 4,
                  rules: [
                    {
                      required: true,
                      message: intl
                        .get(
                          'ide.src.page-manage.page-object-model.tree-drawer-object.iijbq0fz7x'
                        )
                        .d('请选择数据类型'),
                    },
                  ],
                })(
                  <Select
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.iijbq0fz7x'
                      )
                      .d('请选择数据类型')}
                    showSearch
                    optionFilterProp="children"
                  >
                    {window.njkData.dict.dataType.map(item => (
                      <Option key={item.key} value={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={intl
                  .get(
                    'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7qxovvpt6pn'
                  )
                  .d('业务逻辑')}
              >
                {getFieldDecorator('tagDescr', {
                  initialValue: data.tagDescr,
                  rules: [
                    {transform: value => value && value.trim()},
                    {
                      max: 128,
                      whitespace: true,
                      message: intl
                        .get('ide.src.component.form-component.8ftxftczpk7')
                        .d('输入不能超过128个字符'),
                    },
                  ],
                })(
                  <TextArea
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.dqn9qha3xn7'
                      )
                      .d('请输入业务逻辑')}
                  />
                )}
              </FormItem>
            </Fragment>
          ) : (
            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-object-model.tree-drawer-object.vbtuljbt1z'
                )
                .d('关联实体')}
            >
              {getFieldDecorator('objIds', {
                initialValue: toJS(data.objIds),
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.9eeb8rl00lg'
                      )
                      .d('请选择关联实体'),
                  },
                  {validator: this.checkEntityNum},
                ],
              })(
                // antd 3.x TreeSelect 无节点情况bug
                relToEntityData.length ? (
                  <TreeSelect
                    size="small"
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.9eeb8rl00lg'
                      )
                      .d('请选择关联实体')}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    allowClear
                    multiple
                    treeDefaultExpandAll
                    treeNodeFilterProp="title"
                  >
                    {createTreeNode(toJS(relToEntityData), ['type', 2])}
                  </TreeSelect>
                ) : (
                  <TreeSelect
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-object-model.tree-drawer-object.9eeb8rl00lg'
                      )
                      .d('请选择关联实体')}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    size="small"
                  />
                )
              )}
            </FormItem>
          )}
        </Form>
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={this.handleCancel}>
            {intl
              .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
              .d('取消')}
          </Button>
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.submit}
            loading={confirmLoading}
          >
            {intl
              .get('ide.src.page-config.workspace-config.modal.wrk0nanr55b')
              .d('确定')}
          </Button>
        </div>
      </Drawer>
    )
  }
}

export default ModalObject
