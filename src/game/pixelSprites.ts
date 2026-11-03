import { EnemyType, HeroClassId, PetId, SkinTier, WeaponId } from './types';

function createPixelSprite(
  grid: string[],
  palette: Record<string, string>,
  scale: number = 3,
  overrideFill?: string
): HTMLCanvasElement {
  const h = grid.length;
  const w = grid[0].length;
  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < h; y++) {
    const row = grid[y];
    for (let x = 0; x < w; x++) {
      const ch = row[x];
      if (ch !== '.' && palette[ch]) {
        ctx.fillStyle = overrideFill
          ? ch === 'o'
            ? '#1e293b'
            : overrideFill
          : palette[ch];
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
  return canvas;
}

export interface SpriteBank {
  heroes: Record<HeroClassId, [HTMLCanvasElement, HTMLCanvasElement]>;
  heroesSkins: Record<
    HeroClassId,
    Record<SkinTier, [HTMLCanvasElement, HTMLCanvasElement]>
  >;
  heroesSilhouette: Record<HeroClassId, [HTMLCanvasElement, HTMLCanvasElement]>;
  heroesGhost: Record<HeroClassId, [HTMLCanvasElement, HTMLCanvasElement]>;
  pets: Record<PetId, [HTMLCanvasElement, HTMLCanvasElement]>;
  enemies: Record<EnemyType, [HTMLCanvasElement, HTMLCanvasElement]>;
  enemiesRedFlash: Record<EnemyType, [HTMLCanvasElement, HTMLCanvasElement]>;
  weapons: Record<WeaponId, HTMLCanvasElement>;
  chestClosed: HTMLCanvasElement;
  chestOpen: HTMLCanvasElement;
  potion: HTMLCanvasElement;
  gold: HTMLCanvasElement;
  manaOrb: HTMLCanvasElement;
  expGem: HTMLCanvasElement;
  shrine: HTMLCanvasElement;
  statue: HTMLCanvasElement;
  merchant: HTMLCanvasElement;
  crate: HTMLCanvasElement;
  vase: HTMLCanvasElement;
}

let cachedBank: SpriteBank | null = null;

export function getSpriteBank(): SpriteBank {
  if (cachedBank) return cachedBank;

  // ==========================================================================
  // 1. VANGUARD KNIGHT (3 Skin Palettes: Default, Rare Cobalt, Legendary Seraph)
  // ==========================================================================
  const knightPalettes: Record<SkinTier, Record<string, string>> = {
    default: {
      o: '#090b10',
      r: '#e11d48',
      R: '#fb7185',
      s: '#cbd5e1',
      m: '#64748b',
      d: '#334155',
      g: '#f59e0b',
      G: '#fde047',
    },
    rare: {
      o: '#090b10',
      r: '#0284c7',
      R: '#38bdf8',
      s: '#e0f2fe',
      m: '#0369a1',
      d: '#1e3a8a',
      g: '#38bdf8',
      G: '#bae6fd',
    },
    legendary: {
      o: '#090b10',
      r: '#9333ea',
      R: '#e879f9',
      s: '#fef08a',
      m: '#f59e0b',
      d: '#b45309',
      g: '#ffffff',
      G: '#fef08a',
    },
  };

  const knightFrame0 = [
    '......oooo......',
    '.....oRrrro.....',
    '....oRrrrro.....',
    '....osssssso....',
    '...ossmmmmss....',
    '...osdoosdos....',
    '...ossmmmmss....',
    '....oooooooo....',
    '...orGGGGssso...',
    '..orrGggGmmmmo..',
    '..orrgGGgddddo..',
    '..o.ooooooooo...',
    '....oddd.oddo...',
    '....osso.osso...',
    '....oooo.oooo...',
    '................',
  ];

  const knightFrame1 = [
    '.....oooo.......',
    '....oRrrro......',
    '....oRrrrro.....',
    '....osssssso....',
    '...ossmmmmss....',
    '...osdoosdos....',
    '...ossmmmmss....',
    '....oooooooo....',
    '..oorGGGGssso...',
    '.orrGggGmmmmo...',
    '.orrgGGgddddo...',
    '..o.oooooooo....',
    '....oddo..oddo..',
    '...osso....osso.',
    '...oooo....oooo.',
    '................',
  ];

  // ==========================================================================
  // 2. ASH PYROMANCER (3 Skin Palettes: Default, Rare Frostfire, Legendary Astral)
  // ==========================================================================
  const pyroPalettes: Record<SkinTier, Record<string, string>> = {
    default: {
      o: '#090b10',
      p: '#7c2d12',
      P: '#c2410c',
      g: '#f59e0b',
      y: '#fde047',
      f: '#f97316',
      w: '#fef08a',
    },
    rare: {
      o: '#090b10',
      p: '#1e1b4b',
      P: '#312e81',
      g: '#38bdf8',
      y: '#7dd3fc',
      f: '#0284c7',
      w: '#e0f2fe',
    },
    legendary: {
      o: '#090b10',
      p: '#4c1d95',
      P: '#7e22ce',
      g: '#fde047',
      y: '#ffffff',
      f: '#f43f5e',
      w: '#fef08a',
    },
  };

  const pyroFrame0 = [
    '......oooo......',
    '.....oppppo.....',
    '....opPPPPpo....',
    '...opPggggPpo...',
    '...opooowoopo...',
    '...opooowoopo...',
    '....opggggpo....',
    '...opPPPPPPpo...',
    '..opPPgPPgPPpo..',
    '..opPPggggPPpo..',
    '...opPPPPPPpo...',
    '...opPggggPpo...',
    '....opPPPPpo....',
    '....oppo.oppo...',
    '....oooo.oooo...',
    '................',
  ];

  const pyroFrame1 = [
    '.....oooo.......',
    '....oppppo......',
    '....opPPPPpo....',
    '...opPggggPpo...',
    '...opooowoopo...',
    '...opooowoopo...',
    '....opggggpo....',
    '...opPPPPPPpo...',
    '..opPPgPPgPPpo..',
    '..opPPggggPPpo..',
    '...opPPPPPPpo...',
    '...opPggggPpo...',
    '....opPPPPpo....',
    '...oppo...oppo..',
    '...oooo...oooo..',
    '................',
  ];

  // ==========================================================================
  // 3. SHADOW ROGUE (3 Skin Palettes: Default, Rare Bloodmoon, Legendary Cyber)
  // ==========================================================================
  const roguePalettes: Record<SkinTier, Record<string, string>> = {
    default: {
      o: '#090b10',
      c: '#1e293b',
      C: '#334155',
      e: '#10b981',
      E: '#34d399',
    },
    rare: {
      o: '#090b10',
      c: '#31102f',
      C: '#4a154b',
      e: '#f43f5e',
      E: '#fb7185',
    },
    legendary: {
      o: '#090b10',
      c: '#0f172a',
      C: '#f59e0b',
      e: '#22d3ee',
      E: '#fef08a',
    },
  };

  const rogueFrame0 = [
    '......oooo......',
    '.....occcco.....',
    '....ocCCCCco....',
    '...ocCooooCco...',
    '...ocooEEooco...',
    '...ocCEeeECco...',
    '....oceeeecco...',
    '....ocCCCCco....',
    '...ooceeeecoo...',
    '...ooCCCCCCoo...',
    '....occcccco....',
    '....occ..cco....',
    '....occ..cco....',
    '....oee..eeo....',
    '....ooo..ooo....',
    '................',
  ];

  const rogueFrame1 = [
    '......oooo......',
    '.....occcco.....',
    '....ocCCCCco....',
    '...ocCooooCco...',
    '...ocooEEooco...',
    '...ocCEeeECco...',
    '....oceeeecco...',
    '....ocCCCCco....',
    '...ooceeeecoo...',
    '....oCCCCCCo....',
    '....occcccco....',
    '...occ....cco...',
    '...occ....cco...',
    '..oeeo....oeeo..',
    '..ooo......ooo..',
    '................',
  ];

  // ==========================================================================
  // 4. CYBER ALCHEMIST (3 Skin Palettes)
  // ==========================================================================
  const alchemistPalettes: Record<SkinTier, Record<string, string>> = {
    default: {
      o: '#090b10',
      a: '#0f766e',
      A: '#14b8a6',
      g: '#84cc16',
      G: '#bef264',
    },
    rare: {
      o: '#090b10',
      a: '#581c87',
      A: '#9333ea',
      g: '#38bdf8',
      G: '#e0f2fe',
    },
    legendary: {
      o: '#090b10',
      a: '#b45309',
      A: '#f59e0b',
      g: '#f43f5e',
      G: '#fef08a',
    },
  };

  const alchemistFrame0 = [
    '......oooo......',
    '.....oAAAAo.....',
    '....oAAAAAAo....',
    '...oAoooooooAo..',
    '...oAoGGooGGoAo.',
    '...oAoooooooAo..',
    '....oaaGGGGaa...',
    '...oAAAAAAAAAo..',
    '..oAAgAAAAAgAAo.',
    '..oAAgGGGGggAAo.',
    '...oaaaaaaaaao..',
    '....oaa..aao....',
    '....oaa..aao....',
    '....ogg..ggo....',
    '....ooo..ooo....',
    '................',
  ];

  const alchemistFrame1 = [
    '.....oooo.......',
    '....oAAAAo......',
    '....oAAAAAAo....',
    '...oAoooooooAo..',
    '...oAoGGooGGoAo.',
    '...oAoooooooAo..',
    '....oaaGGGGaa...',
    '...oAAAAAAAAAo..',
    '..oAAgAAAAAgAAo.',
    '..oAAgGGGGggAAo.',
    '...oaaaaaaaaao..',
    '...oaa....aao...',
    '...oaa....aao...',
    '..oggo....oggo..',
    '..ooo......ooo..',
    '................',
  ];

  // ==========================================================================
  // 5. VOID NECROMANCER (5th Class - Unlockable! 3 Skin Palettes)
  // ==========================================================================
  const necroHeroPalettes: Record<SkinTier, Record<string, string>> = {
    default: {
      o: '#090b10',
      v: '#3b0764',
      V: '#7e22ce',
      s: '#e2e8f0',
      c: '#c084fc',
      g: '#38bdf8',
    },
    rare: {
      o: '#090b10',
      v: '#064e3b',
      V: '#059669',
      s: '#ecfdf5',
      c: '#34d399',
      g: '#fde047',
    },
    legendary: {
      o: '#090b10',
      v: '#4c0519',
      V: '#be123c',
      s: '#fef08a',
      c: '#f59e0b',
      g: '#ffffff',
    },
  };

  const necroHeroFrame0 = [
    '...oo......oo...',
    '..occo....occo..',
    '...oVVVVVVVVo...',
    '...oVssssssVo...',
    '...oVsgoogsVo...',
    '....oVssssVo....',
    '...oVVcccccVVo..',
    '..oVVVcVVVcVVVo.',
    '..oVVVVVVVVVVVo.',
    '...ovvvvvvvvvo..',
    '...ovvccccvvvo..',
    '....ovv..vvo....',
    '....occ..cco....',
    '....ooo..ooo....',
    '................',
  ];

  const necroHeroFrame1 = [
    '..oo........oo..',
    '.occo......occo.',
    '...oVVVVVVVVo...',
    '...oVssssssVo...',
    '...oVsgoogsVo...',
    '....oVssssVo....',
    '...oVVcccccVVo..',
    '..oVVVcVVVcVVVo.',
    '..oVVVVVVVVVVVo.',
    '...ovvvvvvvvvo..',
    '...ovvccccvvvo..',
    '...ovv....vvo...',
    '..occo....occo..',
    '..ooo......ooo..',
    '................',
  ];

  // ==========================================================================
  // 6. BERSERKER TITAN (6th Class - Unlockable! 3 Skin Palettes)
  // ==========================================================================
  const berserkerPalettes: Record<SkinTier, Record<string, string>> = {
    default: {
      o: '#090b10',
      b: '#991b1b',
      B: '#ef4444',
      s: '#fde047',
      m: '#475569',
      w: '#f8fafc',
    },
    rare: {
      o: '#090b10',
      b: '#1e3a8a',
      B: '#3b82f6',
      s: '#38bdf8',
      m: '#94a3b8',
      w: '#e0f2fe',
    },
    legendary: {
      o: '#090b10',
      b: '#78350f',
      B: '#f59e0b',
      s: '#ffffff',
      m: '#fde047',
      w: '#fef08a',
    },
  };

  const berserkerFrame0 = [
    '..oo........oo..',
    '.osso......osso.',
    '..ooBBBBBBBBoo..',
    '..oBBwBBBBwBBo..',
    '..oBBBBssBBBBo..',
    '...oooooooooo...',
    '.oosssBBBBsssoo.',
    'oBBsBBBBBBBBsBBo',
    'oBBBBbssssbBBBBo',
    '.oo.ommmmmmo.oo.',
    '....ommmmmmo....',
    '....obb..bbo....',
    '....osso.osso...',
    '....oooo.oooo...',
    '................',
  ];

  const berserkerFrame1 = [
    '.oo..........oo.',
    'osso........osso',
    '..ooBBBBBBBBoo..',
    '..oBBwBBBBwBBo..',
    '..oBBBBssBBBBo..',
    '...oooooooooo...',
    '.oosssBBBBsssoo.',
    'oBBsBBBBBBBBsBBo',
    'oBBBBbssssbBBBBo',
    '.oo.ommmmmmo.oo.',
    '....ommmmmmo....',
    '...obb....bbo...',
    '..osso....osso..',
    '..oooo....oooo..',
    '................',
  ];

  // PETS
  const catPalette: Record<string, string> = {
    o: '#090b10',
    f: '#f59e0b',
    F: '#fde047',
    w: '#ffffff',
    r: '#ef4444',
  };
  const cat0 = [
    '..oo....oo..',
    '.oFFo..oFFo.',
    '.oFFFFFFFFo.',
    '.oFwoFFowFo.',
    '.oFFrrrrFFo.',
    '..oFFFFFFo..',
    '..offffffo..',
    '..ofo..ofo..',
    '..ooo..ooo..',
  ];
  const cat1 = [
    '..oo....oo..',
    '.oFFo..oFFo.',
    '.oFFFFFFFFo.',
    '.oFwoFFowFo.',
    '.oFFrrrrFFo.',
    '..oFFFFFFo..',
    '..offffffo..',
    '.ofo....ofo.',
    '.ooo....ooo.',
  ];

  const miniSlimePalette: Record<string, string> = {
    o: '#090b10',
    s: '#38bdf8',
    S: '#7dd3fc',
    w: '#ffffff',
  };
  const miniSlime0 = [
    '....oooo....',
    '..ooSSSSoo..',
    '.oSSwSSwSSo.',
    '.oSSSSSSSSo.',
    '.osssssssso.',
    '..oooooooo..',
  ];
  const miniSlime1 = [
    '...oooooo...',
    '.ooSSSSSSoo.',
    '.oSSwSSwSSo.',
    '.osssssssso.',
    '..oooooooo..',
    '............',
  ];

  const dragonPalette: Record<string, string> = {
    o: '#090b10',
    r: '#e11d48',
    R: '#fb7185',
    y: '#fde047',
  };
  const dragon0 = [
    '..oo....oo..',
    '.oyyo..oyyo.',
    '..oRRRRRRo..',
    '.oRyoRRoyRo.',
    'ooRRRRRRRRoo',
    '.o.orrrro.o.',
    '...or..ro...',
    '...oo..oo...',
  ];
  const dragon1 = [
    '.oo......oo.',
    'oyyo....oyyo',
    '..oRRRRRRo..',
    '.oRyoRRoyRo.',
    '.oRRRRRRRRo.',
    '...orrrro...',
    '..or....ro..',
    '..oo....oo..',
  ];

  // ENEMIES
  const slimePalette: Record<string, string> = {
    o: '#090b10',
    s: '#10b981',
    S: '#34d399',
    h: '#a7f3d0',
    d: '#047857',
    c: '#fde047',
    r: '#090b10',
    w: '#ffffff',
  };
  const slime0 = [
    '................',
    '................',
    '......oooo......',
    '....ooSSSSoo....',
    '...oSShhSSSSo...',
    '..oSShSSSSSSSo..',
    '..oSSsccccsSSo..',
    '.oSSwroccorwSSo.',
    '.oSSrroccorrSSo.',
    '.ossddddddddsso.',
    '..oooooooooooo..',
    '................',
  ];
  const slime1 = [
    '................',
    '.....oooooo.....',
    '...ooSSSSSSoo...',
    '..oSShhSSSSSSo..',
    '.oSShSSSSSSSSSo.',
    '.oSSssccccssSSo.',
    '.oSSwroccorwSSo.',
    '.oSSrroccorrSSo.',
    '..ossdddddddsso.',
    '...ooooooooooo..',
    '................',
    '................',
  ];

  const goblinPalette: Record<string, string> = {
    o: '#090b10',
    g: '#65a30d',
    G: '#84cc16',
    v: '#7e22ce',
    V: '#a855f7',
    r: '#ef4444',
    w: '#a16207',
    m: '#f43f5e',
    M: '#fde047',
  };
  const goblin0 = [
    '.....oooooo.....',
    '....ovVVVVvo....',
    '.oo.ovVggVvo.oo.',
    'oGGooGggggGooGGo',
    '.oo.ogrggro..oM.',
    '....ogggggo.omMo',
    '.....ovvvvo..ow.',
    '....ovVVVVvo.ow.',
    '...ovVvvvvVvoow.',
    '...ovvvvvvvvo.w.',
    '....oooooooo..w.',
    '....ogg..ggo....',
    '....ovv..vvo....',
    '....ooo..ooo....',
  ];
  const goblin1 = [
    '.....oooooo..M..',
    '....ovVVVVvoomMo',
    '.oo.ovVggVvo.ow.',
    'oGGooGggggGooGwo',
    '.oo.ogrggro..ow.',
    '....ogggggo..ow.',
    '.....ovvvvo..ow.',
    '....ovVVVVvo.w..',
    '...ovVvvvvVvo...',
    '...ovvvvvvvvo...',
    '....oooooooo....',
    '...ogg....ggo...',
    '...ovv....vvo...',
    '...ooo....ooo...',
  ];

  const golemPalette: Record<string, string> = {
    o: '#090b10',
    s: '#475569',
    m: '#334155',
    d: '#1e293b',
    f: '#f97316',
    y: '#fde047',
  };
  const golem0 = [
    '....oooooooo....',
    '...osssssssso...',
    '..ossmmmmmmss...',
    '..osmooyyoomso..',
    '..osmmffffmmso..',
    '.oossssssssssoo.',
    'ossmmffyffmmmsso',
    'osmmfffyyfffmmso',
    'osmmddddddddmmso',
    'ossmddddddddmsso',
    'osssmmmmmmmmsso.',
    '.ooo.oooooo.ooo.',
    '....oddd.dddo...',
    '...ossso.ossso..',
    '...oooo..ooooo..',
  ];
  const golem1 = [
    '...oooooooooo...',
    '..osssssssssso..',
    '.ossmmmmmmmmss..',
    '.osmooyyyyoomso.',
    '.osmmffffffmmso.',
    'oossssssssssssoo',
    'ossmmffyffmmmsso',
    'osmmfffyyfffmmso',
    'osmmddddddddmmso',
    '.oomddddddddmoo.',
    '..oommmmmmmmoo..',
    '...o.oooooo.o...',
    '..oddd....dddo..',
    '..ossso..ossso..',
    '..oooo....oooo..',
  ];

  const necroPalette: Record<string, string> = {
    o: '#090b10',
    p: '#581c87',
    P: '#9333ea',
    b: '#e2e8f0',
    c: '#38bdf8',
    m: '#c084fc',
  };
  const necro0 = [
    '.....oooooo.....',
    '....opPPPPpo....',
    '...opPbbbbPpo...',
    '...opboocobpo.m.',
    '...opbbbbbbpoomo',
    '....opboobpo..o.',
    '...opPPPPPPpo.o.',
    '..opPPmPPmPPpoo.',
    '..opPPPPPPPPpo..',
    '...oppppppppo...',
    '....oooooooo....',
    '....obb..bbo....',
    '....ooo..ooo....',
  ];
  const necro1 = [
    '.....oooooo...m.',
    '....opPPPPpo.omo',
    '...opPbbbbPpo.o.',
    '...opboocobpo.o.',
    '...opbbbbbbpo.o.',
    '....opboobpo..o.',
    '...opPPPPPPpo...',
    '..opPPmPPmPPpo..',
    '..opPPPPPPPPpo..',
    '...oppppppppo...',
    '....oooooooo....',
    '...obb....bbo...',
    '...ooo....ooo...',
  ];

  const bossPalette: Record<string, string> = {
    o: '#090b10',
    g: '#f59e0b',
    G: '#fde047',
    r: '#e11d48',
    R: '#fb7185',
    s: '#475569',
    S: '#94a3b8',
    w: '#fef08a',
  };
  const boss0 = [
    '....o..o..o..o......',
    '....ogGoGGoGgo...o..',
    '....oggggggggo..oRo.',
    '...ooSSSSSSSSoo.oRro',
    '..oSSssssssssSSooRo.',
    '..oSssoowwoossSo.s..',
    '..oSssrrrrrrssSo.s..',
    '.ooSSSSSSSSSSSSoos..',
    'oRrSSgRRRRRRgSSRrs..',
    'oRrrSgRGGGGgSSRrrs..',
    'oRrrSSgRRRRgSSrrrs..',
    'oRrrSSSSSSSSSSrrs...',
    '.oo.oSSSSSSSSo.os...',
    '....osssssssso..s...',
    '....osssoossso..o...',
    '...oSSSo..oSSSo.....',
    '...oooo....oooo.....',
  ];
  const boss1 = [
    '....o..o..o..o...o..',
    '....ogGoGGoGgo..oRo.',
    '....oggggggggo.oRro.',
    '...ooSSSSSSSSoooRo..',
    '..oSSssssssssSSos...',
    '..oSssoowwoossSos...',
    '..oSssrrrrrrssSos...',
    '.ooSSSSSSSSSSSSos...',
    'oRrSSgRRRRRRgSSRs...',
    'oRrrSgRGGGGgSSRrs...',
    'oRrrSSgRRRRgSSrrs...',
    '.oo.SSSSSSSSSS.os...',
    '....oSSSSSSSSo..s...',
    '...osssssssssso.o...',
    '...ossso..ossso.....',
    '..oSSSo....oSSSo....',
    '..oooo......oooo....',
  ];

  const dummyPalette: Record<string, string> = {
    o: '#090b10',
    w: '#b45309',
    W: '#d97706',
    s: '#fde047',
    r: '#ef4444',
  };
  const dummyGrid = [
    '.....oooo.....',
    '....oWWWWo....',
    '....oWrrWo....',
    '....oWWWWo....',
    '..oooWWWWooo..',
    '.oWWWWssWWWWo.',
    '..oooWWWWooo..',
    '....oWWWWo....',
    '....owwwwo....',
    '.....owwo.....',
    '...ooowwooo...',
    '...oooooooo...',
  ];

  // WEAPON SPRITES
  const weaponPalette: Record<string, string> = {
    o: '#090b10',
    s: '#e2e8f0',
    m: '#94a3b8',
    d: '#475569',
    g: '#f59e0b',
    y: '#fde047',
    b: '#38bdf8',
    r: '#f43f5e',
    e: '#10b981',
    w: '#92400e',
  };

  const broadswordGrid = [
    '.........ooo',
    '........osso',
    '.......ossmo',
    '..o...ossmo.',
    '.ogo.ossmo..',
    '..ogossmo...',
    '..ooggmo....',
    '.owgo.o.....',
    'owo.........',
  ];

  const daggersGrid = [
    '......ooo.',
    '.....oeeo.',
    '.o..oeemo.',
    'ogooeemo..',
    '.ogoomo...',
    'owgo......',
  ];

  const pistolGrid = [
    '..ooooooo.',
    '.ossssssmo',
    '.ommmmmddo',
    '.owwwoooo.',
    '.owwo.....',
    '..oo......',
  ];

  const shotgunGrid = [
    '..oooooooooo',
    '.osssssssssm',
    '.ommmmmmmddo',
    'owwwwwooooo.',
    'owwwo.......',
    '.ooo........',
  ];

  const plasmaGrid = [
    '..oooooooooo',
    '.oddbbbbbbbo',
    '.oddyyyyybbo',
    '.odddggggddo',
    '..owwo..ooo.',
    '..ooo.......',
  ];

  const staffGrid = [
    '........ooo.',
    '.......obyyo',
    '......obybbo',
    '.....ogoboo.',
    '....owgo....',
    '...owo......',
    '..owo.......',
    '.owo........',
  ];

  const bowGrid = [
    '....ooo.....',
    '...ow.ro....',
    '..ow...ro...',
    '..ow..ryyo..',
    '..ow...ro...',
    '...ow.ro....',
    '....ooo.....',
  ];

  const excaliburGrid = [
    '.........oooo',
    '........oyyyo',
    '.......oyyggo',
    '..o...oyyggo.',
    '.ogo.oyyggo..',
    '..ogoyyggo...',
    '..ooggggo....',
    '.orgo.oo.....',
    'oro..........',
  ];

  const frostLaserGrid = [
    '..ooooooooooo',
    '.ossbbbbbbbbo',
    '.ossbbwwwwbbo',
    '.odddbbbbdddo',
    '..oddo..oooo.',
    '..ooo........',
  ];

  // INTERACTABLES & DESTRUCTIBLE PROPS
  const chestPalette: Record<string, string> = {
    o: '#090b10',
    w: '#92400e',
    W: '#b45309',
    g: '#f59e0b',
    G: '#fde047',
  };
  const chestClosedGrid = [
    '............',
    '..oooooooo..',
    '.ogWWWWWWgo.',
    '.oWWWWWWWWo.',
    '.oggggggggo.',
    '.oWWWGGWWWo.',
    '.oWWWggWWWo.',
    '.ogwwwwwwgo.',
    '..oooooooo..',
    '............',
  ];
  const chestOpenGrid = [
    '.oooooooooo.',
    'ogWWWWWWWWgo',
    'oooooooooooo',
    '.ooGGGGGGoo.',
    '.oggggggggo.',
    '.oWWWGGWWWo.',
    '.oWWWggWWWo.',
    '.ogwwwwwwgo.',
    '..oooooooo..',
    '............',
  ];

  const cratePalette: Record<string, string> = {
    o: '#090b10',
    w: '#78350f',
    W: '#b45309',
    L: '#d97706',
    m: '#64748b',
  };
  const crateGrid = [
    '.oooooooooo.',
    'omLLLLLLLLmo',
    'oLWwwwwwwWLo',
    'oLWwLLLLwWLo',
    'oLWwLwwLwWLo',
    'oLWwLLLLwWLo',
    'oLWwwwwwwWLo',
    'omwwwwwwwwmo',
    '.oooooooooo.',
  ];

  const vasePalette: Record<string, string> = {
    o: '#090b10',
    b: '#0e7490',
    B: '#06b6d4',
    h: '#67e8f9',
    g: '#fbbf24',
  };
  const vaseGrid = [
    '...oooooo...',
    '..ogBBBBgo..',
    '...obbbbo...',
    '..oBBhhBBo..',
    '.oBBhBBBBBo.',
    '.oggggggggo.',
    '.oBBBBbbbbo.',
    '..obbbbbbo..',
    '...oooooo...',
  ];

  const potionGrid = [
    '....oooo....',
    '....oGgo....',
    '.....oo.....',
    '...oooooo...',
    '..orRRRRro..',
    '.orRRwwRRro.',
    '.orRRRRRRro.',
    '.orrrrrrrro.',
    '..oooooooo..',
    '............',
  ];
  const potionPalette: Record<string, string> = {
    o: '#090b10',
    G: '#fde047',
    g: '#d97706',
    r: '#be123c',
    R: '#f43f5e',
    w: '#ffffff',
  };

  const goldGrid = [
    '............',
    '....oooo....',
    '..ooGGGGoo..',
    '.oGGGGGGGG..',
    '.oGGggggGGoo',
    '.oggggggggGo',
    '..ooooooooo.',
    '............',
  ];

  const manaOrbGrid = [
    '....oo....',
    '..ooBBoo..',
    '.oBBwwBBo.',
    '.oBBBBbbo.',
    '..oobboo..',
    '....oo....',
  ];
  const manaPalette: Record<string, string> = {
    o: '#090b10',
    B: '#3b82f6',
    b: '#1d4ed8',
    w: '#dbeafe',
  };

  const expGemGrid = [
    '....oo....',
    '...oCCo...',
    '..oCwwCo..',
    '.oCCwwCCo.',
    '.oCCCCCCo.',
    '..oCCCCo..',
    '...oCCo...',
    '....oo....',
  ];
  const expGemPalette: Record<string, string> = {
    o: '#090b10',
    C: '#34d399',
    w: '#ecfdf5',
  };

  const shrineGrid = [
    '....oooo....',
    '...oBbbBo...',
    '..oBbbbbBo..',
    '..oBbwwbBo..',
    '...oBbbBo...',
    '....oooo....',
    '...osssso...',
    '..osssssso..',
    '.osssssssso.',
    '.oooooooooo.',
  ];
  const shrinePalette: Record<string, string> = {
    o: '#090b10',
    B: '#38bdf8',
    b: '#0284c7',
    w: '#e0f2fe',
    s: '#64748b',
  };

  const statueGrid = [
    '....oooooo....',
    '...oGGGGGG....',
    '...oGssssGo...',
    '..ooGsoosGoo..',
    '.oGGGssssGGGo.',
    '..ooGssssGoo..',
    '....osssso....',
    '...osssssso...',
    '..oGGGGGGGGo..',
    '.osssssssssso.',
    '.oooooooooooo.',
  ];
  const statuePalette: Record<string, string> = {
    o: '#090b10',
    G: '#a855f7',
    s: '#94a3b8',
  };

  const merchantGrid = [
    '....oooooo....',
    '...oBBBBBB....',
    '..oBBBBBBBBo..',
    '..oBooooooo...',
    '..oBooyyooBo..',
    '..oBooooooBo..',
    '..oBBBBGGGGo..',
    '.oBBBBGGGGGBo.',
    '.oBBBBBBBBBB..',
    '..oooooooooo..',
  ];
  const merchantPalette: Record<string, string> = {
    o: '#090b10',
    B: '#1d4ed8',
    G: '#f59e0b',
    y: '#fde047',
  };

  const buildSkinSet = (
    f0: string[],
    f1: string[],
    palettes: Record<SkinTier, Record<string, string>>
  ): Record<SkinTier, [HTMLCanvasElement, HTMLCanvasElement]> => ({
    default: [
      createPixelSprite(f0, palettes.default, 3),
      createPixelSprite(f1, palettes.default, 3),
    ],
    rare: [
      createPixelSprite(f0, palettes.rare, 3),
      createPixelSprite(f1, palettes.rare, 3),
    ],
    legendary: [
      createPixelSprite(f0, palettes.legendary, 3),
      createPixelSprite(f1, palettes.legendary, 3),
    ],
  });

  const heroesSkins: Record<
    HeroClassId,
    Record<SkinTier, [HTMLCanvasElement, HTMLCanvasElement]>
  > = {
    knight: buildSkinSet(knightFrame0, knightFrame1, knightPalettes),
    pyromancer: buildSkinSet(pyroFrame0, pyroFrame1, pyroPalettes),
    rogue: buildSkinSet(rogueFrame0, rogueFrame1, roguePalettes),
    alchemist: buildSkinSet(alchemistFrame0, alchemistFrame1, alchemistPalettes),
    necromancer: buildSkinSet(necroHeroFrame0, necroHeroFrame1, necroHeroPalettes),
    berserker: buildSkinSet(berserkerFrame0, berserkerFrame1, berserkerPalettes),
  };

  cachedBank = {
    heroes: {
      knight: heroesSkins.knight.default,
      pyromancer: heroesSkins.pyromancer.default,
      rogue: heroesSkins.rogue.default,
      alchemist: heroesSkins.alchemist.default,
      necromancer: heroesSkins.necromancer.default,
      berserker: heroesSkins.berserker.default,
    },
    heroesSkins,
    heroesSilhouette: {
      knight: [
        createPixelSprite(knightFrame0, knightPalettes.default, 3, '#05070b'),
        createPixelSprite(knightFrame1, knightPalettes.default, 3, '#05070b'),
      ],
      pyromancer: [
        createPixelSprite(pyroFrame0, pyroPalettes.default, 3, '#05070b'),
        createPixelSprite(pyroFrame1, pyroPalettes.default, 3, '#05070b'),
      ],
      rogue: [
        createPixelSprite(rogueFrame0, roguePalettes.default, 3, '#05070b'),
        createPixelSprite(rogueFrame1, roguePalettes.default, 3, '#05070b'),
      ],
      alchemist: [
        createPixelSprite(alchemistFrame0, alchemistPalettes.default, 3, '#05070b'),
        createPixelSprite(alchemistFrame1, alchemistPalettes.default, 3, '#05070b'),
      ],
      necromancer: [
        createPixelSprite(necroHeroFrame0, necroHeroPalettes.default, 3, '#05070b'),
        createPixelSprite(necroHeroFrame1, necroHeroPalettes.default, 3, '#05070b'),
      ],
      berserker: [
        createPixelSprite(berserkerFrame0, berserkerPalettes.default, 3, '#05070b'),
        createPixelSprite(berserkerFrame1, berserkerPalettes.default, 3, '#05070b'),
      ],
    },
    heroesGhost: {
      knight: [
        createPixelSprite(knightFrame0, knightPalettes.default, 3, '#38bdf8'),
        createPixelSprite(knightFrame1, knightPalettes.default, 3, '#38bdf8'),
      ],
      pyromancer: [
        createPixelSprite(pyroFrame0, pyroPalettes.default, 3, '#fb923c'),
        createPixelSprite(pyroFrame1, pyroPalettes.default, 3, '#fb923c'),
      ],
      rogue: [
        createPixelSprite(rogueFrame0, roguePalettes.default, 3, '#34d399'),
        createPixelSprite(rogueFrame1, roguePalettes.default, 3, '#34d399'),
      ],
      alchemist: [
        createPixelSprite(alchemistFrame0, alchemistPalettes.default, 3, '#a3e635'),
        createPixelSprite(alchemistFrame1, alchemistPalettes.default, 3, '#a3e635'),
      ],
      necromancer: [
        createPixelSprite(necroHeroFrame0, necroHeroPalettes.default, 3, '#c084fc'),
        createPixelSprite(necroHeroFrame1, necroHeroPalettes.default, 3, '#c084fc'),
      ],
      berserker: [
        createPixelSprite(berserkerFrame0, berserkerPalettes.default, 3, '#ef4444'),
        createPixelSprite(berserkerFrame1, berserkerPalettes.default, 3, '#ef4444'),
      ],
    },
    pets: {
      cat: [
        createPixelSprite(cat0, catPalette, 2.5),
        createPixelSprite(cat1, catPalette, 2.5),
      ],
      mini_slime: [
        createPixelSprite(miniSlime0, miniSlimePalette, 2.5),
        createPixelSprite(miniSlime1, miniSlimePalette, 2.5),
      ],
      baby_dragon: [
        createPixelSprite(dragon0, dragonPalette, 2.5),
        createPixelSprite(dragon1, dragonPalette, 2.5),
      ],
    },
    enemies: {
      slime: [
        createPixelSprite(slime0, slimePalette, 3),
        createPixelSprite(slime1, slimePalette, 3),
      ],
      goblin: [
        createPixelSprite(goblin0, goblinPalette, 3),
        createPixelSprite(goblin1, goblinPalette, 3),
      ],
      golem: [
        createPixelSprite(golem0, golemPalette, 3),
        createPixelSprite(golem1, golemPalette, 3),
      ],
      necro_mage: [
        createPixelSprite(necro0, necroPalette, 3),
        createPixelSprite(necro1, necroPalette, 3),
      ],
      warden_boss: [
        createPixelSprite(boss0, bossPalette, 3),
        createPixelSprite(boss1, bossPalette, 3),
      ],
      dummy: [
        createPixelSprite(dummyGrid, dummyPalette, 3),
        createPixelSprite(dummyGrid, dummyPalette, 3),
      ],
    },
    enemiesRedFlash: {
      slime: [
        createPixelSprite(slime0, slimePalette, 3, '#ef4444'),
        createPixelSprite(slime1, slimePalette, 3, '#ef4444'),
      ],
      goblin: [
        createPixelSprite(goblin0, goblinPalette, 3, '#ef4444'),
        createPixelSprite(goblin1, goblinPalette, 3, '#ef4444'),
      ],
      golem: [
        createPixelSprite(golem0, golemPalette, 3, '#ef4444'),
        createPixelSprite(golem1, golemPalette, 3, '#ef4444'),
      ],
      necro_mage: [
        createPixelSprite(necro0, necroPalette, 3, '#ef4444'),
        createPixelSprite(necro1, necroPalette, 3, '#ef4444'),
      ],
      warden_boss: [
        createPixelSprite(boss0, bossPalette, 3, '#ef4444'),
        createPixelSprite(boss1, bossPalette, 3, '#ef4444'),
      ],
      dummy: [
        createPixelSprite(dummyGrid, dummyPalette, 3, '#ef4444'),
        createPixelSprite(dummyGrid, dummyPalette, 3, '#ef4444'),
      ],
    },
    weapons: {
      broadsword: createPixelSprite(broadswordGrid, weaponPalette, 2.5),
      twin_daggers: createPixelSprite(daggersGrid, weaponPalette, 2.5),
      pioneer_pistol: createPixelSprite(pistolGrid, weaponPalette, 2.5),
      splitter_shotgun: createPixelSprite(shotgunGrid, weaponPalette, 2.5),
      plasma_rifle: createPixelSprite(plasmaGrid, weaponPalette, 2.5),
      thunder_staff: createPixelSprite(staffGrid, weaponPalette, 2.5),
      inferno_bow: createPixelSprite(bowGrid, weaponPalette, 2.5),
      excalibur: createPixelSprite(excaliburGrid, weaponPalette, 2.5),
      frost_laser: createPixelSprite(frostLaserGrid, weaponPalette, 2.5),
    },
    chestClosed: createPixelSprite(chestClosedGrid, chestPalette, 3),
    chestOpen: createPixelSprite(chestOpenGrid, chestPalette, 3),
    potion: createPixelSprite(potionGrid, potionPalette, 3),
    gold: createPixelSprite(goldGrid, chestPalette, 3),
    manaOrb: createPixelSprite(manaOrbGrid, manaPalette, 3),
    expGem: createPixelSprite(expGemGrid, expGemPalette, 3),
    shrine: createPixelSprite(shrineGrid, shrinePalette, 3),
    statue: createPixelSprite(statueGrid, statuePalette, 3),
    merchant: createPixelSprite(merchantGrid, merchantPalette, 3),
    crate: createPixelSprite(crateGrid, cratePalette, 3),
    vase: createPixelSprite(vaseGrid, vasePalette, 3),
  };

  return cachedBank;
}
