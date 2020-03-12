/**
 * @description 创建加工方案 - 预览保存
 */
import {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {toJS, action} from 'mobx'
import {Button} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'
import {scheduleTypeObj} from '../util'

@inject('rootStore')
@observer
export default class DrawerFour extends Component {
  constructor(props) {
    super(props)
    this.store = props.rootStore.drawerStore
    this.codeStore = props.rootStore.codeStore
  }

  @action.bound submitScheme() {
    const {usedTagIds} = this.codeStore 
    const {schemeDetail} = this.store
    
    this.store.submitScheme({
      id: schemeDetail.id,
      usedTagIds,
    })
  }

  getMajorTag = () => {
    const {
      schemeDetail: {
        mainTagMappingKeys, 
        obj,
      },
    } = this.store

    const majorObj = {}
    
    if (mainTagMappingKeys) {
      mainTagMappingKeys.forEach(d => {
        majorObj[d.objId] = d.columnName
      })
    } 

    return obj.map(d => ({
      title: d.name,
      value: majorObj[d.id],
    }))
  }

  render() {
    const {show} = this.props
    const {schemeDetail, submitLoading} = this.store
    const {
      mainTagMappingKeys,
      objName, 
      isPartitioned,
      partitionMappingKeys,
    } = schemeDetail

    const majorTag = mainTagMappingKeys && mainTagMappingKeys.length > 1 
      ? this.getMajorTag()
      : [{
        title: objName,
        value: mainTagMappingKeys && mainTagMappingKeys[0] && mainTagMappingKeys[0].columnName,
      }]

    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="preview-box">
          <div className="form-title ">基本信息</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '方案名称',
              value: schemeDetail.name,
            }, {
              title: '方案类型',
              value: 'TQL',
            }, {
              title: '所属对象',
              value: schemeDetail.objName,
            }, {
              title: '方案描述',
              value: schemeDetail.descr,
            }]} 
            className="ml32 mb24"
          />
          <div className="form-title">逻辑配置</div>
          <div className="FBH ml32 mb24">
            <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>TQL：</div>
            <div>{schemeDetail.source}</div>
          </div>
          {/* <NemoBaseInfo
            dataSource={[{
              title: 'TQL',
              value: schemeDetail.source,
            }]} 
            className="ml32 mb24"
          /> */}
          <div className="form-title">主标签配置</div>
          <NemoBaseInfo 
            dataSource={majorTag} 
            className="ml32 mb24"
          />
          <div className="form-title">分区配置</div>
          <NemoBaseInfo 
            dataSource={isPartitioned ? [{
              title: '设置分区',
              value: isPartitioned ? '是' : '否',
            }, {
              title: '分区字段名',
              value: partitionMappingKeys[0].partitionFieldName,
            }, {
              title: '分区字段值',
              value: partitionMappingKeys[0].partitionFieldValue,
            }] : [{
              title: '设置分区',
              value: isPartitioned ? '是' : '否',
            }]} 
            className="ml32 mb24"
          />
          <div className="form-title">调度配置</div>
          <NemoBaseInfo 
            dataSource={schemeDetail.scheduleType === 1 ? [{
              title: '调度类型',
              value: scheduleTypeObj[schemeDetail.scheduleType],
            }, {
              title: '调度周期',
              value: schemeDetail.period,
            }, {
              title: '调度时间',
              value: schemeDetail.periodTime,
            }] : [{
              title: '调度类型',
              value: scheduleTypeObj[schemeDetail.scheduleType],
            }]} 
            className="ml32 mb24"
          />
        </div>
       
       
        <div className="bottom-button">
          <Button
            type="primary"
            style={{marginRight: 8}}
            onClick={this.submitScheme}
            loading={submitLoading}
          >
            提交
          </Button>
        </div>
      </div>
    )
  }
}
