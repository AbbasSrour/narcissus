/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import { babelLoader } from "./useLoaderRuleItems";

/**
 * @see https://webpack.js.org/guides/typescript/#loader
 */
export const typescriptRule = {
  test: /\.(ts|tsx)?$/,
  loader: "ts-loader",
  options: {
    transpileOnly: true,
  },
  exclude: /node_modules/
};
/**
 * @see https://webpack.js.org/loaders/babel-loader
 */
export const javascriptRule = {
  test: /\.(js|jsx)$/,
  use: [babelLoader],
  exclude: /node_modules/
};

/**
 * @see https://webpack.js.org/loaders/html-loader
 */
export const htmlRule = {
  test: /\.(html)$/,
  use: {
    loader: "html-loader"
  }
};
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const imagesRule = {
  test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
  type: "asset/resource"
};
/**
 * @see https://webpack.js.org/guides/asset-modules/
 */
export const fontsRule = {
  test: /\.(woff(2)?|eot|ttf|otf|)$/,
  type: "asset/inline"
};

// Images
// export const images2Rule = {
//   test: /\.(jpg|png|gif|svg)$/,
//   use:
//     [
//       {
//         loader: "file-loader",
//         options:
//           {
//             outputPath: "assets/images/"
//           }
//       }
//     ]
// };

// Fonts
// export const fontsRule = {
//   test: /\.(ttf|eot|woff|woff2)$/,
//   use:
//     [
//       {
//         loader: "file-loader",
//         options:
//           {
//             outputPath: "assets/fonts/"
//           }
//       }
//     ]
// };

// Shaders
export const shadersRule = {
  test: /\.(glsl|vs|fs|vert|frag)$/,
  exclude: /node_modules/,
  use: [
    "raw-loader",
    "glslify-loader"
  ]
};
