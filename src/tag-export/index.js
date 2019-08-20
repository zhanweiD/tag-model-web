import {asyncComponent} from '../common/util'
import './tag-export.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./tag-export')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
