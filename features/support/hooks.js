const {Before} = require("@cucumber/cucumber");

Before({tags: "@errorme"}, function() {
    throw "argh";
});

Before({tags: "@skipme"}, function() {
    return "skipped";
});
