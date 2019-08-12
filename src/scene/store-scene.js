import {
  observable, action, runInAction,
} from 'mobx'
import {successTip, errorTip} from '../common/util'
import io from './io'


class SceneStore {
  @observable loading = false

  // 场景列表
  @observable list = []

  // 场景详情
  @observable info = {}

  // 弹窗标识 
  @observable modalVisible = false

  // 弹窗编辑／新增 判断标识
  @observable isEdit = false

  // 场景列表
  @action async getList() {
    this.loading = true
    try {
      const res = await io.getList()

      runInAction(() => {
        this.list.replace(res)
        this.loading = false
      })
    } catch (e) {
      errorTip(e.message)
      runInAction(() => {
        this.loading = false
      })
    }
  }

  // 场景详情
  //  @action async getDetail() {
  //   try {
  //     const res = await io.getDetail()

  //     runInAction(() => {
  //       this.info = res
  //     })
  //   } catch (e) {
  //     errorTip(e.message)
  //   }
  // }

  // 场景新增
  @action async addScene(params) {
    try {
      await io.addScene(params)

      runInAction(() => {
        this.modalVisible = false
        successTip('添加成功')
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

   // 场景删除
   @action async delScene(id) {
    try {
      await io.delScene({
        occasionId: id,
      })

      runInAction(() => {
        successTip('删除成功')
        this.getList()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 场景编辑
  @action async editScene() {
     try {
       await io.editScene()

       runInAction(() => {
         this.modalVisible = false
         successTip('编辑成功')
         this.getList()
       })
     } catch (e) {
       errorTip(e.message)
     }
   }

  // 中文名校验
  @action async checkName(name, cb) {
    try {
      await io.checkName({
        name,
      })

      runInAction(() => {
        if (cb) cb()
      })
    } catch (e) {
      errorTip(e.message)
    }
  }
}

export default new SceneStore()
