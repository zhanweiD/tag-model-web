import {Component, Fragment} from 'react'
import {Input, Popconfirm, Button} from 'antd'
import {action, toJS} from 'mobx'
import {inject} from 'mobx-react'
import {Link} from 'react-router-dom'
import {SearchOutlined} from '@ant-design/icons'
import {Time} from '../../../../common/util'
import {ListContent, projectProvider, OmitTooltip, Authority, NoData} from '../../../../component'
import {tagStatusBadgeMap} from '../../../page-tag-model/tag-model/util'
import DrawerCreate from './drawer-create'
import store from './store-tag-list'


const {Search} = Input

@inject('bigStore')
export default class TagList extends Component {
  constructor(props) {
    super(props)
    const {bigStore} = props
    this.bigStore = bigStore
    store.projectId = undefined
    // store.projectId = bigStore.projectId
    store.objId = bigStore.objId
  }

  columns = [{
    title: '标签名称',
    dataIndex: 'name',
    // render: (text, record) => <Link target="_blank" to={`/manage/object-model/${record.id}/${store.projectId}`}><OmitTooltip maxWidth={120} text={text} /></Link>,
  }, {
    title: '绑定方式',
    dataIndex: 'configType',
    render: text => (text === 1 ? '衍生标签' : '基础标签'),
  }, {
    title: '标签标识',
    dataIndex: 'enName',
  }, {
    key: 'creator',
    title: '创建人',
    dataIndex: 'creator',
    render: (text, record) => <span>{record.createType === 1 ? '自建' : record.projectName}</span>,
  }, {
    key: 'status',
    title: '标签状态',
    dataIndex: 'status',
    render: v => tagStatusBadgeMap(+v),
  }, 
  // {
  //   title: '描述',
  //   dataIndex: 'descr',
  //   render: text => (text || '-'),
  // },
  {
    key: 'action',
    title: '操作',
    width: 180,
    render: (text, record) => (
      <div className="FBH FBAC">
        {/* 标签状态: 待绑定  操作: 编辑/删除 */}
        {record.status === 0 && (
          <Fragment>
            {/* <Authority */}
            {/* authCode="object_list:create_tag[c]"
          > */}
            <a href onClick={() => store.openDrawer('edit', record)} className="mr16">编辑</a>
            <Popconfirm placement="topRight" title="标签被删除后不可恢复，确定删除？" onConfirm={() => this.remove(record)}>
              <a href>删除</a>
            </Popconfirm>
            {/* </Authority> */}
          </Fragment>
        )}

        {/* 标签状态: 待发布  操作: 编辑/删除 */}
        {record.status === 1 && (
          <Fragment>

            {/* <a href onClick={() => store.openDrawer('edit', record)}>编辑</a> */}
            {/* <Authority */}
            {/* authCode="object_list:create_tag[c]"
          > */}
            <span className="disabled mr16">编辑</span>

            <Popconfirm placement="topRight" title="标签被删除后不可恢复，确定删除？" onConfirm={() => this.remove(record)}>
              <a href>删除</a>
            </Popconfirm>
            {/* </Authority> */}
          
          </Fragment>
        )}

        {/* 标签状态: 已发布  操作: 编辑/删除 */}
        {/* {record.status === 2 && record.isUsed === 0 && record.publish === 0 && ( */}
        {record.status === 2 && (
          <Fragment>
            {/* <Authority */}
            {/* authCode="object_list:create_tag[c]"
            > */}
            {/* <a href onClick={() => store.openDrawer('edit', record)} className="mr16">编辑</a> */}
            <span className="disabled mr16">编辑</span>
            <span className="disabled mr16">删除</span>
            {/* <Popconfirm placement="topRight" title="标签被删除后不可恢复，确定删除？" onConfirm={() => this.remove(record)}>
              <a href>删除</a>
            </Popconfirm> */}
            {/* </Authority> */}
          </Fragment>
        )}

      </div>
    ),
  }]

  componentWillReceiveProps(next) {
    const {updateDetailKey, objId} = this.props
    if (!_.isEqual(updateDetailKey, next.updateDetailKey) || !_.isEqual(+objId, +next.objId)) {
      store.objId = next.objId
      store.getList({objId: next.objId, currentPage: 1})
    }
  }

  @action.bound remove(data) {
    store.deleteTag({
      deleteIds: [data.id],
    })
  }
  
  @action.bound onChange(e) {
    const searchKey = e.target.value
    store.getList({
      currentPage: 1,
      searchKey,
    })
  }

  componentWillMount() {
    // if (store.projectId) {
    // store.getAuthCode()
    //   this.initData()
    //   store.checkKeyWord()
    // }
    if (store.objId) {
      // store.getAuthCode()
      this.initData()
      store.checkKeyWord()
    }
  }

  componentDidMount() {
    // if (store.projectId) {
    // 获取所属对象下拉数据
    // store.getObjectSelectList() 

    // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
    // 若返回数据为空[]。则渲染 NoData 组件。
    // store.initParams = {projectId: store.projectId}
    // store.getList({
    //   projectId: store.projectId,
    // })
    // }
    if (store.projectId) {
      // 获取所属对象下拉数据
      store.getObjectSelectList()

      // 请求列表，放在父组件进行请求是因为需要在外层做空数据判断。
      // 若返回数据为空[]。则渲染 NoData 组件。
      // store.initParams = {projectId: store.projectId}
      store.getList({
        objId: store.objId,
      })
    }
  }

  @action initData() {
    store.list.clear()
    store.searchParams = {}
    store.pagination = {
      pageSize: 10,
      currentPage: 1,
    }
  }

  isSearch = () => {
    const {
      searchParams,
    } = store

    if (
      JSON.stringify(searchParams) === '{}'
    ) {
      return false
    }
    return true
  }

  render() {
    // const {} = store
    const {objId} = store
    const listConfig = {
      columns: this.columns,
      initParams: {objId: +store.objId},
      buttons: [<div className="pr24 far" style={{display: 'float'}}>
        {/* <Search
          placeholder="请输入标签名称关键字"
          onChange={e => this.onChange(e)}
          style={{width: 200}}
        /> */}
        <div style={{float: 'left', marginBottom: '8px'}}>
          <Button type="primary" className="mr8" onClick={() => store.openDrawer('add')}>新建标签</Button>
        </div>
        <div style={{float: 'right', marginBottom: '8px'}}>
          <Input
            onChange={e => this.onChange(e)}
            style={{width: 200}}
            size="small"
            placeholder="请输入标签名称关键字"
            suffix={<SearchOutlined />}
          />
        </div>
      </div>],
      store,
    }
    return (
      <div>
        <ListContent {...listConfig} />
        <DrawerCreate store={store} />
      </div>
    )
  }
}
