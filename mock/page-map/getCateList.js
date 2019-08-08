// 获取指定场景下的类目列表

module.exports = {
  "success":true,
  "message":null,
  "code":"0",
  "content":[
            {
          "id":0,				//标签类目Id  非叶子
          "name":"类目名称",
          "parentId":0,		//父类目Id
          "isLeaf":0,             //0 未定义 1 非叶子类目 2 叶子类目
      },
      {
          "id":1,				//标签类目Id
          "name":"类目名称",
          "parentId":0,		//父类目Id
          "isLeaf":1,             //0 未定义 1 非叶子类目 2 叶子类目
      }
  ]
}