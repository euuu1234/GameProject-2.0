import { portal } from "../objetos.js";

const cor1 = 'rgb(0, 150, 20)';
const cor2 = 'white';
const cor4 = 'rgba(255, 2, 120, 0.67)';
const cor3 = 'rgb(150,3,70)';

const player = {
    position:{
        x: 1,
        y: 5,
    },
    tamanho:{
        width: 2,
        height: 5.5,
    },
    fisica: {
        velocityX: 0,
        velocityY: 0,
    },
    speedY: 30,
    speedX: 10,
    element: null,
    jump: 50,
};
player.tamanho.heightPlay = player.tamanho.height

const configFase = {
    run: 15,
    gravity: 150,
    velMaxY: player.tamanho.height * 5,
    velMaxX: player.tamanho.width,
    larguraFase: 60,
    positionInitial: {
        x: player.position.x,
        y: player.position.y
    }
};
configFase.proporcao = window.innerWidth/configFase.larguraFase
configFase.height = configFase.larguraFase/1.76

const elementosDoJogo = [
    {
        position: {
            x: 0,
            y: 0,
        },
        tamanho: {
            width: emForPx(window.screen.width),
            height: 4.9,
        },
        color: cor4,
        element: null,
    },
    {
        position: {
            x: 50.2,
            y: 9.35,
        },
        tamanho: {
            width: 3.2,
            height: 1.5,
        },
        color: cor4,
        element: null,
    },
    {
        position: {
            x: 40,
            y: 9.35,
        },
        tamanho: {
            width: 10.2,
            height: 5.2,
        },
        color: cor4,
        element: null,
    },
    {
        position: {
            x: 0,
            y: 16,
        },
        tamanho: {
            width: 25.5,
            height: 5,
        },
        color: cor4,
        element: null,
    },
    {
        position: {
            x: 25.6,
            y: 12,
        },
        tamanho: {
            width: 10.29,
            height: 1.69,
        },
        color: cor4,
        element: null,
    },
];
const elementosFuncionais = [
    portal,
    
]

elementosFuncionais[0].position.x = 3.2;
elementosFuncionais[0].position.y = 21;



export function emForPx(number){
    return (number / configFase.proporcao)
}

export {elementosDoJogo, player, configFase, elementosFuncionais};