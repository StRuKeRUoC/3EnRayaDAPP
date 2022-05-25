# 3EnRayaDAPP
DAPP del clásico juego 3 En raya desarrollada en Solidity,HTML,CS, JS y BOOTSTRAP para el proyecto final del Máster de Ciberseguridad y Privacidad de la UOC

# Instalación:

Este proyecto utiliza Truffle Box Webpack para el webserver y librerias web3js y ethjs

## Instalar Truffle con Webpack

>npm install -g truffle
>truffle unbox webpack

## Instalar librerias:
Para instalar, lo haremos de la siguiente manera:

>npm install web 3 ethjs

## Descargar la estructura de directorios incluyendo el nodemodules e instalar el frontend en el directorio /app

El front-end ya viene dentro de la carpeta /app, será el encargado de generar el contrato una vez la aplicación esté arrancada.

## Editamos el fichero truffle-config.js aputando al puerto 8545 para posteriormente enlazarlo con Ganache:

    networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    
    develop: {
      port: 8545
    },

# Arrancar Webpack

>cd app && npm run dev

# Pruebas en entorno local con Ganache:

Para poder realizar transacciones en entorno local como si estuvieramos en la red Ethereum podemos hacer uso de Ganache:

## Descargar Ganache 

Podemos obtener la app ganache de la truffle suite en https://trufflesuite.com/ganache/

> Ejecutamos con permisos +x la app de ganache.
