import intl from 'react-intl-universal'
import { Component } from 'react'
import { action, toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Drawer, Button, Spin } from 'antd'
import { ModalForm } from '../../../../component'
import {
  changeToOptions,
  enNameReg,
  isJsonFormat,
  debounce,
} from '../../../../common/util'
import { nameTypeMap } from '../util'

@observer
class DrawerCreate extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.store.objId = props.store.initParams.objId
  }

  // @action.bound selectObject(id) {
  //   this.store.ownObject = id
  //   this.form.resetFields(['cateId', 'name', 'enName'])

  //   this.store.drawerTagInfo.pathIds = []
  //   this.store.drawerTagInfo.parentId = undefined
  //   this.store.drawerTagInfo.name = undefined
  //   this.store.drawerTagInfo.enName = undefined

  //   this.store.getTagCateSelectList({
  //     id,
  //   })
  // }

  selectContent = () => {
    const {
      isEnum, // 是否枚举
      ownObject, // 所属对象
      drawerTagInfo,
      editCateId,
      tagCateSelectList,
      objectSelectList,
    } = this.store
    return [
      // {
      //   label: '所属对象',
      //   key: 'objId',
      //   initialValue: this.store.objId,
      //   component: 'select',
      //   rules: [
      //     '@requiredSelect',
      //   ],
      //   control: {
      //     disabled: true,
      //     options: objectSelectList,
      //     // onSelect: v => this.selectObject(v),
      //   },
      // },
      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.4t6c1m6rpnr'
          )
          .d('所属类目'),
        key: 'cateId',
        initialValue: drawerTagInfo.pathIds,
        // initialValue: drawerTagInfo.cateId ? [drawerTagInfo.cateId] : undefined,
        component: 'cascader',
        rules: ['@requiredSelect'],

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
            'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
          )
          .d('标签名称'),
        key: 'name',
        initialValue: drawerTagInfo.name,
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

        autoComplete: 'off',
        control: {
          // disabled: this.store.drawerTagType === 'edit',
        },
      },
      {
        label: intl
          .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
          .d('标签标识'),
        key: 'enName',
        initialValue: drawerTagInfo.enName,
        component: 'input',
        rules: [
          '@enNamePattern',
          '@transformTrim',
          '@required',
          '@max32',
          // {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
          { validator: this.checkName },
        ],

        autoComplete: 'off',
        control: {
          // disabled: this.store.drawerTagType === 'edit',
        },
      },
      {
        label: intl
          .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
          .d('数据类型'),
        key: 'valueType',
        initialValue: drawerTagInfo.valueType,
        component: 'select',
        rules: ['@requiredSelect'],

        control: {
          disabled: drawerTagInfo.status,
          options: changeToOptions(window.njkData.dict.dataType)(
            'value',
            'key'
          ),
        },
      },

      {
        label: intl
          .get('ide.src.page-manage.page-common-tag.detail.main.ilm7zazygy')
          .d('是否枚举'),
        key: 'isEnum',
        initialValue: drawerTagInfo.isEnum,
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
        initialValue: drawerTagInfo.enumValue,
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
          .get('ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c')
          .d('绑定方式'),
        key: 'configType',
        initialValue: drawerTagInfo.configType,
        component: 'select',
        rules: ['@requiredSelect'],

        control: {
          // options: tagConfigMethodMap,
          options: [
            {
              name: intl
                .get(
                  'ide.src.page-manage.page-common-tag.detail.main.vwwmvcib39m'
                )
                .d('基础标签'),
              value: 0,
            },
            {
              name: intl
                .get(
                  'ide.src.page-manage.page-common-tag.detail.main.mfs279f7xcc'
                )
                .d('衍生标签'),
              value: 1,
            },
          ],
        },
      },

      {
        label: intl
          .get(
            'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.7qxovvpt6pn'
          )
          .d('业务逻辑'),
        key: 'descr',
        initialValue: drawerTagInfo.descr,
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

  componentWillReceiveProps(next) {
    const { updateDetailKey, objId } = this.props
    if (
      !_.isEqual(updateDetailKey, next.updateDetailKey) ||
      !_.isEqual(+objId, +next.objId)
    ) {
      this.store.getList({ objId: next.objId })
    }
  }

  @action.bound changeIsEnum(e) {
    this.store.isEnum = e
  }

  @action handleCancel = () => {
    this.store.drawerTagInfo = {}
    this.store.drawerTagVisible = false
    this.store.isEnum = false
    this.store.tagCateSelectList.clear()
    // this.store.resetModal()
  }

  submit = () => {
    const t = this
    const { store } = t
    this.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          cateId: values.cateId[values.cateId.length - 1],
          // pathIds: values.cateId,
          isEnum: values.isEnum ? 1 : 0,
        }

        if (store.drawerTagType === 'edit') {
          params.id = store.drawerTagInfo.id

          store.updateTag(params, () => {
            t.handleCancel()
            store.getList({ objId: this.store.objId })
          })
        } else {
          store.createTag(params, () => {
            t.handleCancel()
            store.getList({ currentPage: 1, objId: this.store.objId })
          })
        }
      } else {
        console.log(err)
      }
    })
  }

  /**
   * @description 重名校验
   */
  checkName = (rule, value, callback) => {
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
    // console.log(this.store.drawerTagInfo.id)

    if (this.store.drawerTagInfo.id) {
      params.id = this.store.drawerTagInfo.id
    }
    // debounce(() => this.store.checkName(params, callback), 500)
    this.store.checkName(params, callback)
  }

  render() {
    const {
      drawerTagVisible,
      drawerTagType,
      confirmLoading,
      detailLoading,
    } = this.store

    const drawerConfig = {
      width: 560,
      title:
        drawerTagType === 'edit'
          ? intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.3cw1uc8uafd'
              )
              .d('编辑标签')
          : intl
              .get(
                'ide.src.page-manage.page-object-model.object-list.object-detail.drawer-create.s5rfkq7s99'
              )
              .d('新建标签'),
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerTagVisible,
      onClose: this.store.closeDrawer,
      className: 'create-drawer',
    }

    const formConfig = {
      selectContent: drawerTagVisible && this.selectContent(),
      wrappedComponentRef: form => {
        this.form = form ? form.props.form : form
      },
      style: { paddingBottom: '50px' },
    }

    return (
      <Drawer {...drawerConfig}>
        <Spin spinning={detailLoading}>
          <ModalForm {...formConfig} />
        </Spin>

        <div className="bottom-button">
          <Button
            style={{ marginRight: 8 }}
            onClick={() => this.store.closeDrawer()}
          >
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
export default DrawerCreate
