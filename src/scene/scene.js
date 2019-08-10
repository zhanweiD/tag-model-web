import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {
  Row, Col, Spin, Modal, Icon, Tag, Button,
} from 'antd'
import {Link} from 'react-router-dom'
import ModalAdd from './modal-add'

import store from './store-scene'

const {confirm} = Modal

@observer
export default class Scene extends Component {
  componentWillMount() {
    store.getList()
  }

  @action handleModalVisible(type, data = {}) {
    store.info = toJS(data)
    store.isEdit = !!type
    store.modalVisible = true
  }

  @action handleDel(id) {
    confirm({
      title: '确认删除 ？',
      content: '所属该场景的类目都会被删除，标签也会被移除',
      onOk: () => {
        store.delScene(id)
      },
      onCancel: () => {},
    })
  } 

  render() {
    const {loading, list = []} = store
    return (
      <div className="scene-wrap p16 pt0">
        <Spin spinning={loading}>
          <div className="header">标签使用场景</div>
          <Row gutter={16}> 
            <Col span={8}>
              <div className="add-scene FBH FBJC FBAC">
                <div className="pt16" onClick={() => this.handleModalVisible()}>
                  <div className="add-icon">
                    <Icon type="plus" />
                  </div>
                  <p className="mt12">添加场景</p>
                </div>
              </div>
            </Col>
            {
              toJS(list).map(({
                id,
                name,
                cCuser,
                cDate,
                used,
                tagCount,
                apiCount,
              }, d) => (
                <Col span={8}>
                  <div className={`card ${used ? 'used' : 'noused'}`}>
                    <div className="item-info">
                      <div className="c-name">
                        <Link to="/detail" className="mr8">{name}</Link>
                        <Tag color={used ? 'green' : 'blue'}>{used ? '使用中' : '未使用'}</Tag>
                        <Icon type="right" />
                      </div>
                      <div className="c-info">
                        <span className="mr20">
                          创建者：
                          {cCuser}
                        </span> 
                        <span>
                          创建时间：
                          {cDate}
                        </span>
                      </div>
                      <div className="count-info">
                        <div>
                          <span>标签数</span>
                          <div className="count">{tagCount}</div>
                        </div>
                        <div className="line" />
                        <div>
                          <span>API数</span>
                          <div className="count">{apiCount}</div>
                        </div>
                      </div>
                    </div>
                    <div className="item-tool">
                      <Button type="link" disabled={used} className="tool" onClick={() => this.handleModalVisible('edit', list[d])}>
                        <Icon type="form" className={used ? 'i-used' : ''} />
                      </Button>
                      <Button type="link" disabled={used} className="tool" onClick={() => this.handleDel(id)}>
                        <Icon type="delete" className={used ? 'i-used' : ''} />
                      </Button>
                    </div>
                  </div>
                </Col>
              ))
            }
          </Row>
        </Spin>
        <ModalAdd store={store} />
      </div>
    )
  }
}