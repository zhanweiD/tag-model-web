/**
 * @description 标签体系-标签树
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {DtTree} from '@dtwave/uikit'
import {action, toJS} from 'mobx'
import {Loading} from '../../../component'
import Action from './tree-action'
import tagIcon from '../../../icon/tag.svg'

const {DtTreeNode, DtTreeBox} = DtTree

@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store

    this.store.projectId = props.projectId
    this.store.selectedKey = null
    this.store.commonTag = props.commonTag
    this.store.getTreeData()
  }

  // 递归遍历树节点
  processNodeData = data => {
    if (!data) return undefined

    return data.map(node => (
      <DtTreeNode
        key={node.id}
        itemKey={node.isLeaf === 2 ? node.id : node.aId}
        title={node.name}
        selectable={node.type === 0}
        showIcon
        // 对象类目只有一级
        iconNodeSrc={node.type === 0 ? tagIcon : null}
        nodeData={node}
      >
        {
          this.processNodeData(node.children)
        }
      </DtTreeNode>
    ))
  }

  @action onselect = (selectedKey, e) => {
    this.store.selectedKey = selectedKey[0]
    this.store.getTagBaseDetail()
  }

  render() {
    const {
      expandAll,
      treeLoading,
      treeData,
      currentSelectKeys,
      selectedKey,
    } = this.store

    const treeBoxConfig = {
      titleHeight: 34,
      title: <Action store={this.store} />,
      defaultWidth: 200,
      style: {minWidth: '200px'},
    }

    // const expandKey = Number(currentSelectKeys)
    const treeConfig = {
      type: 'tree',
      selectExpand: true,
      onSelect: this.onselect,
      defaultExpandAll: expandAll,
      selectedKeys: selectedKey ? [selectedKey] : [],
      expandWithParentKeys: toJS(currentSelectKeys),
      // defaultExpandedKeys: store.searchExpandedKeys.slice(),
      showDetail: true,
    }
    return (
      <div className="tree"> 
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
      </div>
    )
  }
}
