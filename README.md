# Discordia

Discordia e uma aplicacao de chat em tempo real criada para reunir usuarios em salas de discussao especificas. A ideia do projeto e brincar com o nome: em vez de ser apenas um clone visual de comunidades online, o foco e criar um ambiente onde pessoas entram em salas tematicas para conversar, discordar, trocar mensagens ao vivo e interagir dentro da propria sala.

O projeto tambem inclui um minigame de Pedra, Papel e Tesoura em tempo real, permitindo que usuarios desafiem outros membros presentes na mesma sala.

## Funcionalidades

- Cadastro e login com autenticacao JWT.
- Sessoes isoladas por aba do navegador.
- Salas de discussao criadas e gerenciadas por usuarios administradores.
- Entrada e saida de salas com atualizacao da lista de membros em tempo real.
- Historico de mensagens por sala.
- Envio e recebimento de mensagens via WebSocket.
- Indicador de digitacao.
- Moderacao de mensagens:
  - administradores podem excluir qualquer mensagem;
  - usuarios comuns podem excluir apenas as proprias mensagens.
- Exclusao de salas por administradores.
- Minigame realtime de Pedra, Papel e Tesoura entre membros da sala.

## Stack

- Backend: Spring Boot
- Frontend: React + Vite
- Banco de dados: PostgreSQL
- Mensageria: RabbitMQ
- Tempo real: WebSocket + STOMP + SockJS
- Autenticacao: JWT

## Estrutura

```txt
discordia/
  backend/    # API Spring Boot
  frontend/   # Interface React
```
