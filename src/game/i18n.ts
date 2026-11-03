import {
  DifficultyId,
  EarStyle,
  HeroClassId,
  HornStyle,
  LanguageCode,
  RaceId,
  WeaponId,
  WingStyle,
} from './types';

export const LANG_OPTIONS: {
  code: LanguageCode;
  flag: string;
  label: string;
  short: string;
}[] = [
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt', short: 'VI' },
  { code: 'en', flag: '🇺🇸', label: 'English', short: 'EN' },
  { code: 'ja', flag: '🇯🇵', label: '日本語', short: 'JA' },
  { code: 'ko', flag: '🇰🇷', label: '한국어', short: 'KO' },
];

export interface LocalizedStrings {
  // Splash Title Screen
  splashSubtitle: string;
  pressStart: string;
  customizeHeroBtn: string;
  versionTag: string;
  soundHint: string;

  // Lobby & Top Bar
  quests: string;
  mobileApp: string;
  gachaChest: string;
  gachaSub: string;
  armory: string;
  sanctuary: string;
  sanctuarySub: string;
  raceStudioBtn: string;
  raceStudioSub: string;
  heroStats: string;
  startRun: string;
  enterLivingRoom: string;
  unlocked: string;
  unlockHero: string;
  buySkin: string;
  skinOwned: string;
  lockedHeroBanner: string;

  // Race Customizer Studio
  raceStudioTitle: string;
  raceStudioDesc: string;
  racePresetLabel: string;
  skinToneLabel: string;
  hornStyleLabel: string;
  wingStyleLabel: string;
  earStyleLabel: string;
  eyeColorLabel: string;
  randomizeBtn: string;
  saveCustomBtn: string;

  // Modals
  closeBtn: string;
  gachaModalTitle: string;
  gachaModalDesc: string;
  gachaShaking: string;
  gachaOpenBtn: string;
  shopModalTitle: string;
  shopModalSub: string;
  tabArmory: string;
  tabUpgrades: string;
  extraVialTitle: string;
  extraVialDesc: string;
  equippedBtn: string;
  equipStartBtn: string;
  forgeBtn: string;
  maxedBtn: string;
  upgradeBtn: string;
  questsModalTitle: string;
  claimedBtn: string;
  claimBtn: string;
  progressLabel: string;
  avatarModalTitle: string;
  nicknameLabel: string;
  chooseAvatarLabel: string;
  totalKillsLabel: string;
  runsClearedLabel: string;
  settingsModalTitle: string;
  languageSetting: string;
  bgmSetting: string;
  bgmSettingDesc: string;
  sfxSetting: string;
  sfxSettingDesc: string;
  shakeSetting: string;
  autoAimSetting: string;
  dmgNumberSetting: string;
  touchScaleSetting: string;
  onLabel: string;
  offLabel: string;
  freeGemsBtn: string;
  resetSaveBtn: string;

  // Combat & Pause / Victory
  meleeStrike: string;
  rangedFire: string;
  dashLabel: string;
  skillLabel: string;
  secondaryLabel: string;
  livingRoomBanner: string;
  livingRoomSub: string;
  levelUpTitle: string;
  chooseBoonTitle: string;
  pickBoonBtn: string;
  pauseTitle: string;
  resumeBtn: string;
  backLivingRoomBtn: string;
  backMainLobbyBtn: string;
  victoryTitle: string;
  defeatTitle: string;
  victorySub: string;
  defeatSub: string;
  floorReachedLabel: string;
  foesSlainLabel: string;
  gemsEarnedLabel: string;
  totalDamageLabel: string;
  playAgainBtn: string;
  deflectToast: string;

  // Dictionaries
  difficulties: Record<DifficultyId, { name: string; sub: string }>;
  races: Record<RaceId, { name: string; bonusDesc: string }>;
  horns: Record<HornStyle, string>;
  wings: Record<WingStyle, string>;
  ears: Record<EarStyle, string>;
  heroes: Record<
    HeroClassId,
    { name: string; title: string; desc: string; skillName: string; skillDesc: string }
  >;
  weapons: Record<WeaponId, { name: string; desc: string }>;
}

