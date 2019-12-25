/* type和相应antd组件映射 */
import React from 'react'
import * as antd from 'antd'
import {isArray} from 'util'

const createInputPlaceholder = label => (label ? `请输入${label}` : undefined) // 生成input默认的Placeholder值

const createSelectPlaceholder = label => (label ? `请选择${label}` : undefined) // 生成select默认的Placeholder值


const SelectTypes = ({
  label, placeholder, options = [], ...rest
}) => {
  const mergeOption = options
  if (isArray(options) && !options.length && rest.defaultAll) {
    mergeOption.unshift({
      name: '全部',
      value: '',
    })
  }
  if (options.length && options[0].name !== '全部' && rest.defaultAll) {
    mergeOption.unshift({
      name: '全部',
      value: '',
    })
  }
  return (
    <antd.Select 
      placeholder={placeholder || createSelectPlaceholder(label)} 
      getPopupContainer={triggerNode => triggerNode.parentElement}
      // notFoundContent={rest.selectLoading ? <antd.Spin size="small" /> : <div>暂无数据源</div>}
      {...rest}
    >
      {
        options && options.map(({name, ...optionProps}) => (
          <antd.Select.Option key={optionProps.value} {...optionProps}>{name}</antd.Select.Option>
        ))
      }
    </antd.Select>
  )
}

const createTreeNode = (data = [], valueName, titleName, selectCon) => {
  if (!data.length) return null

  return data.map(node => (
    <antd.TreeSelect.TreeNode
      value={valueName ? node[valueName] : node.aId}
      title={titleName ? node[titleName] : node.name}
      key={node.aId}
      selectable={selectCon ? (node[selectCon[0]] === selectCon[1]) : node.isLeaf === 2}
    >
      {
        createTreeNode(node.children, valueName, titleName, selectCon)
      }
    </antd.TreeSelect.TreeNode>
  ))
}

/**
 * @description 根据type返回相应antd控件
 */ 
export default ({
  type, label, placeholder, options, ...rest
}) => {
  const map = {
    text: <span>{options}</span>,
    input: <antd.Input placeholder={placeholder || createInputPlaceholder(label)} {...rest} />,
    textArea: <antd.Input.TextArea rows={4} placeholder={placeholder || createInputPlaceholder(label)} {...rest} />,
    select: <SelectTypes label={label} placeholder={placeholder || createSelectPlaceholder(label)} options={options} {...rest} />,
    rangePicker: <antd.DatePicker.RangePicker {...rest} />,
    selectTree: () => (
      <antd.TreeSelect
        placeholder={placeholder || createSelectPlaceholder(label)}
        dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
        allowClear
        // multiple
        treeDefaultExpandAll
        treeNodeFilterProp="title"
        {...rest}
      >
        {
          createTreeNode(options, rest.valueName, rest.titleName, rest.selectCon)
        }
      </antd.TreeSelect>
    ), 
    switch: <antd.Switch 
      checkedChildren={rest.checkedText || '是'} 
      unCheckedChildren={rest.unCheckedText || '否'} 
      {...rest}
    />,
    cascader: <antd.Cascader
      options={options}
      placeholder={placeholder || createSelectPlaceholder(label)}
      {...rest}
    />,
  }

  if (typeof map[type] === 'function') {
    return map[type]()
  }
  return map[type] || null
}


/** 
 * @description 导出规则合并函数
 * @param rules
 * @param label
 */
export const mergeRules = (rules, label) => {
  if (!rules) return rules
  const map = {
    '@transformTrim': {transform: value => value && value.trim()}, // 输入类型为string；校验时进行trim()去掉前后空格
    '@required': {required: true, whitespace: true, message: `请输入${label}`},
    '@requiredSelect': {required: true, message: `请选择${label}`},
    '@max32': {max: 32, message: '输入不能超过32个字符'},
    '@max128': {max: 128, message: '输入不能超过128个字符'},
  }

  return rules.map(rule => (typeof rule === 'string' ? map[rule] : rule))
}
