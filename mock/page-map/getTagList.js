// 获取标签列表

module.exports = {
  "success":true,
  "message":null,
  "code":"0",
  "content":{
      "pageSize":10,
      "currentPage":1,
      "totalCount":1,
      "data":[
          {
             "id":1,        //  --标签id
             "name":"标签名称",
             "objId":2,       //   --对象id
             "valueType":1,          //     --标签数据类型
             "valueTypeName":"离散型",   //      --标签数据类型名称
             "worthScore":54,        //   --价值分
             "qualityScore":60,      //    --质量分
             "hotScore":45,          //      --热度
             "creatorId":1,          //           --创建人id
             "creator":"创建人",//
             "isUsed":1,            //           --是否被使用 1 是 0 否
             "apiInvokeCount":123    // --被api调用次数
          }
      ]
  }
}