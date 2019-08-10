import {Component} from 'react'
import {observable, action, toJS} from 'mobx'
import {observer, inject} from 'mobx-react'
import {Button, Tabs, Tag} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Time} from '../common/util'
import TagDetailExponent from '../tag-detail-exponent'
import store from './store-tag-detail'

const {TabPane} = Tabs

@inject('bigStore')
@observer
export default class TagDetail extends Component {
  @observable updateKey = undefined

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

  render() {
    const {
      // objTypeCode: typeCode,
      // 标签
      name,
      enName,
      valueName,
      isEnum,
      creator,
      createTime,
      dataSource,
      fieldName,
      descr,
      isUsed,
    } = store.baseInfo

    const baseInfo = [
      {
        title: '英文名',
        value: enName,
      }, {
        title: '数据类型',
        value: valueName,
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
      }, {
        title: '业务逻辑',
        value: descr,
      },
    ]

    return (
      <div className="tag-detail">
        <div className="detail-info">
          <div className="d-head FBH FBJ">
            <div>
              <span className="mr10">{name}</span>
              {
                isUsed ? <Tag color="green">使用中</Tag> : <Tag color="blue">未使用</Tag>
              }
            </div>
            <Button type="primary">绑定字段</Button>
          </div>
          <NemoBaseInfo dataSource={baseInfo} className="d-info" />
        </div>
        <Tabs
          defaultActiveKey="1"
          animated={false}
        >
          <TabPane tab="标签指数" key="1">
            <TagDetailExponent aId={store.id} />
          </TabPane>
          <TabPane tab="标签调用" key="2">标签调用</TabPane>
          <TabPane tab="标签血缘" key="3">标签血缘</TabPane>
        </Tabs>
      </div>
    )
  }
}
