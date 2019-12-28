/**
 * @description 对象配置 - 选择对象 - 类目树
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {
  observable, action,
} from 'mobx'
import {Tree} from 'antd'
import {NoBorderInput, Loading, OmitTooltip} from '../../component'
import {IconChakan} from '../../icon-comp'

const {TreeNode} = Tree

@inject('bigStore')
@observer
export default class CateTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
  }

  @observable searchKey = undefined
  @observable checkedKeys = []

  componentWillReceiveProps(next) {
    const {removeListItem, selTypeCode} = this.props
    if (!_.isEqual(removeListItem, next.removeListItem) && next.removeListItem) {
      this.checkedKeys = this.checkedKeys.filter(
        id => (+id !== +next.removeListItem.id) && (+id !== +next.removeListItem.objCatId)
      )
    }
    if (!_.isEqual(selTypeCode, next.selTypeCode)) {
      this.destroy()
    }
  }

  @action destroy() {
    this.checkedKeys.clear()
    this.searchKey = undefined
  }

  @action onCheck = (checkedKeys, e) => {
    const {onCheck} = this.props
    const {checkedNodes} = e
    this.checkedKeys = checkedKeys
    const selectNodes = checkedNodes.filter(d => d.props.objectData).map(d => d.props.objectData)

    onCheck(selectNodes)
  }

  /**
   * @description 查询树节点
   */
  @action.bound searchTree(data) {
    this.searchKey = data
    const {selTypeCode} = this.props
    this.store.getObjCate({
      searchKey: data,
      type: selTypeCode,
    })
  }

  renderTreeNodes = data => data.map(item => {
    const {listDataIds} = this.props

    if (item.children) {
      return (
        <TreeNode
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          key={item.aId}
          dataRef={item}
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
        objectData={item}
        disableCheckbox={listDataIds.includes(item.aId)}
      />
    )
  })

  render() {
    const {selectObjLoading, objCateTree} = this.store
    const {listDataIds, selTypeCode} = this.props

    const checkedKeys = this.checkedKeys.length 
      ? this.checkedKeys.slice() 
      : listDataIds

    return (
      <div className="select-object-tree">
        <div className="object-tree-header">
          <NoBorderInput
            placeholder="请输入对象名称搜索"
            value={this.searchKey}
            onChange={this.searchTree}
            key={selTypeCode}
          />
          <IconChakan size="14" className="mr8" onClick={this.onSearch} />
        </div>
        {
          selectObjLoading ? <Loading mode="block" height={100} />
            : (
              <Tree
                checkable
                defaultExpandAll
                onCheck={this.onCheck}
                checkedKeys={checkedKeys}
              >
                {this.renderTreeNodes(objCateTree)}
              </Tree>
            )
        }
      </div>
    )
  }
}
