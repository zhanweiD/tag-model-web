import {observable, action, runInAction} from 'mobx'
import io from './io'
import {successTip, errorTip} from '../common/util'

class InvokeStore {

  // @action async getDailyCard() {
  //   try {
  //     const res = await io.getDailyCard({
  //       id: this.id,
  //     })

  //     runInAction(() => {
  //       this.dailyCard = res
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }

}

export default new InvokeStore()
