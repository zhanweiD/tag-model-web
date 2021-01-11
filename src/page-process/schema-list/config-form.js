import intl from 'react-intl-universal'
import { Component, Fragment } from 'react'
import { Radio, Tag, Button } from 'antd'
import { action, toJS } from 'mobx'
import { inject, observer } from 'mobx-react'

import { ModalForm } from '../../component'
import {
  debounce,
  changeToOptions,
  isJsonFormat,
  failureTip,
} from '../../common/util'

const nameTypeMap = {
  name: 1,
  enName: 2,
}

@inject('store')
@observer
class ConfigDrawerOne extends Component {
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

  selectContent = () => {
    const {
      release, // 是否发布
      isEnum, // 是否枚举
      isConfig, // 是否配置
      tagList,
      isNewTag,
      tagCateSelectList,
      tagBaseInfo,
      recordObj,
      tagTypeList,
    } = this.store
    return [
      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.s5rfkq7s99'
          )
          .d('新建标签'),
        key: 'newTag',
        initialValue: isNewTag,
        valuePropName: 'checked',
        // defaultChecked: isNewTag,
        disabled: release || isConfig,
        control: {
          checkedText: intl
            .get('ide.src.component.form-component.03xp8ux32s3a')
            .d('是'),
          unCheckedText: intl
            .get('ide.src.component.form-component.h7p1pcijouf')
            .d('否'),
          onChange: v => this.newTag(v),
        },

        component: 'switch',
      },
      {
        label: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
          )
          .d('标签名称'),
        key: 'name',
        initialValue: tagBaseInfo.name,
        rules: isNewTag
          ? [
              '@transformTrim',
              '@required',
              '@max32',
              { validator: this.checkName },
            ]
          : ['@requiredSelect'],

        control: isNewTag
          ? null
          : {
              options: tagList,
            },

