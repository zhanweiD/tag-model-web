import {Component, Fragment} from 'react'
import {action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {
  Tabs, Button, Icon, Spin, Alert,
} from 'antd'

import * as navListMap from '../../common/navList'
import {Time} from '../../common/util'
import {AuthBox, Tag, DetailHeader} from '../../component'
import ModalEditScene from '../scene/modal'

import SelectTag from './select-tag'

import store from './store-scene-detail'

const {TabPane} = Tabs

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.application,
  navListMap.scene,
  {text: navListMap.sceneDetail.text},
]

@inject('frameChange')
@observer
export default class SceneDetail extends Component {
  constructor(props) {
    super(props)
    const {spaceInfo} = window
    store.projectId = spaceInfo && spaceInfo.projectId

    const {match: {params}} = props
    store.sceneId = params.sceneId
  }

  componentWillMount() {
    // 面包屑设置
    const {frameChange} = this.props
    frameChange('nav', navList)
   
    if (store.projectId) {
      store.getDetail()
      store.getAuthCode()
    }
  }

  @action.bound sceneDetailVisible() {
    store.isEdit = true
    store.modalVisible = true
  }

  @action.bound onTabChange(e) {
    store.currentKey = e
  }

  componentWillUnmount() {
    store.info = {}
  }

  render() {
    const info = toJS(store.info)
    const {
      storageType,
      dataStorageName,
      cuser,
      cdate,
      descr,
      used,
      name,
    } = info

    // 详情信息
    const baseInfo = [{
      title: '创建者',
      value: cuser,
    }, 
    {
      title: '数据源类型',
      value: storageType,
    },
    {
      title: '数据源',
      value: dataStorageName,
    },
    {
      title: '创建时间',
      value: <Time timestamp={cdate} />,
    },
    ]


    // 不同状态的相应map
    const tagMap = {
      0: <Tag status="wait" text="未使用" />,
      1: <Tag status="success" text="使用中" />,
    }

    const actions = [
      <Button className="mr8" href={`${window.__keeper.pathHrefPrefix}/scene/${store.sceneId}/tags`}>标签列表</Button>,
    ]

    return (
      <div className="scene-detail">    
        {
          used ? (
            <Alert
              showIcon
              closable
              type="warning"
              className="fs12"
              message="场景使用中，无法在场景中继续选择或移除对象，添加、编辑或删除类目，选择或移除标签，只能查看类目与标签详情。"
            />
          ) : null
        }

        <Spin spinning={store.loading}>
          <DetailHeader
            name={(
              <Fragment>
                <span>{name}</span>
                <AuthBox code="asset_tag_project_occ_operator" myFunctionCodes={store.functionCodes} isButton={false}>
                  {
                    !used && <Icon className="ml8" type="edit" onClick={this.sceneDetailVisible} style={{color: 'rgba(0,0,0, .45)'}} />
                  }
                </AuthBox>
              </Fragment>
            )}
            descr={descr}
            btnMinWidth={230}
            baseInfo={baseInfo}
            tag={tagMap[used]}
            actions={actions}
          />
        </Spin>
        {
          store.projectId ? (
            <Fragment>
              <Tabs defaultActiveKey="1" animated={false} onChange={this.onTabChange}>
                <TabPane tab="标签选择" key="1">
                  <SelectTag 
                    sceneId={store.sceneId} 
                    projectId={store.projectId}
                    sceneDetailStore={store}
                  />
                </TabPane>
              </Tabs>
              <ModalEditScene store={store} />
            </Fragment>
          ) : null
        }
       
      </div>
    )
  }
}
