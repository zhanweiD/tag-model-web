/**
 * @description 场景 - 选择标签 - 标签树
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {
  observable, action, computed, toJS,
} from 'mobx'
import {Tree, Checkbox} from 'antd'
import {NoBorderInput, Loading, OmitTooltip} from '../../../component'
import {IconChakan} from '../../../icon-comp'

const {TreeNode} = Tree

@observer
export default class TagTree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable searchKey = undefined
  @observable checkedKeys = []

  // 全选操作
  @observable allChecked = false
  @observable indeterminate = false

  componentWillReceiveProps(next) {
    const {removeListItem} = this.props
    if (!_.isEqual(removeListItem, next.removeListItem) && next.removeListItem) {
      console.log(next.removeListItem)
      this.checkedKeys = this.checkedKeys.filter(
        id => (+id !== +next.removeListItem.id) && (+id !== +next.removeListItem.objCatId)
      )
      console.log(toJS(this.checkedKeys))
    }
  }

  @action destroy() {
    this.checkedKeys.clear()
    this.searchKey = undefined
    this.allChecked = false
    this.indeterminate = false
  }

  @action onCheck = (checkedKeys, e) => {
    const {onCheck} = this.props
    const {checkedNodes} = e
   
    const selectNodes = checkedNodes.filter(d => d.props.tagData).map(d => d.props.tagData)

    this.checkedKeys = selectNodes.map(d => d.id)
    console.log(toJS(this.checkedKeys))
    
    if (checkedKeys.length === this.getTagList.rowKeys.length) {
      this.allChecked = true
      this.indeterminate = false
    } else if (checkedKeys.length) {
      this.indeterminate = true
    } else {
      this.allChecked = false
      this.indeterminate = false
    }
    console.log(selectNodes)
    onCheck(selectNodes)
  }

  // 全选操作
  @action.bound handleAllSelect(e) {
    const {onCheck} = this.props

    this.allChecked = e.target.checked

    if (e.target.checked) {
      this.indeterminate = false
      this.allChecked = true
      this.checkedKeys.replace(this.getTagList.rowKeys)

      onCheck(this.getTagList.list)
    } else {
      this.destroy()
    }
  }

  /**
   * @description 查询树节点
   */
  @action.bound searchTree(data) {
    this.searchKey = data
    this.store.getSelectTag({
      searchKey: data,
    })
  }

  // 获取所有标签列表数据和rowKeys
  @computed get getTagList() {
    const {selectTagData} = this.store

    const rowKeys = selectTagData.map(d => d.id) || []

    // 所有标签数据
    const tagArr = selectTagData.filter(item => !item.type) || []

    return {
      list: tagArr,
      rowKeys,
    }
  }


  renderTreeNodes = data => data.map(item => {
    const {listDataIds} = this.props

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
        tagData={item}
        disableCheckbox={listDataIds.includes(item.id)}
      />
    )
  })

  render() {
    const {selectObjLoading, selectTagTreeData} = this.store
    const {listDataIds} = this.props
  
    const checkedKeys = this.checkedKeys.length
      ? this.checkedKeys.slice()
      : listDataIds
    console.log(toJS(checkedKeys))
    return (
      <div className="select-tree">
        <div className="select-tree-header">
          <NoBorderInput
            placeholder="请输入标签名称"
            value={this.searchKey}
            onChange={this.searchTree}
          />
          <IconChakan size="14" className="mr8" onClick={this.onSearch} />
        </div>
        {
          selectObjLoading ? <Loading mode="block" height={100} />
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
                  checkedKeys={checkedKeys}
                >
                  {this.renderTreeNodes(selectTagTreeData)}
                </Tree>
              </Fragment>

            )
        }
      </div>
    )
  }
}
