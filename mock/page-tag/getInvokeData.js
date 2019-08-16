// 成功的数据
module.exports = {
  success: true,
  message: null,
  code: '0',
  content: {
    title: null, 
    unit: '',   
    value: '',   
    xAxisUnit: null,
    yAxisUnit1: '',     
    yAxisUnit2: '',     
    tenantId: null,
    userId: null,
    success: null,
    data: [
      {
        key: 1557072000000,
        value: {
          apiCount: 100, // 调用api数
          apiInvokeCount: 3, // 被调用次数
        },
      },
      {
        key: 1557158400000,
        value: {
          apiCount: 10,   	
          apiInvokeCount: 300,
        },
      },
      {
        key: 1557244800000,
        value: {
          apiCount: 120,   	
          apiInvokeCount: 30,
        },
      },
    ],
    radixVal: null,
    radixPoint: null,
  },
}
