---
title: "Benchmarking de APIs em quatro linguagens: como medir a latência de cauda sob carga"
description: "Como o projeto de iniciação científica do IFSC comparou a mesma API RESTful em Java/Quarkus, Node/Fastify, Python/FastAPI e Rust/Axum, e o que pesou mais no p95 e no p99."
atualizado: 2026-11-22
---

Qual linguagem escolher para uma API que precisa aguentar muitas requisições ao mesmo tempo?
Para responder com dados, e não com opinião, o projeto de iniciação científica
[Benchmarking de APIs em Diferentes Ambientes de Programação](/portfolio/pesquisa/benchmarking-apis/),
desenvolvido no IFSC — Câmpus Lages em 2025, implementou **a mesma API** de débitos e créditos
em quatro ecossistemas e mediu o comportamento de cada uma sob carga.

## Como o experimento foi montado

- **Quatro implementações equivalentes**, com a mesma especificação e a mesma arquitetura:
  Java/GraalVM/Quarkus, JavaScript/Node/Fastify, Python/Uvicorn/FastAPI e Rust/Tokio/Axum.
- **Mesmo ambiente para todas**: duas instâncias de cada variante atrás de um Nginx com
  balanceamento *round-robin*, um PostgreSQL fixo (mesmo motor, versão e parâmetros) e limites
  idênticos de CPU e memória, com orçamento total de memória dos contêineres de até 350 MB.
- **Reprodutibilidade**: manifestos de versão, *health check*/*readiness*, pinagem de CPU e cotas
  de memória via cgroups.
- **Carga com Gatling**, em modelo aberto, com rampas e patamares estáveis de usuários virtuais e
  fases de aquecimento, regime permanente e resfriamento.
- **Métricas**: latência (p50, p95 e p99), *throughput*, taxa de erros, uso de recursos e
  consistência lógica (idempotência por chave).

## Olhando para o pior caso, não para a média

Cada execução foi dividida em blocos numerados. Em cada bloco, calculou-se um "p99 médio": a média
dos p99 das cinco categorias de requisição (todas, validações, extratos, créditos e débitos). Os
**cinco blocos com maior p99 médio** de cada execução foram separados, e é sobre eles que se
comparam p95, p99 e latência média, com o desvio-padrão como barra de erro.

Esse recorte mostra o "pior cenário consistente" de cada variante. Comparar o p99 com a média
ajuda a separar dois problemas diferentes: piora só na cauda (o p99 sobe e a média não) e
degradação geral do tempo de resposta (os dois sobem juntos). As comparações entre variantes
usaram testes não paramétricos e intervalos de confiança por *bootstrap*.

## O que pesou mais

O que mais reduziu as latências de cauda e a variabilidade sob pressão não foi a linguagem, e sim
a camada de acesso a dados:

1. **Conexões persistentes** com o banco;
2. **Prepared statements**;
3. **Pool de conexões calibrado**.

Outro achado: o **formato de transporte e a serialização/decodificação** podem deslocar bastante
o p95 e o p99, dependendo do cliente e do runtime, mesmo com o banco e o conjunto de operações
mantidos iguais.

## Limites e próximos passos

A variante em Go, prevista no plano, ficou de fora para não abrir o escopo sem ganho
proporcional de evidência. A avaliação exaustiva de formatos binários de transporte e a matriz
completa de injeção de falhas (latência, perda, *jitter* e *backoff*) também foram reduzidas. Os
próximos passos incluem incluir Go, aprofundar os efeitos de GC/JIT por runtime e repetir o
protocolo em outros hardwares, inclusive em nuvem.

## Para saber mais

- Página do projeto: [Benchmarking de APIs](/portfolio/pesquisa/benchmarking-apis/)
- [Relatório final (PDF)](/portfolio/pesquisa/relatorios/relatorio-final-benchmarking-apis-2025.pdf)
- Código das implementações:
  [Rust](https://github.com/leobravoe/rust-backend-debitos-creditos-rinha-2024),
  [Node/Fastify](https://github.com/leobravoe/node-fastify-backend-debitos-creditos-rinha-2024),
  [Python/FastAPI](https://github.com/FabricioIaronka/pythonAPI-rinha-2025) e
  [Java/Quarkus](https://github.com/ViniciusCorbellini/rinha-quarkus)

O trabalho foi apresentado na VII Mostra 3 Minutos de Ciência e Tecnologia, na 22ª Semana
Nacional de Ciência e Tecnologia do IFSC, em novembro de 2025. Participaram como discentes
pesquisadores Fabricio Iaronka de Souza e Vinícius Souza Corbellini.
