const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

/*
var partidas = fs.createWriteStream("./src/my_file.txt");

partidas.once('open', function(fd) {
  partidas.write("Partida:" + global.answer);
  partidas.write("Jugador 1:" );
  partidas.write("Jugador 2:"  );
  partidas.write("Hash de Juego:" );   
  partidas.write("-----------------------------");
  partidas.end();
});  
*/



module.exports = {
  mode: 'development',
  entry: "./src/js/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/js/index.js", to: "./js/index.js" }]),
    new CopyWebpackPlugin([{ from: "./src/css/estilos.css", to: "css/estilos.css" }]),
    new CopyWebpackPlugin([{ from: "./node_modules/ethjs/dist/ethjs.js", to: "./node_modules/ethjs/dist/ethjs.js" }]),
    new CopyWebpackPlugin([{ from: "./node_modules/web3/dist/web3.min.js", to: "./node_modules/web3/dist/web3.min.js" }]),
    new CopyWebpackPlugin([{ from: "./src/img/x.png", to: "img/x.png" }]),
    new CopyWebpackPlugin([{ from: "./src/img/o.png", to: "img/o.png" }]),
    new CopyWebpackPlugin([{ from: "./src/img/unknown.png", to: "img/unknown.png" }]),
    new CopyWebpackPlugin([{ from: "./src/img/LogoTresEnRaya.png", to: "img/LogoTresEnRaya.png" }]),
  ],
  
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};


