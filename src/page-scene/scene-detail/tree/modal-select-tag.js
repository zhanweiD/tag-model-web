/**
 * 场景详情标签树-选择标签弹窗
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {
  observable, action, toJS, computed,
} from 'mobx'
import {
  Modal, Tree, Table, Checkbox, Spin, message, Button, Tooltip,
} from 'antd'

const {TreeNode} = Tree

@inject('bigStore')
@inject('sceneDetail')
@observer
class ModalSelectTag extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
    this.sceneDetailStore = props.sceneDetail
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

  // 表格 - 已选项
  selectedRows = []

  columns = [{
    title: '名称',
    dataIndex: 'name',
    width: 120,
    render: text => <div title={text} style={{maxWidth: '100px'}} className="omit">{text}</div>,
  }, {
    title: '英文名',
    dataIndex: 'enName',
    width: 100,
    render: text => <div title={text} style={{maxWidth: '80px'}} className="omit">{text}</div>,
  }, {
    title: '数据类型',
    dataIndex: 'valueTypeName',
    // width: 100,
  }, {
    title: '是否枚举',
    dataIndex: 'is_enum',
    render: text => (text ? '是' : '否'),
  }, {
    title: '枚举显示值',
    dataIndex: 'enumValue',
    width: 100,
    render: text => <div title={text} style={{maxWidth: '80px'}} className="omit">{text}</div>,

  }, {
    title: '业务逻辑',
    dataIndex: 'descr',
    width: 150,
    render: text => <div title={text} style={{maxWidth: '120px'}} className="omit">{text}</div>,
  }]

  // 获取类目数组 用于全选功能
  @computed get getClassId() {
    const {selectTagData} = this.store
    const classArr = toJS(selectTagData).filter(item => item.type !== 0) || []
    return classArr.map(item => item.id)
  }

   // 获取所有标签列表数据和rowKeys
   @computed get getTagList() {
    const {selectTagData} = this.store
    // 所有标签数据
    const tagArr = selectTagData.filter(item => !item.type) || []
    // 所有标签列表数据
    const list = tagArr.map(item => item.tag)

    const canSelectedList = list.filter(item => !item.used)
    // 所有标签列表rowKeys
    const rowKeys = canSelectedList.map(item => item.id)

    return {
      list,
      rowKeys,
    }
  }

  @action.bound handleSubmit() {
     if (!this.list.length) {
       message.warning('请选择标签')
       return
     } 

     //  const tagIdList = toJS(this.list).map(item => item.id)
     this.store.saveTag(this.rowKeys, () => {
       this.reset()
       // 为了场景的标签数 大费周折
       this.sceneDetailStore.getDetail()
     })
   }

  @action.bound handleCancel() {
    const {modalVisible} = this.store
    modalVisible.selectTag = false
    this.reset()
  }

  @action.bound onTreeCheck(keys, {checkedNodes}) {
    let list = []
    let rowKeys = []
     
    _.forEach(checkedNodes, ({props}) => {
      if (!props.children && props.tags) {
        const tagInfo = props.tags.map(item => item.tag)
        const tagMainInfo = tagInfo.map(d => {
          if (d.configType === 2) {
            return {
              ...d,
              used: 1,
            }
          }
          return d
        })
        console.log(tagMainInfo)
        list = list.concat(tagMainInfo)
      }
    })

    // 生成 0-n 数组
    // if (list.length) rowKeys = Array.from({length: list.length}).map((v, k) => k)

    // 可选数组
    const canselectedList = list.filter(item => !item.used)
    
    rowKeys = canselectedList.map(item => item.id)

    // 更改全选状态

    if (keys.length === this.getClassId.length) {
      this.allChecked = true
      this.indeterminate = false
    } else if (keys.length) {
      this.indeterminate = true
    } else {
      this.allChecked = false
      this.indeterminate = false
    }

    // 表格 - 列表数据
    this.list = list

    // 表格 - 已选项
    this.selectedRows = list

    // 表格 - 已选项key数组
    this.rowKeys = rowKeys

    // 树 - 已选项
    this.checkedKeys = keys
  }

  @action.bound onTableCheck(selectedRowKeys, selectedRows) {
    // 表格 - 已选项
    this.selectedRows = selectedRows

    // 表格 - 已选项key数组
    this.rowKeys = selectedRowKeys
  }

  // 全选操作
  @action.bound handleAllSelect(e) {
    this.allChecked = e.target.checked
    if (e.target.checked) {
      this.indeterminate = false
      this.allChecked = true

      // 赋值所有标签的列表数据
      this.list.replace(this.getTagList.list)

      // 赋值所有标签的rowKeys
      this.rowKeys.replace(this.getTagList.rowKeys)

      // 列表 - 已选项
      this.selectedRowKeys = toJS(this.getTagList.list)

      // 赋值所有类目id 
      this.checkedKeys.replace(this.getClassId)
    } else {
      this.reset()
    }
  }


  // 重置
  @action.bound reset() {
    this.allChecked = false
    this.indeterminate = false
    this.list.clear()
    this.checkedKeys.clear()
    this.rowKeys.clear()
    this.selectedRows = []
  }

  renderTooltip = (text = '', max = 10) => {
    if (text.length > max) {
      return (
        <Tooltip title={text}>
          <span>{`${text.slice(0, max)}...`}</span>
        </Tooltip>
      )
    }

    return <span>{text}</span>
  }


  renderTreeNodes = data => data.map(item => {
    // 类目 且 类目的子集不是标签
    if (item.children) {
      if (item.children[0].type) {
        return (
          <TreeNode title={this.renderTooltip(item.name)} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
         
        )
      } 

      return <TreeNode title={this.renderTooltip(item.name)} key={item.id} tags={item.children} />
    }

    if (item.type === 1) {
      return (
        <TreeNode 
          title={this.renderTooltip(item.name)}
          key={item.id} 
          disableCheckbox={item.used} 
          {...item} 
        />
      )
    }

    return null
  })

  render() {
    const {
      modalVisible: {
        selectTag,
      }, 
      detailLoading,
      confirmLoading, 
      selectTagTreeData,
    } = this.store

    const treeData = toJS(selectTagTreeData)
    console.log(treeData)
    const rowSelection = {
      selectedRowKeys: this.rowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.used || record.configType === 2, // 已选择标签 / 主标签禁止再次被选
      }),
    }

    const treeOpt = {
      checkable: true,
      onCheck: this.onTreeCheck,
      checkedKeys: this.checkedKeys.slice(),
    }

    return (
      <Modal
        title="选择标签"
        width={1000}
        destroyOnClose
        visible={selectTag}
        maskClosable={false}
        // onOk={e => this.handleSubmit(e)}    
        onCancel={this.handleCancel}
        footer={[
          <Button onClick={this.handleCancel}>取消</Button>,
          <Button 
            type="primary" 
            onClick={e => this.handleSubmit(e)} 
            // disabled={!this.list.slice().length}
            disabled={!this.rowKeys.length}
            loading={confirmLoading}
          >
            确定
          </Button>,
        ]}
      >
        <Spin spinning={detailLoading}>
          <div className="select-tag-modal FBH">
            <div className="select-tree">
              <Checkbox 
                checked={this.allChecked}
                indeterminate={this.indeterminate}
                onChange={this.handleAllSelect} 
                className="all"
              >
                全选
              </Checkbox>
              <Tree
                {...treeOpt}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </div>
            <div className="table-tree FB1">
              <Table 
                scroll={{y: 400}}
                columns={this.columns} 
                rowKey="id" 
                dataSource={this.list.slice()} 
                rowSelection={rowSelection} 
                pagination={false} 
              />
            </div>
          </div>
        </Spin>
      </Modal>
    )
  }
}

export default ModalSelectTag
