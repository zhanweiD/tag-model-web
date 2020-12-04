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
    store.projectId = undefined
    // store.projectId = bigStore.projectId
    store.objId = bigStore.objId
    store.typeCode = bigStore.typeCode
    store.relationType = bigStore.objDetail.type
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
      store.getObjectSelectList()
    }
  }

  @action.bound openModal() {
    const {joinModeDetail} = store

    store.getDataSource()

    if (joinModeDetail.mode === 0) {
      // 并集模式
      store.modalVisible = true
    }

    if (joinModeDetail.mode === 1) {
      // 交集模式
      // 要处理数据了。。。
      // TODO: 有问题获取不到数据
      store.mode = joinModeDetail.mode
      store.dataStorageId = joinModeDetail.dataStorageId
      store.dataTableName = joinModeDetail.dataTableName

      store.getDataSheet({
        storageId: store.dataStorageId,
      })

      if (+store.typeCode === 4) {
        // 实体
        store.getFieldList({objId: store.objId})
        const {mappingKeys} = joinModeDetail
        let fieldName
        if (mappingKeys && mappingKeys.length && mappingKeys.length > 0) {
          fieldName = mappingKeys[0].field_name
        }
        store.dataField = fieldName
      } else {
        const {mappingKeys} = joinModeDetail
        let fieldName1
        let fieldName2
        if (mappingKeys && mappingKeys.length && mappingKeys.length > 0) {
          const [key1, key2] = mappingKeys
          // 有两个
          fieldName1 = key1.field_name
          fieldName2 = key2.field_name
          store.getFieldList({objId: key1.obj_id}, fieldList => {
            store.fieldList1 = fieldList.map(d => {
              if (d.field === fieldName2) {
                return {
                  ...d,
                  disabled: true,
                }
              }
              return d
            })
          })
          store.getFieldList({objId: key2.obj_id}, fieldList => {
            store.fieldList2 = fieldList.map(d => {
              if (d.field === fieldName1) {
                return {
                  ...d,
                  disabled: true,
                }
              }
              return d
            })
          })
        }
        store.dataField1 = fieldName1
        store.dataField2 = fieldName2
      }
    }

    // 没数据？
    store.modalVisible = true
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
            onClick={() => store.getObjJoinMode({objId: +objId}, () => {
              this.openModal()
            })}
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
