import {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {observer, inject} from 'mobx-react'
import {
  toJS, observable, action, runInAction,
} from 'mobx'
import {Modal, Spin} from 'antd'
import {DtTree} from '@dtwave/uikit'
import tagClass from '../icon/tag-class.svg'
import tag from '../icon/tag.svg'
import Action from './action'

import ModalCategoryEdit from './modal-category-edit'
import ModalCategoryDetail from './modal-category-detail'
import ModalObjectEdit from './modal-object-edit'
import ModalTagEdit from './modal-tag-edit'
import ModalTagMove from './modal-tag-move'

const {DtTreeNode} = DtTree
const {DtTreeBox} = DtTree
const {confirm} = Modal

@inject('bigStore')
@observer
class TagCategory extends Component {
  @observable typeCode = undefined

  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
  }

  componentWillReceiveProps(nextProps) {
    if (this.typeCode !== nextProps.typeCode) {
      this.typeCode = nextProps.typeCode
      document.getElementById('searchKey').value = ''
      this.store.typeCode = this.bigStore.typeCode
      this.store.id = this.bigStore.id || 999999999
      this.store.destory()
      this.store.getCategoryList()
    }
  }

  @action.bound onselect(selectedKeys, info) {
    const {typeCode, id} = this.bigStore
    // 1. 展开节点
    info.node.onExpand()

    // 2. 相同的路由不跳转，不相同的跳到相应的路由
    if (id === selectedKeys[0]) return

    // 3. 跳转到指定路由
    const {history} = this.props
    history.push(`/${typeCode}/${selectedKeys[0]}`)

    // // fix: 新建的层级跳转
    this.bigStore.id = selectedKeys[0]
  }


  @action getMenuList = item => {
    const {history} = this.props
    
    const addCateKey = {
      key: 'cate',
      value: '添加类目',
      onClick: (key, nodeData) => {
        runInAction(() => {
          this.store.currentTreeItemKey = nodeData.id
          this.store.eStatus.editCategory = false
          this.store.getCategoryDetail()
          this.store.modalVisible.editCategory = true
        })
      },
    }
    const addTagKey = {
      key: 'tag',
      value: '添加标签',
      onClick: (key, nodeData) => {
        runInAction(() => {
          this.store.currentTreeItemKey = nodeData.id
          this.store.eStatus.editTag = false
          this.store.getCategoryDetail()
          this.store.modalVisible.editTag = true
        })
      },
    }
    const editKey = {
      key: 'eidt',
      value: '编辑',
      onClick: (key, nodeData) => {
        runInAction(() => {
          this.store.currentTreeItemKey = nodeData.id
          // 节点类型 type 0 标签 1 类目 2 对象
          if (nodeData.type === 2) {
            // 对象
            this.store.eStatus.editObject = true
            this.store.getRelObj(nodeData.aId)
            this.store.getObjectDetail()
            this.store.modalVisible.editObject = true
          } else if (nodeData.type === 1) {
            // 类目
            this.store.eStatus.editCategory = true
            this.store.getCategoryDetail()
            this.store.modalVisible.editCategory = true
          } else if (nodeData.type === 0) {
            // 标签
            this.store.eStatus.editTag = true
            this.store.getTagDetail()
            this.store.modalVisible.editTag = true
          }
        })
      },
    }
    const deleteKey = {
      key: 'delete',
      value: '删除',
      onClick: (key, nodeData) => {
        runInAction(() => {
          this.store.currentTreeItemKey = nodeData.id
          // 节点类型 type 0 标签 1 类目 2 对象
          const tipStr = nodeData.type === 2 ? '所属对象的类目与标签会被删除' : (
            nodeData.type === 1 ? '所属该类目的子类目会被删除，标签也会被删除' : '该标签会被删除'
          )
          confirm({
            title: '确认删除？',
            content: tipStr,
            onOk: () => this.store.deleteNode(nodeData.type),
          })
        })
      },
    }
    const readKey = {
      key: 'read',
      value: '查看详情',
      onClick: (key, nodeData) => {
        runInAction(() => {
          this.store.currentTreeItemKey = nodeData.id
          this.store.getCategoryDetail()
          this.store.modalVisible.readCategory = true
        })
      },
    }
    const moveKey = {
      key: 'move',
      value: '移动至',
      onClick: (key, nodeData) => {
        runInAction(() => {
          this.store.currentTreeItemKey = nodeData.id
          this.store.getCanMoveTree()
          this.store.modalVisible.moveTag = true
        })
      },
    }

    const actionList = []

    // 添加类目
    if (item.canAddCate) actionList.push(addCateKey)

    // 添加标签
    if (item.canAddTag) {
      actionList.push(addTagKey)
    }

    // 节点类型: type(0 标签 1 类目 2 对象)
    // “类目”节点有【查看详情】
    if (item.type === 1) {
      actionList.push(readKey)
    }

    // 编辑
    if (item.canEdit) {
      actionList.push(editKey)
    }

    // 删除
    if (item.canDelete) {
      actionList.push(deleteKey)
    }

    // ”标签“节点有【移动至】
    if (item.type === 0) {
      actionList.splice(0, 0, moveKey)
    }

    return actionList
  }

  render() {
    const treeData = toJS(this.store.treeData)
    const loop = tree => {
      const arr = []
      tree.forEach(item => {
        if (item.children && item.children.length) {
          arr.push(
            <DtTreeNode
              showIcon
              nodeData={item}
              itemKey={item.id}
              title={item.name}
              actionList={this.getMenuList(item)}
              selectable={item.type ===2}
              iconNodeSrc={tagClass}
            >
              {loop(item.children)}
            </DtTreeNode>
          )
        } else {
          arr.push(
            <DtTreeNode
              showIcon
              nodeData={item}
              itemKey={item.id}
              title={item.name}
              actionList={this.getMenuList(item)}
              iconNodeSrc={tag}
            />
          )
        }
      })

      return arr
    }

    const treeBoxProps = {
      defaultWidth: 200,
      style: {minWidth: '200px'},
      titleHeight: 34,
      title: <Action />,
      onDragStart: (e, w) => console.log('onDragStart..', e, w),
      onDraging: (e, w) => console.log('onDraging...', e, w),
      onDragEnd: (e, w) => console.log('onDragEnd...', e, w),
    }

    const treeProps = {
      selectExpand: true,
      defaultExpandAll: this.store.expandAll,
      selectedKeys: this.bigStore.id ? [this.bigStore.id] : [],
      expandWithParentKeys: this.bigStore.id ? [this.bigStore.id] : [],
      type: 'tree',
      onSelect: this.onselect,
      // actionList,
      showIcon: true,
      defaultExpandedKeys: this.store.searchExpandedKeys.slice(),
    }

    return (
      <div className="category-tree">
        <DtTreeBox {...treeBoxProps}>
          {(() => {
            if (this.store.isLoading) {
              return <div style={{textAlign: 'center', margin: '100px 0'}}><Spin /></div>
            }
            if (!this.store.isLoading && treeData.length) {
              return (
                <DtTree {...treeProps}>
                  {loop(treeData)}
                </DtTree>
              )
            }
          })()}
        </DtTreeBox>
        <ModalCategoryEdit />
        <ModalObjectEdit />
        <ModalTagEdit />
        <ModalTagMove />
        <ModalCategoryDetail />
      </div>
    )
  }
}

export default withRouter(TagCategory)
