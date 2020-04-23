/**
 * @description 场景 - 选择标签 - 标签树
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {
  observable, action, computed, toJS,
} from 'mobx'
import {Tree, Checkbox, Button} from 'antd'
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
  @observable checkedTagData = []
  @observable disabledKeys = []

  // 全选操作
  @observable allChecked = false
  @observable indeterminate = false

  componentWillReceiveProps(next) {
    const {listRemoveItem} = this.props

    if (!_.isEqual(listRemoveItem, next.listRemoveItem)) {
      this.checkedKeys = this.checkedKeys.filter(d => +d !== +next.listRemoveItem.id)
      this.disabledKeys = this.disabledKeys.filter(d => +d !== +next.listRemoveItem.id)

      this.checkedTagData = this.checkedTagData.filter(d => +d.id !== +next.listRemoveItem.id)

      this.allChecked = false
      if (this.checkedKeys.length) {
        this.indeterminate = true
      } else {
        this.indeterminate = false
      }
    }
  }

  @action destroy() {
    this.checkedKeys.clear()
    this.checkedTagData.clear()
    this.disabledKeys.clear()
    this.searchKey = undefined
    this.allChecked = false
    this.indeterminate = false
  }

  // 全选操作
  @action.bound handleAllSelect(e) {
    this.allChecked = e.target.checked

    if (e.target.checked) {
      this.indeterminate = false
      this.allChecked = true
      this.checkedKeys.replace(this.getTagList.allKeys)
      this.checkedTagData.replace(this.getTagList.allTags)
    } else if (this.disabledKeys.length) {
      this.indeterminate = true
      this.allChecked = false
      this.checkedKeys.replace(this.disabledKeys)
    } else {
      this.destroy()
    }
  }

  @action.bound onCheck(checkedKeys, e) {
    const {checkedNodes} = e

    // 全选操作
    if (checkedKeys.length === this.getTagList.allKeys.length) {
      this.allChecked = true
      this.indeterminate = false
    } else if (checkedKeys.length) {
      this.indeterminate = true
    } else {
      this.allChecked = false
      this.indeterminate = false
    }

    // 选择的标签数据
    this.checkedTagData = checkedNodes.filter(d => d.props.tagData).map(d => d.props.tagData)
    this.checkedKeys.replace(checkedKeys)
  }

  @action.bound rightToTable() {
    const {rightToTable} = this.props
    const disabledKeys = this.checkedTagData.map(d => d.id)

    this.disabledKeys.replace(disabledKeys)
    this.checkedKeys.replace(disabledKeys)

    if (disabledKeys.length) {
      this.allChecked = false
      this.indeterminate = true
    }

    rightToTable(toJS(this.checkedTagData))
  }

  // 查询树节点
  @action.bound searchTree(data) {
    this.searchKey = data
    this.store.getSelectTag({
      searchKey: data,
    })
  }

  // 获取所有标签列表数据和rowKeys
  @computed get getTagList() {
    const {selectTagData} = this.store
    // all keys
    const allKeys = selectTagData.map(d => d.id) || []

    // all tags
    const allTags = selectTagData.filter(item => !item.type) || []

    return {
      allTags,
      allKeys,
    }
  }


  renderTreeNodes = data => data.map(item => {
    // 0 标签 1 类目
    if (item.children) {
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

    if (item.type) {
      return (
        <TreeNode
          key={item.id}
          title={<OmitTooltip maxWidth={120} text={item.name} />}
          selectable={false}
        />
      )
    }

    return (
      <TreeNode
        key={item.id}
        title={<OmitTooltip maxWidth={120} text={item.name} />}
        selectable={false}
        tagData={{
          parentId: item.parentId,
          ...item.tag,
        }}
        disableCheckbox={this.disabledKeys.includes(item.id)}
      />
    )
  })

  render() {
    const {selectTagLoading, selectTagTreeData} = this.store

    return (
      <div className="FBH">
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
            selectTagLoading ? <Loading mode="block" height={100} />
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
                    checkedKeys={toJS(this.checkedKeys)}
                  >
                    {this.renderTreeNodes(selectTagTreeData)}
                  </Tree>
                </Fragment>

              )
          }
        </div>
        <div className="select-tag-btn">
          <Button
            type="primary"
            icon="right"
            size="small"
            style={{display: 'block'}}
            className="mb4"
            disabled={!this.checkedTagData.length}
            onClick={this.rightToTable}
          />
        </div>
      </div>

    )
  }
}
