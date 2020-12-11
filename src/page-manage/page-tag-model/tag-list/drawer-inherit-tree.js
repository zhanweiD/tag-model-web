import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {
  observable, action, toJS, computed,
} from 'mobx'
import _ from 'lodash'
import {Tree, Switch} from 'antd'

import {NoBorderInput, Loading, OmitTooltip} from '../../../component'
import {IconChakan} from '../../../icon-comp'

const {TreeNode} = Tree

@inject('bigStore')
@observer
export default class CateTree extends Component {
  // 生成dom节点
  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          key={item.aId}
          dataRef={toJS(item)}
          selectable={false}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }

    return (
      <TreeNode
        key={item.aId}
        title={<OmitTooltip maxWidth={120} text={item.name} />}
        selectable={false}
        objectData={toJS(item)}        
        disableCheckbox={!item.available || item.isUsed}
      />
    )
  })

  // 选中子节点or父节点
  @action onCheck = (checkedKeys, e) => {
    const {bigStore} = this.props
    const {tagParentIds} = bigStore

    bigStore.checkedKeys = _.filter(checkedKeys, item => tagParentIds.indexOf(item) === -1)
  }

  @action.bound onSwitchChange = e => {
    const {bigStore} = this.props
    if (e) {
      // 展示所有的标签
      bigStore.tagTreeLoading = true
      setTimeout(() => {
        bigStore.tagTreeList = bigStore.tagTreeListAll
        bigStore.tagTreeLoading = false
      }, 200)
    } else {
      // 展示可选择的标签
      bigStore.tagTreeLoading = true
      setTimeout(() => {
        bigStore.tagTreeList = bigStore.tagTreeListAvailable
        bigStore.tagTreeLoading = false
      }, 200)
    }
  }

  @action.bound searchTree = e => {
    const {bigStore} = this.props

    bigStore.treeSearchKey = e
    bigStore.getTagTree()
  }

  render() {
    const {bigStore} = this.props

    const {
      tagTreeList,
      tagTreeLoading,
      checkedKeys,
      treeSearchKey,
    } = bigStore

    return (
      <div>
        <div className="mb12 mt2 FBH FBAC">
          <div className="mr4">展示不可选择的标签</div>
          <Switch 
            size="small" 
            checkedChildren="是" 
            unCheckedChildren="否" 
            onChange={this.onSwitchChange}
          />
        </div>
        <div 
          style={{
            border: '1px solid #d9d9d9', 
            marginRight: '16px', 
            height: 'calc(100% - 32px)',
            borderRadius: '4px',
            width: '200px',
          }}
        >
          <div className="object-tree-header">
            <NoBorderInput
              placeholder="请输入对象名称搜索"
              value={treeSearchKey}
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
      </div>
    )
  }
}
