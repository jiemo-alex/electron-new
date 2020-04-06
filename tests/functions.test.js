const chai = require('chai')
const path = require('path')
const fs = require('fs')
const expect = chai.expect
const { getFiles, saveHistoryFile } = require('../src/main/functions')

describe('Unit Test `functions.js`', function() {
    this.timeout(15000)

    it ('Should `getFiles` return the true paths', () => {
        const jsonFile = path.join(__dirname, '_test.json')
        fs.writeFileSync(jsonFile, '')
        const result = getFiles(['_test.json'], __dirname)
        expect(result[0].name).to.equal('_test.json')
        expect(result[0].path).to.equal(jsonFile)
        fs.unlinkSync(jsonFile)
    })

    it('Should `saveHistoryFile` create the right json file', () => {
        const jsonFile = path.join(__dirname, '_test.json')
        fs.writeFileSync(jsonFile, '["test1"]')
        saveHistoryFile(jsonFile, 'test2', () => {
            const json = fs.readFileSync(jsonFile)
            const data = JSON.parse(json)
            expect(data.length).to.equal(2)
            expect(data[0]).to.equal('test2')
            expect(data[1]).to.equal('test1')
            fs.unlinkSync(jsonFile)
        })
    })
})
