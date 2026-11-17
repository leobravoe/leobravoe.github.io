# leobravoe.github.io

Site pessoal e portfólio de Leonardo Bravo Estácio, professor EBTT no IFSC — Câmpus Gaspar.

Site no ar: <https://leobravoe.github.io>

É um site estático: HTML escrito à mão, sem framework, sem build e sem dependência instalada
localmente. Tudo o que o navegador precisa vem de CDN ou do próprio repositório.

## Páginas

| Rota | Arquivo | Conteúdo |
| --- | --- | --- |
| `/` | `index.html` | Apresentação, áreas de atuação e contatos |
| `/curriculo/` | `curriculo/index.html` | Formação acadêmica |
| `/portfolio/` | `portfolio/index.html` | Índice com os quatro cartões de seção |
| `/portfolio/game/` | `portfolio/game/index.html` | Jogos próprios e TCCs orientados em game dev |
| `/portfolio/web/` | `portfolio/web/index.html` | TCCs orientados e projetos usados em aula |
| `/portfolio/livros/` | `portfolio/livros/index.html` | Livro de introdução à programação em JavaScript |
| `/portfolio/pesquisa/` | `portfolio/pesquisa/index.html` | Projetos de pesquisa e dissertação de mestrado |
| — | `404.html` | Página de erro do GitHub Pages, com caminhos absolutos |

## Rodando localmente

Qualquer servidor estático serve, desde que a raiz seja a raiz do repositório. O favicon e o
`404.html` usam caminhos absolutos (`/favicon.ico`), então abrir os arquivos com `file://` ou
servir a partir de uma subpasta quebra parte das referências.

```bash
python -m http.server 5500
```

Depois é só abrir <http://127.0.0.1:5500>. No VS Code, a extensão Live Server faz o mesmo e
usa essa porta por padrão.

## Estrutura

```
.
├── index.html                  páginas na raiz de cada rota
├── curriculo/index.html
├── portfolio/
│   ├── index.html
│   ├── game/
│   │   ├── index.html
│   │   └── tcc/                PDFs e uma pasta img-<projeto> por projeto
│   ├── web/
│   │   ├── index.html
│   │   ├── aula/               imagens dos projetos usados em aula
│   │   └── tcc/                PDFs e imagens dos TCCs
│   ├── livros/
│   │   ├── index.html
│   │   └── pdfs/
│   └── pesquisa/
│       ├── index.html
│       ├── dissertacao/        PDF da dissertação de mestrado
│       └── relatorios/         relatórios finais dos projetos de pesquisa
├── img/                        foto de perfil e ilustrações dos cartões
├── 404.html
├── favicon.ico
├── robots.txt
├── sitemap.xml
└── .github/workflows/jekyll-gh-pages.yml
```

## Bibliotecas

Todas via CDN, com `integrity` e `crossorigin`:

- Bootstrap 5.3.3 (CSS e bundle JS)
- jQuery 3.7.1
- Bootstrap Icons 1.11.3
- Font Awesome 6.5.2

Ao trocar a versão de alguma delas, o hash `integrity` muda junto. Hash errado faz o navegador
recusar o arquivo em silêncio, e a página carrega sem estilo ou sem JavaScript.

## Como as páginas são montadas

Cada página é um arquivo completo e independente. As primeiras ~280 linhas — `<head>` com as
meta tags, barra lateral com foto e contatos, navbar, interruptor de tema — e o rodapé, o modal
de imagem e os scripts do fim são **duplicados nos oito arquivos**. Mudança em qualquer um
desses trechos precisa ser repetida em todos eles, senão as páginas divergem.

É o maior incômodo do repositório hoje. O deploy já passa pelo Jekyll, então dá para migrar esse
trecho repetido para `_layouts` e `_includes` sem mudar nada do deploy. Ainda não foi feito.

### Tema claro e escuro

Um script inline no `<head>` lê `localStorage['theme']`, cai para `prefers-color-scheme` quando
não há nada salvo, e aplica `data-bs-theme` no `<html>` antes da primeira pintura — é o que
evita o flash branco ao carregar no escuro. O interruptor no topo grava a escolha e repinta os
ícones de sol e lua.

### Carrosséis

Os carrosséis usam um lazy-load próprio, em jQuery. A imagem nasce com o caminho em `data-src`
e sem `src`:

```html
<img data-src="./tcc/img-projeto/img0.webp" width="1280" height="720"
    class="d-block w-100 lazyload" alt="Projeto (2025) — legenda da imagem">
```

No evento `slide.bs.carousel`, o `data-src` vira `src` e a classe `lazyload` sai. A imagem do
slide ativo é carregada logo no `ready`, para o carrossel não começar vazio. Clicar em qualquer
imagem abre ela em tela cheia no modal `#imageModal`.

Consequência prática: imagem sem `data-src` nunca carrega, e `src` preenchido direto derruba o
lazy-load daquele slide.

### SEO

Cada página tem título, descrição, autor, `canonical`, Open Graph e Twitter Card próprios. A
descrição aparece em **três** tags — `description`, `og:description` e `twitter:description` —
e as três precisam mudar juntas.

Dois cuidados no atributo `content`: aspas duplas internas precisam virar `&quot;`, senão o
atributo termina ali e o resto do texto vaza para o HTML; e `&` solto deve ser `&amp;`.

## Convenções de conteúdo

- **Ordem por ano, do mais recente para o mais antigo**, em todas as listas do portfólio. O ano
  vai entre parênteses no título do item: `Data Guida (2022)`.
- **Imagens em WebP**, de preferência 1280×720, com `width` e `height` no HTML. O CSS da página
  aplica `height: auto`, então proporções diferentes funcionam, mas dentro de um mesmo carrossel
  vale manter a proporção constante para a altura não pular entre os slides.
- **A legenda é repetida no `alt`**, no formato `Projeto (ano) — legenda`.
- **Nomes de pasta e arquivo em minúsculas**, no padrão `img-<projeto>/imgN.webp` e
  `tcc-<projeto>-<ano>.pdf`. O ano na pasta de imagens é opcional: o repositório tem as duas
  formas, como `img-resquicio` e `img-booklist-2023`.
- **Menções a câmpus são históricas.** Projetos realizados no Câmpus Lages continuam dizendo
  Lages; só o vínculo atual, na barra lateral, aponta para Gaspar.

## Adicionando um projeto

1. Converta as capturas para WebP e coloque em `img-<projeto>-<ano>/`, numeradas a partir de
   `img0.webp`.
2. Copie o `<li>` de um projeto parecido e ajuste título, ano, link do PDF, texto e carrossel.
3. No carrossel, o `id` precisa ser único na página — ele aparece em `data-bs-target` nos
   indicadores e nos dois botões de navegação. Indicadores e slides têm que ter a mesma
   quantidade, e só um slide leva `active`.
4. Posicione o item na ordem decrescente por ano.
5. Se a descrição da página enumera os projetos, atualize as três meta tags.
6. Página nova também entra no `sitemap.xml`.

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
pode ser disparado à mão pela aba Actions. Não existe `_config.yml`: o Jekyll apenas copia os
arquivos como estão.

Os downloads dos jogos (builds para Windows e Android) ficam no Google Drive, linkados a partir
da página de game dev. Eles não estão versionados aqui.

## Licença

MIT. Veja [LICENSE](LICENSE).

O código do site é MIT. Os PDFs de TCC, dissertação, relatórios de pesquisa e o livro são de
seus respectivos autores e estão aqui apenas para consulta.
