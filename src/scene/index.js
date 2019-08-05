import {asyncComponent} from '../common/util'
import './scene.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./scene')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
