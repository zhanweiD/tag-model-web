import intl from 'react-intl-universal'
/* 对象管理-树部分 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Modal} from 'antd'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../../../../component'
import {codeInProduct} from '../../../../common/util'

import {getIconNodeSrc} from '../util'

import Action from './tag-tree-action'
import ModalCategory from './modal-category'

const {DtTreeBox, DtTreeNode} = DtTree
const {confirm} = Modal

@observer
class ObjectTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 最初的列表形式的树数据
  rawData = undefined

  // 选择树的子节点key
  selectKey = null

  // 标签类目
  categoryMenus = (canEdit, canDelete) => [
    {
      key: 'add',
      value: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.tag-class-tree.2cqbroy9rpb'
        )
        .d('新建子类目'),
      onClick: (type, data) => this.openModal(type, data),
    },
    {
      key: 'edit',
      value: intl
        .get('ide.src.component.label-item.label-item.slnqvyqvv7')
        .d('编辑'),
      disabled: !canEdit,
      onClick: (type, data) => this.openModal(type, data),
    },

    {
      key: 'delete',
      value: intl
        .get('ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi')
        .d('删除'),
      disabled: !canDelete,
      onClick: (type, data) => this.deleteNode(type, data),
    },
  ]

  // 标签类目 - 叶子类目
  leafCategoryMenus = (editStatus, deleteStatus) => [
    {
      key: 'edit',
      value: intl
        .get('ide.src.component.label-item.label-item.slnqvyqvv7')
        .d('编辑'),
      disabled: !editStatus,
      onClick: (type, data) => this.openModal(type, data),
    },

    {
      key: 'delete',
      value: intl
        .get('ide.src.page-manage.page-aim-source.source-list.main.sv51d9olqdi')
        .d('删除'),
      disabled: !deleteStatus,
      onClick: (type, data) => this.deleteNode(type, data),
    },
  ]

  componentWillMount() {
    this.store.getTagCateTree(() => {
      this.getCateDetail()
    })
  }

  getCateDetail = () => {
    const {currentSelectKeys, tagList} = this.store
    this.store.keyword = undefined
    this.store.getTagCateDetail()
    this.store.getTagList(
      {
        cateId: currentSelectKeys,
        currentPage: tagList.currentPage,
        pageSize: tagList.pageSize,
      },
      'list'
    )
  }

  @action.bound openModal(type, data) {
    this.store.categoryModal = {
      visible: true,
      title: intl
        .get('ide.src.page-manage.page-object-model.detail.9o263cdwzol')
        .d('标签类目'),
      editType: type,
      detail: data,
    }
  }

  /**
   * @description 删除节点
   */
  @action.bound deleteNode(key, data) {
    const t = this
    confirm({
      title: intl
        .get(
          'ide.src.page-manage.page-object-model.object-list.object-list.tag-class-tree.gmj7k8sckal'
        )
        .d('确认删除标签类目？'),
      // content,
      onOk() {
        t.store.delNode(data.id)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  /**
   * @description 选择标签类目；展示类目详情
   */
  @action.bound onSelect(selectedKeys) {
    // 1. 选中节点为当前所选节点；不进行操作
    if (this.store.currentSelectKeys === selectedKeys[0]) return

    // 2. 选中展开当前节点
    ;[this.store.currentSelectKeys] = selectedKeys

    // 3. 获取类目详情 (基本信息&标签列表)
    this.getCateDetail()
  }

  // 递归遍历树节点
  processNodeData = data => {
    if (!data) return undefined

    return data.map(node => (
      <DtTreeNode
        key={node.id}
        itemKey={node.id}
        title={node.name}
        selectable={node.isLeaf !== 1} // 叶子节点可选
        // showIcon={node.isLeaf !== 2}
        showIcon
        // 对象类目只有一级
        iconNodeSrc={e => getIconNodeSrc(e)}
        actionList={this.setActionList(node)}
        nodeData={node}
      >
        {this.processNodeData(node.children)}
      </DtTreeNode>
    ))
  }

  // 设置节点的菜单
  setActionList = node => {
    // 类目 && 无权限 权限code "asset_tag_tag_cat_add_edit_del"
    if (!codeInProduct('tag_model:update_tag_cate[cud]', true)) {
      return []
    }

    // 叶子类目
    if (node.isLeaf === 2) {
      return this.leafCategoryMenus(node.canEdit, node.canDelete)
    }
    // 标签类目 - 非叶子类目
    return this.categoryMenus(node.canEdit, node.canDelete)
  }

  render() {
    const {treeLoading, treeData, expandAll, currentSelectKeys} = this.store

    const treeBoxConfig = {
      titleHeight: 34,
      title: <Action store={this.store} key={this.store.typeCode} />,
      defaultWidth: 200,
      style: {minWidth: '200px'},
    }

    const expandKey = Number(currentSelectKeys)

    const treeConfig = {
      type: 'tree',
      selectExpand: true,
      onSelect: this.onSelect,
      defaultExpandAll: expandAll,
      selectedKeys: expandKey ? [expandKey] : [-1], // 默认选中默认类目
      expandWithParentKeys: expandKey ? [expandKey] : [-1], // 默认选中默认类目
      defaultExpandedKeys: this.store.searchExpandedKeys.slice(),
      showDetail: true,
    }

    return (
      <div className="object-tree tree-border">
        <DtTreeBox {...treeBoxConfig}>
          {treeLoading ? (
            <Loading mode="block" height={100} />
          ) : (
            <DtTree {...treeConfig}>{this.processNodeData(treeData)}</DtTree>
          )}
        </DtTreeBox>
        <ModalCategory
          store={this.store}
          editNodeSuccess={this.getCateDetail}
        />
      </div>
    )
  }
}
export default ObjectTree
