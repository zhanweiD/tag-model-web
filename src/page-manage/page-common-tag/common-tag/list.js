/**
 * @description 公共标签（标签集市）
 */
import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {action} from 'mobx'
import {Button} from 'antd'
import {Link} from 'react-router-dom'
import {
  ListContent, Tag, Authority, OmitTooltip,
} from '../../../component'
import {getDataTypeName} from '../../../common/util'
import Search from './search'
import Modal from './modal'

import store from './store'

@observer
export default class Market extends Component {
  constructor(props) {
    super(props)
    store.useProjectId = props.projectId
  }

  componentDidMount() {
    // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
    // 若返回数据为空[]。则渲染 NoData 组件。
    // 要是请求放在列表组件ListContent中的话, 就必须渲染表格的dom 影响体验
    if (store.useProjectId) {
      store.getList({
        useProjectId: store.useProjectId,
        type: 2,
      })
  
      store.initParams = {
        useProjectId: store.useProjectId,
        type: 2,
      } 
    } else {
      store.getList()
    }
  }

  componentWillUnmount() {
    store.tagIds.clear()
    store.selectedRows.clear()
    store.rowKeys.clear()
    store.selectItem = {}
    
    store.objectId = ''
    store.ownProjectId = ''
    store.projectPermission = 2
   
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  columns = [
    {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
      render: (text, record) => (
        <div className="FBH">
          {/* <OmitTooltip maxWidth={120} text={text} /> */}
          <Link target="_blank" to={`/manage/common-tag/${record.id}/${store.useProjectId}`}>{text}</Link>
          {(() => {
            if (record.status === 1) {
              return <Tag status="process" className="ml8" text="审批中" />
            }
            //    "status":0, //状态 0：可以申请 1 审批中 2 不可以申请
            if (record.status === 2) {
              return <Tag status="success" className="ml8" text="有权限" />
            } 
            return null
          })()}
        </div>
      ),
    }, {
      key: 'enName',
      title: '标签标识',
      dataIndex: 'enName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    }, {
      key: 'objName',
      title: '对象',
      dataIndex: 'objName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    }, {
      key: 'valueType',
      title: '数据类型',
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    }, {
      key: 'projectName',
      title: '所属项目', 
      dataIndex: 'projectName',
      render: text => <OmitTooltip maxWidth={200} text={text} />,
    }, {
      key: 'action',
      title: '操作',
      width: 150,
      render: (text, record) => (
        <div className="FBH FBAC">
          {/* eslint-disable-next-line no-underscore-dangle */}
          {/* <a href={`${window.__keeper.pathHrefPrefix}/tag-model/${record.id}`}>查看详情</a>  */}
          {/* <Authority authCode="tag_model:public_tag_detail[r]">
            <Link target="_blank" to={`/manage/common-tag/${record.id}/${store.useProjectId}`}>标签详情</Link>
          </Authority> */}
          <Authority authCode="tag_model:apply_tag[c]">  
            {(() => {
              if (store.useProjectId) {
                if (record.status) { // 状态 0：可以申请 1 审批中 2 不可以申请
                  return (                 
                    <Fragment>
                      {/* <span className="table-action-line" />  */}
                      <span className="disabled ml16">申请</span>
                    </Fragment>                
                  )
                } 
                return (
                  <Fragment>
                    {/* <span className="table-action-line" />  */}
                    <a className="ml16" href onClick={() => this.openModal(record, 'one')}>申请</a>
                  </Fragment>
                )
              } 
              return null
            })()}
          </Authority>
        </div>
      ),
    },
  ]

  @action.bound openModal(data, type) {
    store.modalType = type   
    store.selectItem = data
    store.tagIds.replace([data.id]) 
    store.modalVisible = true
  }

  @action.bound onTableCheck(selectedRowKeys, selectedRows) {
    // 表格 - 已选项
    store.selectedRows = selectedRows

    // 表格 - 已选项key数组
    store.rowKeys = selectedRowKeys
  }

  /**
   * @description 批量申请
   */
  @action.bound batchApply() {
    store.modalType = 'batch' 
    store.tagIds.replace(store.rowKeys) 
    store.modalVisible = true
  }

  // // 跳转到标签模型
  // goTagManager = () => {
  //   window.location.href = `${window.__keeper.pathHrefPrefix || '/'}/tag-model`
  // }

  render() {
    const {
      useProjectId, 
    } = store

    const rowSelection = {
      selectedRowKeys: store.rowKeys.slice(),
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.status, // 权限审批中的，不可进行申请、批量申请，且显示审批中
      }),
    }
  
    const listConfig = {
      columns: this.columns,
      buttons: useProjectId ? [
        <Authority authCode="tag_model:apply_tag[c]">
          <Button type="primary" disabled={!store.rowKeys.length} onClick={this.batchApply}>
            {
              `批量申请(${store.rowKeys.length})`
            }

          </Button>
        </Authority>,     
      // ,
        // <span className="ml8">
        //   已选择 
        //   <span style={{color: '#0078FF'}} className="mr4 ml4">{store.rowKeys.length}</span>
        //   项
        // </span>,
      ] : null,
      rowSelection: useProjectId ? rowSelection : null,
      rowKey: 'id',
      initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store, // 必填属性
    }

    return (
 
      <div>
        <Search store={store} />
        <div className="search-list box-border">
          <ListContent {...listConfig} />
          <Modal store={store} />
        </div>
      </div>
    )
  }
}
