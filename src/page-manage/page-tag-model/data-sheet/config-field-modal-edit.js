import intl from 'react-intl-universal'
import {observer} from 'mobx-react'
import {Component} from 'react'
import PropTypes from 'prop-types'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Modal, Input, Spin, Select, Switch, Cascader} from 'antd'
import {
  isJsonFormat,
  enNameReg,
  getNamePattern,
  getEnNamePattern,
  debounce,
} from '../../../common/util'
import store from './store-tag'

const FormItem = Form.Item
const {Option} = Select
const nameTypeMap = {
  name: 1,
  enName: 2,
}

@observer
class ModalTagEdit extends Component {
  static propTypes = {
    title: PropTypes.string,
    visible: PropTypes.bool.isRequired, // 是否可见
    tagDetail: PropTypes.object, // 标签对象
    onCancel: PropTypes.func.isRequired, // 关闭弹框回调
    onOk: PropTypes.func.isRequired, // 点击确定的回调
    cateList: PropTypes.array, // 所属类目的options数组
  }

  static defaultProps = {
    tagDetail: {},
  }

  state = {
    isEnum: this.props.tagDetail.isEnum || false, // 是否枚举
    confirmLoading: false, // 确认按钮加载状态
  }

  render() {
    const {
      form: {getFieldDecorator},
      tagDetail,
      visible,
      onCancel,
      cateList = [],
      title,
    } = this.props

    const {isEnum, confirmLoading} = this.state

    const modalProps = {
      title:
        title
        || intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.3cw1uc8uafd'
          )
          .d('编辑标签'),
      visible,
      onCancel,
      onOk: this.handleOk,
      maskClosable: false,
      width: 520,
      destroyOnClose: true,
      confirmLoading,
    }

    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      colon: false,
    }

    // 默认类目
    const defaultCate = cateList.filter(d => d.aId === -1)
    const defaultCateV = defaultCate.length ? [defaultCate[0].id] : undefined

    return (
      <Modal {...modalProps}>
        <Form>
          <Spin spinning={false}>
            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
                )
                .d('标签名称')}
            >
              {getFieldDecorator('name', {
                initialValue: tagDetail.name || undefined,
                rules: [
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.zwcmh88spor'
                      )
                      .d('名称不可为空'),
                  },
                  ...getNamePattern(),
                  {validator: this.checkName},
                ],
              })(
                <Input
                  size="small"
                  autoComplete="off"
                  placeholder={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.5gv19r5reie'
                    )
                    .d('不超过32个字，允许中文、英文、数字或下划线')}
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
              {getFieldDecorator('enName', {
                initialValue: tagDetail.enName || undefined,
                rules: [
                  {transform: value => value && value.trim()},
                  {
                    required: true,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.dv90olp2t26'
                      )
                      .d('标签标识不可为空'),
                  },
                  ...getEnNamePattern(),
                  // {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
                  {validator: this.checkName},
                ],
              })(
                <Input
                  size="small"
                  autoComplete="off"
                  placeholder={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.lk32glvsr9s'
                    )
                    .d('不超过32个字，允许英文、数字或下划线，必须以英文开头')}
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
              {getFieldDecorator('valueType', {
                initialValue: +tagDetail.valueType || undefined,
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
                      'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.15hh6r64c0b'
                    )
                    .d('请下拉选择')}
                  showSearch
                  optionFilterProp="children"
                >
                  {window.njkData.dict.dataType.map(item => (
                    <Option
                      key={item.key}
                      value={item.key}
                      disabled={!store.tagTypeList.includes(item.key)}
                    >
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
                  'ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy'
                )
                .d('是否枚举')}
            >
              {getFieldDecorator('isEnum', {
                initialValue: tagDetail.isEnum || 0,
                valuePropName: 'checked',
              })(
                <Switch
                  size="small"
                  checkedChildren={intl
                    .get('ide.src.component.form-component.03xp8ux32s3a')
                    .d('是')}
                  unCheckedChildren={intl
                    .get('ide.src.component.form-component.h7p1pcijouf')
                    .d('否')}
                  onChange={v => this.changeIsEnum(v)}
                />
              )}
            </FormItem>

            {/* {(tagDetail.isEnum || isEnum) && ( */}
            {/* {isEnum && (
              <FormItem
                {...formItemLayout}
                label={intl
                  .get(
                    'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7g6e5biv0hp'
                  )
                  .d('枚举显示值')}
              >
                {getFieldDecorator('enumValue', {
                  rules: [
                    { transform: value => value && value.trim() },
                    {
                      max: 128,
                      message: intl
                        .get(
                          'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.xpms8dkz1t'
                        )
                        .d('不能超过128个字符'),
                    },
                    // {required: true, message: '枚举显示值不可为空'},
                    { validator: this.handleEnumValueValidator },
                  ],

                  initialValue: tagDetail.enumValue || undefined,
                })(
                  <Input.TextArea
                    autoComplete="off"
                    rows="3"
                    size="small"
                    placeholder={intl
                      .get(
                        'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.w3weeojwq6'
                      )
                      .d(
                        '若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{"0":"女","1":"男"}'
                      )}
                  />
                )}
              </FormItem>
            )} */}

            <FormItem
              {...formItemLayout}
              label={intl
                .get(
                  'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.4t6c1m6rpnr'
                )
                .d('所属类目')}
            >
              {getFieldDecorator('pathIds', {
                initialValue: tagDetail.pathIds || defaultCateV,
              })(
                <Cascader
                  size="small"
                  options={cateList}
                  placeholder={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.ajw5v43uji'
                    )
                    .d('请选择标签类目')}
                />
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
              {getFieldDecorator('descr', {
                rules: [
                  {transform: value => value && value.trim()},
                  {
                    max: 128,
                    message: intl
                      .get(
                        'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.lzrrqtsqjgk'
                      )
                      .d('业务逻辑不能超过128个字符'),
                  },
                ],

                initialValue: tagDetail.descr || undefined,
              })(
                <Input.TextArea
                  autoComplete="off"
                  rows="3"
                  size="small"
                  placeholder={intl
                    .get(
                      'ide.src.page-manage.page-tag-model.data-sheet.config-field-modal-edit.5r46uz9x11b'
                    )
                    .d(
                      '标签表示的业务逻辑，例如“该用户的手机号”，不超过128个字'
                    )}
                />
              )}
            </FormItem>
          </Spin>
        </Form>
      </Modal>
    )
  }

  // 确定
  handleOk = () => {
    const {form, onOk} = this.props

    form.validateFields((errs, values) => {
      if (!errs) {
        this.setState({
          confirmLoading: true,
        })

        const valuesCopy = {...values}

        // 如果不是枚举值，清空这个字段
        if (!valuesCopy.isEnum) {
          valuesCopy.enumValue = ''
        }

        // 将枚举值字段改成数字
        valuesCopy.isEnum = +valuesCopy.isEnum

        // 调用传入的“确定”回调
        onOk(valuesCopy, () => {
          this.setState({
            confirmLoading: false,
          })
        })
      } else {
        console.log('handleOk Errors: ', errs)
      }
    })
  }

  // 校验枚举值输入
  handleEnumValueValidator(rule, value, callback) {
    if (value) {
      if (!isJsonFormat(value)) {
        callback(
          intl
            .get(
              'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.rmsiuz92s3k'
            )
            .d('请输入正确的JSON格式')
        )
      }
      callback()
    } else {
      callback()
    }
  }

  // 改变是否枚举值
  changeIsEnum(v) {
    this.setState({
      isEnum: v,
    })
  }

  /**
   * @description 重名校验
   */
  checkName = (rule, value, callback) => {
    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 标签标识
    }

    if (store.nameKeyWord.includes(value)) {
      callback(
        intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.gw3veamtpvv'
          )
          .d('名称与关键字重复')
      )
      return
    }

    if (store.tagId) {
      params.id = store.tagId
    }
    // debounce(() => store.checkName(params, callback), 500)
    store.checkName(params, callback)
  }
}

export default Form.create()(ModalTagEdit)
