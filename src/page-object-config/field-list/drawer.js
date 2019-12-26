import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Drawer, Button} from 'antd'
import {ModalForm} from '../../component'
import {changeToOptions, enNameReg, isJsonFormat} from '../../common/util'

const dataTypeData = changeToOptions((window.njkData.dict || {}).dataType || [])('value', 'key')

// 名称类型映射: 1 中文名 2 英文名
const nameTypeMap = {
  name: 1,
  enName: 2,
}

@observer
export default class DrawerTagConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    const {modalInfo: {detail}, isEnum, tagTreeData} = this.store

    return [{
      label: '标签名称',
      key: 'name',
      initialValue: detail.name,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
        {validator: this.checkName},
      ],
    }, {
      label: '唯一标识',
      key: 'enName',
      initialValue: detail.enName,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        '@max32',
        {pattern: enNameReg, message: '不超过32个字，只能包含英文、数字或下划线，必须以英文开头'},
        {validator: this.checkName},
      ],
    }, {
      label: '数据类型',
      key: 'valueType',
      initialValue: detail.valueType,
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
      initialValue: isEnum,
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
      initialValue: detail.enumValue,
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
      key: 'pathIds',
      initialValue: detail.pathIds && detail.pathIds.length ? detail.pathIds.slice(2) : undefined,
      component: 'cascader',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: tagTreeData,
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
    }, {
      label: '业务逻辑',
      key: 'descr',
      initialValue: detail.descr,
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
    this.store.modalInfo.visible = false
  }

  submit = () => {
    const t = this
    const {store} = t
    
    this.form.validateFields((err, values) => {
      if (!err) {
        const {modalInfo: {detail}} = store

        const params = [{
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
          parentId: values.pathIds && values.pathIds.length ? values.pathIds[values.pathIds.length - 1] : detail.parentId, 
        }]

        store.createBatchTag(params)
      }
    })
  }

  /**
   * @description 重名校验
   */
  checkName = (rule, value, callback) => {
    const {modalInfo: {detail}} = this.store

    const params = {
      name: value,
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
    }
    
    if (detail.id) {
      params.id = detail.id
    }

    this.store.checkName(params, callback)
  }


  render() {
    const {modalInfo, confirmLoading} = this.store

    const drawerConfig = {
      width: 560,
      title: '标签配置',
      maskClosable: false,
      destroyOnClose: true,
      visible: modalInfo.visible,
      onClose: this.handleCancel,
      className: 'create-drawer',
    }
    
    const formConfig = {
      selectContent: modalInfo.visible && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Drawer {...drawerConfig}>
        <ModalForm {...formConfig} />
        <div style={{
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
          <Button style={{marginRight: 8}} onClick={this.handleCancel}>取消</Button>
          <Button type="primary" loading={confirmLoading} onClick={this.submit}>确定</Button>
        </div>
      </Drawer>
    )
  }
}
