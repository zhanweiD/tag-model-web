/**
 * @description 标签仓库 - 标签详情
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {Spin, Tabs} from 'antd'
import * as navListMap from '../../common/navList'
import {DetailHeader} from '../../component'
import {Time} from '../../common/util'
import TagAnalyze from '../../business-component/tag-analyze'
import TagrRelate from '../../business-component/tag-relate'
import StorageList from './storage-list'
import AppList from './app-list'

import store from './store'

const {TabPane} = Tabs

// 面包屑设置
// eslint-disable-next-line no-underscore-dangle
const navList = [
  navListMap.tagCenter,
  navListMap.tagWarehouse,
  navListMap.tagDetail,
]

// @inject('frameChange')
@observer
export default class TagDetail extends Component {
  constructor(props) {
    super(props)
    const {match} = props
    store.tagId = match.params.id // 标签id
  }
  
  componentWillMount() {
    // // 面包屑设置
    // const {frameChange} = this.props
    // frameChange('nav', navList)

    store.getTagBaseDetail()
  }

  render() {
    const {tagDetailLoading, tagBaseInfo, tagId} = store

    const baseInfo = [{
      title: '对象',
      value: tagBaseInfo.objName,
    }, {
      title: '唯一标识',
      value: tagBaseInfo.enName,
    }, {
      title: '数据类型',
      value: tagBaseInfo.valueTypeName,
    }, {
      title: '是否枚举',
      value: tagBaseInfo.isEnum ? '是' : '否',
    }, {
      title: '创建者',
      value: tagBaseInfo.creator,
    }, {
      title: '创建时间',
      value: <Time timestamp={tagBaseInfo.createTime} />,
    }, {
      title: '数据源',
      value: tagBaseInfo.dataSource,
    }, {
      title: '数据表',
      value: tagBaseInfo.tableName,
    }, {
      title: '字段',
      value: tagBaseInfo.fieldName,
    }]

    return (
      <div>
        <Spin spinning={tagDetailLoading}>
          <DetailHeader
            name={tagBaseInfo.name}
            descr={tagBaseInfo.descr}
            baseInfo={baseInfo}
          />
        </Spin>
        <Tabs defaultActiveKey="1" className="comp-tab">
          <TabPane tab="标签分析" key="1">
            <div className="bgf m16" style={{height: 'calc(100vh - 298px)'}}>
              <TagAnalyze tagId={tagId} />
            </div>
          </TabPane>
          <TabPane tab="血缘分析" key="2">
            <div className="bgf m16" style={{height: 'calc(100vh - 298px)'}}>
              <TagrRelate tagId={tagId} />
            </div>
          </TabPane>
          <TabPane tab="目的源列表" key="3">
            <div className="bgf m16" style={{height: 'calc(100vh - 298px)'}}>
              <StorageList tagId={tagId} />
            </div>
   
          </TabPane>
          <TabPane tab="标签应用列表" key="4">
            <div className="bgf m16" style={{height: 'calc(100vh - 298px)'}}>
              <AppList tagId={tagId} />
            </div>
          </TabPane>
        </Tabs>
      </div>
      
    )
  }
}
