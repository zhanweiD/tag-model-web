import {useEffect, useState} from 'react'
import OnerFrame from '@dtwave/oner-frame' 

import CommonTag from './tab'

export default () => {
  const ctx = OnerFrame.useFrame()
  const projectId = ctx.useProjectId()
  const [count, setCount] = useState(false)
  console.log(1)
  useEffect(() => {
    // console.log(projectId)
    // if (projectId) {
    //   console.log(1)
    //   ctx.useProject(true)
    // } else if (count) {
    //   console.log(2)
    //   ctx.useProject(false)
    // } else {
    //   console.log(3)
    //   setCount(() => true)
    // }
    ctx.useProject(true)
    ctx.useSider(true)
  }, [projectId])

  return (
    <div>
      <CommonTag key={projectId} projectId={projectId} />
      {console.log(1)}
    </div>
  )
}
