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

  // componentWillReceiveProps(nextProps) {
  //   console.log(toJS(this.props.store.recordObj), toJS(nextProps.store.recordObj))
  //   if (this.props.store !== nextProps.store) {
  //     console.log(this)
  //     // this.form.resetFields()
  //   }
  // }
  
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
      initialValue: isNewTag,
      valuePropName: 'checked',
      // defaultChecked: isNewTag,
      disabled: release || isConfig,
      control: {
        checkedText: '是',
        unCheckedText: '否',
        onChange: v => this.newTag(v),
      },
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
      label: '标签标识',
      key: 'enName',
      initialValue: tagBaseInfo.enName,
      rules: !isNewTag ? null : ([
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ]),
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
      initialValue: isEnum,
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
      hide: !isEnum, // 待验证
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

  // 是否新建标签
  @action newTag = v => {
    this.store.tagBaseInfo = {}
    this.form.resetFields()
    this.store.isNewTag = v
    // this.store.isEnum = false
    if (!v) this.store.getTagList()
  }
  
  @action.bound changeIsEnum(e) {
    this.store.isEnum = e
  }

  @action.bound tagChange(e) {
    console.log(e)
    this.store.tagId = e
    this.store.getTagBaseDetail()
  }

  /**
   * @description 重名校验
   */
  // 名称类型映射: 1 中文名 2 英文名

  checkName = (rule, value, callback) => {
    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名(标签标识)
    }

    if (this.store.nameKeyWord.includes(value)) {
      callback('名称与关键字重复')
      return 
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
    const {isConfig, recordObj, isNewTag} = this.store
    if (isConfig) {
      // 取消配置
      this.store.delTagRelation()
      this.store.recordObj.tagId = null
      this.store.disNext = false
    } else {
      this.form.validateFields().then(values => {
        if (recordObj.valueType !== values.valueType) {
          failureTip('数据类型不匹配，请重新选择')
          return
        }
        const params = {
          ...values,
          newTag: undefined,
          isEnum: values.isEnum ? 1 : 0,
        }
        // 配置
        if (isNewTag) {
          this.store.createTag(params)
        } else {
          this.store.saveTagRelation()
        }
        this.store.disNext = false
      }).catch(err => console.log(err))
    }
    
    // this.store.getList()
  }

  render() {
    const {release, isConfig, recordObj} = this.store
    const {fieldName, tagId, status} = recordObj
    const formConfig = {
      selectContent: this.selectContent(),
      disabled: true,
      wrappedComponentRef: form => { this.store.form = this.form = form ? form.props.form : form },
    }
    return (
      <Fragment>
        {
          fieldName ? (
            <div className="config-form">
              <div className="form-header">
                <div>
                  <span className="fs14 mr8">{fieldName}</span>
                  <Tag color={release ? 'processing' : 'default'}>{status === 2 ? '已发布' : '未发布'}</Tag>
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
