import intl from 'react-intl-universal'
import { useState } from 'react'
import { TimeRange } from '../component'

const RuleCondition = ({}) => {
  const [renderData, changeRenderData] = useState()

  if (true) {
    changeRenderData(1234)
  }
  return (
    <div className="bgf p16 mt16 box-border">
      <h3 className="chart-title">
        {intl.get('ide.src.page-overview.line.0lgkec2vqirn').d('标签使用统计')}
      </h3>
      <div className="time-range-wrap">
        <TimeRange
          custom
          defaultRangeInx={0}
          rangeMap={[
            {
              value: 7,
              label: intl
                .get('ide.src.component.time-range.time-range.4ppflvb5etj')
                .d('最近7天'),
            },
            {
              value: 30,
              label: intl
                .get('ide.src.component.time-range.time-range.7gd32bh9fxx')
                .d('最近30天'),
            },
          ]}

          // exportTimeRange={(gte, lte) => getData(gte, lte)}
        />
      </div>
      {/* <div style={{height: '300px'}} ref={lineRef} /> */}
    </div>
    // <div style={posStyle} className="wrap-rule-condition" id={id}>
    //   <div style={childPosStyle} className="wrap-rule-condition-btn">
    //     {
    //       page === 'detail' ? (
    //         <Button>
    //           {isAnd ? '且' : '或'}
    //         </Button>
    //       ) : (
    //         <Button onClick={change}>
    //           {isAnd ? '且' : '或'}
    //         </Button>
    //       )
    //     }
    //     {/* {
    //       canDelete && page !== 'detail' && flag !== '0' ? (
    //         <Popconfirm
    //           placement="topLeft"
    //           title="确认删除？"
    //           onConfirm={() => delCon()}
    //           okText="确认"
    //           cancelText="取消"
    //         >
    //           <IconDel size="16" className="delete-icon" />
    //         </Popconfirm>
    //       ) : null
    //     } */}
    //   </div>
    //   {/* {
    //     showLine ? <div className="wrap-rule-condition-line" style={{top: height / 2}} /> : null
    //   } */}
    // </div>
  )
}

export default RuleCondition
