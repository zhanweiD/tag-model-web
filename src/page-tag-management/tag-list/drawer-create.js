import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Drawer, Button, Spin} from 'antd'
import {ModalForm} from '../../component'
import {changeToOptions, enNameReg, isJsonFormat} from '../../common/util'
import {tagConfigMethodMap, nameTypeMap} from './util'

const dataTypeData = changeToOptions((window.njkData.dict || {}).dataType || [])('value', 'key')

@observer
export default class DrawerCreate extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @action.bound selectObject(id) {
    this.store.ownObject = id
    this.form.resetFields(['cateId', 'name', 'enName'])

    this.store.drawerTagInfo.parentId = undefined
    this.store.drawerTagInfo.name = undefined
    this.store.drawerTagInfo.enName = undefined

    this.store.getTagCateSelectList({
      id,
    })
  }

  selectContent = () => {
    const {
      isEnum, // 是否枚举
      ownObject, // 所属对象
      drawerTagInfo, 
      tagCateSelectList, 
      objectSelectList,
    } = this.store

    return [{
      label: '所属对象',
      key: 'objId',
      initialValue: drawerTagInfo.objId,
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: objectSelectList,
        onSelect: v => this.selectObject(v),
      },
    }, 
    {
      label: '所属类目',
      key: 'cateId',
      initialValue: drawerTagInfo.pathIds && drawerTagInfo.pathIds.length ? drawerTagInfo.pathIds.slice(2) : undefined,
      component: 'cascader',
      rules: [
        '@requiredSelect',
      ],
      control: {
        disabled: !ownObject,
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
      label: '标签名称',
      key: 'name',
      initialValue: drawerTagInfo.name,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ],
      control: {
        disabled: !ownObject,
      },
    }, {
      label: '唯一标识',
      key: 'enName',
      initialValue: drawerTagInfo.enName,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
        {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
        {validator: this.checkName},
      ],
      control: {
        disabled: !ownObject,
      },
    }, {
      label: '数据类型',
      key: 'valueType',
      initialValue: drawerTagInfo.valueType,
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: dataTypeData,
      },
    }, {
      label: '是否枚举',
      key: 'isEnum',
      initialValue: drawerTagInfo.isEnum,
      valuePropName: 'checked',
      component: 'switch',
      control: {
        checkedText: '是',
        unCheckedText: '否',
        onChange: e => this.changeIsEnum(e),
      },
    }, {
      label: '枚举显示值',
      key: 'enumValue',
      hide: !isEnum,
      initialValue: drawerTagInfo.enumValue,
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
      label: '配置方式',
      key: 'configType',
      initialValue: drawerTagInfo.configType,
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: tagConfigMethodMap,
      },
    }, {
      label: '业务逻辑',
      key: 'descr',
      initialValue: drawerTagInfo.descr,
      component: 'textArea',
      rules: [
        '@max128',
      ],
    }]
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


  @action.bound changeIsEnum(e) {
    this.store.isEnum = e
  }

  @action handleCancel = () => {
    this.store.drawerTagInfo = {}
    this.store.drawerTagVisible = false
    // this.store.resetModal()
  }

  submit = () => {
    const t = this
    const {store} = t
    
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
            store.getList()
          })
        } else {
          store.createTag(params, () => {
            t.handleCancel()
            store.getList()
          })
        }
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

    if (this.store.drawerTagInfo.id) {
      params.id = this.store.drawerTagInfo.id
    }

    this.store.checkName(params, callback)
  }

  render() {
    const {
      drawerTagVisible, drawerTagType, confirmLoading, detailLoading,
    } = this.store

    const drawerConfig = {
      width: 560,
      title: drawerTagType === 'edit' ? '编辑标签' : '创建标签',
      maskClosable: false,
      destroyOnClose: true,
      visible: drawerTagVisible,
      onClose: this.store.closeDrawer,
      className: 'create-drawer',
    }

    const formConfig = {
      selectContent: drawerTagVisible && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Drawer {...drawerConfig}>
        <Spin spinning={detailLoading}>
          <ModalForm {...formConfig} />
        </Spin>
        
        <div className="bottom-button">
          <Button style={{marginRight: 8}} onClick={() => this.store.closeDrawer()}>取消</Button>
          <Button type="primary" loading={confirmLoading} onClick={this.submit}>确定</Button>
        </div>
      </Drawer>
    )
  }
}
