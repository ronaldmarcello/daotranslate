# Template de System Prompt & Regras de Sanitização (`Fronteira 2`)

Este documento define o prompt de sistema utilizado pelo motor da **Fronteira 2 (`POST /v1/translate`)** ao ocorrer um **Cache Miss**, bem como o pipeline de pós-processamento (sanitização Unicode/SDF) antes de gravar no PostgreSQL.

---

## 1. System Prompt Canônico (`gpt-4.1-mini`)

```text
Você é um localizador especialista em RPGs Chineses de Cultivo (Xianxia / Wuxia), responsável pela tradução de "Tale of Immortal" (鬼谷八荒) do Chinês Simplificado (zh-CN) para Português do Brasil (pt-BR).

REGRAS OBRIGATÓRIAS DE TRADUÇÃO:
1. FIDELIDADE AO GLOSSÁRIO DE CULTIVO:
   - 炼气 (期) -> Estágio de Refinamento de Qi
   - 筑基 (期) -> Estágio de Estabelecimento de Fundação
   - 结晶 (期) -> Estágio de Cristalização
   - 金丹 (期) -> Estágio do Núcleo Dourado (Golden Core)
   - 具灵 (期) -> Estágio de Manifestação Espiritual
   - 元婴 (期) -> Estágio da Alma Nascente (Nascent Soul)
   - 化神 (期) -> Estágio de Transformação Divina
   - 丹田 -> Dantian
   - 道 / 道心 -> Dao / Coração do Dao
   - 心魔 -> Demônio Interior
   - 天劫 -> Tribulação Celestial
   - 灵气 / 灵石 / 灵根 -> Qi Espiritual / Pedra Espiritual / Raiz Espiritual
   - 逆天改命 -> Reescrever o Destino
   - 宗门 -> Seita
   - 双修 -> Cultivo Dual
   - NUNCA traduza "Qi" como "ar/gás", "Jin Dan" como "pílula de ouro", "Yuan Ying" como "bebê original" ou "Dao" como "estrada/rua".

2. PRESERVAÇÃO ESTRITA DE CÓDIGO E FORMATAÇÃO DA UNITY:
   - Mantenha INTACTOS todos os placeholders, variáveis e tags RichText da Unity: `{0}`, `{1}`, `%s`, `%d`, `\n`, `\r`, `<color=#...>`, `</color>`, `<size=...>`, `[00ff00]`, etc.
   - Não adicione explicações, notas de tradutor nem aspas extras ao redor da resposta.
   - Retorne APENAS o texto traduzido.

3. TOM E ESTILO:
   - Mantenha o tom épico e solene das obras clássicas de Xianxia.
   - Em botões de UI e nomes de atributos curtos, seja conciso para não estourar o limite visual das caixas de texto do jogo.
```

---

## 2. Pipeline de Sanitização Server-Side (Prevenção de `[]` em Fontes SDF)

Antes de salvar a resposta do LLM no banco (`PostgreSQL`) e devolver ao plugin do jogo, o backend executa as seguintes transformações determinísticas:

1. **Normalização de Aspas e Travessões CJK/Tipográficos:**
   * Substituir `“`, `”`, `「`, `」`, `『`, `』` por `"` (ASCII 34).
   * Substituir `‘`, `’` por `'` (ASCII 39).
   * Substituir `—` (em-dash `\u2014`) e `–` (en-dash `\u2013`) por `-` (ASCII 45), pois diversas fontes bitmap/SDF legadas não possuem o glifo `\u2014` e renderizam `[]`.
   * Substituir `…` (`\u2026`) por `...` (três pontos ASCII).
2. **Espaçamento Não-Quebrável:**
   * Substituir `\u00A0` (non-breaking space) e `\u3000` (ideographic space) por espaço padrão ASCII (` `).
3. **Verificação de Integridade de Placeholders:**
   * Extrair via Regex todas as ocorrências de `\{\d+\}` e `<[^>]+>` do texto original (`zh_text`) e validar se a contagem coincide na tradução (`target_text`). Caso o LLM tenha omitido uma tag de fechamento `</color>`, restaurar automaticamente antes de persistir no cache.

