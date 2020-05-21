import {Component} from 'react'
import RuleCondition from './ruleCondition'
import RuleItem from './ruleItem'

export default class RuleIfBox extends Component {
  render() {
    return (
      <div className="rule-if-box">
              
        <svg>
          <path
            d="M90 16 C90,16 90,16 150,16" // w105 h50
            stroke="#d9d9d9"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M45 16 C55,80 95,80 150,80"
            stroke="#d9d9d9"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M45 16 C55,80 95,80 150,80" 
            stroke="#d9d9d9"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M45 16 C55,130 95,130 150,130"
            stroke="#d9d9d9"
            fill="none"
            strokeWidth="1"
          />
          <path
            d="M45 16 C55,180 95,180 150,180" 
            stroke="#d9d9d9"
            fill="none"
            strokeWidth="1"
          />

        </svg>
        <div className="rule-if-content">
          <RuleCondition />
          <RuleItem pos={[150, 0]} />
          <RuleCondition pos={[150, 66]} />
          <RuleCondition pos={[150, 116]} />
          <RuleCondition pos={[150, 166]} />
        </div>
      </div>
    )
  }
}
