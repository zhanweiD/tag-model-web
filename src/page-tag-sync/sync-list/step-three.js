import {Component} from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import {Button, Tag} from 'antd'
import NemoBaseInfo from '@dtwave/nemo-base-info'

@observer
export default class StepThree extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  render() {
    const {show} = this.props
    const {previewData} = this.store

    const {
      name,
      objId = {},
      descr,
      dataDbType = {},
      dataStorageId = {},
      tableName,
    } = previewData
    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="preview-box">
          <div className="info-title ">基本信息</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '方案名称',
              value: name,
            }, {
              title: '同步对象',
              value: objId.label,
            }, {
              title: '方案描述',
              value: descr,
            }]}
            className="ml24 mb24"
          />
          <div className="info-title ">配置目的源</div>
          <NemoBaseInfo 
            dataSource={[{
              title: '数据源类型',
              value: dataDbType.label,
            }, {
              title: '数据源',
              value: dataStorageId.label,
            }, {
              title: '表',
              value: tableName,
            }]}
            className="ml24 mb24"
          />
          <div className="info-title ">主标签配置</div>
          <NemoBaseInfo 
            dataSource={[].map(d => ({
              title: d.objName,
              value: d.columnName,
            }))}
            className="ml24 mb24"
          />
          <div className="info-title ">配置同步标签</div>
          <div className="FBH ml24 mb24">
            <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>同步标签总数：</div>
            <div>{previewData.tagTotalCount}</div>
          </div>
          <div className="FBH ml24 mb24">
            <div style={{color: ' rgba(0, 0, 0, 0.45)'}}>同步标签：</div>
            <div>{[].map(d => <Tag>{d}</Tag>)}</div>
          </div>
        </div>
       
        <div className="bottom-button">
          <Button
            type="primary"
            // style={{marginRight: 8}}
            // onClick={this.nextStep}
          >
            提交
          </Button>
        </div>
      </div>
    )
  }
}
