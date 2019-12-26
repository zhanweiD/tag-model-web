import {Component} from 'react'
import {action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../component'

@observer
export default class ModalScene extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  selectContent= () => [{
    label: '业务场景',
    key: 'scene',
    rules: [
      '@requiredSelect',
    ],
    control: {
      options: [{
        name: 'hive',
        value: 'hive',
      }],
    },
    component: 'select',
  }, {
    label: '描述',
    key: 'descr',
    component: 'textArea',
  }]

  @action handleCancel = () => {
    this.store.modalSceneVisible = false
  }

  submit = () => {
    const t = this
    const {store} = t
    this.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          occTags: toJS(store.tagIds), 
        }

        // params.occTags.replace(store.occTags) 
        // store.addToScene(params, () => {
        //   t.handleCancel()
        // })
      }
    })
  }

  render() {
    const {modalSceneVisible, confirmLoading} = this.store
    const modalConfig = {
      title: '添加到业务场景',
      visible: modalSceneVisible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      confirmLoading,
    }
    
    const formConfig = {
      selectContent: modalSceneVisible && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }
}
