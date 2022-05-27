var click;
var cuentaActual;
var Array_Cadena = new Array(8);
var contractAddress;
var tiempo; //tiempo obtenido en el contrato
var Jug1; //Guardar ID del jugador 1
var Jug2; //Guardar ID del jugador 2
var turno; //Guardar ID turno del jugador en el juego
var gestion_p; //Guardar valor True o False de si la partida ha acabado o sigue
var gestion_f; //Guardar valor 1 o 2 de la ficha del jugador que le toca tirar.
var ganador; //Guardar valor 0,1 o 2 del jugador que gana la partida.

//ABI Code de funciones del contrato
var abi = [{
        "inputs": [],
        "name": "empezar",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "finalizar",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
                "internalType": "uint8",
                "name": "x",
                "type": "uint8"
            }, {
                "internalType": "uint8",
                "name": "y",
                "type": "uint8"
            }
        ],
        "name": "Movimientos",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [],
        "name": "Pasar_turno",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "inputs": [{
                "internalType": "address",
                "name": "_jugador2",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    }, {
        "inputs": [],
        "name": "Control_turno",
        "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
                "internalType": "uint8",
                "name": "x",
                "type": "uint8"
            }, {
                "internalType": "uint8",
                "name": "y",
                "type": "uint8"
            }
        ],
        "name": "ControlTablero",
        "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "Dibujar_Figura_Jugador",
        "outputs": [{
                "internalType": "enum TresEnRaya.Estado_Tablero",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "EsFin",
        "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [{
                "internalType": "uint8",
                "name": "y",
                "type": "uint8"
            }
        ],
        "name": "FilaVirtual",
        "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "Ganador",
        "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "jug1",
        "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "jug2",
        "outputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "MostrarTableroFilas",
        "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "Reglas_Ganar",
        "outputs": [{
                "internalType": "enum TresEnRaya.Estado_Tablero",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [],
        "name": "Tiempo",
        "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

//ByteCode del contrato en HEX necesario para crear el contrato en la blockchain
const byteCode = "0x608060405260008060006101000a81548160ff021916908360ff1602179055503480156200002c57600080fd5b50604051620024113803806200241183398181016040528101906200005291906200016f565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156200008d57600080fd5b33600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506200011f6200013660201b60201c565b6200012f6200013f60201b60201c565b506200028a565b42600681905550565b6006546078620001509190620001a1565b600781905550565b600081519050620001698162000270565b92915050565b6000602082840312156200018857620001876200026b565b5b6000620001988482850162000158565b91505092915050565b6000620001ae8262000232565b9150620001bb8362000232565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620001f357620001f26200023c565b5b828201905092915050565b60006200020b8262000212565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600080fd5b6200027b81620001fe565b81146200028757600080fd5b50565b612177806200029a6000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80639de4a52e11610097578063c3f770c111610066578063c3f770c11461022c578063c66c21d91461024a578063e8d2933714610268578063ff8fec8114610298576100f5565b80639de4a52e146101a4578063af7048b1146101d4578063b668ed2e146101f2578063c18ffdb11461020e576100f5565b806355911cc1116100d357806355911cc1146101405780635992babb1461015e57806390ef4a341461017c578063963af8f91461019a576100f5565b806340d58c73146100fa57806352404dde14610104578063531443db14610122575b600080fd5b6101026102a2565b005b61010c6102ab565b6040516101199190611daf565b60405180910390f35b61012a6102f1565b6040516101379190611e11565b60405180910390f35b61014861032d565b6040516101559190611e11565b60405180910390f35b6101666103b0565b6040516101739190611d94565b60405180910390f35b6101846113ed565b6040516101919190611d94565b60405180910390f35b6101a2611424565b005b6101be60048036038101906101b99190611c01565b6115a6565b6040516101cb9190611daf565b60405180910390f35b6101dc6117b2565b6040516101e99190611d5e565b60405180910390f35b61020c60048036038101906102079190611c01565b6117dc565b005b610216611a69565b6040516102239190611d5e565b60405180910390f35b610234611a93565b6040516102419190611d79565b60405180910390f35b610252611ae4565b60405161025f9190611d5e565b60405180910390f35b610282600480360381019061027d9190611bd4565b611b5d565b60405161028f9190611daf565b60405180910390f35b6102a0611ba8565b005b42600681905550565b60606102b76000611b5d565b6102c16001611b5d565b6102cb6002611b5d565b6040516020016102dd93929190611d2d565b604051602081830303815290604052905090565b600080600090506000429050806007541115610324576000816007546103179190611ee0565b905080935050505061032a565b81925050505b90565b6000806103386103b0565b905060028081111561034d5761034c612050565b5b8160028111156103605761035f612050565b5b14156103705760019150506103ad565b6001600281111561038457610383612050565b5b81600281111561039757610396612050565b5b14156103a75760029150506103ad565b60009150505b90565b60008060028111156103c5576103c4612050565b5b60016000600381106103da576103d961207f565b5b016000600381106103ee576103ed61207f565b5b602091828204019190069054906101000a900460ff16600281111561041657610415612050565b5b141580156104c3575060016000600381106104345761043361207f565b5b016001600381106104485761044761207f565b5b602091828204019190069054906101000a900460ff1660028111156104705761046f612050565b5b60016000600381106104855761048461207f565b5b016000600381106104995761049861207f565b5b602091828204019190069054906101000a900460ff1660028111156104c1576104c0612050565b5b145b801561056e575060016000600381106104df576104de61207f565b5b016002600381106104f3576104f261207f565b5b602091828204019190069054906101000a900460ff16600281111561051b5761051a612050565b5b60016000600381106105305761052f61207f565b5b016000600381106105445761054361207f565b5b602091828204019190069054906101000a900460ff16600281111561056c5761056b612050565b5b145b156105b95760016000600381106105885761058761207f565b5b0160006003811061059c5761059b61207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b600060028111156105cd576105cc612050565b5b600180600381106105e1576105e061207f565b5b016000600381106105f5576105f461207f565b5b602091828204019190069054906101000a900460ff16600281111561061d5761061c612050565b5b141580156106c857506001806003811061063a5761063961207f565b5b0160016003811061064e5761064d61207f565b5b602091828204019190069054906101000a900460ff16600281111561067657610675612050565b5b6001806003811061068a5761068961207f565b5b0160006003811061069e5761069d61207f565b5b602091828204019190069054906101000a900460ff1660028111156106c6576106c5612050565b5b145b80156107715750600180600381106106e3576106e261207f565b5b016002600381106106f7576106f661207f565b5b602091828204019190069054906101000a900460ff16600281111561071f5761071e612050565b5b600180600381106107335761073261207f565b5b016000600381106107475761074661207f565b5b602091828204019190069054906101000a900460ff16600281111561076f5761076e612050565b5b145b156107bb576001806003811061078a5761078961207f565b5b0160006003811061079e5761079d61207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b600060028111156107cf576107ce612050565b5b60016002600381106107e4576107e361207f565b5b016000600381106107f8576107f761207f565b5b602091828204019190069054906101000a900460ff1660028111156108205761081f612050565b5b141580156108cd5750600160026003811061083e5761083d61207f565b5b016001600381106108525761085161207f565b5b602091828204019190069054906101000a900460ff16600281111561087a57610879612050565b5b600160026003811061088f5761088e61207f565b5b016000600381106108a3576108a261207f565b5b602091828204019190069054906101000a900460ff1660028111156108cb576108ca612050565b5b145b8015610978575060016002600381106108e9576108e861207f565b5b016002600381106108fd576108fc61207f565b5b602091828204019190069054906101000a900460ff16600281111561092557610924612050565b5b600160026003811061093a5761093961207f565b5b0160006003811061094e5761094d61207f565b5b602091828204019190069054906101000a900460ff16600281111561097657610975612050565b5b145b156109c257600180600381106109915761099061207f565b5b016000600381106109a5576109a461207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b600060028111156109d6576109d5612050565b5b60016000600381106109eb576109ea61207f565b5b016000600381106109ff576109fe61207f565b5b602091828204019190069054906101000a900460ff166002811115610a2757610a26612050565b5b14158015610ad3575060018060038110610a4457610a4361207f565b5b01600060038110610a5857610a5761207f565b5b602091828204019190069054906101000a900460ff166002811115610a8057610a7f612050565b5b6001600060038110610a9557610a9461207f565b5b01600060038110610aa957610aa861207f565b5b602091828204019190069054906101000a900460ff166002811115610ad157610ad0612050565b5b145b8015610b7e57506001600260038110610aef57610aee61207f565b5b01600060038110610b0357610b0261207f565b5b602091828204019190069054906101000a900460ff166002811115610b2b57610b2a612050565b5b6001600060038110610b4057610b3f61207f565b5b01600060038110610b5457610b5361207f565b5b602091828204019190069054906101000a900460ff166002811115610b7c57610b7b612050565b5b145b15610bc9576001600060038110610b9857610b9761207f565b5b01600060038110610bac57610bab61207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b60006002811115610bdd57610bdc612050565b5b6001600060038110610bf257610bf161207f565b5b01600160038110610c0657610c0561207f565b5b602091828204019190069054906101000a900460ff166002811115610c2e57610c2d612050565b5b14158015610cda575060018060038110610c4b57610c4a61207f565b5b01600160038110610c5f57610c5e61207f565b5b602091828204019190069054906101000a900460ff166002811115610c8757610c86612050565b5b6001600060038110610c9c57610c9b61207f565b5b01600160038110610cb057610caf61207f565b5b602091828204019190069054906101000a900460ff166002811115610cd857610cd7612050565b5b145b8015610d8557506001600260038110610cf657610cf561207f565b5b01600160038110610d0a57610d0961207f565b5b602091828204019190069054906101000a900460ff166002811115610d3257610d31612050565b5b6001600060038110610d4757610d4661207f565b5b01600160038110610d5b57610d5a61207f565b5b602091828204019190069054906101000a900460ff166002811115610d8357610d82612050565b5b145b15610dd0576001600060038110610d9f57610d9e61207f565b5b01600160038110610db357610db261207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b60006002811115610de457610de3612050565b5b6001600060038110610df957610df861207f565b5b01600260038110610e0d57610e0c61207f565b5b602091828204019190069054906101000a900460ff166002811115610e3557610e34612050565b5b14158015610ee1575060018060038110610e5257610e5161207f565b5b01600260038110610e6657610e6561207f565b5b602091828204019190069054906101000a900460ff166002811115610e8e57610e8d612050565b5b6001600060038110610ea357610ea261207f565b5b01600260038110610eb757610eb661207f565b5b602091828204019190069054906101000a900460ff166002811115610edf57610ede612050565b5b145b8015610f8c57506001600260038110610efd57610efc61207f565b5b01600260038110610f1157610f1061207f565b5b602091828204019190069054906101000a900460ff166002811115610f3957610f38612050565b5b6001600060038110610f4e57610f4d61207f565b5b01600260038110610f6257610f6161207f565b5b602091828204019190069054906101000a900460ff166002811115610f8a57610f89612050565b5b145b15610fd7576001600060038110610fa657610fa561207f565b5b01600260038110610fba57610fb961207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b60006002811115610feb57610fea612050565b5b600160006003811061100057610fff61207f565b5b016000600381106110145761101361207f565b5b602091828204019190069054906101000a900460ff16600281111561103c5761103b612050565b5b141580156110e85750600180600381106110595761105861207f565b5b0160016003811061106d5761106c61207f565b5b602091828204019190069054906101000a900460ff16600281111561109557611094612050565b5b60016000600381106110aa576110a961207f565b5b016000600381106110be576110bd61207f565b5b602091828204019190069054906101000a900460ff1660028111156110e6576110e5612050565b5b145b8015611193575060016002600381106111045761110361207f565b5b016002600381106111185761111761207f565b5b602091828204019190069054906101000a900460ff1660028111156111405761113f612050565b5b60016000600381106111555761115461207f565b5b016000600381106111695761116861207f565b5b602091828204019190069054906101000a900460ff16600281111561119157611190612050565b5b145b156111de5760016000600381106111ad576111ac61207f565b5b016000600381106111c1576111c061207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b600060028111156111f2576111f1612050565b5b60016000600381106112075761120661207f565b5b0160026003811061121b5761121a61207f565b5b602091828204019190069054906101000a900460ff16600281111561124357611242612050565b5b141580156112ef5750600180600381106112605761125f61207f565b5b016001600381106112745761127361207f565b5b602091828204019190069054906101000a900460ff16600281111561129c5761129b612050565b5b60016000600381106112b1576112b061207f565b5b016002600381106112c5576112c461207f565b5b602091828204019190069054906101000a900460ff1660028111156112ed576112ec612050565b5b145b801561139a5750600160026003811061130b5761130a61207f565b5b0160006003811061131f5761131e61207f565b5b602091828204019190069054906101000a900460ff16600281111561134757611346612050565b5b600160006003811061135c5761135b61207f565b5b016002600381106113705761136f61207f565b5b602091828204019190069054906101000a900460ff16600281111561139857611397612050565b5b145b156113e55760016000600381106113b4576113b361207f565b5b016002600381106113c8576113c761207f565b5b602091828204019190069054906101000a900460ff1690506113ea565b600090505b90565b600080600260008054906101000a900460ff1661140a9190611fc1565b60ff16141561141c5760019050611421565b600290505b90565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806114cd5750600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b6114d657600080fd5b6114de611a93565b1561151e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161151590611df1565b60405180910390fd5b611526611ae4565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415611594576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161158b90611dd1565b60405180910390fd5b61159c6102a2565b6115a4611ba8565b565b6060600060028111156115bc576115bb612050565b5b60018460ff16600381106115d3576115d261207f565b5b018360ff16600381106115e9576115e861207f565b5b602091828204019190069054906101000a900460ff16600281111561161157611610612050565b5b1415611654576040518060400160405280600181526020017f4c0000000000000000000000000000000000000000000000000000000000000081525090506117ac565b6001600281111561166857611667612050565b5b60018460ff166003811061167f5761167e61207f565b5b018360ff16600381106116955761169461207f565b5b602091828204019190069054906101000a900460ff1660028111156116bd576116bc612050565b5b1415611700576040518060400160405280600181526020017f580000000000000000000000000000000000000000000000000000000000000081525090506117ac565b60028081111561171357611712612050565b5b60018460ff166003811061172a5761172961207f565b5b018360ff16600381106117405761173f61207f565b5b602091828204019190069054906101000a900460ff16600281111561176857611767612050565b5b14156117ab576040518060400160405280600181526020017f4f0000000000000000000000000000000000000000000000000000000000000081525090506117ac565b5b92915050565b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806118855750600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b61188e57600080fd5b611896611a93565b156118d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118cd90611df1565b60405180910390fd5b6118de611ae4565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461194b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161194290611dd1565b60405180910390fd5b6000600281111561195f5761195e612050565b5b60018360ff16600381106119765761197561207f565b5b018260ff166003811061198c5761198b61207f565b5b602091828204019190069054906101000a900460ff1660028111156119b4576119b3612050565b5b146119be57600080fd5b6119c66102a2565b6119ce611ba8565b6119d66113ed565b60018360ff16600381106119ed576119ec61207f565b5b018260ff1660038110611a0357611a0261207f565b5b602091828204019190066101000a81548160ff02191690836002811115611a2d57611a2c612050565b5b0217905550600160008054906101000a900460ff16611a4c9190611ea9565b6000806101000a81548160ff021916908360ff1602179055505050565b6000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000806002811115611aa857611aa7612050565b5b611ab06103b0565b6002811115611ac257611ac1612050565b5b141580611adf5750600860008054906101000a900460ff1660ff16115b905090565b600080600260008054906101000a900460ff16611b019190611fc1565b60ff161415611b3457600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611b5a565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b6060611b6a6000836115a6565b611b756001846115a6565b611b806002856115a6565b604051602001611b9293929190611d2d565b6040516020818303038152906040529050919050565b6006546078611bb79190611e53565b600781905550565b600081359050611bce8161212a565b92915050565b600060208284031215611bea57611be96120ae565b5b6000611bf884828501611bbf565b91505092915050565b60008060408385031215611c1857611c176120ae565b5b6000611c2685828601611bbf565b9250506020611c3785828601611bbf565b9150509250929050565b611c4a81611f14565b82525050565b611c5981611f26565b82525050565b611c6881611f7c565b82525050565b6000611c7982611e2c565b611c838185611e37565b9350611c93818560208601611f8e565b611c9c816120b3565b840191505092915050565b6000611cb282611e2c565b611cbc8185611e48565b9350611ccc818560208601611f8e565b80840191505092915050565b6000611ce5601783611e37565b9150611cf0826120c4565b602082019050919050565b6000611d08601583611e37565b9150611d13826120ed565b602082019050919050565b611d2781611f65565b82525050565b6000611d398286611ca7565b9150611d458285611ca7565b9150611d518284611ca7565b9150819050949350505050565b6000602082019050611d736000830184611c41565b92915050565b6000602082019050611d8e6000830184611c50565b92915050565b6000602082019050611da96000830184611c5f565b92915050565b60006020820190508181036000830152611dc98184611c6e565b905092915050565b60006020820190508181036000830152611dea81611cd8565b9050919050565b60006020820190508181036000830152611e0a81611cfb565b9050919050565b6000602082019050611e266000830184611d1e565b92915050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000611e5e82611f65565b9150611e6983611f65565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611e9e57611e9d611ff2565b5b828201905092915050565b6000611eb482611f6f565b9150611ebf83611f6f565b92508260ff03821115611ed557611ed4611ff2565b5b828201905092915050565b6000611eeb82611f65565b9150611ef683611f65565b925082821015611f0957611f08611ff2565b5b828203905092915050565b6000611f1f82611f45565b9050919050565b60008115159050919050565b6000819050611f4082612116565b919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b6000611f8782611f32565b9050919050565b60005b83811015611fac578082015181840152602081019050611f91565b83811115611fbb576000848401525b50505050565b6000611fcc82611f6f565b9150611fd783611f6f565b925082611fe757611fe6612021565b5b828206905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b6000601f19601f8301169050919050565b7f4e6f206573207475726e6f2064656c206a756761646f72000000000000000000600082015250565b7f456c206a7565676f206861207465726d696e61646f0000000000000000000000600082015250565b6003811061212757612126612050565b5b50565b61213381611f6f565b811461213e57600080fd5b5056fea26469706673582212200a3e5f5720914928aafdc4c158cba588c0004d0e2b18729ca55c44a0a18094cf64736f6c63430008070033"

    window.addEventListener("load", function () {
        if (window.ethereum) {
            // use MetaMask's provider
            App.web3 = new Web3(window.ethereum);
            window.ethereum.enable(); // get permission to access accounts


        } else {
            console.warn(
                "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live", );
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            App.web3 = new Web3(
                    new Web3.providers.HttpProvider("http://127.0.0.1:8545"), );
        }

        App.start();

    });
    
//Empiezan las funciones de la DAPP    

const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function () {
        const {
            web3
        } = this;

        try {

            const eth = new Eth(web3.currentProvider);
            var meta; // variable donde se crea el contrato
            var acceder; // variable para interactuar con contrato

            eth.accounts().then(function (accounts) {
                meta = eth.contract(abi, byteCode, {
                        from: accounts[0],
                        gas: '3000000'
                    });
            });

            //Primera función de entrada al juego (Crear Partida)
            const Crear_Partida = async() => {
                var enemigo = document.getElementById('oponente').value;
                meta.new(enemigo).then(function (txHash) {
                    var waitForTransaction = setInterval(function () {
                            eth.getTransactionReceipt(txHash, function (err, receipt) {
                                if (receipt) {
                                    clearInterval(waitForTransaction);
                                    acceder = meta.at(receipt.contractAddress);
                                    //Enseña por pantalla la dirección del contrato para compartir con el oponente
                                    document.querySelector('.GetIdg').innerHTML = String(receipt.contractAddress);
                                    contractAddress = receipt.contractAddress; // al crear una partida hay que igualar esta variable al contrato para inicializar desde el primer momento

                                    const Jug1Element = document.getElementsByClassName("GetJug1")[0];
                                    Jug1Element.innerHTML = String(receipt.from);

                                    const Jug2Element = document.getElementsByClassName("GetJug2")[0];
                                    Jug2Element.innerHTML = document.getElementById('oponente').value;

                                }

                            })

                            Refrescos(); // Refrescar estados de las variables en el momento de crear un nuevo juego

                            const AsignarFiguraElement = document.getElementsByClassName("GetAsignar_figura")[0];
                            AsignarFiguraElement.innerHTML = "<img src=\"img/x.png\" width=\"50px\" height=\"50px\">";
				//mostrar modal al inicio de la partida con la ficha del jugador
                            $('#myModal').modal('show');

                        }, 1000);

                })

            }

	//Segunda función de entrada al juego (Entrar Partida)
            const Entrar_Partida = async() => {

                contractAddress = document.getElementById('IDcontrato').value.trim();
                acceder = meta.at(contractAddress);

                const idgElement = document.getElementsByClassName("GetIdg")[0];
                idgElement.innerHTML = await acceder.address;

		//Llamar a función que crea el botón Pasar turno
                setInterval(function () {
	
                    if (tiempo == 0 && cuentaActual != turno && ganador == 0) {
                        //console.log("entro para llamar a pasar_turno");
                        Pasar_Turno();
                    }

                }, 3000);

                //Jugador1();
                //Jugador2();

		//mostrar modal al inicio de la partida con la ficha del jugador
                $('#myModal').modal('show');

                Refrescos(); // Refrescar estados de las variables en el momento de entrar un nuevo juego


            }

	//función que crea el botón pasar turno
            const Pasar_Turno = async() => {
                var p_turno;

                if (tiempo == 0 && cuentaActual != turno && ganador == 0) {
                    console.log("entro en pasar_tuno");
                    let p_turno = document.createElement("button");
                    p_turno.innerHTML = "Pasar Turno";
                    p_turno.id = "p_turno";
                    p_turno.className = "link buzz-out-on-hover";
                    p_turno.style.display = "none";
                    $('#pasar_turno').append(p_turno);
                    $("#p_turno").fadeIn("3000");
                } else {
                    $('#p_turno').remove();
                    $("#p_turno").fadeOut("3000");
                }

	//Enviar transaccion al hacer click sobre el botón pasar turno
                document.getElementById("p_turno").onclick = async() => {
                    event.preventDefault();
                    cuentaActual = cuentaActual.toString(); //Pasar a string
                    console.log("entro");
                    var NData = '0x963af8f9';

                    const Pasar_Turno = web3.eth.sendTransaction({
                            from: cuentaActual,
                            to: contractAddress,
                            data: NData,
                        }).on('transactionHash', function (hash) {
                            $('#p_turno').remove();
                            $("#p_turno").fadeOut("3000");

                        })

                }

            }

	//Comprobar que el campo de crear partida tenga una ID válida
            document.getElementById("crearJuego").onclick = async() => {
                event.preventDefault();
                var validacion = /^[0][xa-zA-Z0-9]*$/;
                //console.log(document.getElementById("IDcontrato").value.match(validacion));
                //console.log(document.getElementById("IDcontrato").value.length > 41);
                if (document.getElementById("oponente").value.match(validacion) && document.getElementById("oponente").value.length > 41) {
                    Crear_Partida();
                    // $('.modal-content').hide();
                    // $('.modal-backdrop').hide();
                } else {
                    alert("Por favor, Introduce una dirección valida");
                    location.reload();
                }

            }
            
	//Comprobar que el campo de entrar partida tenga una ID válida
            document.getElementById("entrarJuego").onclick = async() => {
                var validacion = /^[0][xa-zA-Z0-9]*$/;
                //console.log(document.getElementById("IDcontrato").value.match(validacion));
                //console.log(document.getElementById("IDcontrato").value.length > 41);
                if (document.getElementById("IDcontrato").value.match(validacion) && document.getElementById("IDcontrato").value.length > 41) {
                    Entrar_Partida();
                } else {
                    alert("Por favor, Introduce una dirección valida");
                    location.reload();
                }

            }

	//Comprobar el turno y poner estilo en el front
            const GestionTurno = async() => {

                acceder.Control_turno().then(function (res) {

                    turno = res[0];

                    //const TurnoElement = document.getElementsByClassName("GetTurno")[0];
                    //TurnoElement.innerHTML = turno;
                    //RefrecarTablero();  // Resfrescar tablero una vez cambiemos turno

                    // Colorear turno del jugador
                    Jugador1();
                    Jugador2();

                    if (turno == Jug1) {
                        document.getElementById("jug2").style.backgroundColor = "";
                        document.getElementById("jug2").style.color = "";
                        $("div#jug2").stop(true).fadeTo("fast", 2);

                        document.getElementById("jug1").style.backgroundColor = "lightblue";
                        document.getElementById("jug1").style.color = "#000";
                        $("div#jug1").fadeTo("slow", 0.4);
                        $("div#jug1").fadeTo("slow", 1);
                    } else if (turno == Jug2) {
                        document.getElementById("jug1").style.backgroundColor = "";
                        document.getElementById("jug1").style.color = "";
                        $("div#jug1").stop(true).fadeTo("fast", 2);

                        document.getElementById("jug2").style.backgroundColor = "lightblue";
                        document.getElementById("jug2").style.color = "#000";
                        $("div#jug2").fadeTo("slow", 0.4);
                        $("div#jug2").fadeTo("slow", 1);
                    }

                    return turno;
                });
            }

	//Obtener Wallet del Jugador 1 (Creador de Partida)
            const Jugador1 = async() => {

                acceder.jug1().then(function (res) {

                    Jug1 = res[0];

                    const Jug1Element = document.getElementsByClassName("GetJug1")[0];

                    Jug1Element.innerHTML = Jug1;

                    if (cuentaActual == Jug1) {
                        const AsignarFiguraElement = document.getElementsByClassName("GetAsignar_figura")[0];
                        AsignarFiguraElement.innerHTML = "<img src=\"img/x.png\" width=\"50px\" height=\"50px\">";

                        if (cuentaActual != Jug1) {
                            const AsignarFiguraElement = document.getElementsByClassName("GetAsignar_figura")[0];
                            AsignarFiguraElement.innerHTML = "<img src=\"img/unknown.png\" width=\"50px\" height=\"50px\">";
                        }

                    }

                    return Jug1;
                });
            }
	//Obtener Wallet del Jugador 2 (El que entra a la Partida)
            const Jugador2 = async() => {

                acceder.jug2().then(function (res) {

                    Jug2 = res[0];

                    const Jug2Element = document.getElementsByClassName("GetJug2")[0];
                    Jug2Element.innerHTML = Jug2;

                    if (cuentaActual == Jug2) {
                        const AsignarFiguraElement = document.getElementsByClassName("GetAsignar_figura")[0];
                        AsignarFiguraElement.innerHTML = "<img src=\"img/o.png\" width=\"50px\" height=\"50px\">";

                        if (cuentaActual != Jug2) {
                            const AsignarFiguraElement = document.getElementsByClassName("GetAsignar_figura")[0];
                            AsignarFiguraElement.innerHTML = "<img src=\"img/unknown.png\" width=\"50px\" height=\"50px\">";
                        }

                    }

                    return Jug2;
                });
            }

	//Funcion que siempre devuelve 0 mientras la partida siga activa, Devuelve 1 o 2 cuando hay ganador
            const Ganador = async() => {
                acceder.Ganador().then(function (res) {
                    ganador = res[0];

                    if (ganador == 2) { //En el contrato está puesto jug 1 == 2
                        const GanadorElement = document.getElementsByClassName("GetGanador")[0];
                        GanadorElement.innerHTML = " Jugador 1 ( X ) Gana La partida";

                    } else if (ganador == 1) { //En el contrato está puesto jug 2 == 1
                        const GanadorElement = document.getElementsByClassName("GetGanador")[0];
                        GanadorElement.innerHTML = " Jugador 2 ( O ) Gana La partida";

                    } else {
                        const GanadorElement = document.getElementsByClassName("GetGanador")[0];
                        GanadorElement.innerHTML = " ¡¡ EMPATE !! ";
                    }

                    return ganador;
                });

            }
            
            //Refrescar Tiempo en segundos (blockchain)
            const GestionTiempo = async() => {

                acceder.Tiempo().then(function (res) {

                    tiempo = res[0];
                    Pasar_Turno();

                });

                const TiempoElement = document.getElementsByClassName("GetTiempo")[0];
                TiempoElement.innerHTML = tiempo;

                return tiempo;
            }

	//Funcion que devuelve True/False si la partida ha acabado o sigue en curso
            const GestionFinPartida = async() => {

                acceder.EsFin().then(function (res) {
                    gestion_p = res[0];

                    //const EsFinElement = document.getElementsByClassName("GetEsFin")[0];
                    //EsFinElement.innerHTML = gestion_p;

	//Si la partida acaba, devuelve True y muetra una modal con el resultado.
                    if (gestion_p == true) {
                        $('#myModal2').modal('show'); 

                    } else {
       //Si la partida no ha acabado, devuelve False y esconde la modal.             
                        $('#myModal2').modal('hide');
                    }

                    return gestion_p;

                });
            }

	//Función que devuelve 1 o 2 dependiendo del jugador que tenga el turno. Sabiendo el valor se asigna imagen de figura
            const GestionFigura = async() => {

                acceder.Dibujar_Figura_Jugador().then(function (res) {
                    gestion_f = res[0];

                    const Dibujar_FiguraElement = document.getElementsByClassName("GetDibujar_Figura")[0];

                    if (gestion_f == 1 && ganador == 0) {
                        //Dibujar_FiguraElement.innerHTML = 'X';
                        Dibujar_FiguraElement.innerHTML = "<img src=\"img/x.png\" class=\"imagenes\" width=\"50px\" height=\"50px\">";
                    } else if (gestion_f == 2 && ganador == 0) {
                        //Dibujar_FiguraElement.innerHTML = 'O';
                        Dibujar_FiguraElement.innerHTML = "<img src=\"img/o.png\" width=\"50px\" height=\"50px\">";
                    } else if (ganador != 0) {
                        Dibujar_FiguraElement.innerHTML = ' ';
                    } else {
                        Dibujar_FiguraElement.innerHTML = 'Pendiente Inicializar...';
                    }

                    return gestion_f;

                });

            }

	//Función que se encarga de generar el  botón de reiniciar partida una vez la partida se ha acabado == true
            const Reiniciar_Juego = async() => {
                var r_juego;

                if (gestion_p == true) {
                    let r_juego = document.createElement("button");
                    r_juego.innerHTML = "Crear otra partida";
                    r_juego.id = "r_juego";
                    r_juego.className = "link buzz-out-on-hover";
                    r_juego.style.display = "none";
                    $('#reiniciar').append(r_juego);
                    $("#r_juego").fadeIn("3000");
                    
		//control de click sobre el botón
                    document.getElementById("r_juego").onclick = async() => {
                        location.reload(); //reiniciar pantalla del navegador

                    }

                } else {
                    //console.log("No se ha acabado aun");
                }

            }

	//Función que obtiene posición en la matriz de cuadros de la interfaz web para enviarla al contrato
	
            var MarcarTablero = function () {
                //Usuario clica en la celda
                click = this.getAttribute('posicion'); //valor atributo posicion de la celda

                if (click == 0) {
                    var columna = 0;
                    var fila = 0;

                } else if (click == 1) {
                    var columna = 1;
                    var fila = 0;

                } else if (click == 2) {
                    var columna = 2;
                    var fila = 0;

                } else if (click == 3) {
                    var columna = 0;
                    var fila = 1;

                } else if (click == 4) {
                    var columna = 1;
                    var fila = 1;
                } else if (click == 5) {
                    var columna = 2;
                    var fila = 1;
                } else if (click == 6) {
                    var columna = 0;
                    var fila = 2;
                } else if (click == 7) {
                    var columna = 1;
                    var fila = 2;
                } else if (click == 8) {
                    var columna = 2;
                    var fila = 2;
                } else {
                    alert("error");
                }
                var clickHex = click.toString(16);
                cuentaActual = cuentaActual.toString(); //Pasar a string

                var zeros = 0;
                // Añadir 64 zeros
                for (let i = 0; i <= 62 - clickHex.length; i++) {
                    zeros += '0';
                }
                var NData = '0xb668ed2e' + zeros + columna.toString(16) + zeros + fila.toString(16);

                const Movimientos = web3.eth.sendTransaction({
                        from: cuentaActual,
                        to: contractAddress,
                        data: NData,
                    }).on('transactionHash', function (hash) {})

            } // Fin MarcarTablero


            //Refrescar Tablero
            const RefrecarTablero = async() => {

                //Seleccionar las casillas etiquetadas
                var casillas = document.querySelectorAll('div li');

                // Guardar consulta del estado del tablero

                var refrescar;
                acceder.MostrarTableroFilas().then(function (res) {
                    refrescar = res[0];

                    //Copiamos la cadena de la consulta en un array para saber las posiciones
                    Array_Cadena = refrescar;

                    //Recorrer el array de posiciones y asignarle la casilla en el tablero

                    for (var i = 0; i < 9; i++) {
                        if (Array_Cadena[i] == 'X') {
                            casillas[i].className = Array_Cadena[i];
                            casillas[i].innerHTML = "<img src=\"img/x.png\" width=\"100px\" height=\"100px\">";
                        } else if (Array_Cadena[i] == 'O') {
                            casillas[i].className = Array_Cadena[i];
                            casillas[i].innerHTML = "<img src=\"img/o.png\" width=\"100px\" height=\"100px\">";
                        }

                        //Animación tras ganar

                        //Diagonal
                        if (Array_Cadena[2] == 'X' && Array_Cadena[4] == 'X' && Array_Cadena[6] == 'X') {
                            casillas[2].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[6].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[0] == 'X' && Array_Cadena[4] == 'X' && Array_Cadena[8] == 'X') {
                            casillas[0].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[8].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[2] == 'O' && Array_Cadena[4] == 'O' && Array_Cadena[6] == 'O') {
                            casillas[2].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[6].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        } else if (Array_Cadena[0] == 'O' && Array_Cadena[4] == 'O' && Array_Cadena[8] == 'O') {
                            casillas[0].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[8].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        }

                        //Fila
                        if (Array_Cadena[0] == 'X' && Array_Cadena[1] == 'X' && Array_Cadena[2] == 'X') {
                            casillas[0].style.backgroundColor = 'green';
                            casillas[1].style.backgroundColor = 'green';
                            casillas[2].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[3] == 'X' && Array_Cadena[4] == 'X' && Array_Cadena[5] == 'X') {
                            casillas[3].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[5].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[6] == 'X' && Array_Cadena[7] == 'X' && Array_Cadena[8] == 'X') {
                            casillas[6].style.backgroundColor = 'green';
                            casillas[7].style.backgroundColor = 'green';
                            casillas[8].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[0] == 'O' && Array_Cadena[1] == 'O' && Array_Cadena[2] == 'O') {
                            casillas[0].style.backgroundColor = 'green';
                            casillas[1].style.backgroundColor = 'green';
                            casillas[2].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        } else if (Array_Cadena[3] == 'O' && Array_Cadena[4] == 'O' && Array_Cadena[5] == 'O') {
                            casillas[3].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[5].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        } else if (Array_Cadena[6] == 'O' && Array_Cadena[7] == 'O' && Array_Cadena[8] == 'O') {
                            casillas[6].style.backgroundColor = 'green';
                            casillas[7].style.backgroundColor = 'green';
                            casillas[8].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        }
                        //Columna
                        if (Array_Cadena[0] == 'X' && Array_Cadena[3] == 'X' && Array_Cadena[6] == 'X') {
                            casillas[0].style.backgroundColor = 'green';
                            casillas[3].style.backgroundColor = 'green';
                            casillas[6].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[1] == 'X' && Array_Cadena[4] == 'X' && Array_Cadena[7] == 'X') {
                            casillas[1].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[7].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[2] == 'X' && Array_Cadena[5] == 'X' && Array_Cadena[8] == 'X') {
                            casillas[2].style.backgroundColor = 'green';
                            casillas[5].style.backgroundColor = 'green';
                            casillas[8].style.backgroundColor = 'green';
                            $(".X").fadeTo("fast", 0.4);
                            $(".X").fadeTo("fast", 1);
                        } else if (Array_Cadena[0] == 'O' && Array_Cadena[3] == 'O' && Array_Cadena[6] == 'O') {
                            casillas[0].style.backgroundColor = 'green';
                            casillas[3].style.backgroundColor = 'green';
                            casillas[6].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        } else if (Array_Cadena[1] == 'O' && Array_Cadena[4] == 'O' && Array_Cadena[7] == 'O') {
                            casillas[1].style.backgroundColor = 'green';
                            casillas[4].style.backgroundColor = 'green';
                            casillas[7].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        } else if (Array_Cadena[2] == 'O' && Array_Cadena[5] == 'O' && Array_Cadena[8] == 'O') {
                            casillas[2].style.backgroundColor = 'green';
                            casillas[5].style.backgroundColor = 'green';
                            casillas[8].style.backgroundColor = 'green';
                            $(".O").fadeTo("fast", 0.4);
                            $(".O").fadeTo("fast", 1);
                        }

                    }

                    return casillas;

                });

            }

	//Funcion tablero de juego
	
            var ClickTablero = function () {
		//Si el juego no ha empezado, no se puede tocar el tablero
                if (typeof meta == 'undefined' && turno != cuentaActual) {

                    
                    var casillas = document.querySelectorAll('li');

                    for (var i = 0; i < 9; i++) {
                        casillas[i].removeEventListener('click', MarcarTablero);

                    }

                } else {
                    //console.log("te toca tirar");
                    var casillas = document.querySelectorAll('li');

                    for (var i = 0; i < 9; i++) {
                        casillas[i].addEventListener('click', MarcarTablero, false);

                    }
                }
                // desactivar evento click tablero en cuanto haya un ganador
                if (ganador != 0) {
                    var casillas = document.querySelectorAll('li');

                    for (var i = 0; i < 9; i++) {
                        casillas[i].removeEventListener('click', MarcarTablero);

                    }
                } else if (ganador == 0 && turno != cuentaActual) {
                    //Desactivar tablero si no es turno del jugador
                    var casillas = document.querySelectorAll('li');

                    for (var i = 0; i < 9; i++) {
                        casillas[i].removeEventListener('click', MarcarTablero);

                    }

                }

            }

            var Refrescos = function () {
                setInterval(function () {
                    RefrecarTablero()
                }, 1000); //Refrescar Figura del jugador
                setInterval(function () {
                    GestionTiempo()
                }, 1000); //Refrescar tiempo del contrato
                setInterval(function () {
                    GestionTurno()
                }, 1000); //Refrescar turno del usuario
                setInterval(function () {
                    GestionFinPartida()
                }, 1000); //Refrescar si la partida ha acabado
                setInterval(function () {
                    GestionFigura()
                }, 1000); //Refrescar Figura del jugador
                setInterval(function () {
                    Ganador()
                }, 1000); //Refrescar Si existe un ganador
                setInterval(function () {
                    Reiniciar_Juego()
                }, 1000); //Mostrat botón de reiniciar juego
                setInterval(function () {
                    ClickTablero()
                }, 1000); //Refrescar si se puede tocar el tablero

            }

            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];

            this.refreshCuenta();

        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }
    },

    refreshCuenta: async function () {
        const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
        const account = accounts[0];
        const cuentaElement = document.getElementsByClassName("cuenta")[0];
        cuentaElement.innerHTML = accounts;
        cuentaActual = accounts;

        // Detectar cambio de cuenta

        window.ethereum.on('accountsChanged', function (accounts) {
            const cuentaElement = document.getElementsByClassName("cuenta")[0];
            this.account = accounts;
            cuentaElement.innerHTML = accounts;
            cuentaActual = accounts;

        })

    },

};

