import React from 'react'
import {Spin} from 'antd'

/**
 * @description 
 * @param mode loading模式，若是block，为块级元素，需要执行height；若不写，依赖于父元素 position: relative 进行覆盖居中
 * @param height 当mode="block"时使用
 */
export default ({mode, height}) => {
  const boxStyle = {
    position: 'relative',
    height: height * 2,
  }
  const loadingStyle = {
    backgroundColor: 'rgba(255, 255, 255, .5)',
  }
  return (
    <div className="loading-box" style={mode === 'block' ? boxStyle : {}}>
      <div className="loading" style={mode === 'block' ? {} : loadingStyle}>
        <Spin />
      </div>
    </div>
  )
}
