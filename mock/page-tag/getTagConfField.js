// 标签配置（字段 -> 标签） 表格数据
// http://192.168.90.87:9985/gateway/api/detail/be_tag/9a0f92c83d8f47aa9ff27e336ab6addd

module.exports = function () {
  // POST请求用函数貌似没法获得参数

  return {
    code: '0',
    content: [{
      id: 1,							
      dataStorageId: 'jdsjsjksjk212dsd',
      dataDbName: 'wangshu_test',		
      dataDbType: 4,					
      storageTypeName: 'HIVE',			
      dataTableName: 'demo',			
      dataFieldName: 'type1',			
      dataFieldType: 'string',		
      isConfigured: 0,
      isMajorKey: 1,
      isUsed: 0,
      tagId: '2',
      isEnum: 1,		
      enumValue: '',					
      valueType: 3,			
      name: '标签一',			
      enName: 'type1',			
      descr: 'string',		
      pathIds: [						
        5582112197129600,
        5593174605103488,
        5593179899953536,
        5593182423024000,
        5593182904451456,
        5593186126266752,
      ],	 
      isTrue: 1,
      result: '可创建',
        
    }, {
      id: 1,							
      dataStorageId: 'jdsjsjksjk212dsd',
      dataDbName: 'wangshu_test',		
      dataDbType: 4,					
      storageTypeName: 'HIVE',			
      dataTableName: 'demo',			
      dataFieldName: 'type2',			
      dataFieldType: 'string',	
      isConfigured: 1,
      isMajorKey: 0,
      isUsed: 1,
      tagId: '3',
      isEnum: 0,		
      enumValue: '',					
      valueType: 2,			
      name: '标签二',			
      enName: 'type1',			
      descr: 'string',		
      pathIds: [						
        5582112197129600,
        5593174605103488,
        5593179899953536,
        5593182423024000,
        5593182904451456,
        5593186126266752,
      ],	 
      isTrue: 0,
      result: '标签中文名未命名',
    }],
    success: true,
  }
}
