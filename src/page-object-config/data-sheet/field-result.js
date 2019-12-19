import {Component, Fragment} from 'react'
import {observer} from 'mobx-react'
import {Button, Icon, Spin} from 'antd'

const LabelItem = ({label, value}) => (
  <div>
    <span className="mr8">{`${label}: `}</span>
    <span>{value}</span>
  </div>
)

@observer
export default class FieldResult extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  closeDrawer = () => {
    this.store.closeDrawer()
  }

  render() {
    const {show} = this.props
    const {successInfo, successInfoLoading, drawerType} = this.store
    return (
      <div style={{display: show ? 'block' : 'none'}}>
        <div className="field-result">
          <div className="mb24 fac">
            <Icon type="check-circle" theme="filled" style={{color: '#52C41A', fontSize: 72}} />
          </div>
          <div className="fs24 mb48 fac" style={{color: 'rgba(0,0,0,0.85)'}}>添加成功</div>
          <div className="field-result-info">
            <Spin spinning={successInfoLoading}>
              <LabelItem label="数据源" value={successInfo.dataStorageName} />
              <LabelItem label="数据表" value={successInfo.dataTableName} />
              <LabelItem label="关联的主键" value={successInfo.mappingKey} />
              {
                drawerType === 'edit' ? (
                  <Fragment>
                    <LabelItem
                      label="取消关联字段数" 
                      value={successInfo.deleteFieldCount}
                    />
                    <LabelItem
                      label="添加关联字段数" 
                      value={successInfo.addFieldCount}
                    />
                  </Fragment>
                ) : (
                  <LabelItem 
                    label="已选字段数/字段总数" 
                    value={`${successInfo.configuredField} / ${successInfo.totalField}`}
                  />
                )
              }
              
            </Spin>
          </div>
        </div>
        <div className="bottom-button">
          <Button onClick={this.closeDrawer} type="primary">
            确定
          </Button>
        </div>
      </div>
    )
  }
}
