# NexoTerraCore Console Next — Hardcore

Template independente de treinamento para criar um novo Console do zero, sem mexer no Console antigo.

## Identidade visual

- Fundo principal: `#08090A`
- Sidebar/painéis: `#0B0B0C`
- Laranja principal: `#FF6B1A`
- Laranja secundário: `#FF8433`
- Fontes: IBM Plex Sans, Instrument Serif, JetBrains Mono
- Sem dependência de framework
- Sem emojis no produto
- Sidebar recolhível
- Layout grande, profissional e estável

## O que já vem pronto

- Painel
- Páginas de Vendas
- Imóveis
- Fazendas
- Armazéns e Silos
- Proprietários
- Patrimônio
- Matrículas
- Aluguéis
- Financeiro
- Control Plane
- Geo-referência
- Google Maps (marcado como próximo)
- Google Earth (marcado como próximo)
- Mercado / Análises (próximo)
- Nexo AI (próximo)
- Arquitetura / API
- Banco de Dados
- Logs / VS Code
- PicPay
- WhatsApp API (próximo)
- Usuários & Permissões
- Segurança
- Backup

## Área de Imóveis

Já existe uma estrutura maior:

- lista de imóveis
- botão Novo imóvel
- ficha técnica
- abas de Resumo, Documentos, Fotos, Geo, Avaliação e Histórico
- exportação JSON
- dados demo
- armazenamento local para treino
- espaço para fotos
- conexão futura com API real

## Python

`servidor.py` cria um servidor local de treinamento com três endpoints MOCK:

- `GET /api/health`
- `GET /api/control-plane`
- `GET /api/imoveis`

Ele NÃO usa PostgreSQL real, senha real ou API Key real.

## Segurança

Este template foi criado para a pasta `console-next-hardcore`.

Não substituir `console/index.html`.

Não publicar antes de revisar.

Não inserir segredos no código.
