/**
 * @description 场景-选择对象-对象列表
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {observable, action} from 'mobx'
import {
  Table, Input, Popconfirm, Tooltip,
} from 'antd'
import {OmitTooltip} from '../../../component'

const {Search} = Input

@observer
export default class TagList extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  @observable searchKey = undefined

  columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <OmitTooltip maxWidth={80} text={text} />,
    },
    {
      title: '唯一标识',
      dataIndex: 'enName',
      key: 'enName',
      render: text => <OmitTooltip maxWidth={80} text={text} />,
    },
    {
      title: '数据类型',
      dataIndex: 'valueTypeName',
      key: 'valueTypeName',
      render: text => <OmitTooltip maxWidth={80} text={text} />,
    },
    {
      title: '是否枚举',
      dataIndex: 'is_enum',
      key: 'is_enum',
    },
    {
      title: '枚举显示值',
      dataIndex: 'enumValue',
      key: 'enumValue',
    },
    {
      title: '业务逻辑',
      dataIndex: 'descr',
      key: 'descr',
      render: text => <OmitTooltip maxWidth={100} text={text} />,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 150,
      render: (text, record) => {
        if (record.isUsed) {
          return <Tooltip title="标签使用中, 不可移除"><span className="disabled">移除</span></Tooltip>
        }
        return (
          <Popconfirm placement="topRight" title="确定移除？" onConfirm={() => this.remove(record)}>
            <a href>移除</a>
          </Popconfirm>
        )
      },    
    },
  ]

  @action.bound onChange(e) {
    const {value} = e.target
    this.searchKey = value
  }

  remove = d => {
    const {remove} = this.props

    remove(d)
  }

  getFilterData() {
    const {selectTagTableData} = this.store
    if (this.searchKey) {
      return selectTagTableData.filter(d => d.name.indexOf(this.searchKey) !== -1)
    } 
    return selectTagTableData.slice()
  }

  render() {
    const listConfig = {
      dataSource: this.getFilterData(),
      rowKey: 'id',
      columns: this.columns,
      pagination: false,
      scroll: {y: 'calc(100% - 98)'},
    }

    return (
      <div className="FB1 select-tag-list">
        <Search
          placeholder="请输入标签名称关键字"
          onChange={this.onChange}
          style={{width: 300}}
          className="select-tag-search"
        />
        <Table {...listConfig} />
      </div>
    )
  }
}
