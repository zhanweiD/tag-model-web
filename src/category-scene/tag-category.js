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
import ModalSelectTag from './modal-select-tag'
import ModalTagMove from './modal-tag-move'

const {DtTreeNode} = DtTree
const {DtTreeBox} = DtTree
const {confirm} = Modal

@inject('bigStore')
@observer
class TagCategory extends Component {
  // @observable updateKey = undefined

  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.updateKey !== nextProps.updateKey) {
  //     document.getElementById('searchKey').value = ''
  //     this.store.typeCode = this.bigStore.typeCode
  //     this.store.id = this.bigStore.id || 999999999
  //     this.store.destory()
  //     this.store.getCategoryList()
  //   }
  // }

  @action.bound onselect(selectedKeys, info) {
    const {tagChange} = this.props
    const {typeCode, id} = this.bigStore
    // 1. 展开节点
    info.node.onExpand()

    // 2. 相同的路由不跳转，不相同的跳到相应的路由
    if (id === selectedKeys[0]) return

    // 3. 跳转到指定路由
    // const {history} = this.props
    // history.push(`/${typeCode}/${selectedKeys[0]}`)

    console.log(selectedKeys[0])
    // fix: 新建的层级跳转
    // this.bigStore.id = selectedKeys[0]
    
    console.log(selectedKeys, info)

    // 选择标签id
    this.bigStore.tagId = selectedKeys[0]
    tagChange(selectedKeys[0])
  }

/**
 * 节点类型 type 0 标签 1 类目 2 对象
 * @memberof TagCategory
 */
@action getMenuList = item => {
  // const {history} = this.props
  const addCateKey = {
    key: 'cate',
    value: '添加类目',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id
        this.store.eStatus.editCategory = false
        this.store.modalVisible.editCategory = true

        // 对象-添加类目; 不请求类目详情
        if (nodeData.type === 2) {
          this.store.cateDetail = {
            fullName: '客户',
            id: nodeData.id,
            type: 2, // 0 标签 1 类目 2 对象
          }
        } else {
          // 类目-添加类目; 请求类目详情
          this.store.getCategoryDetail()
        }
      })
    },
  }

  // const addTagKey = {
  //   key: 'tag',
  //   value: '添加标签',
  //   onClick: (key, nodeData) => {
  //     runInAction(() => {
  //       this.store.currentTreeItemKey = nodeData.id
  //       this.store.eStatus.editTag = false
  //       this.store.getCategoryDetail()
  //       this.store.modalVisible.editTag = true
  //     })
  //   },
  // }


  const selectTag = {
    key: 'select',
    value: '选择标签',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id
        this.store.getSelectTag()
        this.store.modalVisible.selectTag = true
      })
    },
  }

  const editKey = {
    key: 'eidt',
    value: '编辑',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id

        // 对象无编辑操作
        // if (nodeData.type === 2) {
        //   // 对象
        //   this.store.eStatus.editObject = true
        //   // this.store.getRelObj(nodeData.aId)
        //   this.store.getObjectDetail()
        //   this.store.modalVisible.editObject = true
        // } else 
        if (nodeData.type === 1) {
          // 类目
          this.store.eStatus.editCategory = true
          this.store.getCategoryDetail()
          this.store.modalVisible.editCategory = true
        } 
        // 标签无编辑操作
        // else if (nodeData.type === 0) {
        //   // 标签
        //   this.store.eStatus.editTag = true
        //   this.store.getTagDetail()
        //   this.store.modalVisible.editTag = true
        // }
      })
    },
  }
  const deleteKey = {
    key: 'delete',
    // 类目为“删除”；其他为“移除”
    value: item.type === 1 ? '删除' : '移除',
    onClick: (key, nodeData) => {
      runInAction(() => {
        this.store.currentTreeItemKey = nodeData.id
        // 节点类型 type 0 标签 1 类目 2 对象
        const tipStr = nodeData.type === 2 ? '所属该场景的全部对象、标签都会被移除，类目会被删除' : (
          nodeData.type === 1 ? '所属该类目的子类目会被删除，标签也会被移除' : '该标签会被移除'
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

  // 标签暂无移动至功能；后续会加？
  // const moveKey = {
  //   key: 'move',
  //   value: '移动至',
  //   onClick: (key, nodeData) => {
  //     runInAction(() => {
  //       this.store.currentTreeItemKey = nodeData.id
  //       this.store.getCanMoveTree()
  //       this.store.modalVisible.moveTag = true
  //     })
  //   },
  // }

  const actionList = []

  // 添加类目
  if (item.canAddCate) actionList.push(addCateKey)

  // 添加标签
  // if (item.canAddTag) {
  //   actionList.push(addTagKey)
  // }

  // 选择标签
  if (item.canAddTag) {
    actionList.push(selectTag)
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
  // if (item.type === 0) {
  //   actionList.splice(0, 0, moveKey)
  // }

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
            selectable={false}
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
            selectable={item.type === 0}
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
      <ModalSelectTag />
      <ModalTagMove />
      <ModalCategoryDetail />
    </div>
  )
}
}

export default withRouter(TagCategory)