window.App = App;


// 													//						
// Parte del menú mostrado en el front-end con funcionalidades de los botones volver y siguiente    //
//	
											        //
var current_fs, next_fs, previous_fs; //fieldsets
var opacity;
var current = 1;
var steps = $("fieldset").length;

setbarraprogreso(current);

$(".next").click(function () {
    event.preventDefault();
    current_fs = $(this).parent();
    next_fs = $(this).parent().next();
    //Clase Activa
    $("#barraprogreso li").eq($("fieldset").index(next_fs)).addClass("active");

    //enseñar siguiente fieldset
    next_fs.show();
    //esconder fieldset con estilo
    current_fs.animate({
        opacity: 0
    }, {
        step: function (now) {
            // Para animacion del fieldset
            opacity = 1 - now;

            current_fs.css({
                'display': 'none',
                'position': 'relative'
            });
            next_fs.css({
                'opacity': opacity
            });
        },
        duration: 500
    });
    setbarraprogreso(++current);
});

$(".nextJoin").click(function () {
    event.preventDefault();
    current_fs = $(this).parent();
    next_fs = $(this).parent().next().next();
    //Clase Activa
    $("#barraprogreso li").eq($("fieldset").index(next_fs)).addClass("active");

    //enseñar siguiente fieldset
    next_fs.show();
    //esconder fieldset con estilo
    current_fs.animate({
        opacity: 0
    }, {
        step: function (now) {
            // Para animacion del fieldset
            opacity = 1 - now;

            current_fs.css({
                'display': 'none',
                'position': 'relative'
            });
            next_fs.css({
                'opacity': opacity
            });
        },
        duration: 500
    });
    setbarraprogreso(++current);
});

