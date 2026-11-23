# leobravoe.github.io

Site pessoal e portfólio de Leonardo Bravo Estácio, professor EBTT no IFSC — Câmpus Gaspar.

Site no ar: <https://leobravoe.github.io>

É um site estático gerado pelo Jekyll, que já era o que o GitHub Pages usava para publicar.
Não há framework de front-end nem passo de build próprio: o HTML é escrito à mão e tudo o que o
navegador precisa vem de CDN ou do próprio repositório.

O site é bilíngue. O português fica na raiz e o inglês em `/en/`.

## Páginas

| Rota | Arquivo | Conteúdo |
| --- | --- | --- |
| `/` · `/en/` | `index.html` · `en/index.html` | Apresentação, áreas de atuação e contatos |
| `/curriculo/` · `/en/curriculo/` | `curriculo/index.html` · `en/curriculo/index.html` | Formação acadêmica |
| `/portfolio/` · `/en/portfolio/` | `portfolio/index.html` · `en/portfolio/index.html` | Índice com os quatro cartões de seção |
| `/portfolio/game/` · `/en/…` | `portfolio/game/index.html` · `en/portfolio/game/index.html` | Jogos próprios e TCCs orientados |
| `/portfolio/web/` · `/en/…` | `portfolio/web/index.html` · `en/portfolio/web/index.html` | TCCs orientados e projetos de aula |
| `/portfolio/livros/` · `/en/…` | `portfolio/livros/index.html` · `en/portfolio/livros/index.html` | Livro de introdução a JavaScript |
| `/portfolio/pesquisa/` · `/en/…` | `portfolio/pesquisa/index.html` · `en/portfolio/pesquisa/index.html` | Projetos de pesquisa e dissertação |
| `/portfolio/<seção>/<trabalho>/` · `/en/…` | `portfolio/<seção>/<trabalho>/index.html` | Página própria de cada trabalho |
| — | `404.html` | Página de erro, nos dois idiomas |

Cada arquivo de página tem só o front matter e o conteúdo do seu cartão. Cabeçalho, barra
lateral, navbar, trilha, rodapé, modal e scripts ficam no layout e nos includes. Os projetos de
portfólio não estão em HTML: ficam em `_data/projetos/`. As páginas de seção (game, web, livros)
listam os trabalhos como cartões, e cada trabalho tem uma página própria, gerada a partir dos
mesmos dados, com o carrossel, a autoria e o link para o PDF. Os trabalhos de pesquisa têm o
texto escrito à mão na própria página (`portfolio/pesquisa/<trabalho>/index.html`).

## Estrutura

```
.
├── _config.yml                 configuração do Jekyll e a lista de idiomas
├── _layouts/
│   ├── default.html            a casca de todas as páginas
│   └── trabalho.html           página de um trabalho do portfólio
├── _includes/
│   ├── head.html               título, descrição, canonical, hreflang, Open Graph, verificações
│   ├── meta-pagina.html        calcula título, descrição e o trabalho da página atual
│   ├── jsonld.html             dados estruturados (Person, ProfilePage, Thesis, Book…)
│   ├── scholar.html            meta tags do Google Scholar (citation_*)
│   ├── assets.html             CDNs, script de tema e o <style> do site
│   ├── sidebar.html            foto, tags de seção e contatos
│   ├── navbar.html             marca, links, tema e seletor de idioma
│   ├── seletor-idioma.html     dropdown de idiomas
│   ├── bandeira.html           bandeiras em SVG inline
│   ├── breadcrumb.html         trilha montada a partir do front matter
│   ├── projeto.html            desenha um projeto inteiro a partir dos dados
│   ├── lista-trabalhos.html    cartões de uma seção, cada um levando ao trabalho
│   ├── cartao-trabalho.html    um cartão de trabalho
│   ├── pessoa.html             um nome, com link para o Lattes quando houver
│   ├── autores.html            lista de autores usando pessoa.html
│   ├── cartoes-portfolio.html  os quatro cartões da página de portfólio
│   ├── footer.html             rodapé
│   └── image-modal.html        modal da imagem ampliada
├── _data/
│   ├── i18n/
│   │   ├── pt.yml              strings da interface em português
│   │   └── en.yml              as mesmas chaves em inglês
│   ├── projetos/
│   │   ├── game.yml            projetos de game dev
│   │   ├── web_tcc.yml         TCCs de web
│   │   ├── web_aula.yml        projetos de web usados em aula
│   │   └── livros.yml          livros
│   ├── pessoas.yml             identificadores Lattes de autores e orientadores (vira link)
│   └── secoes.yml              os quatro cartões do portfólio
├── index.html                  páginas em português
├── curriculo/index.html
├── portfolio/…
├── en/                         as mesmas páginas em inglês
├── portfolio/game/tcc/         PDFs e pastas img-<projeto> (compartilhados)
├── assets/js/site.js           tooltips, modal e tema (carregado com defer)
├── img/                        foto, ilustrações, prévias sociais (og-*.png) e ícones
├── site.webmanifest            nome e ícones do site
├── <chave>.txt                 chave do IndexNow (o nome é o valor de indexnow_key)
├── 404.html
├── sitemap.xml                 gerado por Liquid a partir das páginas
└── .github/workflows/jekyll-gh-pages.yml
```

