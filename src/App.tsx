import React, { useEffect, useRef, useState } from 'react';
import {
  BootPixelIcon,
  CoinPixelIcon,
  HeartPixelIcon,
  ManaPixelIcon,
  ObsidianTitleLockup,
  PausePixelIcon,
  PixelAvatarGraphic,
  PotionPixelIcon,
  SettingsPixelIcon,
  ShieldPixelIcon,
  ShopPixelIcon,
  SkillStarIcon,
  SoulGemIcon,
  SoundIcon,
  StairsPixelIcon,
  SwapWeaponIcon,
  SwordPixelIcon,
} from './components/Icons';
import { IsometricGameEngine } from './game/GameEngine';
import { DIFFICULTIES, HERO_CLASSES, PETS, WEAPONS } from './game/dungeonGen';
import { sound } from './game/sound';
import {
  AVATAR_LIST,
  DEFAULT_PROFILE,
  loadProfile,
  loadSettings,
  saveProfile,
  saveSettings,
} from './game/storage';
import {
  AvatarId,
  BoonOption,
  DifficultyId,
  GameSettings,
  GameState,
  HeroClassId,
  HudSnapshot,
  PermanentUpgrades,
  PetId,
  PlayerProfile,
  WeaponId,
} from './game/types';

const INITIAL_HUD: HudSnapshot = {
  inLivingRoom: true,
  difficulty: 'normal',
  hp: 145,
  maxHp: 145,
  armor: 65,
  maxArmor: 65,
  mana: 200,
  maxMana: 200,
  gold: 30,
  soulGemsEarned: 0,
  floor: 1,
  maxFloors: 3,
  level: 1,
  xp: 0,
  xpToNext: 60,
  potions: 2,
  maxPotions: 4,
  kills: 0,
  enemiesRemaining: 0,
  portalOpen: true,
  roomLocked: false,
  damageDealt: 0,
  heroClass: 'knight',
  petId: 'cat',
  petName: 'Chilly the Cat',
  activeWeapon: WEAPONS.broadsword,
  secondaryWeapon: WEAPONS.pioneer_pistol,
  statueBlessing: null,
  dashCooldownRatio: 0,
  skillCooldownRatio: 0,
  attackCooldownRatio: 0,
  isInvulnerable: false,
  activeBoons: [],
  bossActive: false,
  bossName: '',
  bossHp: 0,
  bossMaxHp: 1,
  floorCleared: true,
  promptText: null,
  promptSubtext: null,
  minimapRooms: [],
};

