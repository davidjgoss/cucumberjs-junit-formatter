const {When, Then} = require("@cucumber/cucumber");
const assert = require("assert");

When("stuff happens", function() {

});

When("a step we haven't implemented yet", function() {
    return "pending";
});

Then("it passes", function() {

});

Then("it fails", function() {
    throw "nope";
});

Then("the result is {int}", function(value) {
    assert.strictEqual(value, 2);
});

let attemptCount = 0
When("a step that passes the second time", function() {
    attemptCount++
    if (attemptCount < 2) {
        throw 'nope'
    }
})
