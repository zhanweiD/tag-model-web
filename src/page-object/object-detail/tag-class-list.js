import {Component, Fragment} from 'react'
import {action, observable} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Button, Input} from 'antd'
import {NoData} from '../../component'
import ModalMove from './modal-move'

const {Search} = Input

@observer
export default class TagList extends Component {
  @observable selectedRowKeys = []

  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
    }, {
      title: '唯一标识',
      dataIndex: 'enName',
    }, {
      title: '数据类型',
      dataIndex: 'valueTypeName',
    }, {
      title: '所属项目',
      dataIndex: 'projectName',
    }, {
      title: '描述',
      dataIndex: 'descr',
    }, {
      title: '操作',
      dataIndex: 'action',
      width: 90,
      render: (text, record) => <a href onClick={() => this.moveTo(record)}>移动至</a>,
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


  render() {
    const {tagList, keyword} = this.store

    const rowSelection = {
      selectedRowKeys: this.selectedRowKeys,
      onChange: this.changeRow,
    }

    const listConfig = {
      rowKey: 'id',
      rowSelection,
      columns: this.columns,
      loading: tagList.loading,
      dataSource: tagList.list,
      pagination: {
        current: tagList.currentPage,
        pageSize: tagList.pageSize,
      },
      // warning here
      // onChange: this.changeTable,
    }

    const noDataConfig = {
      btnText: '选择标签',
      onClick: this.props.openSelectTag,
      text: '没有任何标签，请在当前页面选择标签！',
    }

    return (
      <div className="pt32">
        <p className="mb16">标签列表</p>
        {
          !tagList.list.length && typeof keyword === 'undefined' ? (
            <NoData
              isLoading={tagList.loading}
              {...noDataConfig}
            />
          
          ) : (
            <Fragment>
              <div className="FBH FBJB mb16">
                <Button onClick={() => this.moveTo()} disabled={!this.selectedRowKeys.length} type="primary">批量移动至</Button>
                <Search
                  placeholder="请输入关键字搜索"
                  onSearch={value => this.onSearch(value)}
                  onChange={e => this.onSearch(e.target.value)}
                  style={{width: 200}}
                />
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
