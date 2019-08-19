import React from 'react'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import PropTypes from 'prop-types'
import {
  Row, Col, Table,
} from 'antd'
import EchartsChart from '../component-echarts-chart'
import {getLineChartOption} from './util'
import OmitTooltip from '../component-omit-tooltip'

function typeToText(type = 'worth') {
  switch (type) {
    case 'hot':
      return '热度'
    case 'quality':
      return '质量分'
    default:
      return '价值分'
  }
}

/**
 * @description 标签价值、热度、质量的panel
 * @author 三千
 * @date 2019-08-12
 * @export
 * @class OverviewScorePanel
 * @extends {React.Component}
 */
@observer
export default class OverviewScorePanel extends React.Component {
  static propTypes = {
    // store
    type: PropTypes.string.isRequired, // 哪个panel，worth、hot、quality
    lineData: PropTypes.array, 
    tableData: PropTypes.array,
    currentPage: PropTypes.number,
    // pageSize: PropTypes.number,
    totalCount: PropTypes.number,
    onTableChange: PropTypes.func,
    tableLoading: PropTypes.bool, // 表格加载
  }

  static defaultProps = {
    // type: 'worth',
    lineData: [],
    tableData: [],
    currentPage: 1,
    // pageSize: 5,
    totalCount: 0,
    onTableChange: undefined,
    tableLoading: false,
  }

  tableColumns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      render: (v, record, index) => index + 1,
    },
    {
      title: '标签名',
      dataIndex: 'name',
      key: 'name',
      render: name => <OmitTooltip text={name} maxWidth={200} />,
    },
    {
      title: `标签${typeToText(this.props.type)}`,
      dataIndex: 'score',
      key: 'score',
      width: 80,
      sorter: true,
    },
  ]

  render() {
    const {
      type,
      lineData,
      tableData,
      currentPage,
      // pageSize,
      totalCount,
      onTableChange,
      tableLoading,
    } = this.props

    const typeText = typeToText(type)
    const lineOption = getLineChartOption(lineData)

    return (
      <Row gutter={48} style={{height: '400px', padding: '16px 24px 24px 24px'}}>
        <Col span={15}>
          <div className="fs14 mb12">{`标签平均${typeText}趋势`}</div>
          <EchartsChart
            option={lineOption}
            height={340}
            compareValues={[toJS(lineData)]}
          />
        </Col>
        <Col span={9}>
          <div className="fs14 mb12">{`标签${typeText}Top20排名`}</div>
          <Table
            loading={tableLoading}
            dataSource={tableData}
            columns={this.tableColumns}
            pagination={{
              current: +currentPage,
              pageSize: 5,
              total: Math.min(+totalCount, 20),
              size: 'small',
            }}
            onChange={onTableChange}
          />
        </Col>
      </Row>
    )
  }
}
