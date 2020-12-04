import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {
  observable, action, toJS,
} from 'mobx'
import {Tree} from 'antd'

import {NoBorderInput, Loading, OmitTooltip} from '../../../component'
import {IconChakan} from '../../../icon-comp'

const {TreeNode} = Tree

@inject('bigStore')
@observer
export default class CateTree extends Component {

  @observable checkedKeys = []

  // 生成dom节点
  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          key={item.aid}
          // key={item.isUsed}
          dataRef={toJS(item)}
          selectable={false}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }

    return (
      <TreeNode
        key={item.aid}
        // key={item.isUsed}
        title={<OmitTooltip maxWidth={120} text={item.name} />}
        selectable={false}
        objectData={toJS(item)}
        // disableCheckbox={listDataIds.includes(item.aId)}
        disableCheckbox={item.canDelete === 0}
      />
    )
  })

  // 选中子节点or父节点
  @action onCheck = (checkedKeys, e) => {
    console.log(toJS(checkedKeys))
    const {onCheck, bigStore} = this.props
    const {checkedNodes} = e
    // const selectNodes = checkedNodes.filter(d => d.objectData).map(d => d.objectData)

    // onCheck(selectNodes)
    bigStore.checkedKeys = checkedKeys
  }

  render() {
    const {bigStore} = this.props

    const {
      tagTreeList,
      tagTreeLoading,
      checkedKeys,
    } = bigStore

    return (
      <div style={{border: '1px solid #d9d9d9', marginRight: '16px'}}>
        <div className="object-tree-header">
          <NoBorderInput
            placeholder="请输入对象名称搜索"
            value={this.searchKey}
            onChange={this.searchTree}
          />
          <IconChakan size="14" className="mr8" onClick={this.onSearch} />
        </div>
        {
          tagTreeLoading ? <Loading mode="block" height={100} />
            : (
              <Tree
                checkable
                defaultExpandAll
                onCheck={this.onCheck}
                checkedKeys={checkedKeys}
              >
                {this.renderTreeNodes(tagTreeList)}
              </Tree>
            )
        } 
      </div>
    )
  }
}
