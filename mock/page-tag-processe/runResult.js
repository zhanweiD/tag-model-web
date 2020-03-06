
module.exports = {
  success: true,
  message: null,
  code: '0',
  content: {
    result: {
      data: [
        {
          'goods_array_demo.goods': [{extid: '1300000050', name: '米饭'}, {extid: '1300000045', name: '剁椒带鱼'}],
          'goods_array_demo.userid': '1',
          'goods_array_demo.address': 'hangzhou',
          'goods_array_demo.ip': '127.0.0.1',
        },
      ],
      title: [
        {
          dataKey: 'goods_array_demo.userid',
        },
        {
          dataKey: 'goods_array_demo.ip',
        },
        {
          dataKey: 'goods_array_demo.address',
        },
        {
          dataKey: 'goods_array_demo.goods',
        },
      ],
    },
    totalSize: 1,
    taskInstanceId: 'fasdf',
    resultId: 1,
  },
}
