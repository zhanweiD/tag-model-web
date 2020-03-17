import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Spin, Modal, Button} from 'antd'
import {DtGrid, DtNewCard} from '@dtwave/uikit'
import * as navListMap from '../../common/navList'

import {
  Tag, NoData, AuthBox, Loading,
} from '../../component'
import {IconDel, IconEdit} from '../../icon-comp'

import ModalAdd from './modal-add'

import store from './store'

const {confirm} = Modal

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.application,
  {text: navListMap.scene.text},
]

@inject('frameChange')
@observer
export default class Scene extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId
  }

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
    
    if (store.projectId) {
      store.getList()
      store.getAuthCode()
    }
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

  // 跳转到项目列表
  goProjectList = () => {
    window.location.href = `${window.__keeper.pathPrefix || '/'}/project`
  }

  renderNodata =() => {
    const {spaceInfo} = window

    const noProjectDataConfig = {
      btnText: '去创建项目',
      onClick: this.goProjectList,
      text: '没有任何项目，去项目列表页创建项目吧！',
      code: 'asset_tag_project_add',
      noAuthText: '没有任何项目',
    }

    if (spaceInfo && spaceInfo.finish && !spaceInfo.projectList.length) {
      return (
        <NoData
          {...noProjectDataConfig}
        />
      )
    } 
    return <Loading mode="block" height={200} />
  }

  render() {
    const {loading, list = [], functionCodes} = store
    const {spaceInfo} = window
    
    const noDataConfig = {
      btnText: '添加场景',
      onClick: () => this.handleModalVisible(),
      code: 'asset_tag_project_occ_operator',
      noAuthText: '暂无数据',
      myFunctionCodes: functionCodes,
    }

    return (
      <div className="scene-wrap">

        <div className="content-header">标签使用场景</div>
        {
          spaceInfo && spaceInfo.projectId && spaceInfo.projectList && spaceInfo.projectList.length 
            ? (
              <Spin spinning={loading}>
                <div className="scene-box">
                  {
                    list.length ? (
                      <Fragment>
                        <AuthBox 
                          className="mb16" 
                          code="asset_tag_project_occ_operator" 
                          myFunctionCodes={store.functionCodes}
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
                                link={`${window.__keeper.pathPrefix}/scene#/${id}`}
                                tag={[<Tag status={used ? 'process' : 'wait'} text={used ? '使用中' : '未使用'} className="mr8" />]}
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
                                actions={functionCodes.includes('asset_tag_project_occ_operator') ? [
                                  <Button 
                                    type="link" // antd@Button 属性
                                    disabled={used}
                                    className="p0"
                                    // code="asset_tag_project_occ_operator" 
                                    // myFunctionCodes={functionCodes}
                                    onClick={() => this.handleModalVisible('edit', list[d])}
                                  >
                                    <IconEdit size="14" className={used ? 'i-used' : ''} />
                                  </Button>,
                                  <Button 
                                    type="link" // antd@Button 属性
                                    disabled={used} 
                                    className="p0"
                                    // code="asset_tag_project_occ_operator" 
                                    // myFunctionCodes={functionCodes}
                                    onClick={() => this.handleDel(id)}
                                  >
                                    <IconDel size="14" className={used ? 'i-used' : ''} />
                                  </Button>,
                                ] : null}
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
            )
            : this.renderNodata()
        }
      </div>
    )
  }
}
