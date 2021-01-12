import intl from 'react-intl-universal'
import { Component } from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { Drawer, Button } from 'antd'
import { ModalForm } from '../../../component'
import {
  changeToOptions,
  enNameReg,
  isJsonFormat,
  debounce,
} from '../../../common/util'

// 名称类型映射: 1 中文名 2 英文名
const nameTypeMap = {
  name: 1,
  enName: 2,
}

@observer
class DrawerTagConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent = () => {
    const {
      modalInfo: { detail },
      isEnum,
      tagTreeData,
      tagTypeList,
    } = this.store

    // 默认类目
    const defaultCate = tagTreeData.filter(d => d.aId === -1)
    const defaultCateV = defaultCate.length ? [defaultCate[0].id] : undefined

    return [
      {
        label: intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
          )
          .d('标签名称'),
        key: 'name',
        initialValue: detail.name,
        component: 'input',
        rules: [
          '@namePattern',
          '@nameUnderline',
          '@nameShuQi',
          '@transformTrim',
          '@required',
          '@max32',
          { validator: this.checkName },
        ],
      },

      {
        label: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        key: 'enName',
        initialValue: detail.enName,
        component: 'input',
        rules: [
          '@enNamePattern',
          '@transformTrim',
          '@required',
          '@max32',
          // {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
          { validator: this.checkName },
        ],
      },

      {
        label: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        key: 'valueType',
        initialValue: detail.valueType,
        component: 'select',
        rules: ['@requiredSelect'],

        control: {
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
      },

      {
        label: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        key: 'isEnum',
        initialValue: isEnum,
        valuePropName: 'checked',
        component: 'switch',
        control: {
          checkedText: intl
            .get('ide.src.component.form-component.03xp8ux32s3a')
            .d('是'),
          unCheckedText: intl
            .get('ide.src.component.form-component.h7p1pcijouf')
            .d('否'),
          onChange: e => this.changeIsEnum(e),
        },
      },

      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7g6e5biv0hp'
          )
          .d('枚举显示值'),
        key: 'enumValue',
        hide: !isEnum,
        initialValue: detail.enumValue,
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
        key: 'pathIds',
        initialValue:
          detail.pathIds && detail.pathIds.length
            ? detail.pathIds.slice(2)
            : defaultCateV,
        component: 'cascader',
        rules: ['@requiredSelect'],

        control: {
          options: tagTreeData,
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
        initialValue: detail.descr,
        component: 'textArea',
        rules: ['@max128'],
      },
    ]
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

  @action.bound changeIsEnum(e) {
    this.store.isEnum = e
  }

  @action handleCancel = () => {
    this.store.modalInfo.visible = false
    this.store.tagTypeList.clear()
  }

  submit = () => {
    const t = this
    const { store } = t

    this.form.validateFields((err, values) => {
      if (!err) {
        const {
          modalInfo: { detail },
        } = store

        const params = [
          {
            projectId: detail.projectId,
            objId: detail.objId,
            dataStorageId: detail.dataStorageId,
            dataDbName: detail.dataDbName,
            dataDbType: detail.dataDbType,
            storageTypeName: detail.storageTypeName,
            dataTableName: detail.dataTableName,
            dataFieldName: detail.dataFieldName,
            dataFieldType: detail.dataFieldType,
            isConfigured: detail.isConfigured,
            isMajorKey: detail.isMajorKey,
            isUsed: detail.isUsed,
            tagId: detail.tagId,
            isEnum: values.isEnum ? 1 : 0,
            enumValue: values.enumValue,
            valueType: values.valueType,
            name: values.name,
            enName: values.enName,
            descr: values.descr,
            pathIds: values.pathIds,
            parentId:
              values.pathIds && values.pathIds.length
                ? values.pathIds[values.pathIds.length - 1]
                : detail.parentId,
          },
        ]

        store.createBatchTag(params)
      }
    })
  }

  /**
   * @description 重名校验
   */
  checkName = (rule, value, callback) => {
    const {
      modalInfo: { detail },
    } = this.store

    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
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

    if (detail.id) {
      params.id = detail.id
    }
    // debounce(() => this.store.checkName(params, callback), 500)
    this.store.checkName(params, callback)
  }

  render() {
    const { modalInfo, confirmLoading } = this.store

    const drawerConfig = {
      width: 560,
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field.7i73j0om993'
        )
        .d('标签配置'),
      maskClosable: false,
      destroyOnClose: true,
      visible: modalInfo.visible,
      onClose: this.handleCancel,
      className: 'create-drawer',
    }

    const formConfig = {
      selectContent: modalInfo.visible && this.selectContent(),
      wrappedComponentRef: form => {
        this.form = form ? form.props.form : form
      },
    }

    return (
      <Drawer {...drawerConfig}>
        <ModalForm {...formConfig} />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
          <Button style={{ marginRight: 8 }} onClick={this.handleCancel}>
            {intl
              .get('ide.src.page-config.workspace-config.modal.xp905zufzth')
              .d('取消')}
          </Button>
          <Button type="primary" loading={confirmLoading} onClick={this.submit}>
            {intl
              .get('ide.src.page-config.workspace-config.modal.wrk0nanr55b')
              .d('确定')}
          </Button>
        </div>
      </Drawer>
    )
  }
}
export default DrawerTagConfig
