import {Component} from 'react'
import {observable, action, toJS, computed} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Table} from 'antd'
import ModalConfigColumns from './modal-config-columns'
import HelloStore from './store-hello'

const store = new HelloStore()
/** */
const allColumns = [
  {
    title: '中文名',
    key: 'name',
    dataIndex: 'name',
    width: 100,
  }, {
    title: '质量分',
    key: 'age',
    dataIndex: 'age',
  }, {
    title: '生命周期',
    key: 'address',
    dataIndex: 'address',
    width: 100,
  },
]


@observer
export default class Hello extends Component {
  @observable modalVisible = false
  @observable stdColumns = ['中文名']

  constructor(props) {
    super(props)
  }

  @computed get columns() {
    return this.stdColumns.map(column => {
      return allColumns.find(item => item.title === column)
    })
  }

  @action changeStdColumns(e) {
    this.stdColumns.replace(e)
  }

  @action toggleConfColumns() {
    this.modalVisible = !this.modalVisible
  }

  componentWillMount() {
    store.getList()
  }

  render() {
    return (
      <div className="page-hello m24">
        <h3>Table自定义显示列</h3>
        <Button onClick={() => this.toggleConfColumns()}>配置列</Button>
        <Table
          style={{width: '100%'}}
          columns={toJS(this.columns)}
          loading={store.tableLoading}
          dataSource={store.list.slice()}
          pagination={{
            current: store.pagination.currentPage,
            total: store.pagination.count,
          }}
        />
        <ModalConfigColumns
          visible={this.modalVisible}
          toggleConfColumns={() => this.toggleConfColumns()}
          defSteColumns={this.stdColumns.slice()}
          changeStdColumns={e => this.changeStdColumns(e)}
          allColumnsTitle={_.map(allColumns, 'title')}
        />
      </div>
    )
  }
}
