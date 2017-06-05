'use strict'

const expect = require('chai').expect

describe('(unit) example suite', () => {
  // Before test suite
  before((done) => {
    return done()
  })

  // Before each of the tests
  beforeEach((done) => {
    return done()
  })

  describe('feature 1', () => {
    it('should pass', (done) => {
      expect(true).to.be.ok
      done()
    })

  // add other tests...
  })

  // add other features...

  // After each of the tests
  afterEach((done) => {
    done()
  })

  // At the end of all
  after((done) => {
    done()
  })
})
