import {Component, Fragment} from 'react'
import {observable, action, computed, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {withRouter, Link} from 'react-router-dom'
import {Tree, Table, Alert, Button, Spin, Tabs, Tooltip} from 'antd'
import {Time} from '../common/util'
import SvgExtend from '../svg-component/Extend'
import SvgUnExtend from '../svg-component/UnExtend'
import SvgRefresh from '../svg-component/Refresh'
import NoBorderInput from '../component-noborder-input'

import store from './store-tag-export'

const {TreeNode} = Tree
const {TabPane} = Tabs

@observer
class Step1 extends Component {
  exCate = observable.map({})

  // @observable expandedKeys = []
  @observable checkedKeys = []
  @observable selectedKeys = []

  constructor(props) {
    super(props)

    this.tableCol = [
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        width: 150,
        render: text => <div className="omit" style={{width: '150px'}} title={text}>{text}</div>,
      }, {
        title: '英文名',
        key: 'enName',
        dataIndex: 'enName',
        width: 120,
        render: text => <div className="omit" style={{width: '120px'}} title={text}>{text}</div>,
      }, {
        title: '数据类型',
        key: 'tagValueType',
        dataIndex: 'tagValueType',
      }, {
        title: '是否枚举',
        key: 'isEnumStr',
        dataIndex: 'isEnumStr',
      }, {
        title: '枚举显示值',
        key: 'enumVal',
        dataIndex: 'enumVal',
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

  // @action onExpand = expandedKeys => {
  //   this.expandedKeys.replace(expandedKeys)
  // }

  @action onCheck = checkedKeys => {
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
    } /*else {
      if (this.expandedKeys.slice().includes(nodeData.id)) {
        // 非叶子目录 折叠展示
        this.expandedKeys.remove(nodeData.id)
      } else {
        this.expandedKeys.push(nodeData.id)
      }
    }*/
    return true
  }

  @action renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        // <TreeNode
        //   title={(
        //     <Tooltip
        //       key={item.name}
        //       title={item.name}
        //       placement="right"
        //       overlayClassName="tooltip-light"
        //     >
        //       <div
        //         className="omit"
        //         style={{width: `${140 - item.level / 2 * 40}px`}}
        //       >
        //         {item.name}
        //       </div>
        //     </Tooltip>
        //   )}
        //   key={item.id}
        //   nodeData={item}
        // >
        <TreeNode title={item.name} key={item.id} nodeData={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return (
      <TreeNode
        // title={(
        //   <Tooltip
        //     key={item.name}
        //     title={item.name}
        //     placement="right"
        //     overlayClassName="tooltip-light"
        //   >
        //     <div
        //       className="omit"
        //       style={{width: `${140 - item.level / 2 * 40}px`}}
        //     >
        //       {item.name}
        //     </div>
        //   </Tooltip>
        // )}
        title={item.name}
        key={item.id}
        nodeData={item}
        // disableCheckbox={!item.treeIds || (item.treeIds && !item.treeIds.length)}
      />
    )
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

  // 切换队形类型
  @action onChangeTab(e) {
    document.getElementById('searchKey').value = ''
    this.exCate.clear()
    this.checkedKeys.clear()
    this.selectedKeys.clear()

    store.typeCode = +e
    store.expandAll = false
    store.searchKey = ''
    store.getTreeData()
  }

  // 树 Actios
  @action.bound handleRefresh() {
    return store.getTreeData()
  }

  @action.bound handleSearch(e) {
    store.searchKey = e
    store.getTreeData()
  }

  @action.bound handleExpandAll() {
    store.treeLoading = true
    _.delay(() => {
      store.expandAll = !store.expandAll
      store.treeLoading = false
    }, 100)
  }

  render() {
    const {typeCodes} = store
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
        <Alert message={`当前已选择 ${this.stdIds.slice().length} 个标签`} type="info" showIcon />

        <Tabs
          defaultActiveKey={toJS(typeCodes)[0].objTypeCode}
          animated={false}
          onChange={e => this.onChangeTab(e)}
          className="pl4"
        >
          {typeCodes.map(item => <TabPane tab={item.objTypeName} key={item.objTypeCode} />)}
        </Tabs>

        <div className="FBH mt12 export-select-step1">
 
          <div className="export-select-tree">
            <div className="category-manager-action pl8 FBH FBAC">
              <div className="FB1">
                <NoBorderInput onChange={this.handleSearch} />
              </div>

              <div className="FBH pr6 pl6" style={{maxWidth: 70}}>
                <SvgRefresh size="14" onClick={this.handleRefresh} className="mr8 hand" />
                { store.expandAll ? (
                  <SvgUnExtend size="14" className="hand" onClick={this.handleExpandAll} /> 
                ) : (
                  <SvgExtend size="14" className="hand" onClick={this.handleExpandAll} />
                )}
              </div>
            </div>
            {
              store.treeLoading ? <div className="FBH FBJC pt32"><Spin /></div> : (
                <Tree
                  checkable
                  autoExpandParent
                  defaultExpandAll={store.expandAll}
                  defaultExpandedKeys={store.searchExpandedKeys.slice()}
                  // onExpand={this.onExpand}
                  // expandedKeys={this.expandedKeys.slice()}
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
