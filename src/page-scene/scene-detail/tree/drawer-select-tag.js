/**
 * @description 选择标签
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action} from 'mobx'
import {
  Drawer, Button, Spin,
} from 'antd'

import Tree from './select-tag-tree'
import List from './select-tag-list'

@inject('bigStore')
@inject('sceneDetail')
@observer
export default class SelectTag extends Component {
  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
    this.store = this.bigStore.categoryStore
    this.sceneDetailStore = props.sceneDetail
  }

  @observable selectNodes = [] // 对象树所选对象节点 => 对象列表
  @observable removeListItem // 对象列表中移除项id

  @observable tableData= [] // 根据typeCode 过滤后的对象列表
  @observable searchData = [] // 过滤搜索后的对象列表

  @action destroy() {
    this.selectNodes.clear()
    this.removeListItem = undefined
    this.tableData.clear()
    this.searchData.clear()
  }

  @action.bound closeDrawer() {
    const {modalVisible} = this.store
    modalVisible.selectTag = false
    this.destroy()
  }

  // 保存
  saveObj = () => {
    // const t = this
    // const objIds = _.map(this.tableData, 'aId')
    // const params = {
    //   objIds,
    //   objTypeCode: +t.selTypeCode,
    // }
    // this.store.saveSelectedObj(params, () => {
    //   t.store.getObjTree(() => {
    //     t.store.objId = t.store.currentSelectKeys

    //     if (!t.store.objId) {
    //       t.props.history.push(`/object-config/${t.store.typeCode}`)
    //     }
    //   })
    //   t.destroy()
    // })
  }

  // 树选择
  @action.bound onTreeCheck(selectNodes) {
    this.selectNodes = selectNodes.filter(d => +d.type === 0)
  }

  // 树 => 列表
  @action.bound rightToTable() {
    this.tableData.replace(this.selectNodes) 
  }

  // 移除已选列表
  @action.bound removeList(data) {
    this.removeListItem = data
    this.tableData = this.tableData.filter(d => +d.id !== +data.id)
      
    if (!this.tableData.length) {
      this.selectNodes.clear()
    }
  }

  // 列表搜索；前端处理
  @action.bound searchList(v) {
    if (this.tableData.length && v) {
      this.searchData = this.tableData.filter(d => d.name.indexOf(v) !== -1)
    } else {
      this.searchData = this.tableData
    }
  }

  render() {
    const {
      modalVisible: {
        selectTag,
      },
      detailLoading,
      confirmLoading,
    } = this.store

    const drawerConfig = {
      title: '选择标签',
      visible: selectTag,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
    }

    const treeConfig = {
      onCheck: this.onTreeCheck,
      removeListItem: this.removeListItem,
      listDataIds: _.map(this.tableData, 'id'),
      store: this.store, 
    }

    const listConfig = {
      remove: this.removeList,
      onSearch: this.searchList,
      searchData: this.searchData,
      tableData: this.tableData, 
    }

    return (
      <Drawer
        {...drawerConfig}
      >
        <Spin spinning={detailLoading}>
          <div className="select-tag-box">
            <div className="mb8">
              {/* <span className="fs14 mr4">展示不可选择的标签</span>
              <Switch onChange={this.switchChange} checkedChildren="是" unCheckedChildren="否" /> */}
              <span className="ml4 fs12">
              （若需要的标签不可选择，请先去“标签同步”模块完成
                <a href>标签数据的同步</a>
               ）
              </span>
            </div>
            <div className="select-tag-modal">
              <Tree {...treeConfig} />
              <div className="select-tag-btn"> 
                <Button
                  type="primary"
                  icon="right"
                  size="small"
                  style={{display: 'block'}}
                  className="mb4"
                  disabled={!this.selectNodes.length}
                  onClick={this.rightToTable}
                />
              </div>
          
              <List {...listConfig} />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  background: '#fff',
                  textAlign: 'right',
                }}
              > 
                <Button onClick={this.closeDrawer} className="mr8">取消</Button>
                <Button 
                  onClick={this.saveObj} 
                  type="primary" 
                  loading={confirmLoading}
                >
                确定
                </Button>
              </div>
            </div>
          </div>
        </Spin>
      </Drawer>
    )
  }
}
