/**
 * @description 选择对象
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {observable, action, toJS} from 'mobx'
import {RightOutlined} from '@ant-design/icons'
import {
  Drawer, Button,
} from 'antd'
import Tree from './select-object-tree'
import List from './select-object-list'

import './select-object.styl'

@inject('bigStore')
@observer
export default class SelectObject extends Component {
  constructor(props) {
    super(props)
    this.store = props.bigStore
    this.store.isSelectObj = props.bigStore.isSelectObj
    this.store.isOpenSelectObj = props.bigStore.isOpenSelectObj
    // console.log(this.store.isSelectObj, 'true')
  }

  @observable selTypeCode = this.store.typeCode // 实体: 4, 关系: 3
  @observable selectNodes = [] // 对象树所选对象节点 => 对象列表
  @observable removeListItem // 对象列表中移除项id

  @observable filteredData= [] // 根据typeCode 过滤后的对象列表
  @observable searchData = [] // 过滤搜索后的对象列表

  componentWillMount() {
    this.store.getObjCate(() => {
      this.selTypeCode = this.store.typeCode
      this.store.isSelectObj = true
      this.store.objId = this.store.currentSelectKeys
    })
  }

  componentWillReceiveProps(next) {
    const {visible} = this.props
    if (!_.isEqual(visible, next.visible) && next.visible) {
      this.store.getObjSelectedList(data => {
        this.filteredData = data.filter(d => +d.objTypeCode === +this.selTypeCode && d.isUsed === 0)
      })

      this.store.getObjCate({
        type: this.store.typeCode,
      })
      this.selTypeCode = this.store.typeCode
    }
  }

  @action destroy() {
    this.selectNodes.clear()
    this.removeListItem = undefined
    this.filteredData.clear()
    this.searchData.clear()
  }

  @action.bound closeDrawer() {
    this.store.selectObjVisible = false
    this.selectNodes = []
  }

  // 保存选择对象
  saveObj = () => {
    const t = this
    const objIds = _.map(this.filteredData, 'aId')
    const params = {
      objIds,
      objTypeCode: +t.selTypeCode,
    }
    this.store.isSelectObj = false
    this.store.saveSelectedObj(params, () => {
      // t.store.getObjTree(() => {
      //   t.store.objId = t.store.filteredData

      //   if (!t.store.objId) {
      //     t.props.history.push(`/manage/object-config/${t.store.typeCode}`)
      //   }
      // })
      t.store.getObjCate({
        type: this.store.typeCode,
        // objId: this.store.currentSelectKeys,
        isSelectObj: false,
        // isOpenSelectObj: true,
      })
      t.destroy()
    })
  }

  // 树选择
  @action.bound onTreeCheck(selectNodes) {
    this.selectNodes = selectNodes
  }

  // 树 => 列表
  @action.bound rightToTable() {
    const t = this
    const objIds = _.map(this.selectNodes, 'aId')
    
    this.store.getObjSelectedDetail(objIds, res => {
      const mergeData = this.mergeData(toJS(this.filteredData), res)
      t.filteredData = mergeData
    })
  }


  // 合并数据处理
  mergeData = (arr1, arr2) => {
    const mergeData = arr1.concat(arr2)
    const newData = _.uniqBy(mergeData, 'aId')
    return newData
  }

  // 移除已选列表
  @action.bound removeList(data) {
    this.removeListItem = data
    this.filteredData = this.filteredData.filter(d => +d.aId !== +data.aId)
    if (!this.filteredData.length) {
      this.selectNodes.clear()
    }
  }

  // 列表搜索；前端处理
  @action.bound searchList(v) {
    if (this.filteredData.length && v) {
      this.searchData = this.filteredData.filter(d => d.name.indexOf(v) !== -1)
    } else {
      this.searchData = this.filteredData
    }
  }

  componentWillUnmount() {
    this.store.destory()
  }

  render() {
    const {visible} = this.props
    const {selectObjConfirmLoading} = this.store

    const drawerConfig = {
      title: '设置常用对象',
      visible,
      closable: true,
      width: 1120,
      maskClosable: false,
      destroyOnClose: true,
      onClose: this.closeDrawer,
    }

    const treeConfig = {
      onCheck: this.onTreeCheck,
      removeListItem: this.removeListItem,
      selTypeCode: this.selTypeCode,
      listDataIds: _.map(this.filteredData, 'aId'),
    }

    const listConfig = {
      remove: this.removeList,
      onSearch: this.searchList,
      searchData: this.searchData,
      filteredData: this.filteredData, 
    }
    

    return (
      <Drawer
        {...drawerConfig}
      >
        <div style={{overflow: 'hidden'}}>
          {/* 实体: 4, 关系: 3 */}
          {/* <Radio.Group onChange={this.changeType} value={+this.selTypeCode} style={{marginBottom: 8}}>
            {
              tabs.map(({name, value}) => <Radio.Button value={value}>{name}</Radio.Button>)
            }
          </Radio.Group> */}
     
          <div className="FBH select-object">
            <Tree {...treeConfig} />
            <div className="select-object-btn"> 
              <Button
                type="primary"
                icon={<RightOutlined />}
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
                borderTop: '1px solid #e9e9e9',
                padding: '10px 24px',
                background: '#fff',
                textAlign: 'right',
              }}
            > 
              <Button onClick={this.closeDrawer} className="mr8">取消</Button>
              <Button 
                onClick={this.saveObj} 
                type="primary" 
                loading={selectObjConfirmLoading} 
                // disabled={!this.filteredData.length}
              >
                确定
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    )
  }
}
