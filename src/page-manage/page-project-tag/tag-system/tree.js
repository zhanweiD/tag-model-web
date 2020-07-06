/**
 * @description 标签体系-标签树
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../../../component'
import Action from './tree-action'

const {DtTreeNode, DtTreeBox} = DtTree

@observer
export default class Tree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 递归遍历树节点
  processNodeData = data => {
    if (!data) return undefined

    return data.map(node => (
      <DtTreeNode
        key={node.id}
        itemKey={node.aId}
        title={node.name}
        selectable={node.parentId}
        showIcon={node.parentId === 0}
        // 对象类目只有一级
        // iconNodeSrc={e => getIconNodeSrc(e)}
        // actionList={this.setActionList(node)}
        nodeData={node}
      >
        {
          this.processNodeData(node.children)
        }
      </DtTreeNode>
    ))
  }

  render() {
    const {
      expandAll,
      treeLoading,
      treeData,
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
      // selectedKeys: expandKey ? [expandKey] : [],
      // expandWithParentKeys: expandKey ? [expandKey] : [],
      // defaultExpandedKeys: store.searchExpandedKeys.slice(),
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
