// 成功的数据
module.exports = {
  success: true,
  message: null,
  code: '0',
  content: [
    {
      id: 1,
      aId: 1111,
      type: 1, // 0 标签 1 类目 2 对象
      parentId: 0, // 上一级id，默认 0 即为顶层
      objTypeCode: 1,
      name: '中文名字',
      enName: '英文名',
      // parentId: 1,
      used: 0, // type 为 0 时候，标签是否被选择了，默认0 否； 1 是
      // type 为 0 时候，tag不为null
      tag: {
        id: 111113242,
        name: '标签中文名称',
        enName: '标签英文名',
        valueType: 1, // 1: 离散型 2：整数型 3: 小数型 4: 文本型 5: 日期型',
        valueTypeName: '离散型',
        is_enum: 0, // '是否枚举  1 是 0 否'
        enumValue: '',
        descr: 'dfdsafds',
      },
    },
    {
      id: 11,
      aId: 1111,
      type: 1, // 0 标签 1 类目 2 对象
      parentId: 0, // 上一级id，默认 0 即为顶层
      objTypeCode: 1,
      name: '中文名字1',
      enName: '英文名',
      // parentId: 1,
      used: 0, // type 为 0 时候，标签是否被选择了，默认0 否； 1 是
      // type 为 0 时候，tag不为null
      tag: {
        id: 111113242,
        name: '标签中文名称',
        enName: '标签英文名',
        valueType: 1, // 1: 离散型 2：整数型 3: 小数型 4: 文本型 5: 日期型',
        valueTypeName: '离散型',
        is_enum: 0, // '是否枚举  1 是 0 否'
        enumValue: '',
        descr: 'dfdsafds',
      },
    },
    {
      id: 2,
      aId: 222,
      type: 0,
      position: 0,
      objTypeCode: 1,
      name: '标签1',
      enName: '英文名',
      parentId: 1,
      used: 0, // type 为 0 时候，标签是否被选择了，默认0 否； 1 是
      // type 为 0 时候，tag不为null
      tag: {
        id: 2,
        name: '标签中文名称1',
        enName: '标签英文名',
        valueType: 1,
        valueTypeName: '离散型',
        is_enum: 0,
        enumValue: '枚举显示值',
        descr: 'dfdsafds',
      },
    },
    {
      id: 3,
      aId: 222,
      type: 0,
      position: 0,
      objTypeCode: 1,
      name: '标签2',
      enName: '英文名',
      parentId: 1,
      used: 0, // type 为 0 时候，标签是否被选择了，默认0 否； 1 是
      // type 为 0 时候，tag不为null
      tag: {
        id: 3,
        name: '标签中文名称2',
        enName: '标签英文名',
        valueType: 1,
        valueTypeName: '离散型',
        is_enum: 0,
        enumValue: '枚举显示值',
        descr: 'dfdsafds',
      },
    },
    {
      id: 4,
      aId: 222,
      type: 0,
      position: 0,
      objTypeCode: 1,
      name: '标签3',
      enName: '英文名',
      parentId: 1,
      used: 0, // type 为 0 时候，标签是否被选择了，默认0 否； 1 是
      // type 为 0 时候，tag不为null
      tag: {
        id: 4,
        name: '标签中文名称3',
        enName: '标签英文名',
        valueType: 1,
        valueTypeName: '离散型',
        is_enum: 0,
        enumValue: '枚举显示值',
        descr: 'dfdsafds',
      },
    },
    {
      id: 5,
      aId: 222,
      type: 0,
      position: 0,
      objTypeCode: 1,
      name: '标签4',
      enName: '英文名',
      parentId: 11,
      used: 0, // type 为 0 时候，标签是否被选择了，默认0 否； 1 是
      // type 为 0 时候，tag不为null
      tag: {
        id: 5,
        name: '标签中文名称4',
        enName: '标签英文名',
        valueType: 1,
        valueTypeName: '离散型',
        is_enum: 0,
        enumValue: '枚举显示值',
        descr: 'dfdsafds',
      },
    },
    {
      id: 6,
      aId: 222,
      type: 0,
      position: 0,
      objTypeCode: 1,
      name: '标签5',
      enName: '英文名',
      parentId: 11,
      used: 1, // type 为 0 时候，标签是否被选择了，默认0 否； 1 是
      // type 为 0 时候，tag不为null
      tag: {
        id: 6,
        name: '标签中文名称5',
        enName: '标签英文名',
        valueType: 1,
        valueTypeName: '离散型',
        is_enum: 0,
        enumValue: '枚举显示值',
        descr: 'dfdsafds',
      },
    },
  ],
}
