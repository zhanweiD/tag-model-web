/**
 * 场景详情标签树-选择标签弹窗
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {
  observable, action, toJS, computed,
} from 'mobx'
import {
  Modal, Tree, Table, Checkbox, Spin, message,
} from 'antd'

const {TreeNode} = Tree

@inject('bigStore')
@observer
class ModalSelectTag extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
  }

  // 标签列表
  @observable list = []

  // 标签树 - 已选数据
  @observable checkedKeys = []

  // 标签列表 - 已选数据
  @observable rowKeys = []

  // 全选操作
  @observable allChecked = false
  @observable indeterminate = false


  columns = [{
    title: '中文名',
    dataIndex: 'name',
  }, {
    title: '英文名',
    dataIndex: 'enName',
  }, {
    title: '数据类型',
    dataIndex: 'valueTypeName',
  }, {
    title: '是否枚举',
    dataIndex: 'is_enum',
    render: text => (text ? '是' : '否'),
  }, {
    title: '枚举显示值',
    dataIndex: 'enumValue',
  }, {
    title: '业务逻辑',
    dataIndex: 'descr',
  }]

  // 筛选可选标签
  @computed get canSelectTag() {
    const {selectTagTreeData} = this.store

    const canSelectTagArr = []
    _.forEach(toJS(selectTagTreeData), ({type, used, tag}) => {
      if (type === 0 && !used) {
        canSelectTagArr.push(tag)
      }
    })
    return canSelectTagArr
  }

  @action.bound handleSubmit() {
    if (!this.list.length) {
      message.warning('请选择标签')
      return
    } 

    this.store.saveTag(toJS(this.list), () => {
      this.reset()
    })
  }

  @action.bound handleCancel() {
    this.reset()
  }

  // 重置
  @action.bound reset() {
    const {modalVisible} = this.store
    modalVisible.selectTag = false
    
    this.allChecked = false
    this.indeterminate = false
    this.list.clear()
    this.checkedKeys.clear()
    this.rowKeys.clear()
  }


  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.name} key={item.id} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode title={item.name} key={item.id} disableCheckbox={item.used} {...item} />
  });

  @action.bound onTreeCheck(keys, {checkedNodes}) {
    const list = []
    const checkedKeys = []
    let rowKeys = []

    _.forEach(checkedNodes, ({props}) => {
      if (!props.children) {
        list.push(props.tag)
        checkedKeys.push(props.id)
      }
    })

    if (checkedKeys.length) {
      // 生成 0-n 数组
      rowKeys = Array.from({length: checkedKeys.length}).map((v, k) => k) 
    }

    // 更改全选状态
    if (checkedKeys.length === this.canSelectTag.length) {
      this.allChecked = true
      this.indeterminate = false
    } else if (checkedKeys.length) {
      this.indeterminate = true
    } else {
      this.allChecked = false
      this.indeterminate = false
    }

    this.list.replace(list)
    this.checkedKeys.replace(checkedKeys)
    this.rowKeys.replace(rowKeys)
  }

  @action.bound onTableCheck(selectedRowKeys, selectedRows) {
    // 全选操作
    if (!selectedRowKeys.length) {
      this.allChecked = false
      this.indeterminate = false
    }

    // 更改全选状态
    if (selectedRowKeys.length === this.canSelectTag.length) {
      this.allChecked = true
      this.indeterminate = false
    } else if (selectedRowKeys.length) {
      this.indeterminate = true
    } else {
      this.allChecked = false
      this.indeterminate = false
    }


    this.list.replace(selectedRows)
    this.checkedKeys = _.map(selectedRows, item => item.id)
    this.rowKeys = Array.from({length: selectedRowKeys.length}).map((v, k) => k)
  }

  // 全选操作
  @action.bound handleAllSelect(e) {
    this.allChecked = e.target.checked
    if (e.target.checked) {
      this.indeterminate = false
      this.list.replace(this.canSelectTag)
      this.checkedKeys = _.map(this.canSelectTag, item => item.id)
      this.rowKeys = Array.from({length: this.canSelectTag.length}).map((v, k) => k) 
    } else {
      this.reset()
    }
  }

  render() {
    const {
      modalVisible: {
        selectTag,
      }, 
      detailLoading,
      confirmLoading, 
      selectTagList,
    } = this.store

    const treeData = toJS(selectTagList)

    const rowSelection = {
      selectedRowKeys: this.rowKeys.slice(),
      onChange: this.onTableCheck,
    }

    const treeOpt = {
      checkable: true,
      onCheck: this.onTreeCheck,
      checkedKeys: this.checkedKeys.slice(),
    }

    return (
      <Modal
        title="选择标签"
        width={800}
        destroyOnClose
        visible={selectTag}
        maskClosable={false}
        confirmLoading={confirmLoading}
        onOk={e => this.handleSubmit(e)}
        onCancel={this.handleCancel}
        
      >
        <Spin spinning={detailLoading}>
          <div className="FBH">
          
            <div>
              <Checkbox 
                checked={this.allChecked}
                indeterminate={this.indeterminate}
                style={{marginLeft: '26px'}}
                onChange={this.handleAllSelect} 
              >
                全选
              </Checkbox>
              <Tree
                {...treeOpt}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div>
          
            <Table columns={this.columns} dataSource={this.list.slice()} rowSelection={rowSelection} pagination={false} className="FB1 ml24" />
          
          </div>
        </Spin>
      </Modal>
    )
  }
}

export default ModalSelectTag
