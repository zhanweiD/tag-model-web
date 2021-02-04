import intl from 'react-intl-universal'
import {Component} from 'react'
import {action, toJS, observable} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {ModalForm} from '../../../component'

@observer
class ModalScene extends Component {
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

  selectContent = () => [
    {
      label: intl
        .get('ide.src.page-manage.page-project-tag.detail.app-list.is5q9klgisq')
        .d('业务场景'),
      key: 'occasionId',
      rules: ['@requiredSelect'],

      control: {
        options: this.store.sceneList,
        onSelect: v => this.selectScene(v),
      },

      component: 'select',
    },
    {
      label: intl
        .get(
          'ide.src.page-manage.page-project-tag.tag-list.modal-scene.gdcm7jituxg'
        )
        .d('场景类目'),
      key: 'catId',
      component: 'cascader',
      rules: ['@requiredSelect'],

      control: {
        options: toJS(this.store.sceneCate),
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },

      extra: this.sceneId ? (
        <a
          href={`${window.__keeper.pathHrefPrefix}/scene/${this.sceneId}`}
          className="noCate"
        >
          {intl
            .get(
              'ide.src.page-manage.page-project-tag.tag-list.modal-scene.lydu0f9s6'
            )
            .d('没有类目？ 去场景中创建类目')}
        </a>
      ) : null,
    },
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
          occTags = [
            {
              occasionId,
              catId,
              objId: store.selectItem.objId,
              tagId: store.selectItem.id,
            },
          ]
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

        store.addToScene(
          {
            occTags,
          },
          () => {
            t.handleCancel()
          }
        )
      }
    })
  }

  render() {
    const {modalSceneVisible, confirmLoading, sceneCate} = this.store
    const modalConfig = {
      title: intl
        .get(
          'ide.src.page-manage.page-project-tag.tag-list.modal-scene.05eq374dkpuu'
        )
        .d('添加到业务场景'),
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
      wrappedComponentRef: form => {
        this.form = form ? form.props.form : form
      },
    }

    return (
      <Modal {...modalConfig}>
        <ModalForm {...formConfig} />
      </Modal>
    )
  }
}
export default ModalScene