export const I18N: Record<LanguageCode, LocalizedStrings> = {
  vi: {
    splashSubtitle: 'HUYỀN THOẠI HẦM NGỤC HẮC THẠCH · PIXEL ACTION ROGUELIKE',
    pressStart: '▶ CHẠM ĐỂ BẮT ĐẦU (PRESS START)',
    customizeHeroBtn: '✦ TÙY CHỈNH CHỦNG TỘC & NGOẠI HÌNH',
    versionTag: 'PHIÊN BẢN HOÀN CHỈNH v4.0 · 16 VŨ KHÍ · PHẢN ĐÒN ĐẠN · 8-BIT BGM',
    soundHint: 'Nhạc nền Chiptune 8-Bit & Hiệu ứng âm thanh tự động kích hoạt',

    quests: 'NHIỆM VỤ',
    mobileApp: 'TẢI VỀ ĐT',
    gachaChest: 'RƯƠNG BÍ ẨN',
    gachaSub: 'Quay Skin & Vũ Khí',
    armory: 'KHO VŨ KHÍ RÈN',
    sanctuary: 'THÁNH ĐIỆN',
    sanctuarySub: 'Nâng Cấp Chỉ Số Vĩnh Viễn',
    raceStudioBtn: 'CHỦNG TỘC & NGOẠI HÌNH',
    raceStudioSub: 'Phối Sừng, Cánh, Tai, Màu Da',
    heroStats: 'CHỈ SỐ HIỆP SĨ',
    startRun: 'XUẤT TRẬN (1-1)',
    enterLivingRoom: 'VÀO PHÒNG CHỜ LOBBY',
    unlocked: '★ Đã Mở',
    unlockHero: 'MỞ KHÓA TƯỚNG',
    buySkin: 'MUA SKIN',
    skinOwned: 'Đã sở hữu trang phục',
    lockedHeroBanner: '🔒 CHƯA MỞ KHÓA',

    raceStudioTitle: 'PHÒNG TẠO CHỦNG TỘC & NGOẠI HÌNH (CHARACTER STUDIO)',
    raceStudioDesc:
      'Chọn Chủng tộc hoặc tự do phối Màu da, Sừng, Đôi cánh, Tai và Màu mắt phát sáng cho nhân vật của bạn!',
    racePresetLabel: '1. Chủng Tộc & Nội Tại (Race Preset)',
    skinToneLabel: '2. Màu Da (Skin Tone)',
    hornStyleLabel: '3. Kiểu Sừng / Vương Miện (Horns)',
    wingStyleLabel: '4. Đôi Cánh Sau Lưng (Wings)',
    earStyleLabel: '5. Kiểu Tai (Ears)',
    eyeColorLabel: '6. Màu Mắt Phát Sáng (Eye Glow)',
    randomizeBtn: '🎲 NGẪU NHIÊN',
    saveCustomBtn: '✓ LƯU NGOẠI HÌNH',

    closeBtn: 'ĐÓNG ✕',
    gachaModalTitle: 'RƯƠNG BÍ ẨN GACHA',
    gachaModalDesc:
      'Mở Rương để nhận ngẫu nhiên: Trang phục Hiếm/Huyền Thoại, Vũ Khí mới hoặc Nổ Hũ Kim Cương!',
    gachaShaking: 'ĐANG RUNG LẮC RƯƠNG BÍ ẨN...',
    gachaOpenBtn: 'MỞ RƯƠNG NGAY (120 💎)',
    shopModalTitle: 'THỢ RÈN VŨ KHÍ & THÁNH ĐIỆN NÂNG CẤP',
    shopModalSub: 'Rèn 16 loại vũ khí khởi điểm hoặc cường hóa chỉ số vĩnh viễn',
    tabArmory: '⚒ 1. KHO 16 VŨ KHÍ KHỞI ĐIỂM',
    tabUpgrades: '★ 2. THÁNH ĐIỆN CHỈ SỐ VĨNH VIỄN',
    extraVialTitle: 'BÌNH MÁU TIẾP TẾ (+1 HEALING VIAL)',
    extraVialDesc: 'Mang thêm 1 bình máu & năng lượng dự trữ vào trận kế tiếp.',
    equippedBtn: '★ ĐANG MANG VÀO TRẬN',
    equipStartBtn: 'CHỌN MANG VÀO TRẬN',
    forgeBtn: 'RÈN VŨ KHÍ',
    maxedBtn: 'TỐI ĐA',
    upgradeBtn: 'NÂNG',
    questsModalTitle: 'CUỘN NHIỆM VỤ HẰNG NGÀY',
    claimedBtn: 'ĐÃ NHẬN',
    claimBtn: 'NHẬN',
    progressLabel: 'Tiến độ',
    avatarModalTitle: 'HỒ SƠ HIỆP SĨ & AVATAR',
    nicknameLabel: 'Biệt Danh Hiệp Sĩ:',
    chooseAvatarLabel: 'Chọn Biểu Tượng Avatar:',
    totalKillsLabel: 'Quái Đã Hạ',
    runsClearedLabel: 'Lần Phá Đảo',
    settingsModalTitle: 'CÀI ĐẶT HỆ THỐNG (SETTINGS)',
    languageSetting: 'Ngôn Ngữ (Language)',
    bgmSetting: 'Nhạc Nền 8-Bit (Chiptune BGM)',
    bgmSettingDesc: 'Nhạc nền 8-bit tự động đổi theo Sảnh, Hầm ngục & Boss',
    sfxSetting: 'Hiệu Ứng Âm Thanh (SFX)',
    sfxSettingDesc: 'Tiếng chém kiếm, phản đạn, súng nổ và nhặt ngọc',
    shakeSetting: 'Độ Rung Màn Hình (Screen Shake)',
    autoAimSetting: 'Tự Động Ngắm Bắn (Soul Knight Auto-Aim)',
    dmgNumberSetting: 'Hiển Thị Số Sát Thương (Damage Numbers)',
    touchScaleSetting: 'Kích Cỡ Nút Cảm Ứng (Touch Controls)',
    onLabel: 'BẬT',
    offLabel: 'TẮT',
    freeGemsBtn: '+ NHẬN 300 💎 QUÀ TÂN THỦ',
    resetSaveBtn: 'RESET LƯU TRỮ',

    meleeStrike: 'Chém',
    rangedFire: 'Bắn',
    dashLabel: 'Lướt',
    skillLabel: 'Kỹ Năng',
    secondaryLabel: 'Phụ',
    livingRoomBanner: 'PHÒNG CHỜ LIVING ROOM',
    livingRoomSub: 'Đổi Tướng & Pet · Thử Kiếm Phản Đạn · Lên Cổng Bắc Vào 1-1',
    levelUpTitle: 'THĂNG CẤP!',
    chooseBoonTitle: 'Chọn 1 Kỹ Năng Thần Lực (Buff)',
    pickBoonBtn: 'CHỌN BUFF →',
    pauseTitle: 'TẠM DỪNG (PAUSED)',
    resumeBtn: 'TIẾP TỤC CHIẾN ĐẤU',
    backLivingRoomBtn: 'VỀ PHÒNG CHỜ (LIVING ROOM)',
    backMainLobbyBtn: 'VỀ SẢNH CHÍNH (MAIN LOBBY)',
    victoryTitle: 'CHIẾN THẮNG!',
    defeatTitle: 'THẤT BẠI',
    victorySub: 'ĐÃ ĐOẠT ĐƯỢC ĐÁ MA THUẬT!',
    defeatSub: 'GỤC NGÃ TRONG HẦM NGỤC',
    floorReachedLabel: 'Tầng Đạt Được',
    foesSlainLabel: 'Quái Tiêu Diệt',
    gemsEarnedLabel: 'Soul Gems Nhận Được',
    totalDamageLabel: 'Tổng Sát Thương',
    playAgainBtn: 'CHƠI LẠI (1-1)',
    deflectToast: '⚡ PHẢN ĐÒN!',

    difficulties: {
      normal: { name: 'Thường', sub: 'Cân bằng chuẩn Roguelike' },
      badass: { name: 'Khó (Badass)', sub: 'Quái đông & hung hãn hơn' },
      hell: { name: 'Địa Ngục', sub: 'Mưa đạn thực thụ (+150% 💎)' },
    },
    races: {
      human: { name: 'Nhân Loại (Human)', bonusDesc: '+10 HP, +5 Giáp cân bằng' },
      elf: { name: 'Tinh Linh (High Elf)', bonusDesc: '+25 Mana, +6% Tốc chạy' },
      demon: { name: 'Huyết Quỷ (Demon)', bonusDesc: '+8% Sát thương, +5% Chí mạng' },
      orc: { name: 'Chiến Binh Orc', bonusDesc: '+28 Máu tối đa, +5 Giáp' },
      undead: { name: 'Xương Bất Tử (Undead)', bonusDesc: '+15 Giáp, +20 Mana' },
    },
    horns: {
      none: 'Không Sừng',
      demon_horns: 'Sừng Quỷ Đỏ',
      dragon_antlers: 'Sừng Rồng Vàng',
      crown_spikes: 'Vương Miện Gai',
    },
    wings: {
      none: 'Không Cánh',
      angel_wings: 'Cánh Thiên Thần',
      bat_wings: 'Cánh Dơi Ác Quỷ',
      cyber_wings: 'Cánh Quang Học Cyber',
    },
    ears: {
      human: 'Tai Tròn',
      elf_long: 'Tai Dài Tinh Linh',
      beast_ears: 'Tai Thú Chiến Binh',
    },
    heroes: {
      knight: {
        name: 'Vanguard Knight',
        title: 'Hiệp Sĩ Tiên Phong',
        desc: 'Máu và Giáp dày. Khởi đầu với Đại Kiếm + Súng Lục.',
        skillName: 'Superior Shockwave',
        skillDesc: 'Phóng sóng chấn động hoàng kim, hồi +35 Mana và làm choáng quái.',
      },
      pyromancer: {
        name: 'Ash Pyromancer',
        title: 'Pháp Sư Hỏa Diệm',
        desc: 'Bể Mana cực lớn. Khởi đầu với Trượng Sấm Sét + Súng Lục.',
        skillName: 'Solar Cataclysm',
        skillDesc: 'Phóng 8 cầu dung nham xuyên thấu ra mọi hướng và hồi +45 Mana.',
      },
      rogue: {
        name: 'Shadow Rogue',
        title: 'Sát Thủ Bóng Đêm',
        desc: 'Tốc chạy & Chí mạng cao. Khởi đầu với Song Đao + Súng Shotgun.',
        skillName: 'Phantom Blade Fan',
        skillDesc: 'Phi 6 phi tiêu lục bảo xuyên thấu chí mạng và hồi ngay lượt Lướt.',
      },
      alchemist: {
        name: 'Cyber Alchemist',
        title: 'Giả Kim Thuật Sư',
        desc: 'Công nghệ sinh học & băng giá. Khởi đầu với Pháo Laser Băng.',
        skillName: 'Alchemical Venom Nova',
        skillDesc: 'Ném 6 bình độc sinh học nổ lan, hồi +15 Giáp & +35 Mana.',
      },
      necromancer: {
        name: 'Void Necromancer',
        title: 'Chúa Tể Hư Không',
        desc: 'Chiêu hồn bóng tối & hút sinh lực. Khởi đầu với Lưỡi Hái Hư Không.',
        skillName: 'Abyssal Soul Harvest',
        skillDesc: 'Phóng 10 hồn ma hư không tự săn mục tiêu, hút +15 HP & +40 Mana.',
      },
      berserker: {
        name: 'Berserker Titan',
        title: 'Chiến Thần Cuồng Nộ',
        desc: 'Sức mạnh cận chiến hủy diệt. Khởi đầu với Đại Rìu Hỏa Ngục.',
        skillName: 'Ragnarok Blood Rage',
        skillDesc: 'Giậm vỡ mặt đất tạo vòng chém 360° + phóng 6 kiếm khí lửa.',
      },
    },
    weapons: {
      broadsword: {
        name: 'Đại Kiếm Hiệp Sĩ',
        desc: 'Chém quạt rộng đảo chiều liên hoàn (0 Mana). Chém tan đạn địch.',
      },
      twin_daggers: {
        name: 'Song Đao Bóng Đêm',
        desc: 'Chém kép tốc độ cực nhanh (0 Mana). Chém tan đạn địch.',
      },
      blood_katana: {
        name: 'Huyết Kiếm Katana',
        desc: 'Chém rút kiếm siêu tốc (0 Mana). PHẢN ĐÒN ĐẠN bay ngược lại quái!',
      },
      void_scythe: {
        name: 'Lưỡi Hái Hư Không',
        desc: 'Chém vòng cung 220° cực rộng (1 Mana). PHẢN ĐÒN ĐẠN & hút năng lượng.',
      },
      inferno_greataxe: {
        name: 'Đại Rìu Hỏa Ngục',
        desc: 'Xoay 360° quét sạch mọi quái và đạn xung quanh (1 Mana).',
      },
      thunder_warhammer: {
        name: 'Búa Chiến Sấm Sét',
        desc: 'Đập chấn động điện diện rộng làm choáng quái & xóa đạn (2 Mana).',
      },
      dragon_lance: {
        name: 'Thương Long Kích',
        desc: 'Đâm xuyên phá tầm xa kèm mũi thương rồng lửa (0 Mana).',
      },
      excalibur: {
        name: 'Thánh Kiếm Excalibur',
        desc: 'Chém hoàng kim PHẢN ĐÒN ĐẠN kèm sóng kiếm khí xuyên thấu (2 Mana).',
      },
      pioneer_pistol: {
        name: 'Súng Lục Tân Binh',
        desc: 'Súng lục cơ bản chuẩn xác, không tốn năng lượng (0 Mana).',
      },
      splitter_shotgun: {
        name: 'Súng Hoa Cải Shotgun',
        desc: 'Bắn chùm 5 viên đạn ghém đẩy lùi mạnh (2 Mana).',
      },
      plasma_rifle: {
        name: 'Súng Tiểu Liên Plasma',
        desc: 'Xả đạn năng lượng tốc độ cao liên thanh (1 Mana).',
      },
      gatling_minigun: {
        name: 'Súng Máy Gatling',
        desc: 'Xả mưa đạn 3 nòng tốc độ cực đại áp chế toàn phòng (2 Mana).',
      },
      sniper_railgun: {
        name: 'Súng Bắn Tỉa Railgun',
        desc: 'Bắn tia điện từ siêu tốc xuyên thấu mọi mục tiêu (3 Mana).',
      },
      frost_laser: {
        name: 'Pháo Băng Cực Quang',
        desc: 'Bắn 2 tia laser băng giá xuyên thấu hàng quái (2 Mana).',
      },
      thunder_staff: {
        name: 'Trượng Sấm Sét',
        desc: 'Phóng cầu sét tự động giật dây chuyền qua nhiều quái (3 Mana).',
      },
      inferno_bow: {
        name: 'Cung Hỏa Long',
        desc: 'Bắn mũi tên rồng lửa xuyên thấu gây nổ diện rộng (3 Mana).',
      },
    },
  },

  en: {
    splashSubtitle: 'OBSIDIAN DUNGEON CHRONICLES · PIXEL ACTION ROGUELIKE',
    pressStart: '▶ PRESS START / TAP TO PLAY',
    customizeHeroBtn: '✦ CUSTOMIZE RACE & APPEARANCE',
    versionTag: 'DEFINITIVE EDITION v4.0 · 16 WEAPONS · BULLET DEFLECT · 8-BIT BGM',
    soundHint: '8-Bit Chiptune BGM & Retro SFX enabled automatically',

    quests: 'QUESTS',
    mobileApp: 'MOBILE / QR',
    gachaChest: 'MYSTERY CHEST',
    gachaSub: 'Roll Skins & Weapons',
    armory: 'WEAPON ARMORY',
    sanctuary: 'SANCTUARY',
    sanctuarySub: 'Permanent Stat Upgrades',
    raceStudioBtn: 'RACE & APPEARANCE',
    raceStudioSub: 'Horns, Wings, Ears & Skin',
    heroStats: 'HERO ATTRIBUTES',
    startRun: 'ENTER DUNGEON (1-1)',
    enterLivingRoom: 'LIVING ROOM HUB',
    unlocked: '★ Unlocked',
    unlockHero: 'UNLOCK HERO',
    buySkin: 'BUY SKIN',
    skinOwned: 'Skin Owned',
    lockedHeroBanner: '🔒 LOCKED HERO',

    raceStudioTitle: 'RACE & CHARACTER CUSTOMIZATION STUDIO',
    raceStudioDesc:
      'Choose a Fantasy Race preset or freely mix Skin Tone, Horns, Wings, Ears, and Glowing Eyes!',
    racePresetLabel: '1. Fantasy Race & Passive',
    skinToneLabel: '2. Skin Tone',
    hornStyleLabel: '3. Horns & Crown',
    wingStyleLabel: '4. Back Wings',
    earStyleLabel: '5. Ear Style',
    eyeColorLabel: '6. Glowing Eyes',
    randomizeBtn: '🎲 RANDOMIZE',
    saveCustomBtn: '✓ SAVE APPEARANCE',

    closeBtn: 'CLOSE ✕',
    gachaModalTitle: 'MYSTERY GACHA CHEST',
    gachaModalDesc:
      'Open chests to win Rare/Legendary Skins, new Starter Weapons, or Soul Gem Jackpots!',
    gachaShaking: 'UNLOCKING MYSTERY CHEST...',
    gachaOpenBtn: 'OPEN CHEST (120 💎)',
    shopModalTitle: 'BLACKSMITH ARMORY & SANCTUARY',
    shopModalSub: 'Forge 16 starter weapons or permanently upgrade all heroes',
    tabArmory: '⚒ 1. 16-WEAPON ARMORY',
    tabUpgrades: '★ 2. PERMANENT SANCTUARY STATS',
    extraVialTitle: 'EXTRA HEALING VIAL (+1 POTION)',
    extraVialDesc: 'Carry +1 extra healing & mana vial into your next run.',
    equippedBtn: '★ EQUIPPED FOR RUN',
    equipStartBtn: 'EQUIP STARTER',
    forgeBtn: 'FORGE WEAPON',
    maxedBtn: 'MAXED',
    upgradeBtn: 'UPGRADE',
    questsModalTitle: 'DAILY QUESTS SCROLL',
    claimedBtn: 'CLAIMED',
    claimBtn: 'CLAIM',
    progressLabel: 'Progress',
    avatarModalTitle: 'KNIGHT PROFILE & AVATAR',
    nicknameLabel: 'Knight Nickname:',
    chooseAvatarLabel: 'Select Avatar Crest:',
    totalKillsLabel: 'Foes Slain',
    runsClearedLabel: 'Runs Cleared',
    settingsModalTitle: 'SYSTEM SETTINGS',
    languageSetting: 'Language (Ngôn ngữ)',
    bgmSetting: '8-Bit Chiptune Music (BGM)',
    bgmSettingDesc: 'Dynamic 8-bit soundtrack for Title, Lobby, Dungeon & Boss',
    sfxSetting: '8-Bit Sound Effects (SFX)',
    sfxSettingDesc: 'Sword slashes, bullet deflection clang, gunfire & pickups',
    shakeSetting: 'Screen Shake Intensity',
    autoAimSetting: 'Soul Knight Auto-Aim',
    dmgNumberSetting: 'Show Floating Damage Numbers',
    touchScaleSetting: 'Touch Control Size',
    onLabel: 'ON',
    offLabel: 'OFF',
    freeGemsBtn: '+ CLAIM 300 💎 STARTER GIFT',
    resetSaveBtn: 'RESET SAVE',

    meleeStrike: 'Slash',
    rangedFire: 'Fire',
    dashLabel: 'Dash',
    skillLabel: 'Skill',
    secondaryLabel: 'Sub',
    livingRoomBanner: 'LIVING ROOM HUB',
    livingRoomSub: 'Switch Hero & Pet · Test Sword Deflect · Step North to 1-1',
    levelUpTitle: 'LEVEL UP!',
    chooseBoonTitle: 'Select 1 Arcane Boon',
    pickBoonBtn: 'SELECT BOON →',
    pauseTitle: 'GAME PAUSED',
    resumeBtn: 'RESUME COMBAT',
    backLivingRoomBtn: 'RETURN TO LIVING ROOM',
    backMainLobbyBtn: 'RETURN TO MAIN LOBBY',
    victoryTitle: 'VICTORY!',
    defeatTitle: 'DEFEATED',
    victorySub: 'THE OBSIDIAN SOUL STONE IS YOURS!',
    defeatSub: 'FALLEN IN THE DUNGEON',
    floorReachedLabel: 'Stage Reached',
    foesSlainLabel: 'Foes Defeated',
    gemsEarnedLabel: 'Soul Gems Earned',
    totalDamageLabel: 'Total Damage Dealt',
    playAgainBtn: 'PLAY AGAIN (1-1)',
    deflectToast: '⚡ DEFLECT!',

    difficulties: {
      normal: { name: 'Normal', sub: 'Balanced Dungeon Crawl' },
      badass: { name: 'Badass', sub: 'Fierce Aggro & More Elites' },
      hell: { name: 'Abyssal Hell', sub: 'Bullet Hell (+150% 💎)' },
    },
    races: {
      human: { name: 'Human', bonusDesc: '+10 HP, +5 Shield balanced' },
      elf: { name: 'High Elf', bonusDesc: '+25 Mana, +6% Move Speed' },
      demon: { name: 'Arch-Demon', bonusDesc: '+8% Damage, +5% Crit Chance' },
      orc: { name: 'Orc Warborn', bonusDesc: '+28 Max HP, +5 Shield' },
      undead: { name: 'Undead Lich', bonusDesc: '+15 Shield, +20 Mana' },
    },
    horns: {
      none: 'No Horns',
      demon_horns: 'Crimson Demon Horns',
      dragon_antlers: 'Golden Dragon Antlers',
      crown_spikes: 'Obsidian Crown Spikes',
    },
    wings: {
      none: 'No Wings',
      angel_wings: 'Seraphim Angel Wings',
      bat_wings: 'Abyssal Bat Wings',
      cyber_wings: 'Cyber Plasma Wings',
    },
    ears: {
      human: 'Round Ears',
      elf_long: 'Pointed Elf Ears',
      beast_ears: 'Feral Beast Ears',
    },
    heroes: {
      knight: {
        name: 'Vanguard Knight',
        title: 'Iron Vanguard',
        desc: 'High HP & Shield. Starts with Broadsword + Pioneer Pistol.',
        skillName: 'Superior Shockwave',
        skillDesc: 'Unleash a golden shockwave, restoring +35 Mana and stunning foes.',
      },
      pyromancer: {
        name: 'Ash Pyromancer',
        title: 'Keeper of Embers',
        desc: 'Massive Mana pool. Starts with Thunder Staff + Pistol.',
        skillName: 'Solar Cataclysm',
        skillDesc: 'Fire 8 piercing magma orbs in all directions and restore +45 Mana.',
      },
      rogue: {
        name: 'Shadow Rogue',
        title: 'Phantom Assassin',
        desc: 'High Speed & Crit. Starts with Twin Blades + Shotgun.',
        skillName: 'Phantom Blade Fan',
        skillDesc: 'Throw 6 piercing emerald daggers and instantly reset Dash.',
      },
      alchemist: {
        name: 'Cyber Alchemist',
        title: 'Bio-Tech Savant',
        desc: 'Cryo lasers & venom tech. Starts with Aurora Cryo Cannon.',
        skillName: 'Alchemical Venom Nova',
        skillDesc: 'Toss 6 explosive venom vials, restoring +15 Shield & +35 Mana.',
      },
      necromancer: {
        name: 'Void Necromancer',
        title: 'Abyssal Sovereign',
        desc: 'Dark soul magic. Starts with Void Scythe + Thunder Staff.',
        skillName: 'Abyssal Soul Harvest',
        skillDesc: 'Unleash 10 homing soul bolts, draining +15 HP & +40 Mana.',
      },
      berserker: {
        name: 'Berserker Titan',
        title: 'Warborn Gladiator',
        desc: 'Unstoppable melee juggernaut. Starts with Excalibur + Shotgun.',
        skillName: 'Ragnarok Blood Rage',
        skillDesc: '360° ground cleave + 6 explosive crimson sword waves.',
      },
    },
    weapons: {
      broadsword: {
        name: 'Knight Broadsword',
        desc: 'Fast alternating wide slash (0 Mana). Destroys enemy bullets.',
      },
      twin_daggers: {
        name: 'Shadow Twin Blades',
        desc: 'Ultra-fast dual slashes (0 Mana). Slices enemy bullets.',
      },
      blood_katana: {
        name: 'Muramasa Blood Katana',
        desc: 'High-speed iaido slash (0 Mana). DEFLECTS bullets back at foes!',
      },
      void_scythe: {
        name: 'Abyssal Void Scythe',
        desc: 'Wide 220° reaper arc (1 Mana). DEFLECTS bullets & drains mana.',
      },
      inferno_greataxe: {
        name: 'Inferno Greataxe',
        desc: '360° whirlwind spin cleave that clears surrounding bullets (1 Mana).',
      },
      thunder_warhammer: {
        name: 'Thunder Warhammer',
        desc: 'Slams the ground with a lightning shockwave that stuns foes (2 Mana).',
      },
      dragon_lance: {
        name: 'Dragonfire Lance',
        desc: 'Long-reach piercing spear thrust with a fiery dragon tip (0 Mana).',
      },
      excalibur: {
        name: 'Excalibur Sacred Blade',
        desc: 'Golden slash that DEFLECTS bullets & fires a piercing wave (2 Mana).',
      },
      pioneer_pistol: {
        name: 'Pioneer Pistol',
        desc: 'Reliable sidearm with zero energy cost (0 Mana).',
      },
      splitter_shotgun: {
        name: 'Splitter Shotgun',
        desc: 'Fires a 5-pellet cone blast with heavy knockback (2 Mana).',
      },
      plasma_rifle: {
        name: 'Blue Fire Plasma SMG',
        desc: 'Rapid-fire plasma submachine gun (1 Mana).',
      },
      gatling_minigun: {
        name: 'Vulcan Gatling Minigun',
        desc: 'Unleashes a relentless 3-stream storm of bullets (2 Mana).',
      },
      sniper_railgun: {
        name: 'Hyperion Sniper Railgun',
        desc: 'Fires a hyper-velocity electromagnetic beam through all foes (3 Mana).',
      },
      frost_laser: {
        name: 'Aurora Cryo Cannon',
        desc: 'Fires twin piercing cryo laser beams (2 Mana).',
      },
      thunder_staff: {
        name: 'Staff of Thunder',
        desc: 'Launches lightning orbs that chain across nearby enemies (3 Mana).',
      },
      inferno_bow: {
        name: 'Flame Dragon Bow',
        desc: 'Fires piercing fire arrows that detonate on impact (3 Mana).',
      },
    },
  },

  ja: {
    splashSubtitle: '黒曜石のソウルナイト · ピクセル・ローグライク',
    pressStart: '▶ タップして開始 (PRESS START)',
    customizeHeroBtn: '✦ 種族・外見カスタマイズ',
    versionTag: '完全版 v4.0 · 16種類の武器 · 弾返し(Deflect) · 8-BIT BGM',
    soundHint: '8ビットBGMとレトロ効果音が自動で有効になります',

    quests: 'クエスト',
    mobileApp: 'スマホ版/QR',
    gachaChest: '神秘の宝箱',
    gachaSub: 'スキン＆武器ガチャ',
    armory: '鍛冶屋・武器庫',
    sanctuary: '聖域強化',
    sanctuarySub: 'ステータスの永久強化',
    raceStudioBtn: '種族・外見変更',
    raceStudioSub: '角・翼・耳・肌色を自由に合成',
    heroStats: 'ヒーロー能力値',
    startRun: 'ダンジョン出撃 (1-1)',
    enterLivingRoom: 'ロビー待機室へ',
    unlocked: '★ 解放済',
    unlockHero: 'キャラ解放',
    buySkin: 'スキン購入',
    skinOwned: '所持済みスキン',
    lockedHeroBanner: '🔒 未解放',

    raceStudioTitle: '種族＆キャラクターメイキング',
    raceStudioDesc:
      '種族プリセットを選ぶか、肌の色・角・翼・耳・瞳の発光を自由に組み合わせよう！',
    racePresetLabel: '1. 種族＆パッシブ効果',
    skinToneLabel: '2. 肌の色 (Skin Tone)',
    hornStyleLabel: '3. 角・王冠 (Horns)',
    wingStyleLabel: '4. 背中の翼 (Wings)',
    earStyleLabel: '5. 耳のタイプ (Ears)',
    eyeColorLabel: '6. 瞳の発光色 (Eye Glow)',
    randomizeBtn: '🎲 ランダム',
    saveCustomBtn: '✓ 外見を保存',

    closeBtn: '閉じる ✕',
    gachaModalTitle: '神秘のガチャ宝箱',
    gachaModalDesc:
      '宝箱を開けてレア/伝説スキン、初期武器、またはソウルジェムを獲得しよう！',
    gachaShaking: '宝箱を開封中...',
    gachaOpenBtn: '宝箱を開ける (120 💎)',
    shopModalTitle: '鍛冶屋＆聖域アップグレード',
    shopModalSub: '16種類の初期武器を鍛造、または全キャラの能力を永久強化',
    tabArmory: '⚒ 1. 武器庫 (全16種)',
    tabUpgrades: '★ 2. 聖域ステータス強化',
    extraVialTitle: '追加回復ポーション (+1 VIAL)',
    extraVialDesc: '次の出撃時に回復＆マナポーションを1個多く持ち込む。',
    equippedBtn: '★ 装備中',
    equipStartBtn: '初期武器に選択',
    forgeBtn: '武器を鍛造',
    maxedBtn: '最大Lv',
    upgradeBtn: '強化',
    questsModalTitle: 'デイリークエスト',
    claimedBtn: '受取済',
    claimBtn: '受取',
    progressLabel: '進行度',
    avatarModalTitle: 'プロフィール＆アバター',
    nicknameLabel: 'プレイヤー名:',
    chooseAvatarLabel: 'アバターアイコン選択:',
    totalKillsLabel: '総撃破数',
    runsClearedLabel: 'クリア回数',
    settingsModalTitle: 'システム設定 (SETTINGS)',
    languageSetting: '言語 (Language)',
    bgmSetting: '8ビットBGM (Chiptune Music)',
    bgmSettingDesc: 'タイトル・ロビー・ダンジョン・ボス戦の専用BGM',
    sfxSetting: '効果音 (8-Bit SFX)',
    sfxSettingDesc: '剣撃・弾返し・銃声・アイテム獲得音',
    shakeSetting: '画面揺れ (Screen Shake)',
    autoAimSetting: '自動照準 (Auto-Aim)',
    dmgNumberSetting: 'ダメージ数値表示',
    touchScaleSetting: '操作ボタンサイズ',
    onLabel: 'ON',
    offLabel: 'OFF',
    freeGemsBtn: '+ 初心者ギフト 300 💎 受取',
    resetSaveBtn: 'データ初期化',

    meleeStrike: '斬撃',
    rangedFire: '射撃',
    dashLabel: '回避',
    skillLabel: 'スキル',
    secondaryLabel: '副武器',
    livingRoomBanner: 'ロビー待機室 (LIVING ROOM)',
    livingRoomSub: 'キャラ＆ペット変更 · 弾返しテスト · 北の門から1-1へ',
    levelUpTitle: 'LEVEL UP!',
    chooseBoonTitle: '祝福スキル(Buff)を1つ選択',
    pickBoonBtn: '選択する →',
    pauseTitle: '一時停止 (PAUSED)',
    resumeBtn: '戦闘を再開',
    backLivingRoomBtn: '待機室(Living Room)へ戻る',
    backMainLobbyBtn: 'メインロビーへ戻る',
    victoryTitle: 'VICTORY!',
    defeatTitle: 'GAME OVER',
    victorySub: '魔法石を奪還した！',
    defeatSub: 'ダンジョンに倒れた...',
    floorReachedLabel: '到達フロア',
    foesSlainLabel: '撃破した敵',
    gemsEarnedLabel: '獲得ジェム',
    totalDamageLabel: '総ダメージ',
    playAgainBtn: '再挑戦 (1-1)',
    deflectToast: '⚡ 弾返し!',

    difficulties: {
      normal: { name: 'ノーマル', sub: '標準的なダンジョン探索' },
      badass: { name: 'ハード(Badass)', sub: '激しい攻撃とエリート敵増加' },
      hell: { name: 'アビスヘル', sub: '弾幕地獄 (+150% 💎)' },
    },
    races: {
      human: { name: '人間 (Human)', bonusDesc: 'HP+10, シールド+5' },
      elf: { name: 'ハイエルフ (Elf)', bonusDesc: 'マナ+25, 移動速度+6%' },
      demon: { name: '魔族 (Demon)', bonusDesc: '攻撃力+8%, 会心率+5%' },
      orc: { name: 'オーク戦士 (Orc)', bonusDesc: '最大HP+28, シールド+5' },
      undead: { name: 'アンデッド (Undead)', bonusDesc: 'シールド+15, マナ+20' },
    },
    horns: {
      none: 'なし',
      demon_horns: '紅蓮の魔角',
      dragon_antlers: '黄金の龍角',
      crown_spikes: '黒曜の棘冠',
    },
    wings: {
      none: 'なし',
      angel_wings: '熾天使の翼',
      bat_wings: '深淵の悪魔翼',
      cyber_wings: 'サイバー光学翼',
    },
    ears: {
      human: '丸耳',
      elf_long: 'エルフの長耳',
      beast_ears: '獣人の耳',
    },
    heroes: {
      knight: {
        name: 'Vanguard Knight',
        title: '先鋒の騎士',
        desc: '高いHPとシールド。大剣とピストルを初期装備。',
        skillName: 'Superior Shockwave',
        skillDesc: '黄金の衝撃波を放ち、マナ+35回復＆周囲の敵を気絶させる。',
      },
      pyromancer: {
        name: 'Ash Pyromancer',
        title: '紅蓮の魔導士',
        desc: '圧倒的なマナ量。雷の杖とピストルを初期装備。',
        skillName: 'Solar Cataclysm',
        skillDesc: '全方向に8つの貫通マグマ球を放ち、マナ+45回復。',
      },
      rogue: {
        name: 'Shadow Rogue',
        title: '影の暗殺者',
        desc: '高い移動速度と会心率。双剣とショットガンを初期装備。',
        skillName: 'Phantom Blade Fan',
        skillDesc: '6本の貫通クナイを投げ、ダッシュのクールダウンを即時回復。',
      },
      alchemist: {
        name: 'Cyber Alchemist',
        title: '錬金術師',
        desc: '冷凍レーザーと生体毒。オーロラ冷凍砲を初期装備。',
        skillName: 'Alchemical Venom Nova',
        skillDesc: '6つの爆発毒瓶を投げ、シールド+15＆マナ+35回復。',
      },
      necromancer: {
        name: 'Void Necromancer',
        title: '虚空の死霊術師',
        desc: '魂を狩る闇魔術。虚空の大鎌を初期装備。',
        skillName: 'Abyssal Soul Harvest',
        skillDesc: '10個の怨霊弾を放ち、HP+15＆マナ+40を吸収する。',
      },
      berserker: {
        name: 'Berserker Titan',
        title: '狂戦士タイタン',
        desc: '圧倒的な近接破壊力。エクスカリバーを初期装備。',
        skillName: 'Ragnarok Blood Rage',
        skillDesc: '360°回転斬り＋6つの紅蓮剣波を放つ。',
      },
    },
    weapons: {
      broadsword: {
        name: 'ナイトブロードソード',
        desc: '広範囲の交互連続斬り(0マナ)。敵弾を切り裂く。',
      },
      twin_daggers: {
        name: 'シャドウ双剣',
        desc: '超高速の二刀流斬撃(0マナ)。敵の弾を消去する。',
      },
      blood_katana: {
        name: '妖刀ムラマサ',
        desc: '神速の居合斬り(0マナ)。敵の弾を跳ね返す【弾返し】！',
      },
      void_scythe: {
        name: '虚空の死神鎌',
        desc: '220°の広範囲斬撃(1マナ)。【弾返し】効果＆エネルギー吸収。',
      },
      inferno_greataxe: {
        name: '業火のグレートアックス',
        desc: '360°回転斬りで周囲の敵と弾を一掃する(1マナ)。',
      },
      thunder_warhammer: {
        name: '雷鳴のウォーハンマー',
        desc: '地面を叩きつけ電撃衝撃波で敵を気絶させる(2マナ)。',
      },
      dragon_lance: {
        name: '炎龍の長槍',
        desc: '長いリーチで複数の敵を貫く炎の突き攻撃(0マナ)。',
      },
      excalibur: {
        name: '聖剣エクスカリバー',
        desc: '【弾返し】と貫通黄金剣波を同時に放つ伝説の聖剣(2マナ)。',
      },
      pioneer_pistol: {
        name: 'パイオニアピストル',
        desc: 'マナ消費なしで撃てる基本拳銃(0マナ)。',
      },
      splitter_shotgun: {
        name: 'スプリッター散弾銃',
        desc: '5発の散弾を扇状に発射し敵をノックバック(2マナ)。',
      },
      plasma_rifle: {
        name: 'プラズマ連射銃',
        desc: '超高速連射のプラズマサブマシンガン(1マナ)。',
      },
      gatling_minigun: {
        name: 'バルカン・ガトリング砲',
        desc: '圧倒的な弾幕を浴びせる重機関銃(2マナ)。',
      },
      sniper_railgun: {
        name: '超電磁レールガン',
        desc: '直線上のすべての敵を貫通する超高速電磁ビーム(3マナ)。',
      },
      frost_laser: {
        name: 'オーロラ冷凍キャノン',
        desc: '敵を貫通する2本の氷結レーザーを発射(2マナ)。',
      },
      thunder_staff: {
        name: '雷神の杖',
        desc: '周囲の敵に連鎖するチェインライトニングを放つ(3マナ)。',
      },
      inferno_bow: {
        name: '炎龍の弓',
        desc: '着弾時に大爆発を起こす貫通火炎矢を放つ(3マナ)。',
      },
    },
  },

  ko: {
    splashSubtitle: '흑요석 소울 나이트 · 픽셀 액션 로그라이크',
    pressStart: '▶ 터치하여 시작 (PRESS START)',
    customizeHeroBtn: '✦ 종족 및 외형 커스터마이징',
    versionTag: '완전판 v4.0 · 16종 무기 · 탄막 반사(Deflect) · 8-BIT BGM',
    soundHint: '8비트 칩튠 배경음악 및 레트로 효과음이 자동 재생됩니다',

    quests: '일일 임무',
    mobileApp: '모바일/QR',
    gachaChest: '신비한 보물상자',
    gachaSub: '스킨 & 무기 뽑기',
    armory: '대장간 무기고',
    sanctuary: '성소 강화',
    sanctuarySub: '능력치 영구 업그레이드',
    raceStudioBtn: '종족 & 외형 변경',
    raceStudioSub: '뿔, 날개, 귀, 피부색 자유 조합',
    heroStats: '영웅 능력치',
    startRun: '던전 출격 (1-1)',
    enterLivingRoom: '대기실 로비 입장',
    unlocked: '★ 해금됨',
    unlockHero: '영웅 해금',
    buySkin: '스킨 구매',
    skinOwned: '보유 중인 스킨',
    lockedHeroBanner: '🔒 미해금 영웅',

    raceStudioTitle: '종족 & 캐릭터 커스터마이징 스튜디오',
    raceStudioDesc:
      '종족 프리셋을 선택하거나 피부색, 뿔, 날개, 귀, 눈빛 색상을 자유롭게 조합하세요!',
    racePresetLabel: '1. 판타지 종족 & 패시브',
    skinToneLabel: '2. 피부색 (Skin Tone)',
    hornStyleLabel: '3. 뿔 & 왕관 (Horns)',
    wingStyleLabel: '4. 등 날개 (Wings)',
    earStyleLabel: '5. 귀 모양 (Ears)',
    eyeColorLabel: '6. 안광 색상 (Eye Glow)',
    randomizeBtn: '🎲 무작위 조합',
    saveCustomBtn: '✓ 외형 저장',

    closeBtn: '닫기 ✕',
    gachaModalTitle: '신비한 가챠 보물상자',
    gachaModalDesc:
      '상자를 열어 희귀/전설 스킨, 신규 시작 무기 또는 소울 젬 잭팟을 획득하세요!',
    gachaShaking: '보물상자 개봉 중...',
    gachaOpenBtn: '상자 열기 (120 💎)',
    shopModalTitle: '대장간 무기고 & 성소 강화',
    shopModalSub: '16종의 시작 무기를 제작하거나 모든 영웅의 능력치를 영구 강화하세요',
    tabArmory: '⚒ 1. 16종 무기고',
    tabUpgrades: '★ 2. 성소 영구 능력치',
    extraVialTitle: '추가 회복 물약 (+1 VIAL)',
    extraVialDesc: '다음 전투에 회복 및 마나 물약을 1개 더 지참합니다.',
    equippedBtn: '★ 장착 중',
    equipStartBtn: '시작 무기로 장착',
    forgeBtn: '무기 제작',
    maxedBtn: '최대 레벨',
    upgradeBtn: '강화',
    questsModalTitle: '일일 임무 두루마리',
    claimedBtn: '수령 완료',
    claimBtn: '보상 수령',
    progressLabel: '진행도',
    avatarModalTitle: '기사 프로필 & 아바타',
    nicknameLabel: '기사 닉네임:',
    chooseAvatarLabel: '아바타 아이콘 선택:',
    totalKillsLabel: '처치한 적',
    runsClearedLabel: '클리어 횟수',
    settingsModalTitle: '시스템 설정 (SETTINGS)',
    languageSetting: '언어 (Language)',
    bgmSetting: '8비트 배경음악 (Chiptune BGM)',
    bgmSettingDesc: '타이틀, 로비, 던전, 보스전 테마곡 자동 전환',
    sfxSetting: '8비트 효과음 (SFX)',
    sfxSettingDesc: '검격, 탄막 반사음, 총성 및 아이템 획득 효과음',
    shakeSetting: '화면 흔들림 (Screen Shake)',
    autoAimSetting: '자동 조준 (Soul Knight Auto-Aim)',
    dmgNumberSetting: '피해량 숫자 표시',
    touchScaleSetting: '터치 버튼 크기',
    onLabel: '켜기',
    offLabel: '끄기',
    freeGemsBtn: '+ 초보자 선물 300 💎 받기',
    resetSaveBtn: '초기화',

    meleeStrike: '베기',
    rangedFire: '발사',
    dashLabel: '대시',
    skillLabel: '스킬',
    secondaryLabel: '보조',
    livingRoomBanner: '대기실 (LIVING ROOM)',
    livingRoomSub: '영웅 & 펫 변경 · 탄막 반사 테스트 · 북쪽 문으로 1-1 입장',
    levelUpTitle: '레벨 업!',
    chooseBoonTitle: '신성한 축복(Buff) 1개 선택',
    pickBoonBtn: '선택하기 →',
    pauseTitle: '일시 정지 (PAUSED)',
    resumeBtn: '전투 계속하기',
    backLivingRoomBtn: '대기실(Living Room)로 이동',
    backMainLobbyBtn: '메인 로비로 이동',
    victoryTitle: '승리!',
    defeatTitle: '패배',
    victorySub: '마법석을 되찾았습니다!',
    defeatSub: '던전에서 쓰러졌습니다',
    floorReachedLabel: '도달한 층',
    foesSlainLabel: '처치한 몬스터',
    gemsEarnedLabel: '획득한 소울 젬',
    totalDamageLabel: '총 피해량',
    playAgainBtn: '다시 시작 (1-1)',
    deflectToast: '⚡ 탄막 반사!',

    difficulties: {
      normal: { name: '노멀', sub: '균형 잡힌 던전 탐험' },
      badass: { name: '배드애스(Hard)', sub: '강력한 적과 엘리트 출현 증가' },
      hell: { name: '심연 지옥', sub: '극한의 탄막 지옥 (+150% 💎)' },
    },
    races: {
      human: { name: '인간 (Human)', bonusDesc: '체력 +10, 실드 +5' },
      elf: { name: '하이 엘프 (Elf)', bonusDesc: '마나 +25, 이동속도 +6%' },
      demon: { name: '마족 (Demon)', bonusDesc: '공격력 +8%, 치명타율 +5%' },
      orc: { name: '오크 전사 (Orc)', bonusDesc: '최대 체력 +28, 실드 +5' },
      undead: { name: '언데드 (Undead)', bonusDesc: '실드 +15, 마나 +20' },
    },
    horns: {
      none: '뿔 없음',
      demon_horns: '심연의 악마 뿔',
      dragon_antlers: '황금 드래곤 뿔',
      crown_spikes: '흑요석 가시 왕관',
    },
    wings: {
      none: '날개 없음',
      angel_wings: '대천사의 날개',
      bat_wings: '악마의 박쥐 날개',
      cyber_wings: '사이버 플라즈마 날개',
    },
    ears: {
      human: '둥근 귀',
      elf_long: '엘프의 긴 귀',
      beast_ears: '야수 전사의 귀',
    },
    heroes: {
      knight: {
        name: 'Vanguard Knight',
        title: '선봉 기사',
        desc: '높은 체력과 실드. 대검과 권총으로 시작합니다.',
        skillName: 'Superior Shockwave',
        skillDesc: '황금 충격파를 발산하여 마나를 +35 회복하고 적을 기절시킵니다.',
      },
      pyromancer: {
        name: 'Ash Pyromancer',
        title: '화염 마법사',
        desc: '압도적인 마나통. 뇌전의 지팡이와 권총으로 시작합니다.',
        skillName: 'Solar Cataclysm',
        skillDesc: '전방위로 8개의 관통 용암구를 발사하고 마나를 +45 회복합니다.',
      },
      rogue: {
        name: 'Shadow Rogue',
        title: '그림자 암살자',
        desc: '빠른 속도와 높은 치명타. 쌍검과 산탄총으로 시작합니다.',
        skillName: 'Phantom Blade Fan',
        skillDesc: '6개의 관통 수리검을 던지고 대시 쿨타임을 즉시 초기화합니다.',
      },
      alchemist: {
        name: 'Cyber Alchemist',
        title: '사이버 연금술사',
        desc: '냉기 레이저와 생체 독 기술. 오로라 냉동포로 시작합니다.',
        skillName: 'Alchemical Venom Nova',
        skillDesc: '6개의 폭발 독병을 투척하고 실드 +15 및 마나 +35를 회복합니다.',
      },
      necromancer: {
        name: 'Void Necromancer',
        title: '공허의 사령술사',
        desc: '영혼 흡수 암흑 마법. 공허의 낫으로 시작합니다.',
        skillName: 'Abyssal Soul Harvest',
        skillDesc: '10개의 영혼탄을 발사하여 체력 +15 및 마나 +40을 흡수합니다.',
      },
      berserker: {
        name: 'Berserker Titan',
        title: '광전사 타이탄',
        desc: '압도적인 근접 파괴력. 성검 엑스칼리버로 시작합니다.',
        skillName: 'Ragnarok Blood Rage',
        skillDesc: '360° 대지 강타와 6개의 화염 검기를 날립니다.',
      },
    },
    weapons: {
      broadsword: {
        name: '기사단 대검',
        desc: '빠른 교차 연속 베기 (0 마나). 적의 탄환을 베어 없앱니다.',
      },
      twin_daggers: {
        name: '그림자 쌍단검',
        desc: '초고속 이도류 참격 (0 마나). 적의 탄환을 파괴합니다.',
      },
      blood_katana: {
        name: '요도 무라마사 카타나',
        desc: '초고속 발도술 베기 (0 마나). 적의 탄막을 튕겨내는 【탄막 반사】!',
      },
      void_scythe: {
        name: '심연의 사신 낫',
        desc: '220° 광범위 베기 (1 마나). 【탄막 반사】 및 에너지 흡수.',
      },
      inferno_greataxe: {
        name: '지옥불 대형 도끼',
        desc: '360° 회전 베기로 주변의 모든 적과 탄환을 쓸어버립니다 (1 마나).',
      },
      thunder_warhammer: {
        name: '천둥의 전투 망치',
        desc: '대지를 강타해 전격 충격파로 적을 기절시킵니다 (2 마나).',
      },
      dragon_lance: {
        name: '화룡의 장창',
        desc: '긴 사거리로 적들을 꿰뚫는 화염 창 찌르기 (0 마나).',
      },
      excalibur: {
        name: '성검 엑스칼리버',
        desc: '【탄막 반사】와 관통 황금 검기를 동시에 날리는 전설의 검 (2 마나).',
      },
      pioneer_pistol: {
        name: '개척자 권총',
        desc: '마나 소모 없이 안정적으로 발사하는 기본 권총 (0 마나).',
      },
      splitter_shotgun: {
        name: '스플리터 산탄총',
        desc: '5발의 산탄을 부채꼴로 발사하여 적을 밀쳐냅니다 (2 마나).',
      },
      plasma_rifle: {
        name: '플라즈마 기관단총',
        desc: '초고속 연사 플라즈마 서브머신건 (1 마나).',
      },
      gatling_minigun: {
        name: '발칸 개틀링 미니건',
        desc: '3갈래의 압도적인 탄막 폭풍을 쏟아붓는 중기관총 (2 마나).',
      },
      sniper_railgun: {
        name: '하이페리온 저격 레일건',
        desc: '일직선상의 모든 적을 관통하는 초고속 전자기 빔 (3 마나).',
      },
      frost_laser: {
        name: '오로라 냉동 캐논',
        desc: '적들을 관통하는 2줄기 빙결 레이저를 발사합니다 (2 마나).',
      },
      thunder_staff: {
        name: '뇌신의 지팡이',
        desc: '주변 적들에게 연쇄적으로 튀는 번개 구체를 발사합니다 (3 마나).',
      },
      inferno_bow: {
        name: '화룡의 활',
        desc: '적중 시 폭발하는 관통 화염 화살을 발사합니다 (3 마나).',
      },
    },
  },
};
