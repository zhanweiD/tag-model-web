import {asyncComponent} from '../common/util'
import './tag.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./tag')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
