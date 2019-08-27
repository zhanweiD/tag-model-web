import {Component} from 'react'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Button, Tabs, Tag} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Time} from '../common/util'
import Descr from '../component-detail-descr'

import TagDetailExponent from '../tag-detail-exponent'
import TagDetailInvoke from '../tag-detail-invoke'
import TagDetailRelate from '../tag-detail-relate'
import TagDetailDrawer from '../tag-detail-drawer'

import store from './store-tag-detail'

const {TabPane} = Tabs
const {functionCodes} = window.__userConfig

@inject('bigStore')
@observer
export default class TagDetail extends Component {
  @observable updateKey = undefined
  @observable tabActiveKey = '1'


  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
  }

  componentWillMount() {
    const {aId} = this.props
    store.id = aId
    store.getBaseInfo()
  }

  componentWillReceiveProps(nextProps) {
    if (this.updateKey !== nextProps.updateKey) {
      this.updateKey = nextProps.updateKey
      store.id = nextProps.aId
      store.getBaseInfo()
    }
  }

  onTabChange = d => {
    this.tabActiveKey = d
  }

  render() {
    const {
      // objTypeCode: typeCode,
      // 标签
      name,
      enName,
      valueTypeName,
      isEnum,
      creator,
      createTime,
      dataSource,
      fieldName,
      descr,
      isUsed,
      isConfigured,
      objId,
    } = store.baseInfo

    const baseInfo = [
      {
        title: '英文名',
        value: enName,
      }, {
        title: '数据类型',
        value: valueTypeName,
      }, {
        title: '是否枚举',
        value: isEnum ? '是' : '否',
      }, {
        title: '创建人',
        value: creator,
      }, {
        title: '创建时间',
        value: <Time timestamp={createTime} />,
      }, {
        title: '数据源',
        value: dataSource,
      }, {
        title: '字段',
        value: fieldName,
      }, 
      // {
      //   title: '业务逻辑',
      //   value: descr,
      // },
    ]

    return (
      <div className="tag-detail">
        <div className="detail-info">
          <div className="d-head">
            <div className="FBH FBJ FBAC">
              <div>
                <span className="mr10">{name}</span>
                {(() => {
                  if (isUsed) return <Tag color="blue">使用中</Tag>
                  if (isConfigured) return <Tag color="green">未使用</Tag>
                  return <Tag>待配置</Tag>
                })()}
              </div>
              {
                functionCodes.includes('asset_tag_conf_tag_field') && (
                  <TagDetailDrawer
                    id={objId}
                    onUpdate={() => store.getBaseInfo()}
                  >
                    <Button type="primary">绑定字段</Button>
                  </TagDetailDrawer>
                )
              }
            </div>
            <Descr text={descr} pr={85} className="mt8" />
          </div>
          <NemoBaseInfo dataSource={baseInfo} className="d-info" />
        </div>
        <Tabs
          defaultActiveKey="1"
          activeKey={this.tabActiveKey}
          animated={false}
          onChange={this.onTabChange}
          key={this.updateKey}
        >
          <TabPane tab="标签指数" key="1">
            <TagDetailExponent
              aId={store.id}
              baseInfo={store.baseInfo}
            />
          </TabPane>
          <TabPane tab="标签调用" key="2">
            <TagDetailInvoke aId={store.id} />
          </TabPane>
          <TabPane tab="标签血缘" key="3">
            <TagDetailRelate aId={store.id} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
