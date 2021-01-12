import intl from 'react-intl-universal'

const statusMap = [
  {
    name: intl
      .get(
        'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.08rkfw56dlng'
      )
      .d('已配置'),
    value: 1,
  },
  {
    name: intl
      .get(
        'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.k6tc0vxgvc'
      )
      .d('待配置'),
    value: 0,
  },
]

const serach = ({
  tableName,
  dataSourceList,
  dataSheetList,
  selectDataSource,
}) => [
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.9mzk7452ggp')
      .d('数据源'),
    key: 'storateId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: dataSourceList.slice(),
      onSelect: v => selectDataSource(v),
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.page-manage.page-aim-source.source-list.main.bh6e3tzii5')
      .d('数据表'),
    key: 'tableName',
    initialValue: tableName || '',
    control: {
      defaultAll: true,
      options: dataSheetList.slice(),
    },

    component: 'select',
  },
  {
    label: intl
      .get(
        'ide.src.page-manage.page-tag-model.data-sheet.config-field-step-one.l46g9vfk2k'
      )
      .d('配置状态'),
    key: 'isConfigured',
    initialValue: '',
    control: {
      defaultAll: true,
      options: statusMap.slice(),
    },

    component: 'select',
  },
  {
    label: intl
      .get('ide.src.business-component.tag-relate.dag-box.co39wa8uxw5')
      .d('字段名称'),
    key: 'keyword',
    component: 'input',
  },
]

export default serach
