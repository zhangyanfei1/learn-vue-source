import {
  no,
  identity
} from '../shared/util'
export default ({
  /**
   * Parse the real tag name for the specific platform.
   */
   parsePlatformTagName: identity,
   isReservedTag: no,
   optionMergeStrategies: Object.create(null),
   warnHandler: null,
   silent: false
})