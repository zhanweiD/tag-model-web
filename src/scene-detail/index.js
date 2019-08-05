import {asyncComponent} from '../common/util'
import './scene-detail.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./scene-detail')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
