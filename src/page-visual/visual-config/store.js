import {
  action, runInAction, observable, toJS,
} from 'mobx'
import {errorTip, listToTree, successTip, failureTip} from '../../common/util'
import io from './io'

class Store {
  projectId
  
  @observable visualId

  @observable currentStep = 0
  @observable objId
  @observable assObjId
  @observable objList = []
  @observable tagCateSelectList = []
  // @observable detail = {}

  @action async getObjList() {
    try {
      const res = await io.getObjList({
        projectId: this.projectId,
      })
      runInAction(() => {
        this.objList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable assObjList = []

  @action async getAssObj(params) {
    try {
      const res = await io.getAssObj({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.assObjList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 获取所属类目下拉数据
  @action async getTagCateSelectList(params) {
    try {
      const res = await io.getTagCateSelectList(params)
      runInAction(() => {
        this.tagCateSelectList = listToTree(res)
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  // 保存可视化方案（第一个页面)
  @action async saveBaseInfo(params) {
    try {
      const res = await io.saveBaseInfo({
        projectId: this.projectId,
        displayable: 0,
        ...params,
      })
      runInAction(() => {
        if (res) {
          this.visualId = res

          this.currentStep = this.currentStep + 1

          this.getTagCateSelectList({
            id: this.objId,
          })
  
          this.getFunction({
            id: res,
          })
  
          this.getSelectTag({
            id: res,
          })
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

    // 更新可视化方案（第一个页面
    @action async updateBaseInfo(params) {
    try {
      const res = await io.updateBaseInfo({
        projectId: this.projectId,
        ...params,
        displayable: 1,
      })
  
      runInAction(() => {
        this.currentStep = this.currentStep + 1

        this.getTagCateSelectList({
          id: this.objId,
        })

        this.getFunction({
          id: this.visualId,
        })

        this.getSelectTag({
          id: this.visualId,
        })
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable configFuntionList = []
  // 获取函数
  @action async getFunction(params) {
    try {
      const res = await io.getFunction(params)
      runInAction(() => {
        this.configFuntionList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @observable configTagList = []

  // 获取选择标签下拉框
  @action async getSelectTag(params) {
    try {
      const res = await io.getSelectTag({
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        this.configTagList = res
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async checkName(params, cb) {
    try {
      const res = await io.checkName({
        projectId: this.projectId,
        ...params,
      })
      if (res.isExit) {
        cb('名称已存在')
      } else {
        cb()
      }
    } catch (e) {
      errorTip(e.message)
    }
  }

  @action async submitVisual(params, cb) {
    try {
      const res = await io.submitVisual({
        id: +this.visualId,
        projectId: this.projectId,
        ...params,
      })
      runInAction(() => {
        if (res) {
          successTip('提交成功')
          if (cb)cb()
        } else {
          failureTip('提交失败')
        }
      })
    } catch (e) {
      errorTip(e.message)
    }
  }

   // * ****************** 详情 start*********************//
   @observable detailBaseInfo = {}
   @observable detailLoading = false
   @observable tagTreeData = []
   @observable configInfo = {}
   @observable configIdInfo= {}

   @action async getDetail(id) {
     this.detailLoading = true

     try {
       const res = await io.getDetail({
         id,
         projectId: this.projectId,
       })
       runInAction(() => {
         this.detailBaseInfo = res.basSchemeRsp
         this.objId = res.basSchemeRsp.objId
         this.assObjId = res.basSchemeRsp.assObjId

         this.getAssObj({
           id: res.basSchemeRsp.objId,
         })
         
         const len = res.basTagRspList.length

         for (let i = 0; i < len; i += 1) {
           const currentTag = {...res.basTagRspList[i], canEdit: 1, canSubmit: 1}
           this.tagTreeData.push(currentTag)
           this.configInfo[currentTag.id] = res.relVisualExtRspList[i]
           this.configIdInfo[currentTag.id] = res.relVisualExtRspList[i].id
         }
       })
     } catch (e) {
       errorTip(e.message)
     } finally {
       runInAction(() => {
         this.detailLoading = false
       })
     }
   }
   

  // * ****************** 详情 end*********************//
}

export default new Store()
