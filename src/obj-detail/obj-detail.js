import {Component} from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {Button, Modal} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {Time} from '../common/util'
import store from './store-obj-detail'

@observer
export default class ObjDetail extends Component {
  @observable updateKey = undefined

  constructor(props) {
    super(props)
    this.bigStore = props.bigStore
  }

  componentWillMount() {
    const {aId} = this.props
    store.id = aId
    store.getBaseInfo()
    store.getDailyCard()
  }

  componentWillReceiveProps(nextProps) {
    if (this.updateKey !== nextProps.updateKey) {
      this.updateKey = nextProps.updateKey
      store.id = nextProps.aId
      store.getBaseInfo(nextProps.aId)
      store.getDailyCard()
    }
  }

  render() {
    const {
      objTypeCode: typeCode,
      objType,
      tagCount,
      name,
      enName,
      creator,
      createTime,
      descr,
      objRspList = [],
    } = store.baseInfo
    const {dataSourceCount, tableCount, configuredField, associatedField} = store.dailyCard
    
    
    const baseInfo = [
      {
        title: '创建者',
        value: creator,
      }, {
        title: '创建时间',
        value: <Time timestamp={createTime} />,
      }, {
        title: '所属分类',
        value: objType,
      }, {
        title: '英文名',
        value: enName,
      }, {
        title: '标签个数',
        value: tagCount,
      }, {
        title: '描述',
        value: descr,
      },
    ]

    if (typeCode === 3) {
      baseInfo.splice(4, 0, {
        title: '关联的人/物',
        value: objRspList && objRspList.map(item => item.name).join('、'),
      })
    }

    return (
      <div className="tag-detail">
        <div className="detail-info">
          <div className="d-head FBH FBJ">
            <div>
              <span className="mr10">{name}</span>
            </div>
            <div>
              <Button type="primary" className="mr8">添加关联字段</Button>
              <Button>已关联字段列表</Button>
            </div>
          </div>
          <NemoBaseInfo dataSource={baseInfo} className="d-info" />
        </div>
        <div>{dataSourceCount}</div>
        {/* // "dataSourceCount": 3,		--数据源数
    // "tableCount": 20,			--数据表数
		// "configuredField": 100,		--已配置字段数
    // "associatedField": 200		--已关联字段数 */}
    
      </div>
    )
  }
}
