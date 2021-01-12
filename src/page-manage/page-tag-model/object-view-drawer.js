import intl from 'react-intl-universal'
import { Component, Fragment } from 'react'
import { observer } from 'mobx-react'
import { toJS, observable } from 'mobx'
import { Drawer, Table, Button } from 'antd'

@observer
class ObjectViewDrawer extends Component {
  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'name',
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
        .d('标签标识'),
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
    const { datas, visible, closeDrawer } = this.props

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
              {intl
                .get(
                  'ide.src.page-manage.page-tag-model.object-view-drawer.yf5ke0yct0s'
                )
                .d('对象类型：')}
            </div>
            <div className="black65">
              {datas.objTypeCode === 4
                ? intl.get('ide.src.common.dict.yy6bfwytt9').d('实体')
                : intl.get('ide.src.common.dict.g3kh6ck2ho6').d('关系')}
            </div>
          </div>
          <div className="black45 mt8 mb8">
            {intl.get('ide.src.common.navList.5ywghq8b76s').d('标签列表')}
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
              {intl
                .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
                .d('关闭')}
            </Button>
          </div>
        </div>
      </Drawer>
    )
  }
}
export default ObjectViewDrawer
