/**
 * Dados da landing page.
 *
 * Marcadores usados nos textos (convertidos em HTML por `renderMarkup`):
 *   {{termo}}  -> termo canônico do glossário (versão DaoTranslate)
 *   !!termo!!  -> erro de tradução literal (versão tradutor comum)
 *   []         -> glifo ausente na fonte original (quadradinho)
 */

export interface GlossaryHighlight {
  zh: string;
  pinyin: string;
  canonical: string;
  literalWrong: string;
}

export interface ComparisonScene {
  id: string;
  game: string;
  zhTitle: string;
  genre: string;
  context: string;
  zhOriginal: string;
  literal: string;
  curated: string;
  literalHtml: string;
  curatedHtml: string;
  latencyMs: number;
  hashPreview: string;
  errors: string[];
  highlights: GlossaryHighlight[];
}

const GOOD = 'text-white font-medium underline decoration-zinc-600 decoration-1 underline-offset-[6px]';
const BAD = 'text-rose-300 underline decoration-rose-400/60 decoration-wavy decoration-1 underline-offset-[6px]';
const GLYPH = 'inline-block align-middle mx-0.5 px-1 rounded bg-rose-500/15 text-rose-300 font-mono text-[0.7em] leading-tight';

export function renderMarkup(text: string): string {
  return text
    .replace(/\{\{(.+?)\}\}/g, `<span class="${GOOD}">$1</span>`)
    .replace(/!!(.+?)!!/g, `<span class="${BAD}">$1</span>`)
    .replace(/\[\]/g, `<span class="${GLYPH}">[]</span>`);
}

type RawScene = Omit<ComparisonScene, 'literalHtml' | 'curatedHtml'>;

const RAW_SCENES: RawScene[] = [
  {
    id: 'tale-of-immortal',
    game: 'Tale of Immortal',
    zhTitle: '鬼谷八荒',
    genre: 'Xianxia',
    context: 'Tribulação ao romper para Alma Nascente',
    zhOriginal: '体内灵气激荡，丹田欲裂，唯有坚定道心方可突破元婴期！',
    literal:
      '“O !!gás inteligente!! no corpo está agitando, o !!campo vermelho!! quer rachar, só o !!coração firme da estrada!! pode quebrar o !!período do bebê original!![][]!”',
    curated:
      '“O {{Qi Espiritual}} agita-se em seu corpo e seu {{Dantian}} está prestes a se romper! Apenas com um {{Coração do Dao}} inabalável você alcançará a {{Alma Nascente}}.”',
    latencyMs: 12,
    hashPreview: '9f84c2e1',
    errors: [
      '灵气 virou "gás inteligente"',
      '丹田 virou "campo vermelho"',
      '元婴期 virou "período do bebê original"'
    ],
    highlights: [
      { zh: '灵气', pinyin: 'Líng Qì', canonical: 'Qi Espiritual', literalWrong: 'Gás inteligente' },
      { zh: '丹田', pinyin: 'Dān Tián', canonical: 'Dantian', literalWrong: 'Campo vermelho' },
      { zh: '元婴期', pinyin: 'Yuán Yīng', canonical: 'Alma Nascente', literalWrong: 'Bebê original' }
    ]
  },
  {
    id: 'wandering-sword',
    game: 'Wandering Sword',
    zhTitle: '逸剑风云决',
    genre: 'Wuxia',
    context: 'Avaliando um oponente em uma taverna',
    zhOriginal: '此人内力深厚，任督二脉已通，恐怕是少林寺的高手。',
    literal:
      '“A !!força de dentro!! desta pessoa é profunda, as !!duas veias Ren Du já passaram!!, tenho medo que seja a !!mão alta!! do templo Shaolin[].”',
    curated:
      '“Este homem possui {{Energia Interna}} profunda e já desobstruiu os {{Meridianos Ren e Du}}. Provavelmente é um {{mestre}} do Templo Shaolin.”',
    latencyMs: 11,
    hashPreview: '3c71a809',
    errors: [
      '内力 virou "força de dentro"',
      '任督二脉 virou "duas veias Ren Du"',
      '高手 virou "mão alta"'
    ],
    highlights: [
      { zh: '内力', pinyin: 'Nèi Lì', canonical: 'Energia Interna', literalWrong: 'Força de dentro' },
      { zh: '任督二脉', pinyin: 'Rèn Dū', canonical: 'Meridianos Ren e Du', literalWrong: 'Duas veias' },
      { zh: '高手', pinyin: 'Gāo Shǒu', canonical: 'Mestre', literalWrong: 'Mão alta' }
    ]
  },
  {
    id: 'amazing-cultivation',
    game: 'Amazing Cultivation Simulator',
    zhTitle: '了不起的修仙模拟器',
    genre: 'Simulador de Cultivo',
    context: 'Relatório de alquimia da seita',
    zhOriginal: '弟子炼制筑基丹失败，丹炉炸裂，需重新布置聚灵阵。',
    literal:
      '“O discípulo falhou em refinar a !!pílula de construção de base!!, o !!forno de pílula!! explodiu, precisa reorganizar o !!array de reunir espírito!![].”',
    curated:
      '“O discípulo falhou ao refinar a {{Pílula de Fundação}}; o {{Caldeirão Alquímico}} explodiu. É preciso reposicionar a {{Formação de Coleta de Qi}}.”',
    latencyMs: 13,
    hashPreview: 'a52e0d17',
    errors: [
      '筑基丹 virou "pílula de construção de base"',
      '丹炉 virou "forno de pílula"',
      '聚灵阵 virou "array de reunir espírito"'
    ],
    highlights: [
      { zh: '筑基丹', pinyin: 'Zhù Jī Dān', canonical: 'Pílula de Fundação', literalWrong: 'Pílula de base' },
      { zh: '丹炉', pinyin: 'Dān Lú', canonical: 'Caldeirão Alquímico', literalWrong: 'Forno de pílula' },
      { zh: '聚灵阵', pinyin: 'Jù Líng Zhèn', canonical: 'Formação de Coleta de Qi', literalWrong: 'Array de espírito' }
    ]
  },
  {
    id: 'heros-adventure',
    game: "Hero's Adventure",
    zhTitle: '大侠立志传',
    genre: 'Wuxia • Mundo Aberto',
    context: 'Mensagem ao dominar uma técnica',
    zhOriginal: '你的轻功已臻化境，江湖中鲜有敌手。',
    literal:
      '“Seu !!kung fu leve!! chegou ao !!reino da transformação!!, poucos oponentes nos !!rios e lagos!![].”',
    curated:
      '“Sua {{Arte da Leveza}} atingiu a {{perfeição}}; poucos no {{Jianghu}} podem rivalizar com você.”',
    latencyMs: 10,
    hashPreview: '7d19f44a',
    errors: [
      '轻功 virou "kung fu leve"',
      '化境 virou "reino da transformação"',
      '江湖 virou "rios e lagos"'
    ],
    highlights: [
      { zh: '轻功', pinyin: 'Qīng Gōng', canonical: 'Arte da Leveza', literalWrong: 'Kung fu leve' },
      { zh: '化境', pinyin: 'Huà Jìng', canonical: 'Perfeição', literalWrong: 'Reino da transformação' },
      { zh: '江湖', pinyin: 'Jiāng Hú', canonical: 'Jianghu (mundo marcial)', literalWrong: 'Rios e lagos' }
    ]
  }
];

