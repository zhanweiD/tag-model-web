import {Component} from 'react'
import {action, toJS, observable} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../component'

@observer
export default class ModalScene extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable sceneId = undefined

  @action.bound selectScene(id) {
    this.sceneId = id
    this.form.resetFields(['catId'])
    this.store.objId = undefined
    this.store.sceneCate.clear()

    this.store.getSceneCate({
      occasionId: id,
    })
  }

  selectContent= () => [{
    label: '业务场景',
    key: 'occasionId',
    rules: [
      '@requiredSelect',
    ],
    control: {
      options: this.store.sceneList,
      onSelect: v => this.selectScene(v),
    },
    component: 'select',
  }, {
    label: '场景类目',
    key: 'catId',
    component: 'cascader',
    rules: [
      '@requiredSelect',
    ],
    control: {
      // disabled: !this.sceneId,
      options: toJS(this.store.sceneCate),
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  }, 
  // {
  //   label: '描述',
  //   key: 'descr',
  //   component: 'textArea',
  // }
  ]

  @action handleCancel = () => {
    this.store.modalSceneVisible = false
    this.store.sceneType = undefined  
    this.store.sceneCate.clear()
    this.sceneId = undefined
  }

  submit = () => {
    const t = this
    const {store} = t
    this.form.validateFields((err, values) => {
      if (!err) {
        const catId = values.catId[values.catId.length - 1]
        const {occasionId} = values
        let occTags

        if (store.sceneType === 'one') {
          occTags = [{
            occasionId,
            catId, 
            objId: store.selectItem.objId,
            tagId: store.selectItem.id,
          }]
        } else {
          const objId = store.objectId
          const tags = toJS(store.tagIds)

          occTags = tags.map(tagId => ({
            occasionId,
            catId,
            objId,
            tagId: tagId || store.selectItem.id,
          }))
        }
       
        store.addToScene({
          occTags,
        }, () => {
          t.handleCancel()
        })
      }
    })
  }

  render() {
    const {modalSceneVisible, confirmLoading, sceneCate} = this.store
    const modalConfig = {
      title: '添加到业务场景',
      visible: modalSceneVisible,
      onCancel: this.handleCancel,
      onOk: this.submit,
      maskClosable: false,
      width: 525,
      destroyOnClose: true,
      confirmLoading,
      className: 'noCateBox',
    }
    
    const formConfig = {
      selectContent: modalSceneVisible && this.selectContent(),
      wrappedComponentRef: form => { this.form = form ? form.props.form : form },
    }
    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
        {
          this.sceneId ? <a href={`${window.__onerConfig.pathPrefix}/scene#/${this.sceneId}`} className="noCate">没有类目？ 去场景中创建类目</a> : null
        }
        {/* <a href={`${window.__onerConfig.pathPrefix}/scene#/${this.sceneId}`} className="noCate">没有类目？ 去场景中创建类目</a> */}
      </Modal>
    )
  }
}
