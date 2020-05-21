import {asyncComponent} from '../common/util'
import './main1.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./main1')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
