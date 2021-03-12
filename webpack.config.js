const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    main: "./geul.js",
  },
  output: {
    filename: "geul.js",
    path: path.resolve("./demo"),
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
