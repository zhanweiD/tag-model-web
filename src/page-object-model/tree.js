/**
 * @description 对象管理 - 树组件
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Modal} from 'antd'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../component'
import Action from './tree-action'
import ModalCategory from './tree-modal-category'
import ModalObject from './tree-drawer-object'
import ModalMove from './tree-modal-move'
import {
  getIconNodeSrc,
  deleteTipsMap,
  TreeNodeTitle,
  TARGET_CATEGORY,
  TARGET_OBJECT,
  REL_CODE,
  // ENTITY_CODE,
} from './util'

import store from './store-tree'

const {DtTreeNode, DtTreeBox} = DtTree
const {confirm} = Modal

const {functionCodes} = window.__userConfig

@inject('bigStore')
@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
    // 便于获取store请求时的参数
    store.typeCode = props.bigStore.typeCode
    store.objId = props.bigStore.objId
    this.bigStore = props.bigStore
  }

  // 对象类目 - 对应的菜单列表
  categoryMenus = (canEdit, canDelete) => [
    {key: 'add', value: '添加对象', onClick: (key, data) => this.openModal(key, data, TARGET_OBJECT)},
    {key: 'view', value: '查看对象类目', onClick: (key, data) => this.openModal(key, data, TARGET_CATEGORY)},
    {
      key: 'edit', 
      value: '编辑',
      disabled: !canEdit,
      onClick: (key, data) => this.openModal(key, data, TARGET_CATEGORY),
    },
    {
      key: 'delete',
      value: '删除',
      disabled: !canDelete, 
      onClick: (key, data) => this.deleteNode(key, data, TARGET_CATEGORY),
    },
  ]

  // 对象 - 对应的菜单列表
  objectMenus = (canEdit, canDelete) => [
    {key: 'move', value: '移动至', onClick: (key, data) => this.openMoveModal(key, data, TARGET_OBJECT)},
    {
      key: 'edit', 
      value: '编辑',
      disabled: !canEdit,
      onClick: (key, data) => this.openModal(key, data, TARGET_OBJECT),
    }, {
      key: 'delete', 
      value: '删除',
      disabled: !canDelete,
      onClick: (key, data) => this.deleteNode(key, data, TARGET_OBJECT),
    },
  ]

  componentWillMount() {
    this.getTreeData()
  }

  getTreeData = () => {
    store.getObjTree(() => {
      this.bigStore.objId = store.objId
    })
  }

  componentWillReceiveProps(next) {
    const {updateTreeKey, addObjectUpdateKey} = this.props
    if (!_.isEqual(updateTreeKey, next.updateTreeKey)) {
      store.typeCode = this.bigStore.typeCode
      store.objId = this.bigStore.objId

      this.getTreeData()
    }

    if (!_.isEqual(addObjectUpdateKey, next.addObjectUpdateKey)) {
      store.categoryModal = {
        visible: true,
        editType: 'add',
        type: 'add',
        detail: {},
      }
    }
  }

  /**
   * @description 打开 (类目/对象) 新增编辑弹窗
   */
  @action.bound openModal(key, data, type) {
    if (type === TARGET_OBJECT) {
      // 添加/编辑 关系对象
      if (store.typeCode === REL_CODE) {
        store.getRelToEntityData()
      }

      if (key === 'edit') {
        store.getObjDetail(data.aId)
      }
    }

    if (type === TARGET_CATEGORY && key === 'view') {
      store.getCateDetail(data.aId)
    }

    store[`${type}Modal`] = {
      visible: true,
      editType: key,
      type,
      detail: data,
    }
  }

  /**
   * @description 打开（对象）移动至弹窗 
   */
  @action.bound openMoveModal(key, data) {
    store.moveModal = {
      visible: true,
      detail: data,
    }
  }

  /**
   * @description 删除节点（类目/对象）
   */
  @action.bound deleteNode(key, data, type) {
    const t = this
    const {history} = t.props
    const {title, content} = deleteTipsMap[type]

    confirm({
      title,
      content,
      onOk() {
        store.delNode(data.aId, type, () => {
          // 1. 删除节点为当前选中节点
          if (store.objId === data.aId) {
            store.objId = undefined
            // 2. 刷新类目树
            t.getTreeData()
            // 3.改变url
            history.push(`/${store.typeCode}`)
          } else {
            // 删除节点非当前选中节点
            // 1. 刷新类目树
            store.getObjTree()
          }
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  /**
   * @description 选择对象节点 改变路由 刷新对象详情
   * @param {*} selectedKeys @typedef Array 所选ID集合
   * @param {*} info 所选节点信息
   */
  @action.bound onselect(selectedKeys) {
    // 1. 选中节点为当前所选节点；不进行操作
    if (store.objId === selectedKeys[0]) return

    // 2. 展开节点
    // info.node.onExpand()
    [store.currentSelectKeys] = selectedKeys;
    [store.objId] = selectedKeys;
    [this.bigStore.objId] = selectedKeys

    // 3. 跳转到指定路由
    const {history} = this.props
    // 刷新对象详情
    this.bigStore.updateDetailKey = Math.random()
    history.push(`/${store.typeCode}/${selectedKeys[0]}/${this.bigStore.tabId}`)
  }

  /**
   * @description 设置节点的菜单
   */
  setActionList = node => {
    // if (node.type === 3) {
    //   // 默认类目aId为-1,菜单只有前两项
    //   return node.aId === -1 ? this.categoryMenus.slice(0, 2) : this.categoryMenus
    // }

    // 对象管理类目权限code 对象类目（添加、编辑、删除） ```asset_tag_obj_cat_add_edit_del``` --管理员
    if (+node.type === 3 && !functionCodes.includes('asset_tag_obj_cat_add_edit_del')) {
      return [{key: 'view', value: '查看对象类目', onClick: (key, data) => this.openModal(key, data, TARGET_CATEGORY)}] // 只有查看详情权限
    }
    // 对象管理对象权限code对象（添加、编辑、删除、发布、取消发布）```asset_tag_obj_add_edit_del_publish``` --管理员
    if (+node.type === 2 && !functionCodes.includes('asset_tag_obj_add_edit_del_publish')) {
      return [] 
    }

    if (+node.type === 3) {
      return this.categoryMenus(node.canEdit, node.canDelete)
    }

    if (+node.type === 2) {
      return this.objectMenus(node.canEdit, node.canDelete)
    }
  }
  
  /**
   * @description 递归遍历树节点
   */
  processNodeData = data => {
    if (!data) return undefined

    return data.map(node => (
      <DtTreeNode
        key={node.id}
        itemKey={node.aId}
        title={<TreeNodeTitle node={node} />}
        selectable={node.parentId}
        showIcon={node.parentId === 0}
        // 对象类目只有一级
        iconNodeSrc={e => getIconNodeSrc(e)}
        actionList={this.setActionList(node)}
        nodeData={node}
      >
        {
          this.processNodeData(node.children)
        }
      </DtTreeNode>
    ))
  }

  componentWillUnmount() {
    store.destory()
  }

  render() {
    const {
      treeLoading, treeData, expandAll, currentSelectKeys,
    } = store

    const treeBoxConfig = {
      titleHeight: 34,
      title: <Action store={store} key={store.typeCode} />,
      defaultWidth: 200,
      style: {minWidth: '200px'},
    }

    const expandKey = Number(currentSelectKeys)

    const treeConfig = {
      type: 'tree',
      selectExpand: true,
      onSelect: this.onselect,
      defaultExpandAll: expandAll,
      selectedKeys: expandKey ? [expandKey] : [],
      expandWithParentKeys: expandKey ? [expandKey] : [],
      defaultExpandedKeys: store.searchExpandedKeys.slice(),
    }
  
    return (
      <div className="object-tree">
        <DtTreeBox {...treeBoxConfig}>
          {treeLoading
            ? <Loading mode="block" height={100} />
            : (
              <DtTree {...treeConfig}>
                {
                  this.processNodeData(treeData)
                }
              </DtTree>
            )
          }
        </DtTreeBox>
        <ModalCategory store={store} />
        <ModalObject store={store} />
        <ModalMove store={store} />
      </div>
    )
  }
}
