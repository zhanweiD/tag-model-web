import {Component, Fragment} from 'react'
import {observable, action, computed, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {withRouter, Link} from 'react-router-dom'
import {Tree, Table, Alert, Button, Spin} from 'antd'
import {Time} from '../common/util'

import store from './store-tag-export'

const TreeNode = Tree.TreeNode

@observer
class Step1 extends Component {
  exCate = observable.map({})

  @observable autoExpandParent = true
  @observable expandedKeys = []
  @observable checkedKeys = []
  @observable selectedKeys = []

  constructor(props) {
    super(props)

    this.tableCol = [
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: 200,
        render: text => <div className="omit" style={{width: '200px'}} title={text}>{text}</div>,
      }, {
        title: '英文名',
        key: 'enName',
        dataIndex: 'enName',
        width: 150,
        render: text => <div className="omit" style={{width: '150px'}} title={text}>{text}</div>,
      }, {
        title: '数据类型',
        key: 'cateFullName',
        dataIndex: 'cateFullName',
      }, {
        title: '是否枚举',
        key: 'isEnum',
        dataIndex: 'isEnum',
        render: text => (text ? '是' : '否'),
      }, {
        title: '枚举显示值',
        key: 'enumValue',
        dataIndex: 'enumValue',
        width: 150,
        render: text => <div className="omit" style={{width: '150px'}} title={text}>{text}</div>,
      }, {
        title: '业务逻辑',
        key: 'descr',
        dataIndex: 'descr',
        width: 100,
        render: text => <div className="omit" style={{width: '100px'}} title={text}>{text}</div>,
      },
    ]
  }

  componentWillMount() {
    store.getTreeData()
  }

  @computed get stdIds() {
    const arr = []
    
    this.exCate.forEach(item => arr.push(...toJS(item)))
    return arr
  }

  @action onExpand = expandedKeys => {
    this.expandedKeys.replace(expandedKeys)
    this.autoExpandParent = false
  }

  @action onCheck = checkedKeys => {
    console.log(checkedKeys)
    this.checkedKeys.replace(checkedKeys)

    toJS(store.cateList).map(item => {
      if (item.treeIds) {
        if (checkedKeys.includes(`${item.id}`)) {
          this.exCate.set(item.id, item.treeIds)
        } else {
          this.exCate.delete(item.id)
        }
      }
    })
  }

  @action onSelect = (selectedKeys, info) => {
    // 防止已选节点再点击时选中取消
    if (!info.selected) {
      return false
    }

    const {nodeData} = info.node.props
    if (!nodeData.children) {
      // 叶子目录
      this.selectedKeys.replace(selectedKeys)
      store.getList(nodeData.id)
    } else if (!this.expandedKeys.slice().includes(nodeData.id)) {
      // 非叶子目录 展开子集
      this.expandedKeys.push(nodeData.id)
    }
    return true
  }

  @action renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.name} key={item.id} nodeData={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode title={item.name} key={item.id} nodeData={item} />
  })

  loop = (arr, id) => {
    const obj = toJS(store.cateList).find(item => item.id === id)
    const cid = obj.parentId

    if (arr.indexOf(cid) > -1 && cid !== 0) {
      arr.splice(arr.indexOf(cid), 1)
      this.loop(arr, cid)
    }
    return arr
  }

  @action goBack() {
    const {history} = this.props
    store.currStep = 0
    history.push('/')
  }

  render() {
    const currCate = this.selectedKeys.slice()[0]
    const rowSelection = {
      selectedRowKeys: toJS(this.exCate.get(this.selectedKeys.slice()[0])),
      onChange: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          this.exCate.delete(currCate)
          const checkedKeys = _.union(this.checkedKeys.slice())

          // 删除当前节点
          checkedKeys.splice(checkedKeys.indexOf(currCate), 1)

          // 遍历删除父节点
          this.checkedKeys.replace(this.loop(checkedKeys, currCate))
        } else {
          this.checkedKeys.push(currCate)
          this.checkedKeys.replace(_.union(this.checkedKeys.slice()))
          this.exCate.set(currCate, selectedRowKeys)
        }
      },
    }
    return (
      <div className="export-select">
        <Alert message={`当前已选择 ${this.exCate.size} 个类目，共 ${this.stdIds.slice().length} 个标签`} type="info" showIcon />

        <div className="FBH mt12 export-select-step1">
          <div className="export-select-tree">
            {
              store.treeLoading ? <div className="FBH FBJC pt32"><Spin /></div> : (
                <Tree
                  checkable
                  onExpand={this.onExpand}
                  expandedKeys={this.expandedKeys.slice()}
                  autoExpandParent={this.autoExpandParent}
                  onCheck={this.onCheck}
                  checkedKeys={this.checkedKeys.slice()}
                  onSelect={this.onSelect}
                  selectedKeys={this.selectedKeys.slice()}
                >
                  {this.renderTreeNodes(toJS(store.treeData))}
                </Tree>
              )
            }
          </div>

          <div className="FB1" style={{'overflow-x': 'auto'}}>
            <Table
              rowKey="id"
              rowSelection={rowSelection}
              columns={this.tableCol}
              loading={store.tableLoading}
              dataSource={store.list.slice()}
              pagination={false}
            />
          </div>
        </div>

        <div className="fac mt12">
          <Button size="large" className="mr12" onClick={() => this.goBack()}>返回</Button>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              store.currStep = 1
              store.getPreviewData(this.stdIds.slice())
            }}
            disabled={!this.stdIds.slice().length}
          >
            下一步
          </Button>
        </div>
      </div>
    )
  }
}

export default withRouter(Step1)
