
const statusMap = [{
  name: '已配置',
  value: 1,
}, {
  name: '待配置',
  value: 0,
}]

const serach = ({
  tableName, dataSourceList, dataSheetList, selectDataSource,
}) => [
  {
    label: '数据源',
    key: 'storateId',
    initialValue: '',
    control: {
      defaultAll: true,
      options: dataSourceList.slice(),
      onSelect: v => selectDataSource(v),
    },
    component: 'select',
  }, {
    label: '数据表',
    key: 'tableName',
    initialValue: tableName || '',
    control: {
      defaultAll: true,
      options: dataSheetList.slice(),
    },
    component: 'select',
  }, {
    label: '配置状态',
    key: 'isConfigured',
    initialValue: '',
    control: {
      defaultAll: true,
      options: statusMap.slice(),
    },
    component: 'select',
  }, {
    label: '字段名称',
    key: 'keyword',
    component: 'input',
  },
]
export default serach
