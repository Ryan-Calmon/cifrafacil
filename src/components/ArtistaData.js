import imgDjavan from "../Images/djavan.png";
import imgCaetano from "../Images/caetanoveloso.png";
import imgChico from "../Images/chicobuarque.png";
import imgSeuJorge from "../Images/seujorge.png";
import Oceano from "../letras/Oceano";
import EuTeDevoro from "../letras/EuTeDevoro";
const artistas = [
{
id: "djavan" ,
nome: "Djavan",
imagem: imgDjavan, 
musicas: [
{ titulo:"Oceano" , instrumentos: [ "violao", "cavaco"], conteudo: Oceano, youtubeId:"2kqdlAYNEzk", tom:"C" },
{ titulo:"Eu te Devoro" , instrumentos: [ "violao", "cavaco"] , conteudo: EuTeDevoro, youtubeId:"bUjQNMH1HYw", tom:"D" },
{ titulo:"Flor de Lis" , instrumentos: [ "violao", "cavaco"] , conteudo: Oceano , youtubeId:"", tom:"" },

        ],
    },
{
    id: "caetanoveloso" ,
    nome: "Caetano Veloso",
    imagem: imgCaetano,   
    musicas: [
    { titulo:"Samba de Verão" , instrumentos: [ "violao", "cavaco" ] , conteudo: Oceano, youtubeId:"",tom:"",  },
    { titulo:"Sozinho", instrumentos: [ "violao", "cavaco" ] , conteudo: Oceano, youtubeId:"",tom:"" },
    { titulo:"Você Não Me Ensinou a Te Esquecer" , instrumentos: [ "violao", "cavaco" ] , conteudo: Oceano, youtubeId:"",tom:""},
        ],
    },
{
        id: "chicobuarque" ,
        nome: "Chico Buarque",
        imagem: imgChico,
        musicas: [
        { titulo:"João e Maria" , instrumentos: ["violao", "cavaco"], conteudo: Oceano, youtubeId:"",tom:"" },
        { titulo:"A Banda" , instrumentos: ["violao", "cavaco"], conteudo: Oceano, youtubeId:"",tom:"" },
        { titulo:"Construção" , instrumentos: ["violao", "cavaco"], conteudo: Oceano, youtubeId:"",tom:"" },
            ],
        },
{    id: "seujorge" ,
    nome: "Seu Jorge",
    imagem: imgSeuJorge,
    musicas: [
    { titulo:"Amiga da Minha Mulher" , instrumentos: ["violao", "cavaco"], conteudo: Oceano, youtubeId:"",tom:"" },
    { titulo:"Mina do Condomínio" , instrumentos: ["violao", "cavaco"], conteudo: Oceano, youtubeId:"",tom:"" },
    { titulo:"Burguesinha" , instrumentos: ["violao", "cavaco"], conteudo: Oceano, youtubeId:"",tom:"" },
            ],
        },


]

export default artistas;