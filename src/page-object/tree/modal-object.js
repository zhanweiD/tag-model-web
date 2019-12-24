import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../component'
import {changeToOptions} from '../../common/util'
import {targetTypeMap, nameTypeMap, modalDefaultConfig} from '../util'

@inject('bigStore')
@observer
export default class ModalObject extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.bigStore = props.bigStore
  }

  renderContent() {
    const {typeCode} = this.store
    // 查看详情
    if (typeCode === '3') { // 对象类别code,4:实体 3:关系
      return this.renderRelModal()
    }
    // 编辑/添加
    return this.renderEntityModal()
  }

  /**
   * @description 渲染实体编辑弹窗
   */
  renderEntityModal() {
    const {
      objModal: {
        detail,
        visible,
        editType,
      }, 
      confirmLoading,
    } = this.store
    const data = editType === 'edit' ? detail : {objCatId: detail.aId, objCatName: detail.name}

    const content = [{
      label: '对象名称',
      key: 'name',
      initialValue: data.name,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        {validator: this.checkName},
      ],
    }, {
      label: '唯一标识',
      key: 'enName',
      initialValue: data.enName,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        {validator: this.checkName},
      ],
    }, {
      label: '对象主键',
      key: 'objPk',
      initialValue: data.objPk,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        {validator: this.checkName},
      ],
    }, {
      label: '所属类目',
      key: 'objCatId',
      initialValue: data.objCatId,
      component: 'text',
      hide: editType === 'edit',
      control: {
        options: data.objCatName,
      },
    }, {
      label: '所属类目',
      key: 'objCatId',
      initialValue: data.objCatId,
      component: 'select',
      hide: editType === 'add',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: changeToOptions(this.store.categoryData)('name', 'aId'),
      },
    }, {
      label: '对象描述',
      key: 'descr',
      initialValue: data.descr,
      component: 'textArea',
    }]

    const modalConfig = {
      title: editType === 'edit' ? '编辑实体' : '添加实体',
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      confirmLoading,
      ...modalDefaultConfig,
    }

    const formConfig = {
      selectContent: visible && content,
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }

  /**
   * @description 渲染关系编辑弹窗
   */
  renderRelModal() {
    const {
      objModal: {
        detail,
        visible,
        editType,
      }, 
      confirmLoading,
    } = this.store
    const data = editType === 'edit' ? detail : {objCatId: detail.id, objCatName: detail.name}

    const content = [{
      label: '对象名称',
      key: 'name',
      initialValue: data.name,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        {validator: this.checkName},
      ],
    }, {
      label: '唯一标识',
      key: 'enName',
      initialValue: data.enName,
      component: 'input',
      rules: [
        '@transformTrim',
        '@required',
        {validator: this.checkName},
      ],
    }, {
      label: '对象主键',
      key: 'objPk',
      initialValue: data.objPk,
      component: 'input',
      rules: [
        '@transformTrim',
        {validator: this.checkName},
      ],
    }, {
      label: '所属类目',
      key: 'objCatId',
      initialValue: data.objCatId,
      component: 'text',
      hide: editType === 'edit',
      control: {
        options: data.objCatName,
      },
    }, {
      label: '所属类目',
      key: 'objCatId',
      initialValue: data.objCatId,
      component: 'select',
      hide: editType === 'add',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: changeToOptions(this.store.categoryData)('name', 'aId'),
      },
    }, {
      label: '关联实体',
      key: 'objIds',
      initialValue: toJS(data.objIds),
      component: 'selectTree',
      rules: [
        '@requiredSelect',
        {validator: this.checkEntityNum},
      ],
      control: {
        options: toJS(this.store.relToEntityData),
        multiple: true,
        selectCon: ['type', 2],
      },
    }, {
      label: '对象描述',
      key: 'descr',
      initialValue: data.descr,
      component: 'textArea',
    }]

    const modalConfig = {
      title: editType === 'edit' ? '编辑关系' : '添加关系',
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      confirmLoading,
      ...modalDefaultConfig,
    }

    const formConfig = {
      selectContent: visible && content,
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }

  /**
   * @description checkEntityNum
   */
  @action checkEntityNum = (rule, value, callback) => {
    if (value && value.length !== 2) {
      callback('请选择两个关联的人/物') // 请选择两个关联的人/物
    } else {
      callback()
    }
  }

  /**
   * @description 中英文名 重名校验
   */
  @action checkName = (rule, value, callback) => {
    const {
      objModal: {
        detail,
      },
    } = this.store

    const params = {
      name: value,
      type: targetTypeMap.obj, // 类型:0 类目 1 对象
      nameType: nameTypeMap[rule.field], // 名称类型: 1 中文名 2 英文名
    }

    // 对象编辑状态;判断所属类目objCatId不为0; 则为对象
    if (detail.id && detail.objCatId) {
      params.id = detail.id
    }

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
      objModal: {
        editType,
        detail,
        type,
      },
    } = store

    this.form.validateFields((err, values) => {
      if (!err) {
        // 编辑 
        if (editType === 'edit') {
          const params = {id: detail.id, ...values}
          store.editNode(params, type, () => {
            // 编辑节点为当前选中节点
            if (detail.id === t.bigStore.objId) {
              // 刷新对象详情
              t.bigStore.updateDetailKey = Math.random()
            }
           
            t.handleCancel()
          })
        } else {
          // 新增
          store.addNode(values, type, () => {
            t.bigStore.objId = store.objId
            t.handleCancel()
          })
        }
      }
    })
  }

  render() {
    return this.renderContent()
  }
}
