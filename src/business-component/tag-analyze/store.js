import {
  action, observable, runInAction, toJS,
} from 'mobx'
import {errorTip} from '../../common/util'
import io from './io'

class Store {
  // 值域分布
  @observable chartPieValues = [
    {treeId: null, treeName: '530', metaCount: 1229, ratio: 37},
    {treeId: null, treeName: 'ym一级', metaCount: 863, ratio: 26},
    {treeId: null, treeName: 'DCA_一级类目', metaCount: 744, ratio: 23},
    {treeId: null, treeName: 'bb', metaCount: 224, ratio: 7},
    {treeId: null, treeName: 't1', metaCount: 224, ratio: 7},
  ]
  // @observable totalCount = 3284

  tagId
  // 空值占比趋势
   @action async getValueTrend(params, cb) {
    try {
      // const res = await io.getValueTrend({
      //   tagId: this.tagId,
      //   ...params,
      // })

      const res = []
      runInAction(() => {
        if (cb) cb(toJS(res))
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new Store()