`_site/` é a saída do build. Não é versionada.

## Rodando localmente

As páginas têm Liquid, então **não dá para abrir com um servidor estático simples**: o Live
Server do VS Code mostra o front matter cru e os `{% ... %}` sem processar. É preciso rodar o
Jekyll.

Com Ruby instalado:

```bash
jekyll serve
```

Sem Ruby, via Docker:

```bash
docker run --rm -it -v "${PWD}:/srv/jekyll" -p 4000:4000 jekyll/jekyll:4 jekyll serve --host 0.0.0.0
```

Nos dois casos o site fica em <http://127.0.0.1:4000> e recarrega sozinho ao salvar um arquivo.

Antes de publicar, vale rodar o build uma vez e olhar a saída:

```bash
docker run --rm -v "${PWD}:/srv/jekyll" -w /srv/jekyll jekyll/jekyll:4 jekyll build
```

## Front matter

Tudo o que varia de uma página para outra está no front matter:

```yaml
---
layout: default
lang: en
ref: portfolio-game
sitemap: true
atualizado: 2026-11-22
title: "Game Dev — Portfolio of Leonardo Bravo Estácio"
description: "Digital games developed and supervised by Leonardo Bravo Estácio…"
nav: portfolio
breadcrumb:
  - chave: portfolio
    href: "/portfolio/"
  - chave: game
    href: "/portfolio/game/"
---
```

| Campo | Para que serve |
| --- | --- |
| `lang` | `pt` ou `en`; define `<html lang>`, o idioma das strings e o prefixo dos links |
| `ref` | mesma chave nas duas versões da página; é o que liga uma tradução à outra |
| `title` | `<title>`, `og:title` e `twitter:title` |
| `description` | `description`, `og:description` e `twitter:description` |
| `nav` | marca em negrito o item ativo da navbar: `home`, `curriculo` ou `portfolio` |
| `breadcrumb` | trilha; `chave` é olhada em `_data/i18n`, e o `href` ganha o prefixo do idioma |
| `sitemap` | `true` põe a página no `sitemap.xml`; sem ele ela fica fora |
| `atualizado` | data da última mudança de conteúdo; vira o `lastmod` do sitemap, o único campo do sitemap que o Google usa. Atualize ao mexer no texto |
| `fonte` / `projeto` | página de trabalho: o arquivo em `_data/projetos` e o `id` do trabalho. Título, descrição e conteúdo saem dos dados |
| `academico` | trabalhos de pesquisa escritos à mão: tipo, título original, autores, instituição, palavras-chave e PDF, para o Scholar e o JSON-LD |
| `noindex` | só no `404.html`: troca o canonical por `robots: noindex` |
| `card_body` | `false` quando a página monta o próprio miolo, sem a caixa `card-body` |
| `card_body_class` | classe alternativa para essa caixa |

O `canonical`, o `og:url` e as tags `hreflang` saem do caminho do arquivo e do `ref`, não
precisam ser escritos. Os links do layout e dos includes são absolutos a partir da raiz e ganham
o prefixo do idioma sozinhos.

## Os dois idiomas

O português é o idioma padrão e fica na raiz; o inglês fica sob `/en/`. Nenhuma URL em português
mudou quando o inglês entrou. Os dois idiomas estão declarados em `_config.yml`, com a bandeira,
a sigla e o prefixo de cada um.

**Strings da interface** ficam em `_data/i18n/pt.yml` e `_data/i18n/en.yml`, com as mesmas
chaves. Chave que faltar no inglês cai de volta para o português, então uma tradução incompleta
degrada em vez de quebrar a página.

**Textos dos projetos** ficam nos dados, com os dois idiomas lado a lado:

```yaml
titulo:
  pt: "Resquício: Jogo para Introdução à Programação"
  en: "Resquício: A Game for Introductory Programming"
```

**O seletor de idioma** acha a contraparte da página pelo campo `ref`, então trocar de idioma
mantém a página em que você está. Idioma sem contraparte publicada aparece desabilitado no
dropdown, em vez de levar para um 404 — é isso que permite traduzir uma página por vez.

**Não há redirecionamento automático** por idioma do navegador. Detectar e redirecionar quebra o
botão voltar, confunde crawler e prende quem quer ler no outro idioma. A troca é sempre
explícita.

