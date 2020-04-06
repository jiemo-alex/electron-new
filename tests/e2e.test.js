const chai = require('chai')
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect

global.before(function () {
    chai.should();
    chai.use(chaiAsPromised);
});

const Application = require('spectron').Application
const app = new Application({
    path: '/home/alex/dev/learn/electronDemo/native/dist/linux-unpacked/native-test'
})

describe('End To End Test', function() {
    this.timeout(15000)
    before(function () {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start()
    });

    after(function () {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it('Only one window can be loaded', (done) => {
        app.client.waitUntilWindowLoaded().getWindowCount().then(count => {
            expect(count).to.equal(1)
            done()
        })
    })
})