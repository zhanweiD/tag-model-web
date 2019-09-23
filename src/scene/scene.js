import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {
  Spin, Modal,
} from 'antd'
import {DtGrid, DtNewCard} from '@dtwave/uikit'

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
    
    const noDataConfig = {
      btnText: '添加场景',
      onClick: () => this.handleModalVisible(),
      code: 'asset_tag_add_occation',
      noAuthText: '暂无数据',
    }

    return (
      <div className="scene-wrap">
        <div className="header">标签使用场景</div>
        <Spin spinning={loading}>
          <div className="scene-box">
          
            {
              list.length ? (
                <Fragment>
                  <AuthBox 
                    className="mb16" 
                    code="asset_tag_add_occation" 
                    type="primary" 
                    onClick={() => this.handleModalVisible()}
                  >
                      添加场景
                  </AuthBox>
                  <DtGrid row={3} fixedHeight={192}>
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
                        <DtNewCard 
                          className="card"
                          title={name}
                          // eslint-disable-next-line no-underscore-dangle
                          link={`${window.__onerConfig.pathPrefix}/scene#/detail/${id}`}
                          tag={[<Tag text={used ? '使用中' : '未使用'} color={used ? 'blue' : 'gray'} className="mr8" />]}
                          labelList={[{
                            label: '创建者',
                            value: cUser,
                          }, {
                            label: '创建时间',
                            value: moment(+cDate).format('YYYY-MM-DD HH-MM-SS'),
                          }]}
                          descr={descr}
                          countList={[{
                            label: '标签数',
                            value: tagCount,
                          }, {
                            label: 'API数',
                            value: apiCount,
                          }]}
                          actions={[
                            <AuthBox 
                              type="link" // antd@Button 属性
                              disabled={used}
                              className="p0"
                              code="asset_tag_edit_occation" 
                              onClick={() => this.handleModalVisible('edit', list[d])}
                            >
                              <Edit size="14" className={used ? 'i-used' : ''} />
                            </AuthBox>,
                            <AuthBox 
                              type="link" // antd@Button 属性
                              disabled={used} 
                              className="p0"
                              code="asset_tag_del_occation" 
                              onClick={() => this.handleDel(id)}
                            >
                              <Del size="14" className={used ? 'i-used' : ''} />
                            </AuthBox>,
                          ]}
                        />
                      )) 
                    }
                  </DtGrid>
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
