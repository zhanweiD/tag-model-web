import intl from 'react-intl-universal'
/**
 * @description 树组件 - 搜索框
 */
import { Component } from 'react'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import { NoBorderInput } from '../../../component'
import { IconRefresh, IconUnExtend, IconExtend } from '../../../icon-comp'

@observer
class Action extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  // 查询树节点
  @action.bound searchTree(data) {
    this.store.searchKey = data
    this.store.getTreeData()
  }

  // 刷新树节点
  @action.bound refreshTree() {
    this.store.getTreeData()
  }

  // 展开缩放树节点
  @action.bound expandTree() {
    this.store.treeLoading = true
    _.delay(() => {
      this.store.expandAll = !this.store.expandAll
      this.store.treeLoading = false
    }, 100)
  }

  render() {
    return (
      <div className="object-tree-action">
        <NoBorderInput
          placeholder={intl
            .get(
              'ide.src.page-manage.page-project-tag.tag-system.tree-action.sseq75z4s6'
            )
            .d('请输入关键字')}
          onChange={this.searchTree}
          onPressEnter={this.searchTree}
        />

        <div className="FBH pr6 pl6" style={{ maxWidth: 70 }}>
          <IconRefresh size="14" className="mr8" onClick={this.refreshTree} />
          {this.store.expandAll ? (
            <IconUnExtend
              size="14"
              className="hand"
              onClick={this.expandTree}
            />
          ) : (
            <IconExtend size="14" className="hand" onClick={this.expandTree} />
          )}
        </div>
      </div>
    )
  }
}
export default Action
