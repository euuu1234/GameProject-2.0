export function configuracoes(){
    const tela = document.body;
    const config = document.createElement('img');
    const pause = document.createElement('img');
    const pauseAndConfig = [
        {
            nome: config,
            position: {
                x: 20,
                y: 18
            },
            tamanho: {
                width: 30,
                height: 30
            },
            src: '../Assets/img-ico/iconeEngrenagem.png',
        },
        {
            nome: pause,
            position:{
                x: 70,
                y: 20
            },
            tamanho: {
                width: 20,
                height: 25
            },
            src: '../Assets/img-ico/pause_ico.png'
        }
    ];

    pauseAndConfig.forEach((element)=>{
        element.nome.src = element.src;
        element.nome.style.position = 'absolute';

        element.nome.style.width = element.tamanho.width + 'px';
        element.nome.style.height = element.tamanho.height + 'px';

        element.nome.style.top = element.position.y + 'px';
        element.nome.style.right = element.position.x + 'px';

        element.nome.classList.add('parador')

        element.nome.addEventListener('pointerenter', ()=>{
            element.nome.style.scale = '1.2';
            element.nome.style.cursor = 'pointer';
        })
        element.nome.addEventListener('pointerout', ()=>{element.nome.style.scale = '1'})

        element.nome.addEventListener('click', ()=>{
            if(element.nome === config){
                faceInterna.menuConfig.style.display = 'flex';

                element.nome.style.display = 'none';

                pause.style.display = 'none'
            }
            else if(element.nome === pause){
                faceInterna.menuPause.style.display = 'flex';
            
                element.nome.style.display = 'none';
                
                config.style.display = 'none'
            }
        })

        implantar(element.nome)
    });

    const menuConfig = document.createElement('main');
    {
        menuConfig.style.position = 'fixed';

        menuConfig.style.display = 'none';
        menuConfig.style.border = '1px solid black';

        menuConfig.classList.add('menu');

        menuConfig.id = "menu-config";

        implantar(menuConfig)
    };
    const menuPause = document.createElement('main');
    {
        menuPause.style.position = 'fixed'; 

        menuPause.style.display = 'none';

        menuPause.classList.add('menu', 'menu-pause')

        implantar(menuPause)
    };
    async function insercaoConfig() {
        let resposta = await fetch("../interface/config.html")
        let htmlMenuConfig = await resposta.text();

        menuConfig.innerHTML = htmlMenuConfig;

        resposta = await fetch("../interface/pause.html")
        htmlMenuConfig = await resposta.text();

        menuPause.innerHTML = htmlMenuConfig;

        document.querySelectorAll('.fechador').forEach((element)=>{
            element.addEventListener('click', ()=>fechar())
        });

        menuPause.querySelector('#config_main').addEventListener('click', ()=>{
            menuPause.style.display = 'none';
            menuConfig.style.display = 'flex';
        })
    };
    insercaoConfig();


    const faceInterna = {
        menuConfig: menuConfig,
        menuPause: menuPause
    };

    //injetor de elementos
    function implantar(item){
        tela.appendChild(item)
    }

    function fechar(){
        faceInterna.menuConfig.style.display = 'none';
        faceInterna.menuPause.style.display = 'none';
        config.style.display = 'block';
        pause.style.display = 'block';
    }

};