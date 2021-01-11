import intl from 'react-intl-universal'
import React from 'react'
import { observer } from 'mobx-react'
import { action, toJS } from 'mobx'
import { Table, Badge, Switch } from 'antd'
import { QuestionTooltip } from '../../../component'

const columns = [
  {
    title: intl
      .get('ide.src.business-component.tag-relate.dag-box.bhzleo4vj5g')
      .d('字段'),
    key: 'dataFieldName',
    dataIndex: 'dataFieldName',
  },

  {
    title: intl
      .get('ide.src.business-component.tag-relate.dag-box.xr0hezmhuj')
      .d('字段类型'),
    key: 'dataFieldType',
    dataIndex: 'dataFieldType',
  },

  {
    title: intl
      .get(
        'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.l46g9vfk2k'
      )
      .d('配置状态'),
    key: 'isConfigured',
    dataIndex: 'isConfigured',
    render: v =>
      +v === 1 ? (
        <Badge
          color="#52C41A"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.08rkfw56dlng'
            )
            .d('已配置')}
        />
      ) : (
        <Badge
          color="rgba(0,0,0,0.25)"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.k6tc0vxgvc'
            )
            .d('待配置')}
        />
      ),
  },

  {
    title: (
      <span>
        {intl
          .get(
            'ide.src.page-manage.page-aim-source.source-detail.main.16o5qwy427p'
          )
          .d('标签状态')}

        <QuestionTooltip
          tip={intl
            .get(
              'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.ei6a3d394f'
            )
            .d('字段绑定的标签是否发布')}
        />
      </span>
    ),

    key: 'status',
    dataIndex: 'status',
    render: v =>
      +v === 2 ? (
        <Badge
          color="#1890FF"
          text={intl
            .get('ide.src.page-manage.page-object-model.detail.mayalaiwna')
            .d('已发布')}
        />
      ) : (
        <Badge
          color="rgba(0,0,0,0.25)"
          text={intl
            .get(
              'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.kpitwb1mdsn'
            )
            .d('未发布')}
        />
      ),

    width: '11%',
  },
]

// 标签配置 - 选择字段
@observer
class StepOne extends React.Component {
  componentDidMount() {
    const { store } = this.props
    store.getInitialList()
  }

  @action.bound onSwitchChange(checked) {
    const { store } = this.props

    if (checked) {
      store.tableData = store.initialList.filter(d => d.status !== 2)
    } else {
      store.tableData = toJS(store.initialList)
    }
  }

  render() {
    const { store } = this.props

    const selectedRowKeys = store.secondTableList.map(
      item => item.dataFieldName
    )

    return (
      <div>
        {/* <div className="fs16 mb8 ml2" style={{color: 'rgba(0,0,0,0.85)'}}>
           字段列表
          </div> */}
        <div className="fs12 mb8 ml2">
          <span className="mr8">
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.2t0e7l5jdww'
              )
              .d('仅展示未发布')}
          </span>
          <Switch
            size="small"
            defaultChecked
            checkedChildren={intl
              .get('ide.src.component.form-component.03xp8ux32s3a')
              .d('是')}
            unCheckedChildren={intl
              .get('ide.src.component.form-component.h7p1pcijouf')
              .d('否')}
            onChange={this.onSwitchChange}
          />
        </div>
        <Table
          loading={store.loadings.firstTable}
          columns={columns}
          dataSource={store.tableData}
          rowKey="dataFieldName"
          rowSelection={{
            selectedRowKeys,
            onChange: this.onRowSelect,
            getCheckboxProps(value) {
              return {
                defaultChecked: false,
                disabled: +value.status === 2, // 标签被使用 或者 标签已发布不能操作
              }
            },
          }}
          pagination={false}
          // TODO:表格滚动
          // scroll={{x: false, y: 500}}
          // style={{
          //   height: 500,
          // }}
        />
      </div>
    )
  }

  // 选择行，更新store中选择的字段
  @action.bound onRowSelect(selectedRowKeys, selectedRows) {
    const { store } = this.props

    store.updateSecondTableList(selectedRows)
  }
}
export default StepOne
