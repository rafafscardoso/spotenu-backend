# spotenu-backend

## Stack
Esse é um projeto de Backend feito utilizando NodeJS, Express, Typescript e MySQL. Além disso, ele segue uma arquitetura baseada em MVC, com 4 camadas simples:

1. Controller: responsável pela comunicação com agentes externos (como o Frontend)
1. Model: responsável pela representação das nossas entidades
1. Business: responsável pela lógica de negócio
1. Data: responseavel pela interação com banco de dados relacional

## Sobre
Esse foi um projeto de Backend que utilizei para treinar os casos básicos de CRUD de uma API: Create, Read, Update e Delete.
Para isso, foi utilizado um tema sobre Música. São quatro perfis diferentes com acesso ao aplicativo, administrador, artista, usuário pagante e não pagante.
Um administrador pode criar um outro administrador, adicionar gêneros musicais, aprovar uma banda que tenha feito o cadastro no aplicativo e transformar um usuário não pagante em um pagante. Um artista só tem acesso ao ser aprovado por um administrador, e uma vez com acesso, ele pode criar, editar e apagar um álbum, escolhendo ao menos um dos gêneros criados por um administrador, e adicionar, editar e apagar uma música nesse álbum. Tanto um usuário pagante quanto não pagante podem fazer uma busca de uma música por nome da mesma, do artista ou do álbum ou por gênero musical. Cabe apenas a um usuário pagante gerar, adicionar música, tornar pública e seguir uma playlist.

## Instruções para rodar
As instruções são:
1. `npm install` para instalar todas as dependências;
1. `npm run start` para rodar localmente o projeto
1. `npm run deploy` para gerar uma versão possível de ser deployada com os arquivos transpilados para Javascript

## Versão deployada para teste
https://5d4u5nhjxd.execute-api.us-east-1.amazonaws.com/dev

## Contato (opcional)
Rafael Felipe Santos Cardoso
rafafscardoso@gmail.com
(11) 97224-8806
