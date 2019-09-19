### DtNewCard

```
<Card 
    title="这是一个卡片"
    link="http://gitlab.dtwave-inc.com/oner/oner-uikit" 
    tag={[<Tag color="blue">使用中</Tag>]}
    labelList={[{
      label: '创建者',
      value: "麻花",
    }, {
      label: '创建时间',
      value: "2019-9-19 22:22:22",
    }]}
    descr="这是一个描述, 可能会很长。但是我有..."
    countList={[{
      label: '标题1',
      value: 8,
    }, {
      label: '标题2',
      value: 8,
    }, {
      label: '标题3',
      value: 8,
    }]}
    actions={[
      <Button 
        type="link" // antd@Button 属性
        onClick={() => {}}
      >
        编辑
      </Button>,
      <Button 
        type="link" // antd@Button 属性
        onClick={() => {}}
      >
        删除
      </Button>,
    ]}
  />
```

| 配置项           |  类型               |   必填   | 默认值        | 功能/备注  |
| --------        | :----:             | :------: | :----:       | :------ |
| title           | string             | option   |  -             | 名称  |
| link            | string             | option   |  -      |  卡片点击跳转链接  |
| tag             | Array<ReactNode>   | option   |  -             | 卡片状态标签  |
| labelList       | Array<{label: string, value: string}>   | option   |  -      |  基本信息eg：创建者、创建时间 |
| descr           | string             | option   |  -    | 描述信息
| countList       | Array<{label: string, value: number}>   | option   |  - |  指标数量信息；eg: {label: 标签数, value: 23} |
| actions         | Array<ReactNode>   | option   |  -            |  卡片操作组
| hasDescr        | boolean            | option   |  true            | 卡片是否存在描述, 用于区分“无描述”与“存在描述, 描述为空”情况  |

说明: 搭配@dtwave/uikit/DtGrid 使用；***Card*** hover样式需要写在业务代码文件中；***DtGrid***组件升级过度可以规避此问题。使用方法 举个🌰
```
 // 覆盖DtDrid hover效果属性; DtDrid组件需要优化
  .dt-grid .dt-row .dt-item
    border-radius 4px
    -webkit-transition all .3s linear
    transition all .3s linear
    
    &:not(.dt-grid-empty):hover
      -webkit-box-shadow 0px 3px 10px #DDE0E4
      box-shadow 0px 3px 10px #DDE0E4
      -webkit-transform translate3d(0, -2px, 0)
      transform translate3d(0, -2px, 0)
```
