// SPDX-License-Identifier: GPL-3.0


// 0,0|1,0|2,0
// 0,1|1,1|2,1
// 0,2|1,2|2,2

pragma solidity >=0.7.0 <0.9.0;


contract TresEnRaya
{

    //Contador de Movimientos en el juego

    uint8 movimientos = 0;

    //Enumerador del estado del tablero {Nada, X, O}

    enum Estado_Tablero {Libre, X, O}

    //Tablero vacío de 3x3

    Estado_Tablero[3][3] Tablero;

    //Variable de almacenamiento de las direcciones de Jugador1 vs Jugador2

    address jugador1;

    address jugador2;

    // Variables tiempo por turno

    uint _Empezar; //Inicio

    uint _Terminar; //Fin

    //Sumador de tiempo en segundos

    function empezar() public{
        _Empezar = block.timestamp;
    }

    //Tope en segundos donde debe llegar

    function finalizar() public{

        _Terminar = 120+_Empezar;

    }

    //Funcion Ver tiempo en la Dapp 

     function Tiempo() public view returns (uint){

        uint finish = 0;

        uint now = block.timestamp;

        if (_Terminar > now) {

            uint pendingTime = _Terminar - now;

            return pendingTime;

        } else {

            return finish;
        }

    }

    //Funcion Pasar_turno por exceso de Tiempo en la Dapp 

    function Pasar_turno() public
    {
        // Comprobar que los jugadores estan en juego
        require (msg.sender == jugador1 || msg.sender == jugador2);

        //Comprobar que el juego no ha acabado
        require(!EsFin(), "El juego ha terminado");

        //Comprobar que el jugador contrario pueda clicar sobre el botón de pasar turno
        require (msg.sender != Control_turno(),"No es turno del jugador");

        //Si todo se cumple se reinician contadores y se pasa turno
        empezar();
        finalizar();         

    }

    //Inicializar Variable de los jugadores en el constructor

    constructor (address _jugador2) 
    {
        //Jugador 1 y 2 no pueden tener una cuenta null // valor 0 

        require (_jugador2 != address(0));

        jugador1 = msg.sender; //Jugador1 siempre será el que crea el contrato O inicia la partida

        jugador2 = _jugador2; // Pasamos por parámetro la dirección del Jugador 2.

        //Tiempo

        empezar(); //Inicializar Contador

        finalizar(); //Inicializar 120 segundos

    } // Fin constructor

    //Devolver variables en la DAPP

    function jug1() public view returns (address)
    {
            return jugador1;
    }

    function jug2() public view returns (address)
    {
            return jugador2;
    }

    function Movimientos(uint8 x, uint8 y) public
    {
        // Comprobar que los jugadores estan en juego

        require (msg.sender == jugador1 || msg.sender == jugador2);

        //Comprobar que el juego no ha acabado

        require(!EsFin(), "El juego ha terminado");

        //Comprobar que el jugador puede mover

        require (msg.sender == Control_turno(),"No es turno del jugador");

        //Comprobar que el campo seleccionado este vacío

        require (Tablero[x][y] == Estado_Tablero.Libre);

        empezar(); // reiniciamos contador de tiempo

        finalizar(); // 60 segundos de tiempo

        Tablero[x][y] = Dibujar_Figura_Jugador();
    
        movimientos = movimientos + 1;

    }

    function Reglas_Ganar() public view returns (Estado_Tablero)
    {
        // Por columnas

        if(Tablero[0][0] != Estado_Tablero.Libre && Tablero[0][0]== Tablero [0][1] && Tablero[0][0] == Tablero[0][2])
        {

            return Tablero[0][0];

        }else if (Tablero[1][0] != Estado_Tablero.Libre && Tablero[1][0]== Tablero [1][1] && Tablero[1][0] == Tablero[1][2])

        {
            return Tablero[1][0];

        }else if (Tablero[2][0] != Estado_Tablero.Libre && Tablero[2][0]== Tablero [2][1] && Tablero[2][0] == Tablero[2][2])
        {
            return Tablero[1][0];
        }

        // Por Filas

        if(Tablero[0][0] != Estado_Tablero.Libre && Tablero[0][0]== Tablero [1][0] && Tablero[0][0] == Tablero[2][0])
        {
            return Tablero[0][0];

        }else if (Tablero[0][1] != Estado_Tablero.Libre && Tablero[0][1]== Tablero [1][1] && Tablero[0][1] == Tablero[2][1])
        {

            return Tablero[0][1];

        }else if (Tablero[0][2] != Estado_Tablero.Libre && Tablero[0][2]== Tablero [1][2] && Tablero[0][2] == Tablero[2][2])
        {
            return Tablero[0][2];
        }


        // Por Diagonal

        if(Tablero[0][0] != Estado_Tablero.Libre && Tablero[0][0]== Tablero [1][1] && Tablero[0][0] == Tablero[2][2])
        {
            return Tablero[0][0];
        }else if (Tablero[0][2] != Estado_Tablero.Libre && Tablero[0][2]== Tablero [1][1] && Tablero[0][2] == Tablero[2][0])
        {
            return Tablero[0][2];
        }
        return Estado_Tablero.Libre;
    }

    //Comprobar turno del jugador

    function Control_turno() public view returns (address)
    {
        //Si el numero es Par el jugador 1 tendrá turno de tirada

        if(movimientos % 2 == 0)
        {
            return jugador1;
        }else ///Si el numero es Impar el jugador 2 tendrá turno de tirada
        {
            return jugador2;
        }
    }

    //Dibujar el Simbolo correspondiente a cada jugador en el juego

    function Dibujar_Figura_Jugador() public view returns (Estado_Tablero)
    {
        if(movimientos % 2 == 0)
        {
            return Estado_Tablero.X;

        }else
        {
            return Estado_Tablero.O;
        }
    }

    //Comprobar si el juego ha acabado (2 posibilidades)

    function EsFin() public view returns (bool)
    {
        // La partida acaba si hay ganador sin espacios de tablero libre o si los movimientos llegan a ocupar las 8 posiciones o equivalente a tablero lleno. 

        return (Reglas_Ganar() != Estado_Tablero.Libre || movimientos > 8 );

    }

    function Ganador() public view returns (uint) 
    {

        Estado_Tablero Ganador_Final = Reglas_Ganar();

        if (Ganador_Final == Estado_Tablero.O ) 
        {
            return 1;
        }else if(Ganador_Final == Estado_Tablero.X) 
        {
            return 2;
        }else
        {
            return 0;
        }    
    }

    // Retorno general del estado del tablero

    function MostrarTableroFilas() public view returns (string memory)
    {
        return string(abi.encodePacked(FilaVirtual(0),FilaVirtual(1),FilaVirtual(2)));

    } // Fin IntrosFilas

    //Comprobador según estados del tablero posicion X , Y , L 

    function ControlTablero(uint8 x, uint8 y) public view returns (string memory)
    {

        if(Tablero[x][y] == Estado_Tablero.Libre)
        {
            return 'L';
        }else if (Tablero[x][y] == Estado_Tablero.X )
        {
            return 'X';
        }else if (Tablero[x][y] == Estado_Tablero.O )
        {
            return 'O';
        }

    } //Fin ControlTablero

    // retorno de filas pasando y por parametro 

    function FilaVirtual(uint8 y) public view returns (string memory)
    {
        return string(abi.encodePacked(ControlTablero(0,y),ControlTablero(1,y),ControlTablero(2,y))) ; 

    } //Fin FilaVirtual

} // Fin contrato