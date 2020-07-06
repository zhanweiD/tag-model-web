/**
 * @description 对象管理 - 树组件
 */
import {Component} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../../../component'
import {
  getIconNodeSrc,
  TreeNodeTitle,
} from '../util'

import Action from './action'
import SelectObject from './select-object'

const {DtTreeNode, DtTreeBox} = DtTree

@inject('bigStore')
@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  componentWillMount() {
    this.getTreeData()
  }

  componentWillReceiveProps(next) {
    const {selectObjUpdateKey} = this.props
    if (!_.isEqual(selectObjUpdateKey, next.selectObjUpdateKey)) {
      this.store.selectObjVisible = true
    }
  }

  getTreeData() {
    this.store.getObjTree(() => {
      this.store.objId = this.store.currentSelectKeys
    })
  }

  /**
   * @description 选择对象节点 改变路由 刷新对象详情
   * @param {*} selectedKeys @typedef Array 所选ID集合
   * @param {*} info 所选节点信息
   */
  @action.bound onselect(selectedKeys, node) {
    // 1. 选中节点为当前所选节点；不进行操作
    if (this.store.objId === selectedKeys[0]) return

    // 2. 展开节点
    // info.node.onExpand()
    [this.store.currentSelectKeys] = selectedKeys

    // 3. 跳转到指定路由
    const {history} = this.props

    const {nodeData} = node.node.props

    let {tabId} = this.store

    if (nodeData && (nodeData.objType === 0)) { // 简单关系
      if (tabId === 'field') {
        this.store.tabId = 'view'
        tabId = 'view'
      }
    }

    history.push(`/manage/object-config/${this.store.typeCode}/${selectedKeys[0]}/${tabId}`);
    
    [this.store.objId] = selectedKeys
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
        nodeData={node}
      >
        {
          this.processNodeData(node.children)
        }
      </DtTreeNode>
    ))
  }

  componentWillUnmount() {
    this.store.destory()
  }

  render() {
    const {
      treeLoading, treeData, expandAll, currentSelectKeys, selectObjVisible,
    } = this.store

    const {history} = this.props

    const treeBoxConfig = {
      titleHeight: 34,
      title: <Action store={this.store} key={this.store.typeCode} getTreeData={this.getTreeData} />,
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
      defaultExpandedKeys: this.store.searchExpandedKeys.slice(),
    }

    const selectObjConfig = {
      visible: selectObjVisible,
      history,
      // store,
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
        <SelectObject {...selectObjConfig} />
      </div>
    )
  }
}
