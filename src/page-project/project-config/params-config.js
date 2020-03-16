/**
 * @description 项目配置 -  参数配置
 */
import {Component} from 'react'
import {observer} from 'mobx-react'
import {Alert, Table} from 'antd'
// import {getDataTypeName} from '../../common/util'

@observer
export default class ParamsConfig extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  componentWillMount() {
    this.store.getParamsList()
  }

  columns = [{
    title: '姓名',
    dataIndex: 'parameterName',
  }, {
    title: '类型',
    dataIndex: 'parameterType',
    // render: text => getDataTypeName(+text),
    render: () => '日期型',
  }, {
    title: '时间格式',
    dataIndex: 'parameterValue',
  }, {
    title: '描述',
    dataIndex: 'descr',
  }]

  render() {
    const {paramsList} = this.store
    return (
      <div>
        <Alert 
          message="系统参数为平台内置参数，不需要做额外的赋值动作，标签加工方案运行的时候就会自动替换。支持调用的方式如：${bizDate},${bizDate+/-m}，m为正整数。"
          type="info"
          showIcon
          className="alert-info"
        />
        <Table 
          columns={this.columns}    
          dataSource={paramsList} 
          pagination={false}
          className="m24"
        />

      </div>
    )
  }
}
