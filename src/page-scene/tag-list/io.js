import ioContext from '../../common/io-context'
import {sceneApi, get} from '../../common/util'

const api = {
  getList: get(`${sceneApi}/tagList`), // 标签列表
}

ioContext.create('sceneTags', api)

export default ioContext.api.sceneTags
