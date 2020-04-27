import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../component'

@observer
export default class ModalTagConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => {
    const {objList, tagList} = this.store
    return [{
      label: '对象',
      key: 'objId',
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: toJS(objList),
        onSelect: v => this.selectObj(v),
      },
    }, {
      label: '标签名称',
      key: 'tagId',
      component: 'select',
      rules: [
        '@requiredSelect',
      ],
      control: {
        options: toJS(tagList),
      },
    }]
  }

  @action.bound selectObj(v) {
    this.form.resetFields(['tagId'])
    this.store.getTagList({
      objId: v,
    })
  } 

  @action handleCancel = () => {
    this.store.visible = false
  }

  submit = () => {
    const t = this

    this.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          tagId: values.tagId,
          id: t.store.fieldDetail.id,
        }
        t.store.configTag(params, () => {
          t.handleCancel()
        })
      }
    })
  }

  render() {
    const {
      visible, confirmLoading,
    } = this.store
    const modalConfig = {
      title: '标签映射',
      visible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      confirmLoading,
    }
    
    const formConfig = {
      selectContent: visible && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }
}