export const COMPARISON_SCENES: ComparisonScene[] = RAW_SCENES.map((s) => ({
  ...s,
  literalHtml: renderMarkup(s.literal),
  curatedHtml: renderMarkup(s.curated)
}));

export const GENRES = [
  'Xianxia',
  'Wuxia',
  'Simuladores de Cultivo',
  'RPGs de Mundo Aberto',
  'Sandbox Marcial'
];

export interface CatalogGame {
  id: string;
  title: string;
  zhTitle: string;
  genre: string;
  engine: string;
  status: 'verified' | 'testing' | 'voting';
  statusLabel: string;
  initialVotes: number;
}

export const CATALOG_GAMES: CatalogGame[] = [
  {
    id: 'guigubahuang',
    title: 'Tale of Immortal',
    zhTitle: '鬼谷八荒',
    genre: 'Xianxia',
    engine: 'Unity',
    status: 'verified',
    statusLabel: 'Beta inicial',
    initialVotes: 342
  },
  {
    id: 'wanderingsword',
    title: 'Wandering Sword',
    zhTitle: '逸剑风云决',
    genre: 'Wuxia',
    engine: 'Unreal Engine',
    status: 'testing',
    statusLabel: 'Em homologação',
    initialVotes: 219
  },
  {
    id: 'herosadventure',
    title: "Hero's Adventure",
    zhTitle: '大侠立志传',
    genre: 'Wuxia • Mundo Aberto',
    engine: 'Unity',
    status: 'voting',
    statusLabel: 'Em votação',
    initialVotes: 164
  },
  {
    id: 'matchlesskungfu',
    title: 'The Matchless Kungfu',
    zhTitle: '绝世好武功',
    genre: 'Sandbox Marcial',
    engine: 'Unreal Engine',
    status: 'voting',
    statusLabel: 'Em votação',
    initialVotes: 128
  },
  {
    id: 'acs',
    title: 'Amazing Cultivation Simulator',
    zhTitle: '了不起的修仙模拟器',
    genre: 'Simulador de Cultivo',
    engine: 'Unity',
    status: 'voting',
    statusLabel: 'Em votação',
    initialVotes: 97
  },
  {
    id: 'suggest',
    title: 'Sugira um jogo',
    zhTitle: '',
    genre: 'RPGs asiáticos densos em texto',
    engine: '—',
    status: 'voting',
    statusLabel: 'Aberto',
    initialVotes: 0
  }
];
