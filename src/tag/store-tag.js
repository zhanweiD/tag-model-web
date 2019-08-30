import {
  observable, action, runInAction, toJS,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'

export default class TagStore {
  // 编辑后强制左侧tab更新
  @observable updateKey = undefined

  // 类目id
  @observable id = undefined
  @observable currentNode = undefined

  // 标签树类型 1:人 2:物 3:关系
  @observable typeCode = undefined

}
