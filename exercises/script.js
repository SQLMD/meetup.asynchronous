const fs = require("fs");

class ReviewBuilder {
  buildReviewsSync() {
    const products = JSON.parse(
      fs.readFileSync("./data/products.json", "utf-8")
    );
    const reviews = JSON.parse(fs.readFileSync("./data/reviews.json", "utf-8"));
    const users = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

    const productsMap = {};
    products.forEach(product => {
      productsMap[product.id] = product.name;
    });

    const usersMap = {};
    users.forEach(user => {
      usersMap[user.id] = user.username;
    });

    return reviews.map(review => {
      const productObj = {
        productName: productsMap[review.productId],
        username: usersMap[review.userId],
        text: review.text,
        rating: review.rating
      };
      return productObj;
    });
  }

  buildReviewsAsync(callback) {
    fs.readFile("./data/products.json", "utf-8", (err, products) => {
      if (err) return `Something wrong, ${err}`;

      fs.readFile("./data/users.json", "utf-8", (err, users) => {
        if (err) return `Something wrong, ${err}`;

        fs.readFile("./data/reviews.json", "utf-8", (err, reviews) => {
          if (err) return `Something wrong, ${err}`;
          const productsMap = {};
          JSON.parse(products).forEach(product => {
            productsMap[product.id] = product.name;
          });
          const usersMap = {};
          JSON.parse(users).forEach(user => {
            usersMap[user.id] = user.username;
          });
          const result = this._makeResultObj(reviews, productsMap, usersMap);
          callback(result);
        });
      });
    });
    // });
  }

  buildReviewsPromises() {
    // Create and return a Promise object that settles when the files are read.
    const productsPromise = this._makePromise("products");
    const usersPromise = this._makePromise("users");
    const reviewsPromise = this._makePromise("reviews");
    // Return a single Promise when all of Promises settled.
    // And use them to create "result" array.
    return Promise.all([productsPromise, usersPromise, reviewsPromise]).then(
      promise => {
        const productsMap = {};
        JSON.parse(promise[0]).forEach(product => {
          productsMap[product.id] = product.name;
        });
        const usersMap = {};
        JSON.parse(promise[1]).forEach(user => {
          usersMap[user.id] = user.username;
        });
        return this._makeResultObj(promise[2], productsMap, usersMap);
      }
    );
  }

  _makePromise(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./data/${fileName}.json`, "utf-8", (err, products) => {
        if (err) return reject(err);
        return resolve(products);
      });
    });
  }

  async buildReviewsAsyncAwait() {
    const productsResult = await this._promisify("products");
    const usersResult = await this._promisify("users");
    const reviewsRresult = await this._promisify("reviews");
    const promises = await Promise.all([
      productsResult,
      usersResult,
      reviewsRresult
    ]);
    const productsMap = {};
    JSON.parse(promises[0]).forEach(product => {
      productsMap[product.id] = product.name;
    });
    const usersMap = {};
    JSON.parse(promises[1]).forEach(user => {
      usersMap[user.id] = user.username;
    });
    return this._makeResultObj(promises[2], productsMap, usersMap);
  }

  _makeResultObj(promise, firstMap, secondMap) {
    return JSON.parse(promise).map(data => {
      const productObj = {
        productName: firstMap[data.productId],
        username: secondMap[data.userId],
        text: data.text,
        rating: data.rating
      };
      return productObj;
    });
  }

  _promisify(filename) {
    return new Promise((resolve, reject) => {
      fs.readFile(`./data/${filename}.json`, "utf-8", (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  }
}

module.exports = ReviewBuilder;
