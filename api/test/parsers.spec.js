import { expect } from 'chai'
import parsers from './../parsers'

describe('parsers', () => {
  describe('comments', () => {
    it('should return object with result and rest keys', () => {
      let parse = parsers.comments('-- Comment')
      expect(parse).to.have.all.keys('result', 'rest')
    })
    it('should return correctly parsed result', () => {
      let parse = parsers.comments(`
      -- Comment
      Important code -- very important code
      ------ Interesting comment
      --- another interesting comment ---     
      `)
      expect(parse.result).to.be.an('array').that.contains(
        '-- Comment',
        '-- very important code',
        '------ Interesting comment',
        '--- another interesting comment ---     '
      )
    })
    it('should remove results with replace = true', () => {
      let parse = parsers.comments(`
      -- Comment
      Important code -- very important code
      ------ Interesting comment
      --- another interesting comment ---     
      `, true)
      expect(parse.rest).to.equal(`
      
      Important code 
      
      
      `)
    })
    // TODO: replace by default
    it('should keep results with replace = false', () => {
      let input = `
      -- Comment
      Important code -- very important code
      ------ Interesting comment
      --- another interesting comment ---     
      `
      let parse = parsers.comments(input, false)
      expect(parse.rest).to.equal(input)
    })
  })
})
