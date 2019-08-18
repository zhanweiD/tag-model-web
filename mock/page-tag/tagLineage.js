// 标签配置所属类目
// 标签池-获取标签可移动的标签类目树

module.exports = {
  success: true,
  message: null,
  code: '0',
  content: {
    links: [
      {
        u: '12',
        v: '5615671508857984',
      },
      {
        u: '5615671508857984',
        v: '360',
      },
      {
        u: '5615671508857984',
        v: '361',
      },
      {
        u: '5615671508857984',
        v: '362',
      },
      {
        u: '360',
        v: '160',
      },
    ],
    nodes: [
      {
        tableName: 'demo',
        storageName: 'ws_oracle',
        entityId: 12,		
        entityName: 'age',
        fieldType: 'string',
        nodeType: 0, // 0 字段 1 标签 2 api 3 应用
      },
      {
        entityId: 5615671508857984,
        entityName: '交易金额',
        nodeType: 1,
      },
      {
        entityId: 360,
        entityName: 'api名称1',
        nodeType: 2,
      },
      {
        entityId: 361,
        entityName: 'api名称2',
        nodeType: 2,
      },
      {
        entityId: 362,
        entityName: 'api名称3',
        nodeType: 2,
      },
      {
        entityId: 160,
        entityName: 'api应用1',
        nodeType: 3,
      },
    ],
  },
}
