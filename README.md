# Inventário de Suprimentos

Aplicação web mobile para iniciar, registrar e finalizar inventários de suprimentos. O catálogo fica versionado como JSON; cada inventário é salvo em uma aba própria da planilha Google Sheets `INV-SUPRIMENTO`.

## Funcionalidades

- busca por descrição, `IDPRODUTO` ou `EAN`;
- contagem somente após iniciar um inventário;
- protocolo `INVDDMMAAAA` e sufixos `-02`, `-03` para novos inventários no mesmo dia;
- reabertura de inventários do dia;
- soma quando o mesmo produto é contado novamente;
- abas **Formulário** e **Lista da contagem**;
- CSV com `IDPRODUTO`, `EAN`, `DESCRICAOPRODUTO` e `QUANTIDADE`;
- interface responsiva, instalável e publicação automática no GitHub Pages.

## Atualizar o cadastro

1. Coloque `CADASTRO PRODUTOS SUPRIMENTO.xls` na raiz.
2. A primeira aba deve conter `IDPRODUTO`, `EAN` e `DESCRICAOPRODUTO`.
3. Execute:

```bash
npm install
npm run convert:products
```

O comando valida campos obrigatórios e IDs duplicados e gera `data/products.json`. O Excel original é ignorado pelo Git; versione o JSON gerado. Repita a conversão quando o cadastro mudar.

## Configurar o Google Sheets

1. Abra a planilha `INV-SUPRIMENTO` e acesse **Extensões > Apps Script**.
2. Substitua `Code.gs` por `google-apps-script/Code.gs`.
3. Em **Configurações do projeto**, habilite o manifesto e use `google-apps-script/appsscript.json`.
4. Execute a função `setup` uma vez e autorize o acesso.
5. Vá a **Implantar > Nova implantação > Aplicativo da web**.
6. Execute como **você** e permita acesso a **qualquer pessoa** que utilizará o formulário.
7. Copie o endereço terminado em `/exec`.

O script cria a aba oculta `_INVENTARIOS` e uma aba visível para cada protocolo.

> O endereço `/exec` permite escrita apenas pelas operações do script. Compartilhe-o somente com a equipe. Se a organização bloquear acesso anônimo, use a opção permitida pelo domínio e hospede o site em ambiente autenticado.

## Conectar e publicar

Abra o site, toque na engrenagem, cole o endereço `/exec` e salve. A configuração fica no navegador. Para deixá-la fixa, preencha `apiUrl` em `config.js`.

```bash
npm test
npm run build
```

O build fica em `dist/`. O workflow `.github/workflows/pages.yml` testa e publica a branch `main`. No GitHub, configure **Settings > Pages > Source: GitHub Actions**.

## Estrutura

- `index.html`, `styles.css`, `app.js`: interface mobile;
- `src/inventory.js`: pesquisa, validação e CSV;
- `data/products.json`: catálogo web;
- `scripts/convert-products.mjs`: conversão Excel para JSON;
- `google-apps-script/`: integração com o Google Sheets;
- `tests/`: testes automatizados.
