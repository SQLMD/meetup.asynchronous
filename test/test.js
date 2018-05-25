const ReviewBuilder = require("../exercises/script.js");
const expected = require("./fixtures/result.js");
const { expect } = require("chai");

describe("Review Builder", () => {
  it("should create an array of user-facing review objects synchronously", () => {
    // Setup
    const reviewBuilder = new ReviewBuilder();

    // Excercise
    const actual = reviewBuilder.buildReviewsSync();

    // Assert
    expect(actual).to.deep.equal(expected);
  });

  it("should create an array of user-facing review objects using callback", done => {
    // Setup
    const reviewBuilder = new ReviewBuilder();

    // Excercise
    reviewBuilder.buildReviewsAsync(actual => {
      // Assert
      expect(actual).to.deep.equal(expected);

      // Teardown
      done();
    });
  });

  it("should create an array of user-facing review objects using promise", () => {
    // Setup
    const reviewBuilder = new ReviewBuilder();

    // Excercise
    const promise = reviewBuilder.buildReviewsPromises();

    const next = promise.then(actual => {
      // Assert
      expect(actual).to.deep.equal(expected);
    });

    return next;
  });

  it("should create an array of user-facing review objects using await", async () => {
    // Setup
    const reviewBuilder = new ReviewBuilder();

    // Excercise
    const actual = await reviewBuilder.buildReviewsAsyncAwait();

    // Assert
    expect(actual).to.deep.equal(expected);
  });
});
