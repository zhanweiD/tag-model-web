import {observable, action, runInAction, computed, toJS} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../common/util'

class OverviewStore {
  // todo 这块暂时延缓(告警规则table右侧图表)
  @observable warnRuleData = []
  @action async getRuleChartData(cb) {
    try {
      // const res = await io.getContent({
      //   param: '1',
      // })
      runInAction(() => {
        const data = [{
          "ruleId": 58,
          "ruleName": "字段监控规则2",
          "firstValue": "10",
          "secondValue": "30", "compareType": 3, "compareObject": 2, "compareName": "前1天", "todayName": "字段值", "fluctuateName": "波动系数", "trendType": 1, "ruleType": 5, "itemList": [{ "recordTime": "2019-04-18", "standardValue": "3712878.00", "resultValue": "412542", "fluctuateValue": "-88.89", "standardValueExist": true, "resultValueExist": true, "fluctuateValueExist": true }, { "recordTime": "2019-04-19", "standardValue": "0.00", "resultValue": "420734", "fluctuateValue": "100.00", "standardValueExist": true, "resultValueExist": true, "fluctuateValueExist": true }, { "recordTime": "2019-04-20", "standardValue": "4199148.00", "resultValue": "424830", "fluctuateValue": "-89.88", "standardValueExist": true, "resultValueExist": true, "fluctuateValueExist": true }, { "recordTime": "2019-04-21", "standardValue": "849660.00", "resultValue": "428926", "fluctuateValue": "-49.52", "standardValueExist": true, "resultValueExist": true, "fluctuateValueExist": true }, { "recordTime": "2019-04-22", "standardValue": "3860334.00", "resultValue": "433022", "fluctuateValue": "-88.78", "standardValueExist": true, "resultValueExist": true, "fluctuateValueExist": true }, { "recordTime": "2019-04-23", "standardValue": "866044.00", "resultValue": "437118", "fluctuateValue": "-49.53", "standardValueExist": true, "resultValueExist": true, "fluctuateValueExist": true }, { "recordTime": "2019-04-24", "standardValue": "3934062.00", "resultValue": "441214", "fluctuateValue": "-88.78", "standardValueExist": true, "resultValueExist": true, "fluctuateValueExist": true }]
        }]
          this.warnRuleData.replace(data)
          cb && cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}
export default new OverviewStore()
