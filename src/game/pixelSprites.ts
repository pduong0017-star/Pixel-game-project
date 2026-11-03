import { EnemyType, HeroClassId, PetId, WeaponId } from './types';

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
            ? '#7f1d1d'
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
}

let cachedBank: SpriteBank | null = null;

export function getSpriteBank(): SpriteBank {
  if (cachedBank) return cachedBank;

  // 1. VANGUARD KNIGHT
  const knightPalette: Record<string, string> = {
    o: '#090b10',
    r: '#e11d48',
    R: '#fb7185',
    s: '#cbd5e1',
    m: '#64748b',
    d: '#334155',
    g: '#f59e0b',
    G: '#fde047',
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

  // 2. PYROMANCER
  const pyroPalette: Record<string, string> = {
    o: '#090b10',
    p: '#7c2d12',
    P: '#c2410c',
    g: '#f59e0b',
    y: '#fde047',
    f: '#f97316',
    w: '#fef08a',
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

  // 3. SHADOW ROGUE
  const roguePalette: Record<string, string> = {
    o: '#090b10',
    c: '#1e293b',
    C: '#334155',
    e: '#10b981',
    E: '#34d399',
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

  // PETS (Thú cưng đồng hành chuẩn Soul Knight)
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

  // ENEMIES: SLIME, GOBLIN, GOLEM, WARDEN BOSS, TRAINING DUMMY
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

  // WEAPON SPRITES (Held in hand & dropped on floor)
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

  // INTERACTABLES
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

  cachedBank = {
    heroes: {
      knight: [
        createPixelSprite(knightFrame0, knightPalette, 3),
        createPixelSprite(knightFrame1, knightPalette, 3),
      ],
      pyromancer: [
        createPixelSprite(pyroFrame0, pyroPalette, 3),
        createPixelSprite(pyroFrame1, pyroPalette, 3),
      ],
      rogue: [
        createPixelSprite(rogueFrame0, roguePalette, 3),
        createPixelSprite(rogueFrame1, roguePalette, 3),
      ],
    },
    heroesGhost: {
      knight: [
        createPixelSprite(knightFrame0, knightPalette, 3, '#38bdf8'),
        createPixelSprite(knightFrame1, knightPalette, 3, '#38bdf8'),
      ],
      pyromancer: [
        createPixelSprite(pyroFrame0, pyroPalette, 3, '#fb923c'),
        createPixelSprite(pyroFrame1, pyroPalette, 3, '#fb923c'),
      ],
      rogue: [
        createPixelSprite(rogueFrame0, roguePalette, 3, '#34d399'),
        createPixelSprite(rogueFrame1, roguePalette, 3, '#34d399'),
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
  };

  return cachedBank;
}
