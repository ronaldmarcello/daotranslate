-- ============================================================================
-- AI ALL GAMES TRANSLATOR - Content-Addressable Cache & Glossary Schema (PostgreSQL)
-- Fronteira 2: Cloud AI & Cache Gateway
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela de Jogos Homologados (Catálogo Curado)
CREATE TABLE IF NOT EXISTS supported_games (
    game_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    engine VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'verified', -- 'verified', 'testing', 'voting'
    sdf_font_package_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabela de Glossário Contextual por Jogo
CREATE TABLE IF NOT EXISTS game_glossary_terms (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(64) NOT NULL REFERENCES supported_games(game_id) ON DELETE CASCADE,
    zh_term VARCHAR(128) NOT NULL,
    pinyin VARCHAR(128),
    canonical_pt_br VARCHAR(255) NOT NULL,
    canonical_en VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL DEFAULT 'cultivation', -- 'realm', 'concept', 'skill', 'sect'
    forbidden_literals TEXT[],
    UNIQUE (game_id, zh_term)
);

-- 3. Tabela Principal: Content-Addressable Translation Cache (SHA-256)
-- Lookup O(1) em <15ms usando o índice composto (game_id, target_lang, source_hash)
CREATE TABLE IF NOT EXISTS translation_cache (
    id BIGSERIAL PRIMARY KEY,
    game_id VARCHAR(64) NOT NULL REFERENCES supported_games(game_id) ON DELETE CASCADE,
    target_lang VARCHAR(16) NOT NULL DEFAULT 'pt-BR',
    source_hash CHAR(64) NOT NULL, -- SHA-256 hex de trim(zh_text)
    zh_text TEXT NOT NULL,
    target_text TEXT NOT NULL,
    model_used VARCHAR(64) NOT NULL DEFAULT 'gpt-4.1-mini',
    hit_count BIGINT NOT NULL DEFAULT 0,
    is_curated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_game_lang_hash UNIQUE (game_id, target_lang, source_hash)
);

CREATE INDEX IF NOT EXISTS idx_translation_lookup
    ON translation_cache (game_id, target_lang, source_hash);

-- ============================================================================
-- SEED INICIAL: Jogo Âncora #1 (Tale of Immortal / Guigu Bahuang)
-- ============================================================================

INSERT INTO supported_games (game_id, title, engine, status)
VALUES
    ('guigubahuang', 'Tale of Immortal (鬼谷八荒)', 'Unity IL2CPP', 'verified'),
    ('wanderingsword', 'Wandering Sword (逸剑风云决)', 'Unreal Engine 4', 'testing'),
    ('herosadventure', 'Hero''s Adventure: Road to Passion (大侠立志传)', 'Unity', 'voting'),
    ('matchlesskungfu', 'The Matchless Kungfu (绝世好武功)', 'Unreal Engine 5', 'voting')
ON CONFLICT (game_id) DO NOTHING;

-- Seed de Termos Críticos do Glossário de Tale of Immortal
INSERT INTO game_glossary_terms (game_id, zh_term, pinyin, canonical_pt_br, canonical_en, category, forbidden_literals)
VALUES
    ('guigubahuang', '炼气期', 'Liàn Qì Qī', 'Estágio de Refinamento de Qi', 'Qi Refining Stage', 'realm', ARRAY['Refinamento de Gás', 'Período de Ar']),
    ('guigubahuang', '筑基期', 'Zhù Jī Qī', 'Estágio de Estabelecimento de Fundação', 'Foundation Establishment Stage', 'realm', ARRAY['Construção de Base', 'Terraplenagem']),
    ('guigubahuang', '结晶期', 'Jié Jīng Qī', 'Estágio de Cristalização', 'Qi Condensation Stage', 'realm', ARRAY['Congelamento', 'Período de Gelo']),
    ('guigubahuang', '金丹期', 'Jīn Dān Qī', 'Estágio do Núcleo Dourado (Golden Core)', 'Golden Core Stage', 'realm', ARRAY['Pílula de Ouro', 'Comprimido Dourado']),
    ('guigubahuang', '具灵期', 'Jù Líng Qī', 'Estágio de Manifestação Espiritual', 'Spirit Sight Stage', 'realm', ARRAY['Ferramenta Espiritual']),
    ('guigubahuang', '元婴期', 'Yuán Yīng Qī', 'Estágio da Alma Nascente (Nascent Soul)', 'Nascent Soul Stage', 'realm', ARRAY['Bebê Original', 'Feto Primordial']),
    ('guigubahuang', '化神期', 'Huà Shén Qī', 'Estágio de Transformação Divina', 'Deity Transformation Stage', 'realm', ARRAY['Química de Deus']),
    ('guigubahuang', '丹田', 'Dān Tián', 'Dantian', 'Dantian', 'concept', ARRAY['Campo de Cinábrio', 'Plantação Vermelha']),
    ('guigubahuang', '道心', 'Dào Xīn', 'Coração do Dao', 'Dao Heart', 'concept', ARRAY['Coração da Estrada', 'Mente da Rua']),
    ('guigubahuang', '心魔', 'Xīn Mó', 'Demônio Interior', 'Heart Demon', 'concept', ARRAY['Diabo Cardíaco']),
    ('guigubahuang', '天劫', 'Tiān Jié', 'Tribulação Celestial', 'Heavenly Tribulation', 'concept', ARRAY['Roubo do Céu']),
    ('guigubahuang', '逆天改命', 'Nì Tiān Gǎi Mìng', 'Reescrever o Destino', 'Rewrite Destiny', 'concept', ARRAY['Mudar a Vida Contra o Clima']),
    ('guigubahuang', '双修', 'Shuāng Xiū', 'Cultivo Dual', 'Dual Cultivation', 'concept', ARRAY['Reparo Duplo', 'Conserto em Par'])
ON CONFLICT (game_id, zh_term) DO NOTHING;

-- Seed de Frases Reais no Cache SHA-256 (Exemplos Prontos para Hit Instantâneo)
INSERT INTO translation_cache (game_id, target_lang, source_hash, zh_text, target_text, is_curated)
VALUES
    (
        'guigubahuang',
        'pt-BR',
        encode(digest('体内灵气激荡，丹田欲裂，唯有坚定道心方可突破元婴期！', 'sha256'), 'hex'),
        '体内灵气激荡，丹田欲裂，唯有坚定道心方可突破元婴期！',
        'O Qi Espiritual agita-se em seu corpo e seu Dantian está prestes a se romper! Apenas com um Coração do Dao inabalável você conseguirá avançar para o Estágio da Alma Nascente (Nascent Soul)!',
        TRUE
    ),
    (
        'guigubahuang',
        'pt-BR',
        encode(digest('此人金丹已成，绝非寻常炼气期修士可比。', 'sha256'), 'hex'),
        '此人金丹已成，绝非寻常炼气期修士可比。',
        'Este cultivador já formou seu Núcleo Dourado (Golden Core); ele jamais pode ser comparado a um mero praticante do Refinamento de Qi.',
        TRUE
    ),
    (
        'guigubahuang',
        'pt-BR',
        encode(digest('突破瓶颈时遭遇天劫，若道心不稳恐生心魔。', 'sha256'), 'hex'),
        '突破瓶颈时遭遇天劫，若道心不稳恐生心魔。',
        'Ao romper o gargalo e enfrentar a Tribulação Celestial, se o seu Coração do Dao vacilar, um Demônio Interior nascerá.',
        TRUE
    )
ON CONFLICT (game_id, target_lang, source_hash) DO NOTHING;

