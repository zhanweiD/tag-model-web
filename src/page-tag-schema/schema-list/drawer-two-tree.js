/**
 * @description 
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {action, observable} from 'mobx'
import {Tabs} from 'antd'
import {DtTree} from '@dtwave/uikit'
import {Loading} from '../../component'
import Action from './tree-action'
import functionIcon from '../../icon/function-icon.svg'

const {TabPane} = Tabs
const {DtTreeNode, DtTreeBox} = DtTree

@inject('rootStore')
@observer
export default class DrawerTwoTree extends Component {
  constructor(props) {
    super(props)
    const {drawerStore} = props.rootStore
    
    this.store = drawerStore
  }

  @observable current = '0'

  @action.bound tabChange(key) {
    this.current = key
    this.store.searchKey = undefined

    if (key === '1') {
      this.store.getFunTree()
    } else {
      this.store.getTagTree()
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
        itemKey={node.id}
        // title={<TreeNodeTitle node={node} />}
        title={+this.current === 0 && node.enName ? `${node.name}(${node.enName})` : node.name}
        selectable={node.parentId}
        showIcon={node.parentId === 0}
        // 对象类目只有一级
        iconNodeSrc={+this.current === 1 ? functionIcon : null}
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
      treeLoading, treeData, expandAll, searchExpandedKeys,
    } = this.store

    const treeConfig = {
      type: 'tree',
      selectExpand: true,
      onSelect: this.onselect,
      defaultExpandAll: expandAll,
      defaultExpandedKeys: searchExpandedKeys.slice(),
    }

    const treeBoxConfig = {
      titleHeight: 34,
      showTitle: this.current === '0',
      title: <Action store={this.store} key={this.store.typeCode} />,
      defaultWidth: 200,
      style: {minWidth: '200px'},
    }

    return (
      <div className="processe-tree">
        <Tabs onChange={this.tabChange}>
          <TabPane tab="基础标签" key="0" />
          <TabPane tab="函数" key="1" />
        </Tabs>
        <div style={{marginTop: '-24px', height: 'calc(100% - 38px)', overflow: 'auto'}}>
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
      </div>
    )
  }
}
