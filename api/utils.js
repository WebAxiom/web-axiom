import _ from 'lodash'

let trim = (obj) => {
  if (_.isString(obj)) {
    return obj.replace(/^\s*$/gm, '')
  } else if (_.isArray(obj) && obj.length > 0 && _.isString(obj[0])) {
    return obj.map(s => s.replace(/^\s*$/gm, ''))
  }
}

export default {
  trim
}
