/**
 * @description 标签模型-标签详情
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Spin} from 'antd'
import * as navListMap from '../../../common/navList'
import {DetailHeader, TabRoute, Tag} from '../../../component'
import {Time} from '../../../common/util'
import TagRelate from './tag-relate'

import store from './store'


// 面包屑设置
// eslint-disable-next-line no-underscore-dangle

const navList = [
  navListMap.tagCenter,
  navListMap.tagManagement,
  navListMap.tagModel,
  navListMap.tagDetail,
]

// @inject('frameChange')
@observer
export default class TagManagement extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.tagId = match.params.tagId // 标签id
  }

  componentWillMount() {
    // 面包屑设置
    // const {frameChange} = this.props
    // frameChange('nav', navList)

    store.getDetail()
  }


  render() {
    const {tagDetailLoading, tagDetail} = store

    const baseInfo = [{
      title: '对象',
      value: tagDetail.objName,
    }, {
      title: '标签标识',
      value: tagDetail.enName,
    }, {
      title: '数据类型',
      value: tagDetail.valueTypeName,
    }, {
      title: '是否枚举',
      value: tagDetail.isEnum ? '是' : '否',
    }, {
      title: '创建者',
      value: tagDetail.creator,
    }, {
      title: '创建时间',
      value: <Time timestamp={tagDetail.createTime} />,
    }, {
      title: '数据源',
      value: tagDetail.dataSource,
    }, {
      title: '数据表',
      value: tagDetail.tableName,
    }, {
      title: '字段',
      value: tagDetail.fieldName,
    }]

    // 不同状态的相应map
    const tagMap = {
      0: <Tag status="wait" text="未使用" />,
      1: <Tag status="process" text="使用中" />,
    }

    return (
      <div>
        <Spin spinning={tagDetailLoading}>
          <DetailHeader
            name={tagDetail.name}
            descr={tagDetail.descr}
            baseInfo={baseInfo}
            tag={tagMap[tagDetail.isUsed]}
          />
        </Spin>
        <TabRoute tabs={[{name: '标签血缘', value: 1}]} />
        <div className="bgf m16" style={{height: 'calc(100vh - 298px)'}}>
          <TagRelate store={store} />
        </div>
      </div>
      
    )
  }
}