**As bandeiras são SVG inline**, em `_includes/bandeira.html`. Emoji de bandeira não serve:
no Windows o navegador mostra as letras do país em vez da bandeira. Cada SVG é desenhado na sua
proporção natural e encaixado numa caixa de 20×14 com `slice`, então as duas ficam do mesmo
tamanho sem distorcer. Os `id` internos recebem um sufixo porque a mesma bandeira aparece duas
vezes na página.

**Os PDFs continuam em português.** Nas páginas em inglês os botões dizem isso.

## Bibliotecas

Todas via CDN, com `integrity` e `crossorigin`, declaradas em `_includes/assets.html`:

- Bootstrap 5.3.3 (CSS e bundle JS)
- jQuery 3.7.1
- Bootstrap Icons 1.11.3
- Font Awesome 6.5.2

Ao trocar a versão de alguma delas, o hash `integrity` muda junto. Hash errado faz o navegador
recusar o arquivo em silêncio, e a página carrega sem estilo ou sem JavaScript.

Só o CSS do Bootstrap bloqueia a primeira pintura. Os dois CSS de ícones carregam com
`media="print"` e viram `all` quando chegam, e os scripts (jQuery, Bootstrap e
`assets/js/site.js`) vão com `defer`, que preserva a ordem. Por isso nenhum script inline pode
usar `$` ou `bootstrap`: o código que depende deles fica em `site.js`.

## Como as páginas funcionam

### Tema claro e escuro

Um script inline no `<head>` lê `localStorage['theme']`, cai para `prefers-color-scheme` quando
não há nada salvo, e aplica `data-bs-theme` no `<html>` antes da primeira pintura — é o que
evita o flash branco ao carregar no escuro. O interruptor no topo grava a escolha e repinta os
ícones de sol e lua.

### Carrosséis

Os carrosséis são gerados por `_includes/projeto.html` a partir dos dados. Toda imagem nasce com
`src`: o Google só indexa imagem que esteja no `src` do HTML, e antes elas ficavam em `data-src`
até alguém clicar no carrossel. A primeira imagem carrega na hora, com `fetchpriority="high"`
(é a maior coisa da página); as outras usam `loading="lazy"`, que o próprio navegador resolve.

### Modal da imagem ampliada

Clicar em qualquer imagem de carrossel abre ela em tela cheia. O modal recebe a lista de imagens
daquele carrossel, então dá para avançar e voltar sem fechar, pelos botões laterais ou pelas
setas do teclado. Os botões só aparecem quando há mais de uma imagem.

Clicar em qualquer outro ponto do modal fecha. Isso é feito no script, não por
`data-bs-dismiss` espalhado pelos elementos — se fosse pelo atributo, o clique nos botões de
navegação fecharia o modal junto.

## Convenções de conteúdo

- **Ordem por ano, do mais recente para o mais antigo**, em todas as listas do portfólio. O ano
  é um campo dos dados e entra no título automaticamente.
- **Imagens em WebP**, de preferência 1280×720. O CSS aplica `height: auto`, então proporções
  diferentes funcionam, mas dentro de um mesmo carrossel vale manter a proporção constante para
  a altura não pular entre os slides.
- **A legenda vira o `alt`**, no formato `Projeto (ano) — legenda`, montado pelo include.
- **Caminhos nos dados são absolutos a partir da raiz** (`/portfolio/game/tcc/…`), porque os
  mesmos dados são usados pelas páginas em `/` e em `/en/`.
- **Menções a câmpus são históricas.** Projetos realizados no Câmpus Lages continuam dizendo
  Lages; só o vínculo atual, na barra lateral, aponta para Gaspar.

## Busca, redes e Scholar

O que o site já entrega sozinho:

- **Dados estruturados** (`_includes/jsonld.html`): `Person` e `WebSite` em toda página,
  `ProfilePage` na home e no currículo, `Thesis`/`Report`/`Book` nas páginas de trabalho e
  `BreadcrumbList` com a trilha. Os perfis listados em `pessoa` no `_config.yml` entram no `sameAs`.
- **Google Scholar** (`_includes/scholar.html`): meta tags `citation_*` nas páginas de trabalho em
  português. O Scholar pede um trabalho por URL, PDF com texto pesquisável e até 5 MB.
- **Prévia de compartilhamento** de 1200×630 por idioma (`img/og-pt.png`, `img/og-en.png`).
- **Sitemap com `lastmod`** e IndexNow no deploy (avisa Bing e cia.).

O que depende de você, no `_config.yml`:

