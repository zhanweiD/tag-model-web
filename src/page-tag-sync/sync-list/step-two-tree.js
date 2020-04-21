import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {Tree, Checkbox} from 'antd'
import {NoBorderInput, Loading, OmitTooltip} from '../../component'
import {IconChakan} from '../../icon-comp'

const {TreeNode} = Tree

@observer
export default class SyncTagTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  renderTreeNodes = data => data.map(item => {
    // const {listDataIds} = this.props

    if (item.type) {
      return (
        <TreeNode
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          key={item.id}
          dataRef={item}
          selectable={false}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }

    return (
      <TreeNode
        key={item.id}
        title={<OmitTooltip maxWidth={120} text={item.name} />}
        selectable={false}
        // tagData={item}
        // disableCheckbox={listDataIds.includes(item.id)}
      />
    )
  })
  render() {
    const {treeData, treeLoading} = this.store

    return (
      <div className="sync-tag-tree">
        <div className="select-tree-header">
          <NoBorderInput
            placeholder="请输入标签名称"
            value={this.searchKey}
            onChange={this.searchTree}
          />
          <IconChakan size="14" className="mr8" onClick={this.onSearch} />
        </div>
        {
          treeLoading ? <Loading mode="block" height={100} />
            : (
              <Fragment>
                <Checkbox
                  checked={this.allChecked}
                  indeterminate={this.indeterminate}
                  onChange={this.handleAllSelect}
                  className="all"
                >
                  全选
                </Checkbox>
                <Tree
                  checkable 
                  checkStrictly={false}
                  defaultExpandAll
                  onCheck={this.onCheck}
                  // checkedKeys={checkedKeys}
                >
                  {this.renderTreeNodes(treeData)}
                </Tree>
              </Fragment>

            )
        }
      </div>
    )
  }
}
