/**
 * @description 对象配置 - 选择对象 - 类目树
 */
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
  constructor(props) {
    super(props)
    this.store = props.bigStore
    console.log(toJS(this.store.objCateTree), 'sot')
  }

  @observable searchKey = undefined
  @observable checkedKeys = []

  // 打开抽屉默认选中的keys
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

  // 初始化数据
  @action destroy() {
    this.checkedKeys.clear()
    this.searchKey = undefined
  }

  // 选中子节点or父节点
  @action onCheck = (checkedKeys, e) => {
    const {onCheck} = this.props
    const {checkedNodes} = e
    this.checkedKeys = checkedKeys
    const selectNodes = checkedNodes.filter(d => d.objectData).map(d => d.objectData)

    onCheck(selectNodes)
  }

  /*
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


  // 生成dom节点
  renderTreeNodes = data => data.map(item => {
    const {listDataIds} = this.props

    if (item.children) {
      return (
        <TreeNode
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          key={item.aId}
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
        key={item.aId}
        // key={item.isUsed}
        title={<OmitTooltip maxWidth={120} text={item.name} />}
        selectable={false}
        objectData={toJS(item)}
        // disableCheckbox={listDataIds.includes(item.aId)}
        disableCheckbox={item.canDelete === 0}
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
                checkedKeys={checkedKeys.map(String)}
              >
                {this.renderTreeNodes(objCateTree)}
              </Tree>
            )
        } 
      </div>
    )
  }
}
