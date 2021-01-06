const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./geul.js",
  },
  output: {
    filename: "geul.js",
    path: path.resolve("./dist"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
