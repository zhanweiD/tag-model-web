import {
  action, runInAction, observable,
} from 'mobx'
import {successTip, errorTip} from '../../common/util'
import {ListContentStore} from '../../component/list-content'
import io from './io'

class Store extends ListContentStore(io.getList) {
  syncId

  @observable infoLoading = false
  @observable detail = {}

  @observable visible = false
  @observable confirmLoading = false

  @observable configInfo = {} // 配置信息
  @observable configInfoLoading = false

  @action async getDetail() {
    this.infoLoading = true

    try {
      // const res = await io.getDetail({
      //   id: this.syncId,
      // })
      const res = {
        tenantId: 512635,
        userId: 243724,
        id: 6884716921461056,
        name: '测试方案1',
        objName: '对象',
        descr: null,
        cUserName: 'user',
        createTime: 1585218909000,
        storageTypeName: 'mysql',
        storageName: '数据源',
      }

      runInAction(() => {
        this.detail = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.infoLoading = false
      })
    }
  }

  @action async getConfigInfo() {
    this.configInfoLoading = true
    try {
      // const res = await io.getConfigInfo({
      //   id: this.syncId,
      // })
      const res = {
        tenantId: 512635,
        userId: 243724,
        id: 6884716921461056,
        tableName: '测',
        mainTagMappingKeys: [
          {
            objName: '对象',
            columnName: 'hy1',
          },
        ],
        tagTotalCount: '7', // 同步标签总数
        tagNameList: ['标签1', '标签2'],
        scheduleType: '调度类型',
        scheduleExpression: '',
      }
      
      runInAction(() => {
        this.configInfo = res
      })
    } catch (e) {
      errorTip(e.message)
    } finally {
      runInAction(() => {
        this.configInfoLoading = false
      })
    }
  }
}

export default new Store()