        onChange: isNewTag ? null : this.tagChange,
        disabled: release || isConfig,
        component: isNewTag ? 'input' : 'select',
      },
      {
        label: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        key: 'enName',
        initialValue: tagBaseInfo.enName || recordObj.fieldName,
        rules: !isNewTag
          ? null
          : [
              '@enNamePattern',
              '@transformTrim',
              '@required',
              '@max32',
              { validator: this.checkName },
            ],

        disabled: release || isConfig || !isNewTag,
        component: 'input',
      },
      {
        label: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        key: 'valueType',
        // initialValue: tagBaseInfo.valueType || recordObj.valueType, // 要判断数据类型是否一致
        initialValue: tagBaseInfo.valueType || tagTypeList[0], // 要判断数据类型是否一致
        rules: ['@requiredSelect'],

        control: {
          // options: changeToOptions(window.njkData.dict.dataType)('value', 'key'),
          options: [
            {
              name: intl.get('ide.src.common.dict.z1n81lmrcs').d('整数型'),
              value: 2,
              disabled: !tagTypeList.includes(2),
            },
            {
              name: intl.get('ide.src.common.dict.o41130chdhe').d('小数型'),
              value: 3,
              disabled: !tagTypeList.includes(3),
            },
            {
              name: intl.get('ide.src.common.dict.vdvia4exsvj').d('文本型'),
              value: 4,
              disabled: !tagTypeList.includes(4),
            },
            {
              name: intl.get('ide.src.common.dict.k7axbetkeh9').d('日期型'),
              value: 5,
              disabled: !tagTypeList.includes(5),
            },
          ],
        },

        // disabled: true,
        disabled: release || isConfig || !isNewTag,
        component: 'select',
      },
      {
        label: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        key: 'isEnum',
        initialValue: isEnum,
        valuePropName: 'checked',
        disabled: release || isConfig || !isNewTag,
        component: 'switch',
        control: {
          checkedText: intl
            .get('ide.src.component.form-component.03xp8ux32s3a')
            .d('是'),
          unCheckedText: intl
            .get('ide.src.component.form-component.h7p1pcijouf')
            .d('否'),
          onChange: this.changeIsEnum,
        },
      },

      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7g6e5biv0hp'
          )
          .d('枚举显示值'),
        key: 'enumValue',
        hide: !isEnum, // 待验证
        disabled: release || isConfig || !isNewTag,
        autoSize: { minRows: 3, maxRows: 5 },
        initialValue: tagBaseInfo.enumValue,
        component: 'textArea',
        rules: [
          '@transformTrim',
          // '@required',
          '@max128',
          { validator: this.handleEnumValueValidator },
        ],

        control: {
          placeholder: intl
            .get(
              'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.w3weeojwq6'
            )
            .d(
              '若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{"0":"女","1":"男"}'
            ),
        },
      },

      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.4t6c1m6rpnr'
          )
          .d('所属类目'),
        key: 'cateId',
        rules: ['@requiredSelect'],

        // initialValue: tagBaseInfo.parentId,
        initialValue:
          tagBaseInfo.pathIds && tagBaseInfo.pathIds.length
            ? tagBaseInfo.pathIds.slice(2)
            : undefined,
        // control: {
        //   // options: tagCateSelectList,
        //   options: changeToOptions(tagCateSelectList)('name', 'id'),
        //   // fieldNames: {
        //   //   label: 'name',
        //   //   value: 'id',
        //   // },
        // },
        disabled: release || isConfig || !isNewTag,
        // component: 'select',
        component: 'cascader',
        control: {
          options: tagCateSelectList,
          // valueName: 'id',
          // selectCon: ['isLeaf', 2],
          fieldNames: {
            label: 'name',
            value: 'id',
          },
        },
      },

      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7qxovvpt6pn'
          )
          .d('业务逻辑'),
        key: 'descr',
        initialValue: tagBaseInfo.descr,
        rules: ['@max128'],

        disabled: release || isConfig || !isNewTag,
        autoSize: { minRows: 3, maxRows: 5 },
        placeholder: intl
          .get('ide.src.page-process.schema-list.config-form.7j9uobg1hij')
          .d('标签表示的业务逻辑，例如“该用户的手机号”，不超过100个字'),
        component: 'textArea',
      },
    ]
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
      callback(
        intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.gw3veamtpvv'
          )
          .d('名称与关键字重复')
      )
      return
    }
    // debounce(() => this.store.tabCheckName(params, callback), 500)
    this.store.tabCheckName(params, callback)
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

  @action submit = () => {
    const { isConfig, recordObj, isNewTag } = this.store
    if (isConfig) {
      // 取消配置
      this.store.delTagRelation()
      this.store.recordObj.tagId = null
      this.store.disNext = false
    } else {
      this.form
        .validateFields()
        .then(values => {
          // if (recordObj.valueType !== values.valueType) {
          //   failureTip('数据类型不匹配，请重新选择')
          //   return
          // }
          values.cateId = values.cateId.pop()
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
        })
        .catch(err => console.log(err))
    }

    // this.store.getList()
  }

  render() {
    const { release, isConfig, recordObj, confirmLoading } = this.store
    const { fieldName, tagId, status } = recordObj
    const formConfig = {
      selectContent: this.selectContent(),
      disabled: true,
      wrappedComponentRef: form => {
        this.store.form = this.form = form ? form.props.form : form
      },
    }

    return (
      <Fragment>
        {fieldName ? (
          <div className="config-form">
            <div className="form-header mb16">
              <div>
                <span className="fs14 mr8">{fieldName}</span>
                <Tag color={release ? 'processing' : 'default'}>
                  {status === 2
                    ? intl
                        .get(
                          'ide.src.page-manage.page-object-model.detail.mayalaiwna'
                        )
                        .d('已发布')
                    : intl
                        .get(
                          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.kpitwb1mdsn'
                        )
                        .d('未发布')}
                </Tag>
              </div>
              <div>
                <Button
                  type="primary"
                  disabled={release}
                  onClick={this.submit}
                  loading={confirmLoading}
                >
                  {isConfig
                    ? intl
                        .get(
                          'ide.src.page-manage.page-tag-model.field-list.index.aghycqeyy64'
                        )
                        .d('取消配置')
                    : intl
                        .get(
                          'ide.src.page-process.schema-list.config-form.joncuwqju4'
                        )
                        .d('配置')}
                </Button>
              </div>
            </div>
            <ModalForm {...formConfig} />
          </div>
        ) : (
          <div className="config-text">
            <div className="form-tooltip">
              {intl
                .get('ide.src.page-process.schema-list.config-form.7yt3glrq2rx')
                .d('点击左侧字段名称')}

              <br />
              {intl
                .get(
                  'ide.src.page-manage.page-tag-model.data-sheet.index.ovoicz21id'
                )
                .d('配置标签')}
            </div>
          </div>
        )}
      </Fragment>
    )
  }
}
export default ConfigDrawerOne
