import {
  nextTick
} from '../util/index'
const queue = []
let has = {}
let waiting = false
let flushing = false
let index = 0
function flushSchedulerQueue () {
  let watcher, id
  debugger
  flushing = true
  // currentFlushTimestamp = getNow()
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
  }
}


export function queueWatcher (watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {

    }
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}