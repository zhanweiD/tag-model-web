import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {
  Row, Col, Spin, Modal, Icon,
} from 'antd'
import {Link} from 'react-router-dom'

// import {Time} from '../common/util'
import {navListMap} from '../common/constants'
import NoData from '../component-scene-nodata'
import AuthBox from '../component-auth-box'
import Tag from '../component-tag'

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
      navListMap.assetMgt,
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
    
    // const {functionCodes} = window.__userConfig
    const noDataConfig = {
      btnText: '添加场景',
      onClick: () => this.handleModalVisible(),
      code: 'asset_tag_add_occation',
      noAuthText: '暂无数据',
    }
    // if (functionCodes.includes('asset_tag_add_occation')) {
    //   noDataConfig = {
    //     btnText: '添加场景',
    //     onClick: () => this.handleModalVisible(),
    //   }
    // } else {
    //   noDataConfig = {
    //     text: '暂无数据',
    //   }
    // }
    return (
      <div className="scene-wrap">
        <div className="header">标签使用场景</div>
        <Spin spinning={loading}>
          <div className="scene-box">
          
            {
              list.length ? (
                <Fragment>
                  {/* {functionCodes.includes('asset_tag_add_occation') && <Button className="mb16" type="primary" onClick={() => this.handleModalVisible()}>添加场景</Button>} */}
                  <AuthBox 
                    className="mb16" 
                    code="asset_tag_add_occation" 
                    type="primary" 
                    onClick={() => this.handleModalVisible()}
                  >
                      添加场景
                  </AuthBox>
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
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */} 
                            <div
                              className="item-info"
                              onClick={() => {
                                window.location.href = `${window.__onerConfig.pathPrefix}/scene#/detail/${id}`
                              }}
                            >
                              <div className="c-name">
                                <Link to={`/detail/${id}`} className="name hover-style omit" title={name}>{name}</Link>
                                {/* <Tag color={used ? 'blue' : ''}>{used ? '使用中' : '未使用'}</Tag> */}
                                <Tag text={used ? '使用中' : '未使用'} color={used ? 'blue' : 'gray'} />
                                <Icon type="right" className="hover-style" />
                              </div>
                              <div className="c-info FBH">
                                <div className="mr20 omit">
                          创建者：
                                  {cUser}
                                </div> 
                                <div className="omit">
                          创建时间：
                                  {moment(+cDate).format('YYYY-MM-DD')}
                                </div>
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
                              <AuthBox type="link" code="asset_tag_edit_occation" disabled={used} className="tool" onClick={() => this.handleModalVisible('edit', list[d])}>
                                <Edit size="14" className={used ? 'i-used' : 'i-btn'} />
                              </AuthBox>
                              <div className="line" />
                              <AuthBox type="link" code="asset_tag_del_occation" disabled={used} className="tool" onClick={() => this.handleDel(id)}>
                                <Del size="14" className={used ? 'i-used' : 'i-btn'} />
                              </AuthBox>
                              {/* {functionCodes.includes('asset_tag_edit_occation') && (
                                <Button type="link" disabled={used} className="tool" onClick={() => this.handleModalVisible('edit', list[d])}>
                                  <Edit size="14" className={used ? 'i-used' : 'i-btn'} />
                                </Button>
                              )} */}

                              {/* <div className="line" /> */}
                              {/* {functionCodes.includes('asset_tag_del_occation') && (
                                <Button type="link" disabled={used} className="tool" onClick={() => this.handleDel(id)}>
                                  <Del size="14" className={used ? 'i-used' : 'i-btn'} />
                                </Button>
                              )} */}
                            </div>
                          </div>
                        </Col>
                      )) 
                    }
           
                  </Row>
                </Fragment>
              ) : (
                <NoData
                  isLoading={loading}
                  {...noDataConfig}
                />
              )
            }
            <ModalAdd store={store} />
          </div>
        </Spin>
      </div>
    )
  }
}
