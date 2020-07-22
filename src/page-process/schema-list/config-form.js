import {Component, Fragment} from 'react'
import {Radio, Tag, Button} from 'antd'
import {action, toJS} from 'mobx'
import {inject, observer} from 'mobx-react'

import {ModalForm} from '../../component'
import {debounce, changeToOptions, isJsonFormat, failureTip} from '../../common/util'

const nameTypeMap = {
  name: 1,
  enName: 2,
}
@inject('store')
@observer
export default class ConfigDrawerOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 是否新建标签
  @action newTag = v => {
    this.form.resetFields()
    this.store.isNewTag = v
    if (!v) this.store.getTagList()
  }

  selectContent= () => {
    const {
      release, // 是否发布
      isEnum, // 是否枚举
      isConfig, // 是否配置
      tagList,
      isNewTag,
      tagCateSelectList,
      tagBaseInfo,
      recordObj,
    } = this.store
    return [{
      label: '新建标签',
      key: 'newTag',
      initialValue: true,
      defaultChecked: true,
      disabled: release || isConfig,
      onClick: v => this.newTag(v),
      component: 'switch',
    }, {
      label: '标签名称',
      key: 'name',
      initialValue: tagBaseInfo.name,
      rules: isNewTag ? ([
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ]) : ([
        '@requiredSelect',
      ]),
      control: isNewTag ? null : ({
        options: tagList,
      }),
      onChange: isNewTag ? null : this.tagChange,
      disabled: release || isConfig,
      component: isNewTag ? 'input' : 'select',
    }, {
      label: '唯一标识',
      key: 'enName',
      initialValue: tagBaseInfo.enName,
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ],
      disabled: release || isConfig || !isNewTag,
      component: 'input',
    }, {
      label: '数据类型',
      key: 'valueType',
      initialValue: tagBaseInfo.valueType || recordObj.valueType, // 要判断数据类型是否一致
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: changeToOptions(window.njkData.dict.dataType)('value', 'key'),
      },
      // disabled: release || isConfig,
      disabled: true,
      component: 'select',
    }, {
      label: '是否枚举',
      key: 'isEnum',
      initialValue: tagBaseInfo.isEnum || false,
      valuePropName: 'checked',
      disabled: release || isConfig || !isNewTag,
      component: 'switch',
      control: {
        checkedText: '是',
        unCheckedText: '否',
        onChange: this.changeIsEnum,
      },
    }, {
      label: '枚举显示值',
      key: 'enumValue',
      hide: !isEnum,
      disabled: release || isConfig || !isNewTag,
      autoSize: {minRows: 3, maxRows: 5},
      initialValue: tagBaseInfo.enumValue,
      component: 'textArea',
      rules: [
        '@transformTrim',
        '@required',
        {validator: this.handleEnumValueValidator},
      ],
      control: {
        placeholder: '若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{"0":"女","1":"男"}',
      },
    }, {
      label: '所属类目',
      key: 'cateId',
      rules: [
        '@requiredSelect',
      ],
      initialValue: tagBaseInfo.parentId,
      control: {
        // options: tagCateSelectList,
        options: changeToOptions(tagCateSelectList)('name', 'id'),
        // fieldNames: {
        //   label: 'name',
        //   value: 'id',
        // },
      },
      disabled: release || isConfig || !isNewTag,
      component: 'select',
    }, {
      label: '业务逻辑',
      key: 'descr',
      initialValue: tagBaseInfo.descr,
      rules: [
        {max: 100, message: '业务逻辑不能超过100字'},
      ],
      disabled: release || isConfig || !isNewTag,
      autoSize: {minRows: 3, maxRows: 5},
      placeholder: '标签表示的业务逻辑，例如“该用户的手机号”，不超过100个字',
      component: 'textArea',
    }]
  }

  @action.bound changeIsEnum(e) {
    this.store.isEnum = e
  }

  @action.bound tagChange(e) {
    this.store.tagId = e
  }

  /**
   * @description 重名校验
   */
  // 名称类型映射: 1 中文名 2 英文名

  checkName = (rule, value, callback) => {
    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名(唯一标识)
    }
    this.store.tabCheckName(params, callback)
  }


  // 校验枚举值输入
  handleEnumValueValidator(rule, value, callback) {
    if (value) {
      if (!isJsonFormat(value)) {
        callback('请输入正确的JSON格式')
      }
      callback()
    } else {
      callback()
    }
  }

  @action submit = () => {
    const {isConfig, recordObj} = this.store
    if (isConfig) {
      // 取消配置
      this.store.delTagRelation()
    } else {
      this.form.validateFields().then(values => {
        console.log(values)
        if (recordObj.valueType !== values.valueType) {
          failureTip('数据类型不匹配，请重新选择')
        }
        const params = {
          ...values,
          newTag: undefined,
          isEnum: values.isEnum ? 1 : 0,
        }
        // 配置
        this.store.createTag(params)
      }).catch(err => console.log(err))
    }
    // this.store.getList()
  }

  render() {
    const {release, isConfig, recordObj} = this.store
    const {fieldName, tagId} = recordObj
    const formConfig = {
      selectContent: this.selectContent(),
      disabled: true,
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Fragment>
        {
          tagId ? (
            <div className="config-form">
              <div className="form-header">
                <div>
                  <span className="fs14 mr8">{fieldName}</span>
                  <Tag color={release ? 'processing' : 'default'}>{release === 2 ? '已发布' : '未发布'}</Tag>
                </div>
                <div>
                  <Button type="primary" disabled={release} onClick={this.submit}>
                    {isConfig ? '取消配置' : '配置'}
                  </Button>
                </div>
              </div>
              <ModalForm {...formConfig} />
            </div>
          ) : (
            <div className="config-text">
              <div className="form-tooltip">
                点击左侧字段名称
                <br />
                配置标签
              </div>
            </div>
          )
        }
      </Fragment>
    )
  }
}
