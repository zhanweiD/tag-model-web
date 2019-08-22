import React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import SvgExport from '../svg-component/Export'
import SvgImport from '../svg-component/Import'
import SvgObjectAdd from '../svg-component/ObjectAdd'

import './empty-content.styl'

const ADD = 'add'
const IMPORT = 'import'
const EXPORT = 'export'

// 没有要展示的内容时的占位内容
export default class EmptyContent extends React.Component {
  static propTypes = {
    onClick: PropTypes.func, // 点击按钮要触发的事件
  }

  // state = {
  //   activeType: ADD, // 当前激活的button，add：添加对象，import：导入标签及类目
  // }

  render() {
    const {functionCodes} = window.__userConfig
    // const {activeType} = this.state

    // const getBtnClass = type => {
    //   return cls({
    //     'empty-content-button': true,
    //     'empty-content-button--active': activeType === type,
    //   })
    // }

    return (
      <div 
        className="FBV FBJC FBAC" 
        style={{
          height: '100%',
          background: '#F4F6F9',
        }}
      >
        {
          functionCodes.includes('asset_tag_add_obj') && (
            <button 
              type="button" 
              // className={getBtnClass(ADD)}
              className="empty-content-button mb8 FBH"
              style={{
                marginTop: -60,
              }}
              onClick={() => {
                this.handleClick(ADD)
              }}
            >
              <div className="empty-content-button__icon FBH FBAC">
                <SvgObjectAdd size="20" className="ml6" fill="#7AADFF" />
              </div>
              <span>添加对象</span>
            </button>
          )
        }
        {
          functionCodes.includes('asset_tag_import_tag_cate') && (
            <button 
              type="button" 
              // className={getBtnClass(IMPORT)}
              className="empty-content-button mb8 FBH"
              onClick={() => {
                this.handleClick(IMPORT)
              }}
            >
              <div className="empty-content-button__icon FBH FBAC">
                <SvgImport size="20" className="ml6" fill="#7AADFF" />
              </div>
              <span>导入标签及类目</span>
            </button>
          )
        }

        {
          functionCodes.includes('asset_tag_export_tag_cate') && (
            <button 
              type="button" 
              // className={getBtnClass(IMPORT)}
              className="empty-content-button FBH"
              onClick={() => {
                this.handleClick(EXPORT)
              }}
            >
              <div className="empty-content-button__icon FBH FBAC">
                <SvgExport size="20" className="ml6" fill="#7AADFF" />
              </div>
              <span>导出类目及标签</span>
            </button>
          )
        }
      </div>
    )
  } 
  
  // 按钮被点击
  handleClick(type = ADD) {
    const {onClick} = this.props
    
    // this.setState({
    //   activeType: type,
    // })

    if (typeof onClick === 'function') {
      onClick(type)
    }
  }
}
