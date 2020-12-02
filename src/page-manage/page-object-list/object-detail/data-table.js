import {Component} from 'react'
import {Input, Button, Modal} from 'antd'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {SearchOutlined} from '@ant-design/icons'
import {Time} from '../../../common/util'
import {ListContent, Authority, OmitTooltip} from '../../../component'
import ModalRelateTable from './modal-relate-table'
import store from './store-table'

const {Search} = Input

@inject('bigStore')
@observer
export default class DataTable extends Component {
  constructor(props) {
    super(props)
    const {bigStore} = props
    this.bigStore = bigStore
    // console.log(props, 'c')
    store.projectId = bigStore.projectId
    store.objId = bigStore.objId
    store.typeCode = bigStore.typeCode
    store.relationType = bigStore.objDetail.type
    // console.log(store.projectId, 'd')
  }

  columns = [{
    title: '数据表',
    dataIndex: 'tableName',
  }, {
    title: '数据源',
    dataIndex: 'storageName',
    className: 'wb',
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '添加项目',
    dataIndex: 'projectName',
  }, {
    title: '标签数/字段数',
    dataIndex: 'tagCount',
    render: (text, record) => `${text}/${record.fieldCount}`,
  }, {
    title: '添加时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }]
  
  simpleColumns = [{
    title: '数据表',
    dataIndex: 'tableName',
  }, {
    title: '数据源',
    dataIndex: 'storageName',
    className: 'wb',
  }, {
    title: '数据源类型',
    dataIndex: 'storageType',
  }, {
    title: '添加项目',
    dataIndex: 'projectName',
  }, {
    title: '添加时间',
    dataIndex: 'ctime',
    render: text => <Time timestamp={text} />,
  }, {
    title: '标签/字段数',
    dataIndex: 'tagCount',
    render: (text, record) => `${record.tagCount}/${record.fieldCount}`,
  }]

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    if (!_.isEqual(updateDetailKey, next.updateDetailKey) || !_.isEqual(+objId, +next.objId)) {
      store.getList({objId: next.objId})
    }
  }

  @action.bound openModal() {
    const {typeCode, objDetail} = this.bigStore
    if (+typeCode === 4) {
      store.bothTypeCode = 2 // 实体
      store.modalVisible = true
    } else if (typeof objDetail.type === 'undefined') {
      this.bigStore.getObjDetail(res => {
        store.bothTypeCode = res.type
        store.modalVisible = true
      }) // 复杂关系 vs 简单关系
    } else {
      store.bothTypeCode = objDetail.type 
      store.modalVisible = true
    }
    store.getDataSource()
  }

  @action.bound openTagConfig(data) {
    store.editSelectedItem = data
    this.tagConfigVisible = true
  }

  @action.bound closeTagConfig() {
    this.tagConfigVisible = false
  }

  @action.bound tagConfigSuccess() {
    store.getList({
      objId: store.objId,
    })
  }

  @action.bound onChange(e) {
    const keyword = e.target.value
    store.getList({
      currentPage: 1,
      keyword,
    })
  }

  render() {
    // const {projectId} = store
    // const {objId, type, projectId} = this.props
    const {objId, type} = this.props
    const listConfig = {
      columns: +type ? this.columns : this.simpleColumns,
      // initParams: {objId: +objId, projectId: +projectId},
      initParams: {objId: +objId},
      buttons: [<div className="pr24 far" style={{display: 'float'}}>
        {/* <Search
          placeholder="请输入数据表名称关键字"
          onChange={e => this.onChange(e)}
          style={{width: 200}}
          size="small"
        /> */}
        {/* <Authority authCode="tag_model:update_table[cud]"> */}
        <div style={{float: 'left', marginBottom: '8px'}}>
          <Button 
            style={{marginRight: 'auto'}}
            type="primary" 
            className="mr8"
            onClick={() => this.openModal()}
          >
        多表关联模式设置
          </Button>
        </div>
        {/* </Authority> */}
        <div style={{float: 'right', marginBottom: '8px'}}>
          <Input
            onChange={e => this.onChange(e)}
            style={{width: 200}}
            size="small"
            placeholder="请输入数据表名称关键字"
            suffix={<SearchOutlined />}
          />
        </div>
      </div>],
      store,
    }
    return (
      <div className="pt16">
        <ListContent {...listConfig} />
        {/* <ModalAddTable store={store} />  */}
        <ModalRelateTable store={store} />
      </div>
    )
  }
}