| Campo | O que pôr |
| --- | --- |
| `verificacao.google` | o código da meta tag do Google Search Console (propriedade de prefixo de URL) |
| `verificacao.bing` | o código da meta tag do Bing Webmaster Tools (ou importe do Search Console) |
| `pessoa.orcid`, `pessoa.google_scholar`, `pessoa.linkedin` | endereço completo do perfil; com valor, o link aparece na barra lateral |
| `goatcounter` | o código da conta no GoatCounter, se quiser contar visitas sem cookies |

Depois de publicar: enviar `https://leobravoe.github.io/sitemap.xml` no Search Console e no
Bing, e conferir uma página de trabalho na Inspeção de URL (as imagens devem aparecer no HTML
renderizado). Para validar o JSON-LD: <https://search.google.com/test/rich-results>.

**PDFs.** Mantenha cada PDF abaixo de 5 MB e com Título e Autor preenchidos nas propriedades
do arquivo: o Google usa isso como título no resultado, e o Scholar ignora arquivo maior.

## Adicionando um projeto

1. Converta as capturas para WebP e coloque em `img-<projeto>/`, numeradas a partir de
   `img0.webp`.
2. Acrescente uma entrada no `_data/projetos/<seção>.yml`, na posição certa da ordem por ano:

```yaml
  - id: meu-projeto
    ano: 2026
    slug: meu-projeto          # o pedaço da URL da página do trabalho
    academico:                 # só para TCC/livro; tire se for projeto de aula
      tipo: tcc                # tcc, livro, relatorio ou dissertacao
      titulo: "Título exatamente como está no PDF"
      autores:
        - "Aluno Um"
        - "Leonardo Bravo Estácio"
      instituicao: "Instituto Federal de Educação, Ciência e Tecnologia de Santa Catarina (IFSC) — Câmpus Gaspar"
      curso: "Tecnologia em Análise e Desenvolvimento de Sistemas"
    secao: objetivo            # ou gameplay
    titulo:
      pt: "Meu Projeto"
      en: "My Project"
    links:
      - chave: tcc             # rótulo vem de _data/i18n
        href: "/portfolio/web/tcc/tcc-meu-projeto-2026.pdf"
    texto:
      pt:
        - >-
          Descrição em português.
      en:
        - >-
          Description in English.
    carrossel: meu-projeto
    pasta: "/portfolio/web/tcc/img-meu-projeto"
    largura: 1280
    altura: 720
    legenda_classe: "bg-dark bg-opacity-50 text-light"
    imagens:
      - arquivo: img0.webp
        legenda:
          pt: "Legenda."
          en: "Caption."
```

3. Crie a página do trabalho nas duas línguas, `portfolio/<seção>/<slug>/index.html` e
   `en/portfolio/<seção>/<slug>/index.html`, só com o front matter (copie de um trabalho vizinho
   e troque `ref`, `projeto` e `atualizado`):

```yaml
---
layout: trabalho
lang: pt                       # en na versão em inglês
ref: trabalho-meu-projeto
sitemap: true
atualizado: 2026-12-01
fonte: web_tcc
projeto: meu-projeto
botao: btn-primary
nav: portfolio
breadcrumb:
  - chave: portfolio
    href: "/portfolio/"
  - chave: web
    href: "/portfolio/web/"
---
```

4. Se a `description` da página de seção enumera os projetos, atualize o front matter das duas
   versões e mude o `atualizado` dela.
5. Mantenha o PDF abaixo de 5 MB e com Título e Autor nas propriedades do arquivo.

Para converter as imagens, com Pillow:

```bash
python -c "
from PIL import Image
import glob, os
for i, f in enumerate(sorted(glob.glob('*.png'))):
    im = Image.open(f).convert('RGB')
    im.thumbnail((1280, 1280), Image.LANCZOS)
    im.save('img%d.webp' % i, 'WEBP', quality=82, method=6)
"
```

## Deploy

`.github/workflows/jekyll-gh-pages.yml` publica no GitHub Pages a cada push na `main`, e também
pode ser disparado à mão pela aba Actions.

O build usa o `actions/jekyll-build-pages`, que roda com o bundle fixo do gem `github-pages` e
**ignora o Gemfile do repositório**. Na prática isso significa que plugins de terceiros (como o
`jekyll-polyglot`) não funcionam. É por isso que o suporte a dois idiomas aqui é feito só com
Liquid, includes e `_data`.

Depois do deploy, um terceiro job (`indexnow`) lê o sitemap publicado e avisa o IndexNow (Bing,
Yandex e outros) das URLs. Se ele falhar, a publicação não é afetada.

Os downloads dos jogos (builds para Windows e Android) ficam no Google Drive, linkados a partir
da página de game dev. Eles não estão versionados aqui.

## Licença

MIT. Veja [LICENSE](LICENSE).

O código do site é MIT. Os PDFs de TCC, dissertação, relatórios de pesquisa e o livro são de
seus respectivos autores e estão aqui apenas para consulta.
