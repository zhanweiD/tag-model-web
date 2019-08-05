import {asyncComponent} from '../common/util'
import './scene-tags.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./scene-tags')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
