import React from 'react'
import PropTypes from 'prop-types'
import cls from 'classnames'
import addIcon from '../icon/add.svg'
import importIcon from '../icon/import.svg'
import './empty-content.styl'

const ADD = 'add'
const IMPORT = 'import'

// 没有要展示的内容时的占位内容
export default class EmptyContent extends React.Component {
  static propTypes = {
    onClick: PropTypes.func, // 点击按钮要触发的事件
  }

  // state = {
  //   activeType: ADD, // 当前激活的button，add：添加对象，import：导入标签及类目
  // }

  render() {
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
        <button 
          type="button" 
          // className={getBtnClass(ADD)}
          className="empty-content-button"
          style={{
            marginTop: -60,
            marginBottom: 8,
          }}
          onClick={() => {
            this.handleClick(ADD)
          }}
        >
          <div className="empty-content-button__icon">
            <img 
              src={addIcon} 
              alt="icon" 
              height={20}
            />
          </div>
          <span>添加对象</span>
        </button>

        <button 
          type="button" 
          // className={getBtnClass(IMPORT)}
          className="empty-content-button"
          onClick={() => {
            this.handleClick(IMPORT)
          }}
        >
          <div className="empty-content-button__icon">
            <img 
              src={importIcon} 
              alt="icon" 
              height={20}
            />
          </div>
          <span>导入标签及类目</span>
        </button>
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
