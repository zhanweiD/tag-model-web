// 标签配置所属类目
// 标签池-获取标签可移动的标签类目树

module.exports = {
  success: true,
  message: null,
  code: '0',
  content: [
    {
      id: 1,
      aId: 1,				
      type: 2,			
      position: 0,		    
      objTypeCode: 1,				
      name: '客户',	
      enName: 'customer',
      parentId: 0,
      isLeaf: 0,
      canEdit: 1,  
      canDelete: 1,  
      canAddTag: 0,  
      canAddCate: 1,  
      tagCount: 100,
    },
    {
      id: 2,
      aId: -1,				
      type: 1,			
      position: 0,		    
      objTypeCode: 1,				
      name: '默认类目',	
      enName: 'default_cate',
      parentId: 1,
      isLeaf: 2,
      canEdit: 0,  
      canDelete: 0,  
      canAddTag: 1,  
      canAddCate: 0,  
      tagCount: 0,
    },
  ],
}
