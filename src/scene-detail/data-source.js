import {Component} from 'react'
// import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {
  Table, Button, Empty, Spin,
} from 'antd'

@observer
export default class DataSource extends Component {
  // componentWillMount() {
  //   const {store} = this.props
  //   store.getSourceList()
  // }


  columns = [{
    title: '所属分类',
    dataIndex: 'objTypeName',
  }, {
    title: '对象名称',
    dataIndex: 'objName',
  }, {
    title: '所属类目',
    dataIndex: 'catName',
  }, {
    title: '标签名称',
    dataIndex: 'tagName',
  }, {
    title: '标签英文名',
    dataIndex: 'tagEnName',
  }, {
    title: '目的字段',
    dataIndex: 'filedName',
  }]

  render() {
    const {store: {sourceData}} = this.props

    return (
      <div className="data-source">
        <div className="m16 p16 bgf">
          <Spin spinning={sourceData.loading}>
            {
              sourceData.data.length 
                ? sourceData.data.map((item, index) => (
                  <div className="mb48">
                    <div className="mb24 FBH FBJ FBAC">
                      <div className="fs14">
                        <span className="mr48">
                      目的数据源：
                          {item.sourceName}
                        </span>
                        <span>
                      目的数据表：
                          {item.tableName}
                        </span>
                      </div>
                      {/* 点击“配置数据服务”按钮，跳转至服务管理页面 */}
                      {
                        (index === 0) && (
                          <Button type="primary">
                            <a 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              href="/service/api"
                            >
                               配置数据服务
                            </a>      
                          </Button>
                        )
                      }
                    </div>
                    <Table 
                      columns={this.columns} 
                      loading={sourceData.loading}
                      dataSource={item.details.slice()} 
                      pagination={false}
                    />
                  </div>

                )) : <div className="empty-box bgf"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div> 
            }
          </Spin>
        </div>
      </div>
    )
  }
}
