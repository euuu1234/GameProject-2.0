export function configuracoes(){
    const tela = document.body;
    const config = document.createElement('img');
    const pause = document.createElement('img');
    const pauseAndConfig = [
        {
            nome: config,
            position: {
                x: 2,
                y: 2
            },
            tamanho: {
                width: 3,
                height: 3
            },
            src: './Assets/img-ico/iconeEngrenagem.png',
        },
        {
            nome: pause,
            position:{
                x: 7,
                y: 2
            },
            tamanho: {
                width: 2,
                height: 2.5
            },
            src: './Assets/img-ico/pause_ico.png'
        }
    ];

    pauseAndConfig.forEach((element)=>{
        element.nome.src = element.src;
        element.nome.style.position = 'absolute';

        element.nome.style.width = element.tamanho.width + 'em';
        element.nome.style.height = element.tamanho.height + 'em';

        element.nome.style.top = element.position.y + 'em';
        element.nome.style.right = element.position.x + 'em';

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
        menuConfig.style.width = '80%';
        menuConfig.style.height = '80%';

        menuConfig.style.position = 'fixed';

        menuConfig.style.marginRight = '10%';
        menuConfig.style.marginLeft = '10%';

        menuConfig.style.display = 'none';
        menuConfig.style.border = '1px solid black';

        menuConfig.classList.add('menu')

        implantar(menuConfig)
    };
    const menuPause = document.createElement('main');
    {
        menuPause.style.width = '80%';
        menuPause.style.height = '80%';

        menuPause.style.position = 'fixed';

        menuPause.style.marginRight = '10%';
        menuPause.style.marginLeft = '10%';

        menuPause.style.display = 'none';
        menuPause.style.border = '1px solid black';

        menuPause.classList.add('menu')

        implantar(menuPause)
    };
    async function insercaoConfig() {
        let resposta = await fetch("./interface/config.html")
        let htmlMenuConfig = await resposta.text();

        menuConfig.innerHTML = htmlMenuConfig;

        resposta = await fetch("./interface/pause.html")
        htmlMenuConfig = await resposta.text();

        menuPause.innerHTML = htmlMenuConfig;

        document.querySelectorAll('.fechador').forEach((element)=>{
            element.addEventListener('click', ()=>fechar())
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