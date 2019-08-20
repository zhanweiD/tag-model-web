import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {
  Row, Col, Spin, Modal, Icon, Tag, Button,
} from 'antd'
import {Link} from 'react-router-dom'

import {Time} from '../common/util'
import {navListMap} from '../common/constants'
import NoData from '../component-scene-nodata'
import ModalAdd from './modal-add'

import Del from '../svg-component/Del'
import Edit from '../svg-component/Edit'

import store from './store-scene'

const {confirm} = Modal

@inject('frameChange')
@observer
export default class Scene extends Component {
  componentWillMount() {
    const {frameChange} = this.props

    frameChange('nav', [
      navListMap.tagMgt,
      {text: '标签场景'},
    ])
    
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
      <div className="scene-wrap">
        <div className="header">标签使用场景</div>
        <Spin spinning={loading}>
          <div className="scene-box">
          
            {
              list.length ? (
                <Fragment>
                  <Button className="mb16" type="primary" onClick={() => this.handleModalVisible()}>添加场景</Button>
                  <Row gutter={16}> 
           
                    {
                      list.map(({
                        id,
                        name,
                        cUser,
                        cDate,
                        used,
                        tagCount,
                        apiCount,
                        descr,
                      }, d) => (
                        <Col span={8}>
                          <div className="card">
                            <div className="item-info">
                              <div className="c-name">
                                <Link to={`/detail/${id}`} className={`name ${used ? 'use-name' : ''}`} title={name}>{name}</Link>
                                <Tag color={used ? 'blue' : ''}>{used ? '使用中' : '未使用'}</Tag>
                                <Icon type="right" />
                              </div>
                              <div className="c-info">
                                <span className="mr20">
                          创建者：
                                  {cUser}
                                </span> 
                                <span>
                          创建时间：
                                  <Time timestamp={cDate} />
                                </span>
                              </div>
                              <div className="c-descr omit" title={descr}>
                          描述：
                                {descr}
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
                                <Edit size="14" className={used ? 'i-used' : 'i-btn'} />
                              </Button>
                              <div className="line" />
                              <Button type="link" disabled={used} className="tool" onClick={() => this.handleDel(id)}>
                                <Del size="14" className={used ? 'i-used' : 'i-btn'} />
                              </Button>
                            </div>
                          </div>
                        </Col>
                      )) 
                    }
           
                  </Row>
                </Fragment>
              ) : <NoData btnTxt="添加场景" onClick={() => this.handleModalVisible()} />
            }
            <ModalAdd store={store} />
          </div>
        </Spin>
      </div>
    )
  }
}