const UPGRADE_DEFINITIONS: {
  key: keyof PermanentUpgrades;
  name: string;
  desc: string;
  bonusPerLevel: string;
  baseCost: number;
  accent: string;
}[] = [
  {
    key: 'hpLevel',
    name: 'Vitality Core (+HP)',
    desc: 'Tăng máu tối đa vĩnh viễn cho mọi nhân vật.',
    bonusPerLevel: '+15 Max HP / cấp',
    baseCost: 80,
    accent: '#f43f5e',
  },
  {
    key: 'armorLevel',
    name: 'Aegis Plating (+Shield)',
    desc: 'Tăng giáp lá chắn tự hồi phục khi giao tranh.',
    bonusPerLevel: '+8 Shield / cấp',
    baseCost: 90,
    accent: '#94a3b8',
  },
  {
    key: 'manaLevel',
    name: 'Arcane Reservoir (+Mana)',
    desc: 'Tăng năng lượng tối đa để xả súng & phép.',
    bonusPerLevel: '+25 Max Mana / cấp',
    baseCost: 75,
    accent: '#38bdf8',
  },
  {
    key: 'dmgLevel',
    name: 'Weapon Mastery (+DMG)',
    desc: 'Tăng sát thương cho mọi vũ khí cận chiến & súng.',
    bonusPerLevel: '+8% Sát thương / cấp',
    baseCost: 110,
    accent: '#f59e0b',
  },
  {
    key: 'goldLevel',
    name: 'Merchant Vault (+Gold)',
    desc: 'Khởi đầu trận đấu với nhiều vàng hơn để mua đồ.',
    bonusPerLevel: '+20 Vàng khởi đầu / cấp',
    baseCost: 65,
    accent: '#fde047',
  },
];

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<IsometricGameEngine | null>(null);
  const dpadRef = useRef<HTMLDivElement | null>(null);
  const dpadPointerId = useRef<number | null>(null);

  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [selectedClass, setSelectedClass] = useState<HeroClassId>('knight');
  const [selectedPet, setSelectedPet] = useState<PetId>('cat');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyId>('normal');

  const [activeModal, setActiveModal] = useState<
    'NONE' | 'SHOP' | 'AVATAR' | 'SETTINGS'
  >('NONE');
  const [shopTab, setShopTab] = useState<'UPGRADES' | 'ARMORY'>('UPGRADES');

  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [boonChoices, setBoonChoices] = useState<BoonOption[]>([]);
  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Sync profile & settings changes to localStorage + GameEngine
  const updateAndSaveProfile = (updater: (prev: PlayerProfile) => PlayerProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      saveProfile(next);
      engineRef.current?.updateProfile(next);
      return next;
    });
  };

  const updateAndSaveSettings = (
    updater: (prev: GameSettings) => GameSettings
  ) => {
    setSettings((prev) => {
      const next = updater(prev);
      saveSettings(next);
      engineRef.current?.updateSettings(next);
      return next;
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const initialProf = loadProfile();
    const initialSet = loadSettings();
    sound.setMuted(initialSet.muted);

    const engine = new IsometricGameEngine(
      canvasRef.current,
      (newState) => setGameState(newState),
      (newHud) => setHud(newHud),
      (choices) => setBoonChoices(choices),
      (gemsDelta, killsDelta = 0, runWon = false, consumedPreRun = false) => {
        setProfile((prev) => {
          const next: PlayerProfile = {
            ...prev,
            soulGems: prev.soulGems + gemsDelta,
            totalKills: prev.totalKills + killsDelta,
            runsCompleted: prev.runsCompleted + (runWon ? 1 : 0),
            preRunWeapon: consumedPreRun ? null : prev.preRunWeapon,
            preRunPotion: consumedPreRun ? false : prev.preRunPotion,
          };
          saveProfile(next);
          engine.updateProfile(next);
          return next;
        });
      }
    );
    engine.updateProfile(initialProf);
    engine.updateSettings(initialSet);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleSelectClass = (cls: HeroClassId) => {
    setSelectedClass(cls);
    engineRef.current?.selectHeroClass(cls);
    sound.playExpCoin();
  };

  const handleSelectPet = (petId: PetId) => {
    setSelectedPet(petId);
    engineRef.current?.selectPet(petId);
  };

  const handleSelectDifficulty = (diff: DifficultyId) => {
    setSelectedDifficulty(diff);
    engineRef.current?.selectDifficulty(diff);
    sound.playWeaponSwitch();
  };

  const handleEnterLivingRoom = () => {
    setActiveModal('NONE');
    engineRef.current?.enterLivingRoom(selectedClass, selectedDifficulty);
  };

  const handleStartDungeonDirect = () => {
    setActiveModal('NONE');
    engineRef.current?.startNewRun(selectedClass, selectedDifficulty);
  };

  const handleToggleMute = () => {
    updateAndSaveSettings((prev) => ({
      ...prev,
      muted: !prev.muted,
    }));
  };

  const handleBuyUpgrade = (
    key: keyof PermanentUpgrades,
    baseCost: number
  ) => {
    const currentLv = profile.upgrades[key];
    if (currentLv >= 5) return;
    const cost = baseCost + currentLv * 60;
    if (profile.soulGems < cost) return;

    sound.playLevelUp();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cost,
      upgrades: {
        ...prev.upgrades,
        [key]: prev.upgrades[key] + 1,
      },
    }));
  };

  const handleBuyPreRunWeapon = (wpnId: WeaponId) => {
    const wpn = WEAPONS[wpnId];
    if (profile.preRunWeapon === wpnId) return;
    if (profile.soulGems < wpn.shopGemsCost) return;

    sound.playWeaponSwitch();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - wpn.shopGemsCost,
      preRunWeapon: wpnId,
    }));
  };

  const handleBuyPreRunPotion = () => {
    const cost = 50;
    if (profile.preRunPotion || profile.soulGems < cost) return;
    sound.playPickup('potion');
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cost,
      preRunPotion: true,
    }));
  };

  // Multi-touch Virtual D-Pad / Analog Stick handlers
  const updateJoystickFromEvent = (clientX: number, clientY: number) => {
    if (!dpadRef.current) return;
    const rect = dpadRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxRadius = rect.width * 0.36;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < 4) {
      setKnobOffset({ x: 0, y: 0 });
      engineRef.current?.setVirtualStick(0, 0);
      return;
    }

    const clamped = Math.min(dist, maxRadius);
    const nx = dx / dist;
    const ny = dy / dist;

    setKnobOffset({ x: nx * clamped, y: ny * clamped });
    engineRef.current?.setVirtualStick(nx, ny);
  };

  const handleDpadPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dpadPointerId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateJoystickFromEvent(e.clientX, e.clientY);
  };

  const handleDpadPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dpadPointerId.current !== e.pointerId) return;
    e.stopPropagation();
    updateJoystickFromEvent(e.clientX, e.clientY);
  };

  const handleDpadPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dpadPointerId.current !== e.pointerId) return;
    e.stopPropagation();
    dpadPointerId.current = null;
    setKnobOffset({ x: 0, y: 0 });
    engineRef.current?.setVirtualStick(0, 0);
  };

  const classCfg = HERO_CLASSES[selectedClass];
  const currentAvatarInfo =
    AVATAR_LIST.find((a) => a.id === profile.avatarId) || AVATAR_LIST[0];
  const isLargeControls = settings.controlScale === 'large';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#06080d] select-none">
      {/* Isolated 60fps 2.5D Pixel-Art Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
      />

      {/* =====================================================================
          1. MAIN MENU HUB (Avatar, Soul Gems, Difficulty, 4 Classes, Shop, Settings)
         ===================================================================== */}
      {gameState === 'TITLE_MENU' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-[#06080d]/92 via-[#06080d]/60 to-[#06080d]/95 overflow-y-auto">
          {/* TOP BAR: Player Avatar Profile, Soul Gems, Shop & Settings Buttons */}
          <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            {/* Left: Player Avatar & Profile Button */}
            <button
              onClick={() => {
                sound.playExpCoin();
                setActiveModal('AVATAR');
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#090b10]/95 border border-slate-800 hover:border-amber-400 transition-colors cursor-pointer"
            >
              <PixelAvatarGraphic
                avatarId={profile.avatarId}
                className="w-9 h-9 rounded-lg border border-slate-700 shrink-0"
              />
              <div className="text-left">
                <div className="text-xs font-display font-bold text-slate-100 flex items-center gap-1.5">
                  <span>{profile.playerName}</span>
                  <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                    Đổi Avatar
                  </span>
                </div>
                <div className="text-[10px] font-mono-tabular text-slate-400">
                  {currentAvatarInfo.title} · Hạ {profile.totalKills} quái ·{' '}
                  {profile.runsCompleted} lần phá đảo
                </div>
              </div>
            </button>

            {/* Right: Soul Gems Currency + Shop + Settings + Audio */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#090b10]/95 border border-sky-500/40 text-sky-300 font-mono-tabular text-xs font-bold">
                <SoulGemIcon className="w-4 h-4 shrink-0" />
                <span>{profile.soulGems}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  SOUL GEMS
                </span>
              </div>

              <button
                onClick={() => {
                  sound.playExpCoin();
                  setActiveModal('SHOP');
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/70 text-amber-300 font-mono-tabular font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShopPixelIcon className="w-4 h-4" />
                <span>Cửa Hàng & Nâng Cấp</span>
              </button>

              <button
                onClick={() => {
                  sound.playExpCoin();
                  setActiveModal('SETTINGS');
                }}
                className="min-h-[40px] px-3 py-2 rounded-xl bg-[#090b10]/95 hover:bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 font-mono-tabular text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <SettingsPixelIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Cài Đặt</span>
              </button>

              <button
                onClick={handleToggleMute}
                className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#090b10]/95 border border-slate-800 text-slate-300 hover:border-amber-400 flex items-center justify-center cursor-pointer"
                aria-label="Toggle Audio"
              >
                <SoundIcon muted={settings.muted} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CENTER HUB: Title Lockup, Difficulty Selector, 4 Hero Classes & Pet */}
          <div className="w-full max-w-6xl flex flex-col items-center text-center my-auto py-1 pointer-events-auto">
            <div className="w-full max-w-[330px] sm:max-w-[380px]">
              <ObsidianTitleLockup />
            </div>

            {/* 1. DIFFICULTY SELECTOR ROW (Chọn Độ Khó) */}
            <div className="w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-3 mt-1 mb-2.5">
              {(Object.keys(DIFFICULTIES) as DifficultyId[]).map((diffId) => {
                const dCfg = DIFFICULTIES[diffId];
                const active = selectedDifficulty === diffId;
                return (
                  <button
                    key={diffId}
                    onClick={() => handleSelectDifficulty(diffId)}
                    className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#111726] shadow-[0_0_16px_rgba(0,0,0,0.6)]'
                        : 'bg-[#090b10]/85 border-slate-800/90 opacity-75 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: active ? dCfg.accent : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className="font-display font-bold text-xs sm:text-sm truncate"
                        style={{ color: active ? dCfg.accent : '#e2e8f0' }}
                      >
                        {dCfg.name}
                      </span>
                      <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded bg-slate-900 text-sky-300 font-bold shrink-0">
                        {dCfg.gemMult}x 💎
                      </span>
                    </div>
                    <div className="text-[10px] font-mono-tabular text-slate-400 truncate mt-0.5">
                      {dCfg.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 2. 4 HERO CLASSES + PET & LOADOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 w-full mb-2.5">
              {/* 4 Hero Class Cards */}
              <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(Object.keys(HERO_CLASSES) as HeroClassId[]).map((clsId) => {
                  const cfg = HERO_CLASSES[clsId];
                  const isSelected = selectedClass === clsId;
                  const boostedHp = cfg.maxHp + profile.upgrades.hpLevel * 15;
                  const boostedArm =
                    cfg.maxArmor + profile.upgrades.armorLevel * 8;
                  const boostedMp =
                    cfg.maxMana + profile.upgrades.manaLevel * 25;

                  return (
                    <button
                      key={clsId}
                      onClick={() => handleSelectClass(clsId)}
                      className={`text-left p-2.5 rounded-xl border transition-transform active:scale-[0.98] cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#111726] border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.22)]'
                          : 'bg-[#090b10]/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span
                            className="font-display font-bold text-xs sm:text-sm tracking-wide truncate"
                            style={{
                              color: isSelected ? cfg.accentColor : '#f8fafc',
                            }}
                          >
                            {cfg.name}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-mono-tabular px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                              CHỌN
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mb-1.5">
                          {cfg.title}
                        </div>
                        <div className="text-[10px] font-mono-tabular text-slate-200 flex items-center gap-1.5 flex-wrap">
                          <span className="text-rose-400 font-bold">
                            HP {boostedHp}
                          </span>
                          <span>·</span>
                          <span className="text-slate-300 font-bold">
                            SHD {boostedArm}
                          </span>
                          <span>·</span>
                          <span className="text-sky-400 font-bold">
                            MP {boostedMp}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono-tabular text-amber-300 truncate">
                        ⚔ {WEAPONS[cfg.starterWeaponId].name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Companion Pet + Pre-Run Loadout Box */}
              <div className="lg:col-span-3 bg-[#090b10]/92 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between text-left">
                <div>
                  <div className="text-[10px] font-mono-tabular text-slate-400 mb-1">
                    Thú Cưng Đồng Hành · {PETS[selectedPet].role}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {(Object.keys(PETS) as PetId[]).map((pid) => {
                      const pCfg = PETS[pid];
                      const active = selectedPet === pid;
                      return (
                        <button
                          key={pid}
                          onClick={() => handleSelectPet(pid)}
                          className={`px-2 py-1 rounded-lg border text-[10px] font-mono-tabular font-semibold transition-colors cursor-pointer truncate ${
                            active
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {pCfg.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/90 flex items-center justify-between text-[10px] font-mono-tabular">
                  <span className="text-slate-400">Trang bị mang theo:</span>
                  <span className="text-emerald-400 font-bold truncate max-w-[140px]">
                    {profile.preRunWeapon
                      ? WEAPONS[profile.preRunWeapon].name
                      : 'Mặc định'}
                    {profile.preRunPotion ? ' +1 Vial' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Skill & Primary Start CTAs */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-[#090b10]/95 border border-slate-800 rounded-xl px-3.5 py-2">
              <div className="flex items-center gap-2 text-left text-xs">
                <SkillStarIcon className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">
                    Kỹ năng {classCfg.skillName}:{' '}
                  </span>
                  <span className="text-slate-300">{classCfg.skillDesc}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleEnterLivingRoom}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-display font-extrabold text-xs sm:text-sm tracking-wider shadow-[0_6px_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  Vào Phòng Chờ (Living Room)
                </button>
                <button
                  onClick={handleStartDungeonDirect}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-mono-tabular font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Chơi Ngay (1-1) →
                </button>
              </div>
            </div>
          </div>

          {/* Single Flat Control-Hint Line */}
          <div className="text-[11px] font-mono-tabular text-slate-400 tracking-wide text-center">
            WASD / D-Pad Di chuyển · Space Bắn/Chém · R Đổi Vũ Khí · Shift Lướt (0.5s Bất Tử) · 1 Kỹ Năng · Phá Thùng/Bình rớt Vàng & Mana
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL A: SHOP & PERMANENT UPGRADES (Mua Đồ & Nâng Cấp Vĩnh Viễn)
         ===================================================================== */}
      {activeModal === 'SHOP' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#090b10] border border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-display font-bold text-lg sm:text-xl text-amber-400">
                  Cửa Hàng Kho Vũ Khí & Nâng Cấp Thánh Điện
                </h2>
                <p className="text-xs font-mono-tabular text-slate-400">
                  Dùng Soul Gems thu thập được trong hầm ngục để nâng cấp chỉ số vĩnh viễn hoặc mua vũ khí mang vào trận
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-sky-500/40 text-sky-300 font-mono-tabular text-sm font-bold">
                  <SoulGemIcon className="w-4 h-4" />
                  <span>{profile.soulGems}</span>
                </div>
                <button
                  onClick={() => setActiveModal('NONE')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-tabular text-xs font-bold cursor-pointer"
                >
                  Đóng ✕
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 my-3">
              <button
                onClick={() => setShopTab('UPGRADES')}
                className={`px-4 py-2 rounded-xl font-mono-tabular text-xs font-bold transition-colors cursor-pointer ${
                  shopTab === 'UPGRADES'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                1. Nâng Cấp Chỉ Số Vĩnh Viễn
              </button>
              <button
                onClick={() => setShopTab('ARMORY')}
                className={`px-4 py-2 rounded-xl font-mono-tabular text-xs font-bold transition-colors cursor-pointer ${
                  shopTab === 'ARMORY'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                2. Mua Vũ Khí Mang Vào Trận
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {shopTab === 'UPGRADES' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {UPGRADE_DEFINITIONS.map((u) => {
                    const lv = profile.upgrades[u.key];
                    const isMax = lv >= 5;
                    const cost = u.baseCost + lv * 60;
                    const canAfford = profile.soulGems >= cost && !isMax;

                    return (
                      <div
                        key={u.key}
                        className="p-3.5 rounded-xl bg-[#111726] border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-display font-bold text-sm"
                              style={{ color: u.accent }}
                            >
                              {u.name}
                            </span>
                            <span className="text-[11px] font-mono-tabular px-2 py-0.5 rounded bg-slate-900 text-slate-200 font-bold">
                              Lv.{lv}/5
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {u.desc}
                          </p>
                          <div className="text-[11px] font-mono-tabular text-emerald-400 mt-1">
                            {u.bonusPerLevel}
                          </div>
                        </div>

                        <button
                          onClick={() => handleBuyUpgrade(u.key, u.baseCost)}
                          disabled={!canAfford}
                          className={`min-h-[42px] px-3.5 py-2 rounded-xl font-mono-tabular text-xs font-bold shrink-0 transition-all cursor-pointer ${
                            isMax
                              ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 cursor-default'
                              : canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {isMax ? 'TỐI ĐA' : `Nâng Cấp (${cost} 💎)`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Extra Vial Supply */}
                  <div className="p-3 rounded-xl bg-[#111726] border border-rose-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <PotionPixelIcon className="w-7 h-7 shrink-0" />
                      <div>
                        <div className="font-display font-bold text-sm text-rose-300">
                          Bình Máu Tiếp Tế (+1 Healing Vial Khởi Đầu)
                        </div>
                        <div className="text-xs text-slate-400">
                          Mang thêm 1 bình máu & năng lượng dự trữ ngay khi bước vào hầm ngục.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleBuyPreRunPotion}
                      disabled={profile.preRunPotion || profile.soulGems < 50}
                      className={`min-h-[40px] px-4 py-2 rounded-xl font-mono-tabular text-xs font-bold shrink-0 cursor-pointer ${
                        profile.preRunPotion
                          ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                          : profile.soulGems >= 50
                          ? 'bg-rose-500 hover:bg-rose-400 text-slate-950'
                          : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {profile.preRunPotion ? 'ĐÃ TRANG BỊ' : 'Mua (50 💎)'}
                    </button>
                  </div>

                  {/* All Weapons Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {(Object.keys(WEAPONS) as WeaponId[]).map((wId) => {
                      const w = WEAPONS[wId];
                      const equipped = profile.preRunWeapon === wId;
                      const canBuy = profile.soulGems >= w.shopGemsCost && !equipped;
                      return (
                        <div
                          key={wId}
                          className="p-3 rounded-xl bg-[#111726] border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className="font-display font-bold text-sm truncate"
                                style={{ color: w.rarityColor }}
                              >
                                {w.name}
                              </span>
                              <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
                                {w.rarity}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono-tabular text-slate-300 mt-1">
                              DMG {w.damage} ·{' '}
                              <span className="text-sky-400">
                                {w.manaCost} Mana
                              </span>{' '}
                              · {w.type.toUpperCase()}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                              {w.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleBuyPreRunWeapon(wId)}
                            disabled={!canBuy}
                            className={`mt-3 min-h-[38px] w-full py-1.5 px-3 rounded-lg font-mono-tabular text-xs font-bold transition-colors cursor-pointer ${
                              equipped
                                ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                                : canBuy
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                : 'bg-slate-900 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {equipped
                              ? '★ ĐANG MANG VÀO TRẬN'
                              : `Trang Bị (${w.shopGemsCost} 💎)`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL B: AVATAR & PLAYER PROFILE (Chọn Avatar & Hồ Sơ)
         ===================================================================== */}
      {activeModal === 'AVATAR' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090b10] border border-amber-500/50 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-display font-bold text-xl text-amber-400">
                Hồ Sơ Hiệp Sĩ & Chọn Avatar
              </h2>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-tabular text-xs font-bold cursor-pointer"
              >
                Đóng ✕
              </button>
            </div>

            {/* Player Name Input */}
            <div className="mb-4">
              <label className="block text-xs font-mono-tabular text-slate-400 mb-1">
                Tên Nhân Vật (Biệt danh Hiệp Sĩ):
              </label>
              <input
                type="text"
                maxLength={18}
                value={profile.playerName}
                onChange={(e) =>
                  updateAndSaveProfile((prev) => ({
                    ...prev,
                    playerName: e.target.value || 'Soul Knight',
                  }))
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#111726] border border-slate-700 text-slate-100 font-mono-tabular text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* 6 Pixel Avatars */}
            <div className="mb-4">
              <div className="text-xs font-mono-tabular text-slate-400 mb-2">
                Chọn Biểu Tượng Avatar:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AVATAR_LIST.map((av) => {
                  const selected = profile.avatarId === av.id;
                  return (
                    <button
                      key={av.id}
                      onClick={() => {
                        sound.playExpCoin();
                        updateAndSaveProfile((prev) => ({
                          ...prev,
                          avatarId: av.id as AvatarId,
                        }));
                      }}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#111726] border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <PixelAvatarGraphic
                        avatarId={av.id}
                        className="w-10 h-10 rounded-lg shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-display font-bold text-slate-100 truncate">
                          {av.name}
                        </div>
                        <div
                          className="text-[10px] font-mono-tabular truncate"
                          style={{ color: av.accent }}
                        >
                          {av.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Career Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#111726] border border-slate-800 font-mono-tabular text-center">
              <div>
                <div className="text-[10px] text-slate-400">Quái Đã Hạ</div>
                <div className="text-sm font-bold text-rose-400">
                  {profile.totalKills}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Lần Phá Đảo</div>
                <div className="text-sm font-bold text-amber-400">
                  {profile.runsCompleted}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Soul Gems</div>
                <div className="text-sm font-bold text-sky-400">
                  {profile.soulGems} 💎
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL C: SETTINGS (Cài Đặt Game, Âm Thanh, Rung, Auto-Aim)
         ===================================================================== */}
      {activeModal === 'SETTINGS' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090b10] border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-display font-bold text-xl text-amber-400">
                Cài Đặt Hệ Thống (Settings)
              </h2>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono-tabular text-xs font-bold cursor-pointer"
              >
                Đóng ✕
              </button>
            </div>

            <div className="space-y-3 font-mono-tabular text-xs">
              {/* 1. Audio */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">
                    Âm Thanh 8-Bit (Web Audio SFX)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Hiệu ứng tiếng chém, súng, bước chân và nhặt ngọc
                  </div>
                </div>
                <button
                  onClick={handleToggleMute}
                  className={`px-3.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                    !settings.muted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {!settings.muted ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </button>
              </div>

              {/* 2. Screen Shake */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">
                    Độ Rung Màn Hình (Screen Shake)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Cảm giác rung chấn khi nổ súng, chém hoặc trúng đòn
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {(['off', 'normal', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() =>
                        updateAndSaveSettings((s) => ({
                          ...s,
                          shakeIntensity: lvl,
                        }))
                      }
                      className={`px-2.5 py-1 rounded font-bold uppercase cursor-pointer ${
                        settings.shakeIntensity === lvl
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {lvl === 'off' ? 'Tắt' : lvl === 'normal' ? 'Vừa' : 'Mạnh'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Smart Auto-Aim */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">
                    Tự Động Ngắm Bắn (Soul Knight Auto-Aim)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Tự động khóa mục tiêu quái gần nhất khi bắn
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateAndSaveSettings((s) => ({
                      ...s,
                      autoAim: !s.autoAim,
                    }))
                  }
                  className={`px-3.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                    settings.autoAim
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.autoAim ? 'BẬT' : 'TẮT'}
                </button>
              </div>

              {/* 4. Floating Damage Numbers */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">
                    Hiển Thị Số Sát Thương (Damage Numbers)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Hiện số sát thương & chí mạng bay lên khi đánh trúng
                  </div>
                </div>
                <button
                  onClick={() =>
                    updateAndSaveSettings((s) => ({
                      ...s,
                      showDamageNumbers: !s.showDamageNumbers,
                    }))
                  }
                  className={`px-3.5 py-1.5 rounded-lg font-bold cursor-pointer ${
                    settings.showDamageNumbers
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.showDamageNumbers ? 'HIỆN' : 'ẨN'}
                </button>
              </div>

              {/* 5. Control Size */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#111726] border border-slate-800">
                <div>
                  <div className="font-bold text-slate-200">
                    Kích Cỡ Nút Cảm Ứng (Touch Controls)
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Tùy chỉnh kích thước D-Pad và cụm nút kỹ năng
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {(['normal', 'large'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() =>
                        updateAndSaveSettings((s) => ({
                          ...s,
                          controlScale: sz,
                        }))
                      }
                      className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                        settings.controlScale === sz
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {sz === 'normal' ? 'Chuẩn' : 'Cỡ Lớn'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bonus Gems Gift & Reset Row */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    sound.playLevelUp();
                    updateAndSaveProfile((p) => ({
                      ...p,
                      soulGems: p.soulGems + 300,
                    }));
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400 text-sky-300 font-bold cursor-pointer"
                >
                  + Nhận 300 💎 Quà Tân Thủ
                </button>
                <button
                  onClick={() => {
                    updateAndSaveProfile(() => ({ ...DEFAULT_PROFILE }));
                  }}
                  className="py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 border border-rose-700/50 text-rose-300 font-bold cursor-pointer"
                >
                  Reset Lưu Trữ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. LOW-OCCLUSION LANDSCAPE HUD (>85% Unobstructed Playfield)
         ===================================================================== */}
      {gameState === 'PLAYING' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2.5 sm:p-3.5">
          {/* TOP PERIMETER BAR */}
          <div className="flex items-start justify-between gap-2">
            {/* Top-Left: Avatar + Soul Knight 3-Bar Status Frame (HP, Shield, Mana) */}
            <div className="pointer-events-auto bg-[#090b10]/92 border border-slate-800 rounded-xl p-2.5 shadow-lg min-w-[215px] sm:min-w-[248px]">
              <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-slate-800/80">
                <PixelAvatarGraphic
                  avatarId={profile.avatarId}
                  className="w-7 h-7 rounded border border-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-display font-bold text-slate-100 truncate">
                    {profile.playerName}
                  </div>
                  <div
                    className="text-[9px] font-mono-tabular font-bold uppercase"
                    style={{ color: DIFFICULTIES[hud.difficulty].accent }}
                  >
                    {DIFFICULTIES[hud.difficulty].name}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono-tabular text-sky-300 font-bold">
                  <SoulGemIcon className="w-3.5 h-3.5" />
                  <span>{profile.soulGems}</span>
                </div>
              </div>

              {/* 1. HP Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-0.5">
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <HeartPixelIcon className="w-3.5 h-3.5" />
                  <span>HP</span>
                </span>
                <span className="text-slate-100 font-bold">
                  {hud.hp}/{hud.maxHp}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden border border-slate-800 mb-1">
                <div
                  className="h-full bg-rose-500 transition-transform duration-150 origin-left"
                  style={{
                    transform: `scaleX(${Math.max(
                      0,
                      Math.min(1, hud.hp / hud.maxHp)
                    )})`,
                  }}
                />
              </div>

              {/* 2. Armor / Shield Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-0.5">
                <span className="flex items-center gap-1 text-slate-300 font-bold">
                  <ShieldPixelIcon className="w-3.5 h-3.5" />
                  <span>SHIELD</span>
                </span>
                <span className="text-slate-200 font-bold">
                  {hud.armor}/{hud.maxArmor}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden border border-slate-800 mb-1">
                <div
                  className="h-full bg-slate-400 transition-transform duration-150 origin-left"
                  style={{
                    transform: `scaleX(${Math.max(
                      0,
                      Math.min(1, hud.armor / Math.max(1, hud.maxArmor))
                    )})`,
                  }}
                />
              </div>

              {/* 3. Mana / Energy Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-0.5">
                <span className="flex items-center gap-1 text-blue-400 font-bold">
                  <ManaPixelIcon className="w-3.5 h-3.5" />
                  <span>MANA</span>
                </span>
                <span className="text-blue-200 font-bold">
                  {hud.mana}/{hud.maxMana}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden border border-slate-800 mb-1.5">
                <div
                  className="h-full bg-blue-500 transition-transform duration-150 origin-left"
                  style={{
                    transform: `scaleX(${Math.max(
                      0,
                      Math.min(1, hud.mana / Math.max(1, hud.maxMana))
                    )})`,
                  }}
                />
              </div>

              {/* Unboxed Metadata Row: Level, Gold, Pet */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono-tabular text-slate-300">
                <span className="text-amber-300 font-bold">
                  Lv.{hud.level} ({hud.xp}/{hud.xpToNext})
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <CoinPixelIcon className="w-3.5 h-3.5" />
                  {hud.gold}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-300 truncate">
                  {hud.petName.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Top-Center: Boss Bar, Living Room Banner, or Interactive Pickup/Shop Prompt */}
            <div className="flex flex-col items-center gap-1.5 max-w-xs sm:max-w-md w-full px-1">
              {hud.inLivingRoom && !hud.promptText && (
                <div className="bg-[#090b10]/90 border border-slate-800 rounded-xl px-3.5 py-1.5 text-center">
                  <div className="text-xs font-display font-bold text-amber-400">
                    PHÒNG CHỜ LIVING ROOM
                  </div>
                  <div className="text-[11px] font-mono-tabular text-slate-300">
                    Đổi Tướng & Pet · Mở Rương Vũ Khí · Đi Lên Cổng Bắc Để Vào 1-1
                  </div>
                </div>
              )}

              {hud.bossActive && (
                <div className="w-full bg-[#090b10]/95 border border-rose-500/60 rounded-xl px-3 py-2 shadow-lg">
                  <div className="flex items-center justify-between text-xs font-mono-tabular mb-1">
                    <span className="font-display font-bold text-rose-300 truncate">
                      {hud.bossName}
                    </span>
                    <span className="text-rose-400 font-bold shrink-0">
                      {hud.bossHp}/{hud.bossMaxHp}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-amber-400 transition-transform duration-150 origin-left"
                      style={{
                        transform: `scaleX(${Math.max(
                          0,
                          Math.min(1, hud.bossHp / hud.bossMaxHp)
                        )})`,
                      }}
                    />
                  </div>
                </div>
              )}

              {hud.promptText && (
                <button
                  onClick={() => engineRef.current?.bufferAction('interact')}
                  className="pointer-events-auto min-h-[44px] px-4 py-1.5 rounded-xl bg-[#090b10]/95 border-2 border-amber-400 text-center shadow-lg hover:bg-slate-900 active:scale-95 transition-transform cursor-pointer"
                >
                  <div className="text-xs font-mono-tabular font-bold text-amber-300 whitespace-nowrap">
                    {hud.promptText}
                  </div>
                  {hud.promptSubtext && (
                    <div className="text-[10px] font-mono-tabular text-slate-300 max-w-xs truncate">
                      {hud.promptSubtext}
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Top-Right: Soul Knight Grid Room Minimap + Mute/Pause */}
            <div className="pointer-events-auto flex items-start gap-2">
              {!hud.inLivingRoom && (
                <div className="bg-[#090b10]/92 border border-slate-800 rounded-xl p-2 shadow-lg">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tabular text-slate-300 mb-1.5">
                    <span className="flex items-center gap-1 font-bold text-purple-300">
                      <StairsPixelIcon className="w-3.5 h-3.5" />
                      1-{hud.floor}
                    </span>
                    <span
                      className={
                        hud.roomLocked
                          ? 'text-rose-400 font-bold'
                          : hud.portalOpen
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }
                    >
                      {hud.roomLocked
                        ? 'LOCKED'
                        : hud.portalOpen
                        ? 'PORTAL'
                        : `${hud.enemiesRemaining} Foes`}
                    </span>
                  </div>

                  {/* 3x2 Room Grid Minimap */}
                  <div className="grid grid-cols-3 gap-1 w-[74px] h-[48px] p-1 bg-slate-950 rounded border border-slate-800">
                    {[0, 1].map((gy) =>
                      [0, 1, 2].map((gx) => {
                        const rm = hud.minimapRooms.find(
                          (r) => r.gridX === gx && r.gridY === gy
                        );
                        if (!rm) {
                          return (
                            <div
                              key={`${gx}-${gy}`}
                              className="rounded-xs bg-transparent"
                            />
                          );
                        }
                        let bg = 'bg-slate-800';
                        if (rm.isCurrent) bg = 'bg-sky-400';
                        else if (rm.kind === 'BOSS_ROOM') bg = 'bg-rose-500/80';
                        else if (rm.kind === 'CHEST_ROOM')
                          bg = 'bg-amber-400/80';
                        else if (
                          rm.kind === 'SHOP_ROOM' ||
                          rm.kind === 'STATUE_ROOM'
                        )
                          bg = 'bg-purple-400/80';
                        else if (rm.cleared) bg = 'bg-emerald-500/60';

                        return (
                          <div
                            key={rm.id}
                            className={`rounded-xs ${bg} ${
                              rm.isCurrent ? 'ring-1 ring-white' : ''
                            }`}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                {hud.inLivingRoom && (
                  <button
                    onClick={handleStartDungeonDirect}
                    className="min-h-[44px] px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono-tabular font-bold text-xs cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Vào 1-1 →
                  </button>
                )}
                <button
                  onClick={() => setActiveModal('SETTINGS')}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#090b10]/92 border border-slate-800 text-slate-300 hover:border-amber-400 flex items-center justify-center cursor-pointer"
                  aria-label="Settings"
                >
                  <SettingsPixelIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => engineRef.current?.setGameState('PAUSED')}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#090b10]/92 border border-slate-800 text-slate-300 hover:border-amber-400 flex items-center justify-center cursor-pointer"
                  aria-label="Pause Game"
                >
                  <PausePixelIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM PERIMETER: LANDSCAPE MOBILE THUMB CONTROLS */}
          <div className="flex items-end justify-between gap-2 pb-1 px-1">
            {/* Bottom-Left: 360° Multi-Touch Virtual Joystick */}
            <div
              ref={dpadRef}
              onPointerDown={handleDpadPointerDown}
              onPointerMove={handleDpadPointerMove}
              onPointerUp={handleDpadPointerUp}
              onPointerCancel={handleDpadPointerUp}
              className={`pointer-events-auto relative rounded-full bg-[#090b10]/85 border-2 border-slate-800 flex items-center justify-center touch-none cursor-pointer shadow-xl ${
                isLargeControls
                  ? 'w-[148px] h-[148px] sm:w-[162px] sm:h-[162px]'
                  : 'w-[128px] h-[128px] sm:w-[140px] sm:h-[140px]'
              }`}
              aria-label="Virtual Directional Pad"
            >
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-mono-tabular text-slate-500 pointer-events-none">
                ▲
              </span>
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono-tabular text-slate-500 pointer-events-none">
                ▼
              </span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-mono-tabular text-slate-500 pointer-events-none">
                ◀
              </span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono-tabular text-slate-500 pointer-events-none">
                ▶
              </span>

              <div className="w-14 h-14 rounded-full border border-slate-800/80 pointer-events-none" />

              <div
                className="absolute w-11 h-11 rounded-full bg-amber-500/90 border-2 border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.45)] flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{
                  transform: `translate3d(${knobOffset.x}px, ${knobOffset.y}px, 0)`,
                }}
              >
                <div className="w-2.5 h-2.5 rotate-45 bg-slate-950" />
              </div>
            </div>

            {/* Bottom-Right: Soul Knight Dual-Weapon Switch + Skill + Dash + Fire Cluster */}
            <div className="pointer-events-auto flex flex-col items-end gap-2">
              {/* Weapon Switch Slot Bar */}
              <button
                onPointerDown={(e) => {
                  e.stopPropagation();
                  engineRef.current?.bufferAction('switch_weapon');
                }}
                className="min-h-[42px] px-3 py-1.5 rounded-xl bg-[#090b10]/95 border border-slate-700 hover:border-amber-400 active:scale-95 flex items-center gap-2.5 shadow-md transition-transform cursor-pointer"
                aria-label="Switch Weapon"
              >
                <div className="text-left">
                  <div
                    className="text-xs font-mono-tabular font-bold leading-tight whitespace-nowrap"
                    style={{ color: hud.activeWeapon.rarityColor }}
                  >
                    {hud.activeWeapon.name}
                  </div>
                  <div className="text-[10px] font-mono-tabular text-slate-400">
                    DMG {hud.activeWeapon.damage} ·{' '}
                    <span className="text-blue-400 font-bold">
                      {hud.activeWeapon.manaCost} MP
                    </span>
                    {hud.secondaryWeapon
                      ? ` · Phụ: ${hud.secondaryWeapon.name.split(' ')[0]}`
                      : ''}
                  </div>
                </div>
                <SwapWeaponIcon className="w-4 h-4 text-amber-400 shrink-0" />
              </button>

              {/* Action Buttons Row */}
              <div className="flex items-end gap-2 sm:gap-2.5">
                {/* Heal Vial Slot (2) */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('potion');
                  }}
                  disabled={hud.potions <= 0}
                  className={`relative rounded-xl bg-[#090b10]/92 border border-slate-800 hover:border-rose-400 active:scale-95 flex flex-col items-center justify-center p-1.5 disabled:opacity-45 transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[54px] min-h-[54px]'
                      : 'min-w-[48px] min-h-[48px]'
                  }`}
                  aria-label="Use Healing Vial"
                >
                  <PotionPixelIcon className="w-5 h-5" />
                  <span className="text-[10px] font-mono-tabular text-rose-300 font-bold mt-0.5 whitespace-nowrap shrink-0">
                    {hud.potions}/{hud.maxPotions}
                  </span>
                </button>

                {/* Class Skill Slot (1 / Q) */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('skill');
                  }}
                  className={`relative rounded-xl bg-[#090b10]/92 border border-slate-800 hover:border-amber-400 active:scale-95 flex flex-col items-center justify-center p-1.5 overflow-hidden transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[62px] min-h-[62px]'
                      : 'min-w-[54px] min-h-[54px]'
                  }`}
                  aria-label="Cast Class Skill"
                >
                  {hud.skillCooldownRatio > 0 && (
                    <div
                      className="absolute inset-0 bg-slate-950/80 origin-bottom transition-transform duration-75"
                      style={{
                        transform: `scaleY(${hud.skillCooldownRatio})`,
                      }}
                    />
                  )}
                  <SkillStarIcon className="w-5 h-5 relative z-10" />
                  <span className="text-[10px] font-mono-tabular text-amber-300 font-bold mt-0.5 relative z-10 whitespace-nowrap shrink-0">
                    Skill
                  </span>
                </button>

                {/* Dash Button (Ghost Trail & 0.5s I-Frame) */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.bufferAction('dash');
                  }}
                  className={`relative rounded-2xl bg-[#090b10]/92 border-2 border-sky-500/70 hover:border-sky-400 active:scale-95 flex flex-col items-center justify-center p-1.5 overflow-hidden transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[64px] min-h-[64px]'
                      : 'min-w-[56px] min-h-[56px]'
                  }`}
                  aria-label="Dash with Ghost Trail"
                >
                  {hud.dashCooldownRatio > 0 && (
                    <div
                      className="absolute inset-0 bg-slate-950/85 origin-bottom transition-transform duration-75"
                      style={{
                        transform: `scaleY(${hud.dashCooldownRatio})`,
                      }}
                    />
                  )}
                  <BootPixelIcon className="w-5 h-5 relative z-10" />
                  <span className="text-[10px] font-mono-tabular text-sky-300 font-bold mt-0.5 relative z-10 whitespace-nowrap shrink-0">
                    Dash
                  </span>
                </button>

                {/* Primary Fire / Strike Button */}
                <button
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    engineRef.current?.setAttackHeld(true);
                  }}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    engineRef.current?.setAttackHeld(false);
                  }}
                  onPointerLeave={() => {
                    engineRef.current?.setAttackHeld(false);
                  }}
                  className={`relative rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 border-2 border-amber-300 text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.38)] flex flex-col items-center justify-center p-2 transition-transform cursor-pointer ${
                    isLargeControls
                      ? 'min-w-[80px] min-h-[80px]'
                      : 'min-w-[70px] min-h-[70px]'
                  }`}
                  aria-label="Fire or Strike"
                >
                  <SwordPixelIcon className="w-6 h-6" />
                  <span className="text-[11px] font-mono-tabular font-extrabold mt-0.5 whitespace-nowrap shrink-0">
                    {hud.activeWeapon.type === 'melee' ? 'Chém' : 'Bắn'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3. LEVEL UP / SKILL BUFF SELECTION MODAL
         ===================================================================== */}
      {gameState === 'BOON_SELECT' && (
        <div className="absolute inset-0 bg-[#06080d]/88 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#090b10] border border-amber-500/50 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-xs font-mono-tabular text-amber-400 tracking-widest mb-1">
                THĂNG CẤP! · LEVEL {hud.level}
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-100">
                Chọn 1 Kỹ Năng Thần Lực (Buff)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {boonChoices.map((boon) => (
                <button
                  key={boon.id}
                  onClick={() => engineRef.current?.applyBoon(boon)}
                  className="text-left p-4 rounded-xl bg-[#111726] border border-slate-800 hover:border-amber-400 active:scale-[0.98] transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div
                      className="text-[11px] font-mono-tabular mb-1"
                      style={{ color: boon.accent }}
                    >
                      {boon.category}
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-100 mb-2">
                      {boon.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {boon.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-800 text-xs font-mono-tabular text-amber-300">
                    Chọn Buff →
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. PAUSE MODAL
         ===================================================================== */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 bg-[#06080d]/85 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090b10] border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="font-display font-bold text-2xl text-amber-400 mb-1">
              Tạm Dừng (Paused)
            </h2>
            <p className="text-xs font-mono-tabular text-slate-400 mb-5">
              Tầng 1-{hud.floor} · {DIFFICULTIES[hud.difficulty].name} ·{' '}
              {hud.gold} Vàng · +{hud.soulGemsEarned} 💎
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => engineRef.current?.setGameState('PLAYING')}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Tiếp Tục Chiến Đấu
              </button>
              <button
                onClick={() => setActiveModal('SETTINGS')}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Mở Cài Đặt (Settings)
              </button>
              <button
                onClick={handleEnterLivingRoom}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Về Phòng Chờ (Living Room)
              </button>
              <button
                onClick={() => engineRef.current?.setGameState('TITLE_MENU')}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Về Màn Hình Chính
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VICTORY / GAME OVER MODAL
         ===================================================================== */}
      {(gameState === 'GAME_OVER' || gameState === 'VICTORY') && (
        <div className="absolute inset-0 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090b10] border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-xs font-mono-tabular tracking-widest mb-1 text-slate-400">
              {gameState === 'VICTORY'
                ? 'ĐÃ ĐOẠT ĐƯỢC ĐÁ MA THUẬT!'
                : 'GỤC NGÃ TRONG HẦM NGỤC'}
            </div>
            <h2
              className={`font-display font-extrabold text-3xl mb-4 ${
                gameState === 'VICTORY' ? 'text-amber-400' : 'text-rose-500'
              }`}
            >
              {gameState === 'VICTORY' ? 'Chiến Thắng!' : 'Thất Bại'}
            </h2>

            <div className="grid grid-cols-2 gap-2.5 mb-5 text-left bg-[#111726] border border-slate-800/90 rounded-xl p-4 font-mono-tabular">
              <div>
                <div className="text-[11px] text-slate-400">Tầng Đạt Được</div>
                <div className="text-base font-bold text-slate-100">
                  1-{hud.floor} ({DIFFICULTIES[hud.difficulty].name})
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Quái Tiêu Diệt</div>
                <div className="text-base font-bold text-slate-100">
                  {hud.kills}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">
                  Soul Gems Nhận Được
                </div>
                <div className="text-base font-bold text-sky-400">
                  +{hud.soulGemsEarned} 💎
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Tổng Sát Thương</div>
                <div className="text-base font-bold text-rose-400">
                  {hud.damageDealt}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleEnterLivingRoom}
                className="min-h-[48px] flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Về Phòng Chờ
              </button>
              <button
                onClick={() => {
                  engineRef.current?.setGameState('TITLE_MENU');
                  setActiveModal('SHOP');
                }}
                className="min-h-[48px] py-3 px-4 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400 text-sky-300 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Mở Cửa Hàng 💎
              </button>
              <button
                onClick={handleStartDungeonDirect}
                className="min-h-[48px] py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Chơi Lại (1-1)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
