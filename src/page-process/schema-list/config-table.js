import intl from 'react-intl-universal'
import { Component } from 'react'
import { Tabs, Button, Radio, Card, Input } from 'antd'
import { action, toJS } from 'mobx'
import { inject, observer } from 'mobx-react'

import { ListContent } from '../../component'

const { Search } = Input
@inject('store')
@observer
class ConfigDrawerOne extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
  }

  columns = [
    {
      key: 'fieldName',
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.co39wa8uxw5')
        .d('字段名称'),
      dataIndex: 'fieldName',
    },
    {
      key: 'fieldType',
      title: intl
        .get('ide.src.business-component.tag-relate.dag-box.xr0hezmhuj')
        .d('字段类型'),
      dataIndex: 'fieldType',
    },
    {
      key: 'tagFieldId',
      title: intl
        .get(
          'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.l46g9vfk2k'
        )
        .d('配置状态'),
      dataIndex: 'tagFieldId',
      render: text =>
        text
          ? intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.08rkfw56dlng'
              )
              .d('已配置')
          : intl
              .get('ide.src.page-process.schema-list.config-table.v0yomx1i6fk')
              .d('未配置'),
    },
    {
      key: 'status',
      title: intl
        .get('ide.src.page-process.schema-list.config-table.8djz7ggbb12')
        .d('发布状态'),
      dataIndex: 'status',
      render: text =>
        text === 2
          ? intl
              .get('ide.src.page-manage.page-object-model.detail.mayalaiwna')
              .d('已发布')
          : intl
              .get(
                'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.kpitwb1mdsn'
              )
              .d('未发布'),
    },
  ]

  // 字段搜索
  @action searchFiled = v => {
    this.store.fieldName = v
    this.store.getList()
    this.store.recordObj = {}
  }

  // 选中字段
  @action selectField = obj => {
    this.store.getTagTypeList(obj)

    this.store.recordObj = obj
    this.store.tagBaseInfo = {}
    this.store.release = obj.status === 2
    this.store.isEnum = !!obj.isEnum
    this.store.isNewTag = !obj.tagFieldId
    this.store.isConfig = obj.tagFieldId

    this.store.getTagCateSelectList() // 获取标签类目列表
    if (obj.tagFieldId) this.store.getTagBaseDetail()
    if (this.store.form) this.store.form.resetFields()
  }

  // 显示全部，隐藏已发布
  @action showAll = () => {
    const { list, pagination, hiddenRel, tabChange, tabValue } = this.store
    if (hiddenRel) {
      tabChange(tabValue)
    } else {
      this.store.list = list.filter(item => item.status !== 2)
      pagination.totalCount = this.store.list.length
      this.store.recordObj = {}
    }
    this.store.hiddenRel = !hiddenRel
  }

  @action setSelect = record => {
    console.log(record.fieldName, this.store.recordObj.fieldName)
    const { fieldName } = this.store.recordObj
    return record.fieldName === fieldName ? 'ant-table-row-selected' : null
  }

  render() {
    const {
      allList,
      configNum,
      processId,
      fieldName,
      tableLoading,
      tabChange,
      tabValue,
      hiddenRel,
      totalCount,
    } = this.store

    const listConfig = {
      initParams: {
        id: processId,
        fieldName,
      },

      hasPaging: false,
      tableLoading,
      onRow: record => ({
        onClick: () => this.selectField(record),
      }),

      columns: this.columns,
      // initGetDataByParent: true, // 初始请求 在父层组件处理。列表组件componentWillMount内不再进行请求
      store: this.store, // 必填属性
      pagination: {
        totalCount,
        currentPage: 1,
        // pageSize: 10,
      },
    }

    const allListLength = allList.length
    return (
      <div className="config-table">
        <Radio.Group value={tabValue} onChange={v => tabChange(v.target.value)}>
          <Radio.Button value={1}>
            {intl
              .get(
                'ide.src.page-process.schema-list.config-table.1wmh1iuzsh2',
                { allListLength: allListLength }
              )
              .d('全部({allListLength})')}
          </Radio.Button>
          <Radio.Button value={2}>
            {intl
              .get(
                'ide.src.page-process.schema-list.config-table.nrxr2ulwcv8',
                { configNum: configNum }
              )
              .d('已配置({configNum})')}
          </Radio.Button>
          <Radio.Button value={0}>{`待配置(${allListLength -
            configNum})`}</Radio.Button>
        </Radio.Group>

        <Card
          size="small"
          title={intl
            .get(
              'ide.src.page-manage.page-aim-source.source-detail.main.yjl6a0fdf2l'
            )
            .d('字段列表')}
          extra={
            <a href onClick={this.showAll}>
              {hiddenRel
                ? intl
                    .get(
                      'ide.src.page-process.schema-list.config-table.1yk8r0ujgpm'
                    )
                    .d('显示全部')
                : intl
                    .get(
                      'ide.src.page-process.schema-list.config-table.hyvairvkdwj'
                    )
                    .d('隐藏已发布')}
            </a>
          }
          style={{ width: 525, height: 660, marginTop: '16px' }}
        >
          <Search
            placeholder={intl
              .get('ide.src.page-process.schema-list.config-table.b8zwfzrcze6')
              .d('请输入字段名称查询')}
            onSearch={value => this.searchFiled(value)}
            style={{ margin: '4px 0 16px 0' }}
          />

          <div className="list-content not-p">
            <ListContent {...listConfig} />
          </div>
        </Card>
      </div>
    )
  }
}
export default ConfigDrawerOne
