import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Drawer, Button} from 'antd'
import {ModalForm} from '../../component'
import {changeToOptions} from '../../common/util'

const dataTypeData = changeToOptions((window.njkData.dict || {}).dataType || [])('value', 'key')

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
        // {validator: this.checkName},
      ],
    }, {
      label: '唯一标识',
      key: 'enName',
      initialValue: detail.enName,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        // {validator: this.checkName},
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
      control: {
        placeholder: '若标签值为枚举型，可将枚举代码值显示为易理解的值，例如：{"0":"女","1":"男"}',
      },
    }, {
      label: '所属类目',
      key: 'pathIds',
      initialValue: [detail.parentId],
      component: 'cascader',
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
    }]
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
          parentId: detail.parentId || (
            values.pathIds && values.pathIds.length 
              ? values.pathIds[values.pathIds.length - 1] 
              : null),
        }]

        store.createBatchTag(params)
      }
    })
  }

  // checkName = (rule, value, callback) => {
  //   const params = {
  //     name: value,
  //   }

  //   if (this.store.detail.id) {
  //     params.id = this.store.detail.id
  //   }

  //   this.store.checkName(params, callback)
  // }

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
