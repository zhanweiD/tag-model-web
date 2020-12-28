import {Component, Fragment} from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Input, Button} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {codeInProduct} from '../../../../common/util'
import {NoData, OmitTooltip, Authority} from '../../../../component'
import ModalMove from './modal-move'

const {Search} = Input

@observer
export default class TagList extends Component {
  @observable selectedRowKeys = []

  constructor(props) {
    super(props)
    this.store = props.store
    // console.log(this.store, 'tagclasslist')
  }

  columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      render: text => <OmitTooltip maxWidth={100} text={text} />,
    }, {
      title: '标签标识',
      dataIndex: 'enName',
      render: text => <OmitTooltip maxWidth={100} text={text} />,
    }, {
      title: '数据类型',
      dataIndex: 'valueTypeName',
    }, {
      title: '创建方',
      dataIndex: 'creator',
      render: (text, record) => <span>{record.createType === 0 ? record.projectName : (this.store.projectId ? '租户' : '自建')}</span>,
    }, {
      title: '描述',
      dataIndex: 'descr',
      render: text => (text ? <OmitTooltip maxWidth={120} text={text} /> : '-'),
    }, {
      title: '操作',
      dataIndex: 'action',
      width: 90,
      render: (text, record) => <Authority authCode="tag_model:move_tag[u]" isCommon><a href onClick={() => this.moveTo(record)}>移动至</a></Authority>,
    },
  ]

  componentWillReceiveProps(next) {
    const {cateId} = this.props
    
    if (!_.isEqual(cateId, next.cateId)) {
      this.selectedRowKeys.clear()
    }
  }

  onSearch = keyword => {
    const {tagList} = this.store

    this.store.keyword = keyword

    this.store.getTagList({
      keyword,
      currentPage: 1,
      pageSize: tagList.pageSize,
      cateId: this.store.currentSelectKeys,
    }, 'list')
  }

  @action moveTo(record) {
    this.store.modalMove = {
      selectKeys: record ? [record.id] : this.selectedRowKeys.slice(),
      visible: true,
    }
  }

  @action.bound changeRow(keys) {
    this.selectedRowKeys = keys
  }

  @action.bound moveSuccess() {
    const t = this
    const {store} = t
    const {tagList} = store
    const {currentSelectKeys} = store

    t.selectedRowKeys.clear()

    // 1. 标签列表只有一条数据；移动成功后 刷新标签类目树
    if (tagList.list.length === 1) {
      store.getTagCateTree()
    } 
    // 2. 移动标签成功 刷新标签列表
    store.getTagList({
      currentPage: 1,
      pageSize: tagList.pageSize,
      cateId: currentSelectKeys,
    }, 'list')
  }

  @action.bound changeTable = pagination => {
    this.store.tagList.currentPage = pagination.current

    this.store.getTagList({
      keyword: this.store.keyword,
      currentPage: pagination.current,
      pageSize: this.store.tagList.pageSize,
      cateId: this.store.currentSelectKeys,
    }, 'list')
  }


  render() {
    const {tagList, keyword} = this.store

    const rowSelection = codeInProduct('tag_model:move_tag[u]', true) && {
      selectedRowKeys: this.selectedRowKeys,
      onChange: this.changeRow,
    }

    const listConfig = {
      key: this.props.cateId,
      rowKey: 'id',
      rowSelection: rowSelection || null,
      columns: this.columns,
      loading: tagList.loading,
      dataSource: tagList.list,
      pagination: {
        current: tagList.currentPage,
        pageSize: tagList.pageSize,
        total: tagList.total,
      },
      onChange: this.changeTable,
      style: {
        paddingBottom: '60px',
      },
    }

    const noDataConfig = {
      btnText: '选择标签',
      onClick: this.props.openSelectTag,
      text: '没有任何标签，请在当前页面选择标签！',
      code: 'tag_model:move_tag[u]',
      noAuthText: '没有任何标签',
      isLoading: tagList.loading,
      isCommon: true,
    }

    return (
      // <div className="pt32">
      <div>
        <p className="detail-name mb8">标签列表</p>
        {
          // !tagList.list.length && typeof keyword === 'undefined' ? (
          //   <NoData
          //     // isLoading={tagList.loading}
          //     {...noDataConfig}
          //   />
          // ) : 
          (
            <Fragment>
              <div className="FBH FBJB mb16">
                <Authority authCode="tag_model:move_tag[u]" isCommon>                
                  <Button onClick={() => this.moveTo()} disabled={!this.selectedRowKeys.length} type="primary">批量移动至</Button>
                </Authority>
                <Input
                  onChange={e => this.onSearch(e.target.value)}
                  onSearch={value => this.onSearch(value)}
                  size="small"
                  placeholder="请输入关键字搜索"
                  style={{width: 200}}
                  suffix={<SearchOutlined />}
                />
                {/* <Search
                  placeholder="请输入关键字搜索"
                  size="small"
                  onSearch={value => this.onSearch(value)}
                  onChange={e => this.onSearch(e.target.value)}
                  style={{width: 200}}
                /> */}
              </div>
              <Table {...listConfig} />
            </Fragment>
          )
        }
       
        <ModalMove store={this.store} moveSuccess={this.moveSuccess} />
      </div>
    )
  }
}
