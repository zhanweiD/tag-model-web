import {Component, Fragment} from 'react'
import {action} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Spin, Modal, Button} from 'antd'
import {DtGrid} from '@dtwave/uikit'
import * as navListMap from '../../common/navList'
import {
  Tag, NoData, AuthBox, Card, projectProvider,
} from '../../component'
import {IconDel, IconEdit} from '../../icon-comp'

import ModalAdd from './modal'

import store from './store' 

const {confirm} = Modal

const navList = [
  navListMap.tagCenter,
  navListMap.application,
  {text: navListMap.scene.text},
]

// @inject('frameChange')
@observer
class Scene extends Component {
  constructor(props) {
    super(props)
    // const {spaceInfo} = window
    // store.projectId = spaceInfo && spaceInfo.projectId
    store.projectId = props.projectId
  }

  componentWillMount() {
    // 面包屑设置
    // const {frameChange} = this.props
    // frameChange('nav', navList)

    if (store.projectId) {
      store.getList()
      store.getAuthCode()
    }
  }

  @action handleModalVisible(type, data = {}) {
    store.isEdit = !!type

    store.getStorageType()

    if (type) {
      store.getDetail({
        occasionId: data.id,
      })
    }
    store.modalVisible = true
  }

  @action handleDel(id) {
    confirm({
      title: '确认删除 ？',
      content: '所属该场景的类目都会被删除，标签也会被移除',
      onOk: () => {
        store.delScene(id)
      },
      onCancel: () => { },
    })
  }

  render() {
    const {loading, list = [], functionCodes} = store

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
                        cuser,
                        cdate,
                        used,
                        tagCount,
                        apiCount,
                        descr,
                      }, d) => (
                        <Card
                          className="card"
                          title={name}
                          // eslint-disable-next-line no-underscore-dangle
                          link={`${window.__keeper.pathHrefPrefix}/scene/${id}`}
                          tag={[<Tag status={used ? 'process' : 'wait'} text={used ? '使用中' : '未使用'} className="mr8" />]}
                          labelList={[{
                            label: '创建者',
                            value: cuser,
                          }, {
                            label: '创建时间',
                            value: moment(+cdate).format('YYYY-MM-DD HH-MM-SS'),
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
                              onClick={() => this.handleModalVisible('edit', list[d])}
                            >
                              <IconEdit size="14" className={used ? 'i-used' : ''} />
                            </Button>,
                            <Button
                              type="link" // antd@Button 属性
                              disabled={used}
                              className="p0"
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
      </div>
    )
  }
}

export default projectProvider(Scene)
