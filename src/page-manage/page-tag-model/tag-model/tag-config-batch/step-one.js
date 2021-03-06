import intl from 'react-intl-universal'
import { Component } from 'react'
import { observer } from 'mobx-react'
import { Button, Select, Switch, Table, Badge } from 'antd'
import { action, toJS } from 'mobx'
import { tagConfigMethodMap } from '../util'
import { getDataTypeName } from '../../../../common/util'

const { Option } = Select

@observer
class StepOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store

    // this.store.getConfigTagList()
  }

  columns = [
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.63kvhqd3cw8'
        )
        .d('标签名称'),
      dataIndex: 'name',
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xs30zaqk60p')
        .d('标签标识'),
      dataIndex: 'enName',
    },
    {
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.zfaw0a4v7jh')
        .d('数据类型'),
      dataIndex: 'valueType',
      render: text => getDataTypeName(text),
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.l46g9vfk2k'
        )
        .d('配置状态'),
      dataIndex: 'configStatus',
      render: text =>
        text ? (
          <Badge
            color="#87d068"
            text={intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.08rkfw56dlng'
              )
              .d('已配置')}
          />
        ) : (
          <Badge
            color="#d9d9d9"
            text={intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.k6tc0vxgvc'
              )
              .d('待配置')}
          />
        ),
    },
    {
      title: intl
        .get(
          'ide.src.page-manage.page-aim-source.source-detail.main.16o5qwy427p'
        )
        .d('标签状态'),
      dataIndex: 'deployStatus',
      render: text => (
        <div>
          {text === 1 && (
            <Badge
              color="#d9d9d9"
              text={intl
                .get('ide.src.page-manage.page-object-model.detail.3fpa4r1400q')
                .d('待发布')}
            />
          )}

          {text === 2 && (
            <Badge
              color="#87d068"
              text={intl
                .get('ide.src.page-manage.page-object-model.detail.mayalaiwna')
                .d('已发布')}
            />
          )}
        </div>
      ),
    },
  ]

  @action.bound nextStep() {
    this.store.nextStep()
  }

  // @action.bound objectSelect(v) {
  //   this.store.objId = v
  //   this.store.getConfigTagList()
  // }

  @action.bound boundMethodSelect(v) {
    this.store.boundMethodId = v
    this.store.getConfigTagList()
  }

  @action.bound switchChange(v) {
    this.store.isShowPublished = v
  }

  @action.bound onTableCheck(keys, rows) {
    // 表格 - 已选项
    // this.store.selectedRowKeys = rows

    // 表格 - 已选项key数组
    this.store.selectedRowKeys = keys
  }

  render() {
    const { show, closeDrawer, objectSelectList } = this.props
    const {
      objId,
      boundMethodId,
      selectedRowKeys,
      configTagList,
      isShowPublished,
    } = this.store
    const dataSource = isShowPublished
      ? configTagList
      : configTagList.filter(d => d.deployStatus < 2)

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onTableCheck,
      getCheckboxProps: record => ({
        disabled: record.deployStatus === 2 || record.configStatus === 1,
      }),
    }

    const tableConfig = {
      rowSelection,
      columns: this.columns,
      dataSource,
      pagination: false,
      rowKey: 'id',
    }

    return (
      <div style={{ display: show ? 'block' : 'none' }}>
        <div className="mb24">
          {/* <span className="search-label">对象</span>
            <Select value={objId} style={{width: 240}} onChange={this.objectSelect} placeholder="请选择" showSearch optionFilterProp="children">
             {
               objectSelectList.map(
                 ({value, name}) => (
                   <Option 
                     key={value} 
                     value={value}
                   >
                     {name}
                   </Option>
                 )
               )
             }
            </Select> */}
          <span className="search-label ml16">
            {intl
              .get(
                'ide.src.page-manage.page-common-tag.detail.main.2ziwjluj78c'
              )
              .d('绑定方式')}
          </span>
          <Select
            value={boundMethodId === '' ? '' : +boundMethodId}
            style={{ width: 240 }}
            onChange={this.boundMethodSelect}
            showSearch
            optionFilterProp="children"
          >
            {tagConfigMethodMap.map(({ name, value }) => (
              <Option key={value} value={value}>
                {name}
              </Option>
            ))}
          </Select>
          <span className="fs12 ml24 mr8">
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.tag-model.tag-config-batch.step-one.xh0uieuqz7m'
              )
              .d('展示标签状态为已发布的标签')}
          </span>
          <Switch
            size="small"
            checkedChildren={intl
              .get('ide.src.component.form-component.03xp8ux32s3a')
              .d('是')}
            unCheckedChildren={intl
              .get('ide.src.component.form-component.h7p1pcijouf')
              .d('否')}
            onChange={this.switchChange}
          />
        </div>
        <div>
          <Table {...tableConfig} />
        </div>

        <div className="bottom-button">
          <Button style={{ marginRight: 8 }} onClick={() => closeDrawer()}>
            {intl
              .get('ide.src.component.modal-stroage-detail.main.ph80bkiru5h')
              .d('关闭')}
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={this.nextStep}
            disabled={!selectedRowKeys.length}
          >
            {intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field.kpiieqt46x'
              )
              .d('下一步')}
          </Button>
        </div>
      </div>
    )
  }
}
export default StepOne
