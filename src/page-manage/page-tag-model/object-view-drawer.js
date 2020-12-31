import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {toJS, observable} from 'mobx'
import {Drawer, Table, Button} from 'antd'


@observer
export default class ObjectViewDrawer extends Component {
  columns = [
    {
      title: '标签名称',
      dataIndex: 'name',
    }, {
      title: '标签标识',
      dataIndex: 'enName',
      // dataIndex: 'isMajor',
      // render: text => (
      //   <div>
      //     {
      //       text === 1 ? '主键' : '标签'
      //     }
      //   </div>
      // ),
    },
  ]

  render() {
    const {datas, visible, closeDrawer} = this.props

    return (
      <Drawer
        visible={visible}
        title={datas.name}
        onClose={closeDrawer}
        width={560}
        className="object-view-drawer"
      >
        <div>
          <div className="FBH">
            <div className="black45">
              对象类型：
            </div>
            <div className="black65">
              {
                datas.objTypeCode === 4 ? '实体' : '关系'
              }
            </div>
          </div>
          <div className="black45 mt8 mb8">
            标签列表
          </div>
          <Table 
            columns={this.columns}
            dataSource={datas.tag}
            pagination={false}
            rowClassName={(rowData, index) => `ant-table-row-${index % 2}`}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={closeDrawer} type="primary">
              关闭
            </Button>
          </div>
        </div>
      </Drawer>
    )
  }
}