$(".nextCrear").click(function () {
    event.preventDefault();
    current_fs = $(this).parent();
    next_fs = $(this).parents().next().next();
    //Clase Activa
    $("#barraprogreso li").eq($("fieldset").index(next_fs)).addClass("active");

    //enseñar siguiente fieldset
    next_fs.show();
    //esconder fieldset con estilo
    current_fs.animate({
        opacity: 0
    }, {
        step: function (now) {
            // Para animacion del fieldset
            opacity = 1 - now;

            current_fs.css({
                'display': 'none',
                'position': 'relative'
            });
            next_fs.css({
                'opacity': opacity
            });
        },
        duration: 500
    });
    setbarraprogreso(++current);
});

$(".previous").click(function () {
    event.preventDefault();
    current_fs = $(this).parent();
    previous_fs = $(this).parents().prev();

    //Borrar clase activa
    $("#barraprogreso li").eq($("fieldset").index(current_fs)).removeClass("active");

    //Enseñar fieldset anterior
    previous_fs.show();

    //Esconder el fieldset actual con estilos
    current_fs.animate({
        opacity: 0
    }, {
        step: function (now) {
            // Para animacion del fieldset
            opacity = 1 - now;

            current_fs.css({
                'display': 'none',
                'position': 'relative'
            });
            previous_fs.css({
                'opacity': opacity
            });
        },
        duration: 500
    });
    setbarraprogreso(--current);
});

$(".previousJoin").click(function () {
    event.preventDefault();
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev().prev();

    //Borrar clase activa
    $("#barraprogreso li").eq($("fieldset").index(current_fs)).removeClass("active");

    //Enseñar fieldset anterior
    previous_fs.show();

    //Esconder el fieldset actual con estilos
    current_fs.animate({
        opacity: 0
    }, {
        step: function (now) {
            // Para animacion del fieldset
            opacity = 1 - now;

            current_fs.css({
                'display': 'none',
                'position': 'relative'
            });
            previous_fs.css({
                'opacity': opacity
            });
        },
        duration: 500
    });
    setbarraprogreso(--current);
});

function setbarraprogreso(curStep) {
    var percent = parseFloat(150 / steps) * curStep;
    percent = percent.toFixed();
    $(".progress-bar")
    .css("width", percent + "%")
}

$(".submit").click(function () {
    return false;
})

