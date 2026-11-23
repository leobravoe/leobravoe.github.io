---
# RASCUNHO. Rascunhos em _drafts não são publicados.
# Para publicar: revise o texto, mova para _posts/ com a data na frente do nome
# (ex.: _posts/2026-12-01-benchmarking-de-apis-quatro-linguagens.md) e faça o push.
# Com o primeiro post publicado, o link "Blog" aparece na navbar sozinho.
title: "Benchmarking de APIs: o que muda entre Java, Node.js, Python e Rust sob carga"
description: "Resultados do projeto de iniciação científica que comparou a mesma API RESTful em Java/Quarkus, Node/Fastify, Python/FastAPI e Rust/Axum sob testes de carga."
atualizado: 2026-11-22
---

Qual linguagem escolher para uma API que precisa aguentar muitas requisições ao mesmo tempo?
Para responder com dados, e não com opinião, o projeto de iniciação científica
[Benchmarking de APIs em Diferentes Ambientes de Programação](/portfolio/pesquisa/benchmarking-apis/),
desenvolvido no IFSC — Câmpus Lages em 2025, implementou **a mesma API** em quatro ecossistemas e
mediu o comportamento de cada uma sob carga.

## Como o experimento foi montado

- **Quatro implementações equivalentes**, seguindo a mesma especificação e a mesma arquitetura:
  Java/GraalVM/Quarkus, JavaScript/Node/Fastify, Python/Uvicorn/FastAPI e Rust/Tokio/Axum.
- **Mesmo ambiente para todas**: duas instâncias de cada variante atrás de um Nginx com
  balanceamento *round-robin*, um PostgreSQL compartilhado e limites idênticos de CPU e memória.
- **Testes de carga com Gatling**, em fases de aquecimento, regime permanente e resfriamento,
  repetidos para dar validade estatística.
- **Métricas**: latência (p50, p95 e p99), *throughput*, taxa de erros, consistência dos dados e
  consumo de CPU e memória, analisadas com testes não paramétricos e intervalos de confiança por
  *bootstrap*.

## O que os resultados mostram

<!-- REVISAR: completar com os números do relatório final (tabelas de p95/p99 por linguagem). -->

Os dados indicam que três ajustes de configuração pesam muito na latência de cauda,
independentemente da linguagem:

1. **Conexões persistentes** com o banco;
2. **Prepared statements**;
3. **Calibração do pool de conexões**.

Com eles, as latências de cauda e a variabilidade caem quando o sistema está sob pressão. Outro
achado é que o **formato de transporte e a serialização** podem deslocar bastante o p95 e o p99,
mesmo com o banco e o conjunto de operações mantidos iguais.

## Para saber mais

- Página do projeto: [Benchmarking de APIs](/portfolio/pesquisa/benchmarking-apis/)
- [Relatório final (PDF)](/portfolio/pesquisa/relatorios/relatorio-final-benchmarking-apis-2025.pdf)

O trabalho foi apresentado na VII Mostra 3 Minutos de Ciência e Tecnologia, na 22ª Semana
Nacional de Ciência e Tecnologia do IFSC, em novembro de 2025. Participaram como discentes
pesquisadores Fabricio Iaronka de Souza e Vinicius Souza Corbellini.
