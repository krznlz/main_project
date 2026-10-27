const HtmlWebpackPlugin = require('html-webpack-plugin')

function createPages(template, filename, chunks) {
  return new HtmlWebpackPlugin({
    template: template,
    filename: filename,
    chunks: chunks
  })
}

const htmlPages = [
  createPages('./src/index.html', './index.html', ['index']),
  createPages('./src/pages/rps-game.html', './rps-game.html', ['index','rpsgame']),
  createPages('./src/pages/brief.html', './brief.html', ['index','brief'])
]

module.exports = htmlPages
