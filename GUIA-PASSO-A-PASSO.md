# GUIA PASSO A PASSO — 3 DIAS DE TREINAMENTO

Use este roteiro como dever de casa. Faça um comando por vez.

---

# DIA 1 — Montar e abrir o Console

## 1. Entrar no projeto

```bash
cd ~/Projetos/nexoterracore
```

## 2. Confirmar pasta

```bash
pwd
```

Esperado:

```text
/home/gustavo/Projetos/nexoterracore
```

## 3. Criar a pasta nova

```bash
mkdir -p console-next-hardcore
```

## 4. Entrar na pasta

```bash
cd console-next-hardcore
```

## 5. Abrir no VS Code

```bash
code .
```

## 6. Criar esta estrutura

```text
console-next-hardcore/
├── index.html
├── styles.css
├── app.js
├── servidor.py
├── README.md
├── GUIA-PASSO-A-PASSO.md
└── data/
    └── imoveis.json
```

## 7. Copiar os arquivos do pacote para a pasta

Se você descompactou o pacote em Downloads, confira primeiro:

```bash
ls -la ~/Downloads/nexoterracore-console-next-hardcore
```

Depois copie:

```bash
cp -r ~/Downloads/nexoterracore-console-next-hardcore/* ~/Projetos/nexoterracore/console-next-hardcore/
```

## 8. Entrar novamente na pasta

```bash
cd ~/Projetos/nexoterracore/console-next-hardcore
```

## 9. Conferir arquivos

```bash
find . -maxdepth 2 -type f | sort
```

## 10. Rodar com Python

```bash
python3 servidor.py
```

Deixe esse terminal aberto.

## 11. Abrir navegador

```text
http://localhost:5502
```

Teste:
- sidebar recolher/abrir
- Painel
- Imóveis
- Control Plane
- Arquitetura / API
- demais módulos

---

# DIA 2 — Trabalhar o módulo Imóveis

## 1. Abrir o Console

```bash
cd ~/Projetos/nexoterracore/console-next-hardcore
```

## 2. Rodar servidor

```bash
python3 servidor.py
```

## 3. No navegador abrir

```text
http://localhost:5502
```

## 4. Em Imóveis

Faça estes testes:

- abrir lista
- clicar em um imóvel
- testar ficha técnica
- verificar abas
- cadastrar um imóvel de treinamento
- exportar JSON
- recolher sidebar

## 5. Ver dados demo

No VS Code abrir:

```text
data/imoveis.json
```

Pode alterar SOMENTE dados fictícios de treinamento.

Não colocar:
- senha
- API Key
- token
- dados pessoais sensíveis

## 6. Testar API mock no navegador

```text
http://localhost:5502/api/health
```

Depois:

```text
http://localhost:5502/api/control-plane
```

Depois:

```text
http://localhost:5502/api/imoveis
```

---

# DIA 3 — Treino de Git sem publicar

## 1. Voltar à raiz

```bash
cd ~/Projetos/nexoterracore
```

## 2. Ver status

```bash
git status --short
```

## 3. Ver somente o novo Console

```bash
git status --short -- console-next-hardcore
```

## 4. Conferir whitespace

```bash
git diff --check
```

## 5. NÃO publicar

Não executar ainda:

```text
git add
git commit
git push
```

O objetivo é apenas aprender a inspecionar.

---

# O QUE VOCÊ DEVE ME MOSTRAR QUANDO VOLTAR

1. Print do Painel.
2. Print da sidebar aberta.
3. Print da sidebar recolhida.
4. Print de Imóveis.
5. Print da ficha de um imóvel.
6. Resultado de:

```bash
git status --short -- console-next-hardcore
```

---

# QUANDO VOLTARMOS AO PROJETO REAL

A sequência correta será:

1. Visual aprovado.
2. Conectar `/api/health`.
3. Conectar `/api/control-plane`.
4. Conectar `/api/imoveis`.
5. Remover dados mock.
6. Conectar autenticação real.
7. Testar local.
8. `git diff`.
9. Commit.
10. Push.
11. Deploy.
12. Só depois configurar domínio/subdomínio.

---

# REGRA DE SEGURANÇA

Este Console é um laboratório separado.

Nunca copie uma senha ou API Key real para:
- `index.html`
- `app.js`
- `styles.css`
- `servidor.py`
- `imoveis.json`

Quando chegar a hora de integrar segredos, faremos no backend e por variáveis de ambiente.
