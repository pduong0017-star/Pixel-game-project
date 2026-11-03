import React, { useEffect, useRef, useState } from 'react';
import {
  AnvilArmoryIcon,
  BootPixelIcon,
  ChestGachaIcon,
  CoinPixelIcon,
  HeartPixelIcon,
  LockPixelIcon,
  ManaPixelIcon,
  ObsidianTitleLockup,
  PausePixelIcon,
  PhoneDownloadIcon,
  PixelAvatarGraphic,
  PotionPixelIcon,
  QuestScrollIcon,
  SettingsPixelIcon,
  ShieldPixelIcon,
  ShopPixelIcon,
  SkillStarIcon,
  SoulGemIcon,
  SoundIcon,
  SparkleCrownIcon,
  StairsPixelIcon,
  SwapWeaponIcon,
  SwordPixelIcon,
} from './components/Icons';
import { IsometricGameEngine } from './game/GameEngine';
import { DIFFICULTIES, HERO_CLASSES, PETS, WEAPONS } from './game/dungeonGen';
import { getSpriteBank } from './game/pixelSprites';
import { sound } from './game/sound';
import { usePWAInstall } from './game/usePWAInstall';
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
  SkinTier,
  WeaponId,
} from './game/types';

const SKIN_TIERS: SkinTier[] = ['default', 'rare', 'legendary'];

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
  skinTier: 'default',
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

// ============================================================================
// MINI PIXEL PORTRAIT CANVAS (For 6-Hero Roster Bar & Weapon Icons)
// ============================================================================
function HeroMiniPortrait({
  heroId,
  skinTier,
  locked,
}: {
  heroId: HeroClassId;
  skinTier: SkinTier;
  locked: boolean;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.imageSmoothingEnabled = false;
    const bank = getSpriteBank();
    const sprite = locked
      ? bank.heroesSilhouette[heroId][0]
      : bank.heroesSkins[heroId]?.[skinTier]?.[0] || bank.heroes[heroId][0];
    ctx.drawImage(sprite, 4, 2, 36, 36);
  }, [heroId, skinTier, locked]);

  return (
    <canvas
      ref={ref}
      width={44}
      height={40}
      className="w-11 h-10 shrink-0 pointer-events-none"
    />
  );
}

function WeaponMiniSprite({ weaponId }: { weaponId: WeaponId }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.imageSmoothingEnabled = false;
    const bank = getSpriteBank();
    const sprite = bank.weapons[weaponId];
    if (sprite) {
      ctx.drawImage(sprite, 4, 4, 40, 22);
    }
  }, [weaponId]);

  return (
    <canvas
      ref={ref}
      width={48}
      height={30}
      className="w-12 h-7.5 shrink-0 pointer-events-none"
    />
  );
}

// ============================================================================
// INTERACTIVE LOBBY PEDESTAL STAGE CANVAS (Hero + Skin + Weapon Swing + Pet)
// ============================================================================
function LobbyStageCanvas({
  heroClass,
  skinTier,
  isLocked,
  petId,
  weaponId,
  onCyclePet,
}: {
  heroClass: HeroClassId;
  skinTier: SkinTier;
  isLocked: boolean;
  petId: PetId;
  weaponId: WeaponId;
  onCyclePet: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swingTriggerRef = useRef<number>(0);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    const bank = getSpriteBank();
    let rafId = 0;
    let startTime = performance.now();

    const sparks = Array.from({ length: 18 }, (_, i) => ({
      x: 40 + ((i * 37) % 240),
      y: 30 + ((i * 53) % 160),
      vy: 14 + (i % 5) * 6,
      size: 2 + (i % 3),
      phase: i * 0.7,
    }));

    const renderLoop = (now: number) => {
      const t = Math.max(0, (now - startTime) / 1000);
      const w = cvs.width;
      const h = cvs.height;

      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;

      const cx = w / 2;
      const cy = h * 0.68;

      const heroCfg = HERO_CLASSES[heroClass] || HERO_CLASSES.knight;
      const skinCfg = heroCfg.skins[skinTier] || heroCfg.skins.default;
      const primaryGlow = isLocked
        ? '#64748b'
        : skinCfg.auraColor || heroCfg.accentColor;

      // 1. Background Dungeon Arch & Flickering Torches
      const drawTorch = (tx: number, ty: number, offset: number) => {
        const flick = Math.sin(t * 14 + offset) * 2.5;
        // Torch bracket
        ctx.fillStyle = '#334155';
        ctx.fillRect(tx - 4, ty, 8, 18);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(tx - 3, ty + 2, 6, 14);
        // Outer glow
        const grad = ctx.createRadialGradient(
          tx,
          ty - 6,
          2,
          tx,
          ty - 6,
          Math.max(10, 36 + flick * 2)
        );
        grad.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
        grad.addColorStop(0.5, 'rgba(249, 115, 22, 0.22)');
        grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(tx, ty - 6, 38, 0, Math.PI * 2);
        ctx.fill();
        // Flame pixels
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(tx - 6, ty - 14 + flick * 0.5, 12, 12);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(tx - 4, ty - 11 + flick * 0.4, 8, 9);
        ctx.fillStyle = '#fef9c3';
        ctx.fillRect(tx - 2, ty - 8 + flick * 0.3, 4, 5);
      };

      drawTorch(44, 58, 0);
      drawTorch(w - 44, 58, 2.2);

      // 2. Stone Pedestal & Arcane Rune Ring
      ctx.save();
      // Pedestal shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, 88, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal stone base
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 12, 78, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 5, 72, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Magic Circle on Pedestal
      ctx.strokeStyle = primaryGlow;
      ctx.lineWidth = 2;
      ctx.globalAlpha = isLocked ? 0.35 : 0.78;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -t * 24;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 5, 60, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 3. Legendary Skin Halo & Rising Sparkles
      if (!isLocked && skinTier === 'legendary') {
        ctx.save();
        ctx.strokeStyle = skinCfg.auraColor || '#fde047';
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.7 + Math.sin(t * 6) * 0.2;
        ctx.setLineDash([6, 4]);
        ctx.lineDashOffset = t * 32;
        ctx.beginPath();
        ctx.arc(cx, cy - 38, 46, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Floating Ember / Aura Particles
      for (const sp of sparks) {
        const py = ((sp.y - t * sp.vy) % 175) + 175;
        const curY = py % 175;
        const curX = sp.x + Math.sin(t * 2.5 + sp.phase) * 8;
        ctx.fillStyle =
          skinTier === 'legendary' && !isLocked
            ? skinCfg.auraColor || '#fde047'
            : '#f97316';
        ctx.globalAlpha = Math.min(1, curY / 40) * 0.75;
        ctx.fillRect(Math.round(curX), Math.round(curY), sp.size, sp.size);
      }
      ctx.globalAlpha = 1;

      // 5. Companion Pet Orbiting / Hopping near Hero's Feet
      const petAngle = t * 1.15;
      const petX = cx + Math.cos(petAngle) * 52;
      const petY = cy + 8 + Math.sin(petAngle) * 11;
      const petHop = Math.abs(Math.sin(t * 8.5)) * 7;
      const petFrames = bank.pets[petId] || bank.pets.cat;
      const petFrameIdx = Math.abs(Math.floor(t * 6)) % 2;
      const petSprite = petFrames[petFrameIdx] || petFrames[0];
      const petFacing = Math.sin(petAngle) >= 0 ? -1 : 1;

      // Pet shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(petX, petY + 4, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      if (petSprite) {
        ctx.save();
        ctx.translate(Math.round(petX), Math.round(petY - petHop));
        ctx.scale(petFacing * 2.2, 2.2);
        ctx.drawImage(
          petSprite,
          Math.round(-petSprite.width / 2),
          Math.round(-petSprite.height + 4)
        );
        ctx.restore();
      }

      // 6. Hero Sprite (Idle Breathing + Periodic Weapon Swing)
      const frameIdx = Math.abs(Math.floor(t * 3.2)) % 2;
      const breathScaleY = 1 + Math.sin(t * 6.4) * 0.035;
      const breathScaleX = 1 - Math.sin(t * 6.4) * 0.025;
      const heroBob = Math.abs(Math.sin(t * 3.2)) * 3;

      const heroSprite =
        (isLocked
          ? bank.heroesSilhouette[heroClass]?.[frameIdx]
          : bank.heroesSkins[heroClass]?.[skinTier]?.[frameIdx] ||
            bank.heroes[heroClass]?.[frameIdx]) || bank.heroes.knight[0];

      // Hero ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 4, 26, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      if (heroSprite) {
        const heroScale = 3.25;
        ctx.save();
        ctx.translate(Math.round(cx), Math.round(cy - heroBob));
        ctx.scale(heroScale * breathScaleX, heroScale * breathScaleY);
        ctx.drawImage(
          heroSprite,
          Math.round(-heroSprite.width / 2),
          Math.round(-heroSprite.height + 5)
        );
        ctx.restore();
      }

      // 7. Equipped Weapon & Periodic / Click Slash Animation
      if (!isLocked) {
        const wSprite = bank.weapons[weaponId];
        // Auto-swing every 3.2 seconds or when user clicks the stage
        const autoSwingCycle = t % 3.2;
        const manualElapsed = (now - swingTriggerRef.current) / 1000;
        const isSwinging = autoSwingCycle < 0.32 || manualElapsed < 0.32;
        const swingProg =
          manualElapsed < 0.32
            ? manualElapsed / 0.32
            : autoSwingCycle < 0.32
            ? autoSwingCycle / 0.32
            : 0;

        const swingAngle = isSwinging
          ? -0.9 + Math.sin(swingProg * Math.PI) * 1.9
          : Math.sin(t * 3.2) * 0.12 - 0.15;

        if (wSprite) {
          ctx.save();
          ctx.translate(Math.round(cx + 22), Math.round(cy - 34 - heroBob));
          ctx.rotate(swingAngle);
          ctx.scale(2.5, 2.5);
          ctx.drawImage(
            wSprite,
            Math.round(-wSprite.width * 0.28),
            Math.round(-wSprite.height / 2)
          );
          ctx.restore();
        }

        // Draw bright slash arc when swinging!
        if (isSwinging) {
          ctx.save();
          ctx.strokeStyle = primaryGlow;
          ctx.lineWidth = 6 * (1 - swingProg * 0.5);
          ctx.lineCap = 'round';
          ctx.globalAlpha = 0.85 * (1 - swingProg * 0.4);
          ctx.beginPath();
          ctx.arc(cx + 12, cy - 34, 48, -1.1, 0.95);
          ctx.stroke();

          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx + 12, cy - 34, 44, -0.9, 0.75);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        // Locked Mysterious Padlock Text Overlay
        ctx.save();
        ctx.font = "700 10px 'Press Start 2P', monospace";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fde047';
        ctx.fillText('🔒 CHƯA MỞ KHÓA', cx, cy - 88);
        ctx.restore();
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(rafId);
  }, [heroClass, skinTier, isLocked, petId, weaponId]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={200}
      onClick={() => {
        swingTriggerRef.current = performance.now();
        sound.playSlash(true);
        onCyclePet();
      }}
      title="Chạm vào Sân Khấu để thử Vũ Khí & tương tác Thú Cưng!"
      className="w-[270px] h-[168px] sm:w-[320px] sm:h-[200px] cursor-pointer select-none"
    />
  );
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<IsometricGameEngine | null>(null);
  const dpadRef = useRef<HTMLDivElement | null>(null);
  const dpadPointerId = useRef<number | null>(null);

  const [profile, setProfile] = useState<PlayerProfile>(() => loadProfile());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [selectedClass, setSelectedClass] = useState<HeroClassId>('knight');
  const [previewSkinTier, setPreviewSkinTier] = useState<SkinTier>('default');
  const [selectedPet, setSelectedPet] = useState<PetId>('cat');
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyId>('normal');

  const [activeModal, setActiveModal] = useState<
    'NONE' | 'SHOP' | 'GACHA' | 'QUESTS' | 'AVATAR' | 'SETTINGS' | 'MOBILE_INSTALL'
  >('NONE');
  const [shopTab, setShopTab] = useState<'ARMORY' | 'UPGRADES'>('ARMORY');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Gacha Chest State
  const [gachaState, setGachaState] = useState<'IDLE' | 'SHAKING' | 'REVEALED'>(
    'IDLE'
  );
  const [gachaReward, setGachaReward] = useState<{
    type: 'skin' | 'weapon' | 'gems';
    title: string;
    subtitle: string;
    accent: string;
  } | null>(null);

  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [boonChoices, setBoonChoices] = useState<BoonOption[]>([]);
  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Sync profile & settings changes to localStorage + GameEngine
  const updateAndSaveProfile = (
    updater: (prev: PlayerProfile) => PlayerProfile
  ) => {
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
          const updatedQuests = prev.dailyQuests.map((q) => {
            if (q.id === 'q_slay_25' && killsDelta > 0) {
              return {
                ...q,
                progress: Math.min(q.target, q.progress + killsDelta),
              };
            }
            if (q.id === 'q_clear_floors' && gemsDelta >= 10) {
              return {
                ...q,
                progress: Math.min(q.target, q.progress + 1),
              };
            }
            return q;
          });

          const next: PlayerProfile = {
            ...prev,
            soulGems: prev.soulGems + gemsDelta,
            totalKills: prev.totalKills + killsDelta,
            runsCompleted: prev.runsCompleted + (runWon ? 1 : 0),
            preRunWeapon: consumedPreRun ? null : prev.preRunWeapon,
            preRunPotion: consumedPreRun ? false : prev.preRunPotion,
            dailyQuests: updatedQuests,
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

  // Select Hero Class in Lobby
  const handleSelectClass = (cls: HeroClassId) => {
    sound.playUiClick(true);
    setSelectedClass(cls);
    const savedSkin = profile.selectedSkins?.[cls] || 'default';
    setPreviewSkinTier(savedSkin);
    if (profile.unlockedHeroes.includes(cls)) {
      engineRef.current?.selectHeroClass(cls);
      engineRef.current?.selectSkin(savedSkin);
    }
  };

  // Unlock Locked Hero Class with Soul Gems
  const handleUnlockHero = (cls: HeroClassId) => {
    const cfg = HERO_CLASSES[cls];
    if (profile.unlockedHeroes.includes(cls)) return;
    if (profile.soulGems < cfg.unlockCost) {
      sound.playUiClick(false);
      return;
    }
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cfg.unlockCost,
      unlockedHeroes: [...prev.unlockedHeroes, cls],
    }));
    engineRef.current?.selectHeroClass(cls);
  };

  // Cycle Skin [ < ] and [ > ] beneath Hero Pedestal
  const handleCycleSkin = (dir: -1 | 1) => {
    sound.playUiClick(true);
    const idx = SKIN_TIERS.indexOf(previewSkinTier);
    const nextTier =
      SKIN_TIERS[(idx + dir + SKIN_TIERS.length) % SKIN_TIERS.length];
    setPreviewSkinTier(nextTier);

    const ownedSkins = profile.unlockedSkins?.[selectedClass] || ['default'];
    if (ownedSkins.includes(nextTier)) {
      updateAndSaveProfile((prev) => ({
        ...prev,
        selectedSkins: {
          ...prev.selectedSkins,
          [selectedClass]: nextTier,
        },
      }));
      engineRef.current?.selectSkin(nextTier);
    }
  };

  // Unlock Skin Tier with Soul Gems
  const handleUnlockSkin = (cls: HeroClassId, tier: SkinTier) => {
    const skinCfg = HERO_CLASSES[cls].skins[tier];
    const owned = profile.unlockedSkins?.[cls] || ['default'];
    if (owned.includes(tier)) return;
    if (profile.soulGems < skinCfg.cost) {
      sound.playUiClick(false);
      return;
    }
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - skinCfg.cost,
      unlockedSkins: {
        ...prev.unlockedSkins,
        [cls]: [...(prev.unlockedSkins?.[cls] || ['default']), tier],
      },
      selectedSkins: {
        ...prev.selectedSkins,
        [cls]: tier,
      },
    }));
    engineRef.current?.selectSkin(tier);
  };

  const handleSelectPet = (petId: PetId) => {
    sound.playUiClick(true);
    setSelectedPet(petId);
    engineRef.current?.selectPet(petId);
  };

  const handleSelectDifficulty = (diff: DifficultyId) => {
    sound.playUiClick(true);
    setSelectedDifficulty(diff);
    engineRef.current?.selectDifficulty(diff);
  };

  const handleEnterLivingRoom = () => {
    sound.playUiClick(true);
    const playClass = profile.unlockedHeroes.includes(selectedClass)
      ? selectedClass
      : 'knight';
    setActiveModal('NONE');
    engineRef.current?.enterLivingRoom(playClass, selectedDifficulty);
  };

  const handleStartDungeonDirect = () => {
    sound.playUiClick(true);
    const playClass = profile.unlockedHeroes.includes(selectedClass)
      ? selectedClass
      : 'knight';
    setActiveModal('NONE');
    engineRef.current?.startNewRun(playClass, selectedDifficulty);
  };

  const handleToggleMute = () => {
    updateAndSaveSettings((prev) => ({
      ...prev,
      muted: !prev.muted,
    }));
  };

  // Permanent Stat Upgrade
  const handleBuyUpgrade = (
    key: keyof PermanentUpgrades,
    baseCost: number
  ) => {
    const currentLv = profile.upgrades[key];
    if (currentLv >= 5) return;
    const cost = baseCost + currentLv * 60;
    if (profile.soulGems < cost) {
      sound.playUiClick(false);
      return;
    }

    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cost,
      upgrades: {
        ...prev.upgrades,
        [key]: prev.upgrades[key] + 1,
      },
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === 'q_upgrade_stat'
          ? { ...q, progress: Math.min(q.target, q.progress + 1) }
          : q
      ),
    }));
  };

  // Blacksmith Armory: Craft/Unlock Weapon or Equip as Starter Weapon
  const handleUnlockOrEquipWeapon = (wpnId: WeaponId) => {
    const wpn = WEAPONS[wpnId];
    const isUnlocked = profile.unlockedWeapons.includes(wpnId);

    if (isUnlocked) {
      sound.playWeaponSwitch();
      updateAndSaveProfile((prev) => ({
        ...prev,
        selectedStarterWeapon:
          prev.selectedStarterWeapon === wpnId ? null : wpnId,
        preRunWeapon: prev.selectedStarterWeapon === wpnId ? null : wpnId,
      }));
      return;
    }

    if (profile.soulGems < wpn.shopGemsCost) {
      sound.playUiClick(false);
      return;
    }

    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - wpn.shopGemsCost,
      unlockedWeapons: [...prev.unlockedWeapons, wpnId],
      selectedStarterWeapon: wpnId,
      preRunWeapon: wpnId,
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === 'q_open_chest'
          ? { ...q, progress: Math.min(q.target, q.progress + 1) }
          : q
      ),
    }));
  };

  const handleBuyPreRunPotion = () => {
    const cost = 50;
    if (profile.preRunPotion || profile.soulGems < cost) return;
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - cost,
      preRunPotion: true,
    }));
  };

  // Mystery Chest Gacha Roll (120 Gems)
  const handleRollGachaChest = () => {
    const CHEST_COST = 120;
    if (gachaState === 'SHAKING' || profile.soulGems < CHEST_COST) {
      sound.playUiClick(false);
      return;
    }

    sound.playChestRoll();
    setGachaState('SHAKING');
    setGachaReward(null);

    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems - CHEST_COST,
      chestsOpened: (prev.chestsOpened || 0) + 1,
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === 'q_open_chest'
          ? { ...q, progress: Math.min(q.target, q.progress + 1) }
          : q
      ),
    }));

    setTimeout(() => {
      sound.playChing();
      // Gather unowned skins & weapons
      const unownedSkins: { cls: HeroClassId; tier: SkinTier }[] = [];
      (Object.keys(HERO_CLASSES) as HeroClassId[]).forEach((cls) => {
        (['rare', 'legendary'] as SkinTier[]).forEach((t) => {
          if (!profile.unlockedSkins?.[cls]?.includes(t)) {
            unownedSkins.push({ cls, tier: t });
          }
        });
      });

      const unownedWeapons = (Object.keys(WEAPONS) as WeaponId[]).filter(
        (wId) => !profile.unlockedWeapons.includes(wId)
      );

      const roll = Math.random();
      if (roll < 0.45 && unownedSkins.length > 0) {
        const pick =
          unownedSkins[Math.floor(Math.random() * unownedSkins.length)];
        const skinMeta = HERO_CLASSES[pick.cls].skins[pick.tier];
        updateAndSaveProfile((prev) => ({
          ...prev,
          unlockedSkins: {
            ...prev.unlockedSkins,
            [pick.cls]: [
              ...(prev.unlockedSkins?.[pick.cls] || ['default']),
              pick.tier,
            ],
          },
          selectedSkins: {
            ...prev.selectedSkins,
            [pick.cls]: pick.tier,
          },
        }));
        if (pick.cls === selectedClass) {
          setPreviewSkinTier(pick.tier);
        }
        setGachaReward({
          type: 'skin',
          title: `SKIN MỚI: ${skinMeta.name.toUpperCase()}`,
          subtitle: `${HERO_CLASSES[pick.cls].name} (${skinMeta.badge})`,
          accent:
            pick.tier === 'legendary' ? '#fde047' : '#38bdf8',
        });
      } else if (roll < 0.8 && unownedWeapons.length > 0) {
        const pickWpn =
          unownedWeapons[Math.floor(Math.random() * unownedWeapons.length)];
        const wMeta = WEAPONS[pickWpn];
        updateAndSaveProfile((prev) => ({
          ...prev,
          unlockedWeapons: [...prev.unlockedWeapons, pickWpn],
          selectedStarterWeapon: pickWpn,
          preRunWeapon: pickWpn,
        }));
        setGachaReward({
          type: 'weapon',
          title: `VŨ KHÍ MỚI: ${wMeta.name.toUpperCase()}`,
          subtitle: `Đã mở khóa vĩnh viễn trong Kho Vũ Khí (${wMeta.rarity})`,
          accent: wMeta.rarityColor,
        });
      } else {
        const jackpotGems = 160 + Math.floor(Math.random() * 90);
        updateAndSaveProfile((prev) => ({
          ...prev,
          soulGems: prev.soulGems + jackpotGems,
        }));
        setGachaReward({
          type: 'gems',
          title: `KHO BÁU KIM CƯƠNG: +${jackpotGems} 💎`,
          subtitle: 'Nổ hũ Đá Linh Hồn từ Rương Bí Ẩn!',
          accent: '#38bdf8',
        });
      }

      setGachaState('REVEALED');
    }, 880);
  };

  // Claim Daily Quest Reward
  const handleClaimQuest = (questId: string) => {
    const q = profile.dailyQuests.find((item) => item.id === questId);
    if (!q || q.claimed || q.progress < q.target) return;
    sound.playChing();
    updateAndSaveProfile((prev) => ({
      ...prev,
      soulGems: prev.soulGems + q.rewardGems,
      dailyQuests: prev.dailyQuests.map((item) =>
        item.id === questId ? { ...item, claimed: true } : item
      ),
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
  const isHeroLocked = !profile.unlockedHeroes.includes(selectedClass);
  const currentSkinCfg = classCfg.skins[previewSkinTier];
  const isSkinOwned = (
    profile.unlockedSkins?.[selectedClass] || ['default']
  ).includes(previewSkinTier);

  const activeStarterWeaponId =
    profile.selectedStarterWeapon ||
    profile.preRunWeapon ||
    classCfg.starterWeaponId;

  const claimableQuestsCount = profile.dailyQuests.filter(
    (q) => !q.claimed && q.progress >= q.target
  ).length;

  const currentAvatarInfo =
    AVATAR_LIST.find((a) => a.id === profile.avatarId) || AVATAR_LIST[0];
  const isLargeControls = settings.controlScale === 'large';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#06080d] select-none">
      {/* Isolated 60fps 2.5D Pixel-Art Dungeon Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
      />

      {/* =====================================================================
          1. INTERACTIVE LOBBY MAIN MENU (Soul Knight / Enter the Gungeon Style)
         ===================================================================== */}
      {gameState === 'TITLE_MENU' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center px-2.5 sm:px-5 py-2 sm:py-3 bg-gradient-to-b from-[#06080d]/90 via-[#06080d]/55 to-[#06080d]/95 overflow-y-auto">
          {/* Ambient Floating Ember Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[12, 24, 38, 52, 67, 81, 91].map((leftPct, idx) => (
              <div
                key={idx}
                className="animate-ember absolute bottom-6 w-1.5 h-1.5 rounded-xs bg-amber-400/70 shadow-[0_0_8px_#f59e0b]"
                style={{
                  left: `${leftPct}%`,
                  animationDelay: `${idx * 0.55}s`,
                  animationDuration: `${3.6 + (idx % 3) * 0.8}s`,
                }}
              />
            ))}
          </div>

          {/* ================= TOP BAR: PROFILE + DIFFICULTY + GEMS + QUESTS + SETTINGS ================= */}
          <div className="relative z-10 w-full max-w-6xl flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            {/* Left: Player Avatar Button + Difficulty Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('AVATAR');
                }}
                className="btn-3d btn-3d-slate flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer"
              >
                <PixelAvatarGraphic
                  avatarId={profile.avatarId}
                  className="w-8 h-8 rounded-lg border border-slate-600 shrink-0"
                />
                <div className="text-left">
                  <div className="text-[11px] font-pixel text-amber-300 leading-tight flex items-center gap-1.5">
                    <span>{profile.playerName}</span>
                  </div>
                  <div className="text-[10px] font-mono-tabular text-slate-300">
                    {currentAvatarInfo.title} · ☠ {profile.totalKills}
                  </div>
                </div>
              </button>

              {/* Difficulty 3D Switcher Pills */}
              <div className="flex items-center gap-1 bg-[#090b10]/90 p-1 rounded-xl border-2 border-slate-800">
                {(Object.keys(DIFFICULTIES) as DifficultyId[]).map((diffId) => {
                  const dCfg = DIFFICULTIES[diffId];
                  const active = selectedDifficulty === diffId;
                  return (
                    <button
                      key={diffId}
                      onClick={() => handleSelectDifficulty(diffId)}
                      className={`px-2.5 py-1 rounded-lg font-pixel text-[9px] sm:text-[10px] transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-800 text-amber-300 border border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                      style={{
                        color: active ? dCfg.accent : undefined,
                      }}
                    >
                      {dCfg.name.split(' ')[0]} ({dCfg.gemMult}x💎)
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Soul Gems + Daily Quests Scroll + Settings + Mute */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090b10]/95 border-2 border-sky-500/60 text-sky-300 font-pixel text-xs shadow-[0_4px_0_#0c4a6e]">
                <SoulGemIcon className="w-4 h-4 shrink-0" />
                <span>{profile.soulGems}</span>
              </div>

              {/* Mobile App / GitHub Deploy 3D Button */}
              {!isInstalled && (
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('MOBILE_INSTALL');
                  }}
                  className="btn-3d btn-3d-emerald px-3 py-1.5 rounded-xl font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer"
                >
                  <PhoneDownloadIcon className="w-4 h-4" />
                  <span className="hidden md:inline">TẢI VỀ ĐT / GITHUB</span>
                </button>
              )}

              {/* Daily Quests Scroll Button */}
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('QUESTS');
                }}
                className="btn-3d btn-3d-amber relative px-3 py-1.5 rounded-xl font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer"
              >
                <QuestScrollIcon className="w-4 h-4" />
                <span className="hidden sm:inline">NHIỆM VỤ</span>
                {claimableQuestsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 border-2 border-white text-white font-pixel text-[9px] flex items-center justify-center animate-bounce">
                    {claimableQuestsCount}
                  </span>
                )}
              </button>

              {/* Settings 3D Button */}
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('SETTINGS');
                }}
                className="btn-3d btn-3d-slate p-2 rounded-xl flex items-center justify-center cursor-pointer"
                aria-label="Cài Đặt"
              >
                <SettingsPixelIcon className="w-4 h-4" />
              </button>

              {/* Audio Mute 3D Button */}
              <button
                onClick={handleToggleMute}
                className="btn-3d btn-3d-slate p-2 rounded-xl flex items-center justify-center cursor-pointer"
                aria-label="Âm Thanh"
              >
                <SoundIcon muted={settings.muted} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ================= CENTERPIECE INTERACTIVE LOBBY STAGE ================= */}
          <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-center my-auto py-1 pointer-events-auto">
            {/* LEFT DOCK (3 Cols): Gacha Mystery Chest + Blacksmith Armory + Sanctuary Upgrades */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 order-2 lg:order-1">
              {/* 1. Mystery Chest Gacha Button */}
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setGachaState('IDLE');
                  setGachaReward(null);
                  setActiveModal('GACHA');
                }}
                className="btn-3d btn-3d-purple flex-1 p-2.5 sm:p-3 rounded-2xl text-left flex items-center gap-3 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-950/90 border-2 border-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                  <ChestGachaIcon className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-[10px] sm:text-xs text-amber-200 truncate">
                    RƯƠNG BÍ ẨN
                  </div>
                  <div className="text-[10px] font-mono-tabular text-purple-100 mt-0.5">
                    Quay Skin & Vũ Khí ·{' '}
                    <span className="text-amber-300 font-bold">120 💎</span>
                  </div>
                </div>
              </button>

              {/* 2. Blacksmith Starter Weapon Armory Button */}
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setShopTab('ARMORY');
                  setActiveModal('SHOP');
                }}
                className="btn-3d btn-3d-cyan flex-1 p-2.5 sm:p-3 rounded-2xl text-left flex items-center gap-3 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-sky-950/90 border-2 border-cyan-200 flex items-center justify-center shrink-0">
                  <AnvilArmoryIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-[10px] sm:text-xs text-slate-950 truncate">
                    KHO VŨ KHÍ RÈN
                  </div>
                  <div className="text-[10px] font-mono-tabular text-slate-900 font-bold truncate mt-0.5">
                    ⚔ {WEAPONS[activeStarterWeaponId].name}
                  </div>
                </div>
              </button>

              {/* 3. Permanent Stat Sanctuary Upgrades Button */}
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setShopTab('UPGRADES');
                  setActiveModal('SHOP');
                }}
                className="btn-3d btn-3d-amber flex-1 p-2.5 sm:p-3 rounded-2xl text-left flex items-center gap-3 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-950/85 border-2 border-amber-200 flex items-center justify-center shrink-0">
                  <ShopPixelIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="font-pixel text-[10px] sm:text-xs text-slate-950 truncate">
                    THÁNH ĐIỆN
                  </div>
                  <div className="text-[10px] font-mono-tabular text-slate-900 font-bold truncate mt-0.5">
                    Nâng Cấp Chỉ Số Vĩnh Viễn
                  </div>
                </div>
              </button>
            </div>

            {/* CENTER STAGE (6 Cols): Title + Interactive Hero Pedestal + Skin Switcher [ < ] [ > ] */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
              <div className="w-full max-w-[260px] sm:max-w-[300px] -mb-2">
                <ObsidianTitleLockup />
              </div>

              {/* Hero Name + Title + Skin Rarity Pill */}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="font-pixel text-xs sm:text-sm tracking-wider"
                  style={{
                    color: isHeroLocked ? '#94a3b8' : classCfg.accentColor,
                  }}
                >
                  {classCfg.name.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-pixel text-[9px] border ${
                    previewSkinTier === 'legendary'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : previewSkinTier === 'rare'
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-slate-800 border-slate-600 text-slate-300'
                  }`}
                >
                  {currentSkinCfg.badge}
                </span>
              </div>

              {/* INTERACTIVE HERO & PET PEDESTAL CANVAS */}
              <div className="relative flex items-center justify-center my-0.5">
                <LobbyStageCanvas
                  heroClass={selectedClass}
                  skinTier={previewSkinTier}
                  isLocked={isHeroLocked}
                  petId={selectedPet}
                  weaponId={activeStarterWeaponId}
                  onCyclePet={() => {
                    const order: PetId[] = ['cat', 'mini_slime', 'baby_dragon'];
                    const nextPet =
                      order[(order.indexOf(selectedPet) + 1) % order.length];
                    handleSelectPet(nextPet);
                  }}
                />
              </div>

              {/* SKIN SELECTOR [ < ] SKIN NAME [ > ] & PET SWITCHER */}
              <div className="w-full max-w-md flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2 bg-[#090b10]/95 px-2.5 py-1.5 rounded-xl border-2 border-slate-800 shadow-lg">
                  <button
                    onClick={() => handleCycleSkin(-1)}
                    className="btn-3d btn-3d-slate px-2.5 py-1 rounded-lg font-pixel text-xs cursor-pointer"
                    aria-label="Skin Trước"
                  >
                    ◀
                  </button>

                  <div className="min-w-[165px] sm:min-w-[195px] text-center px-2">
                    <div className="font-pixel text-[10px] text-amber-300 flex items-center justify-center gap-1">
                      {previewSkinTier === 'legendary' && (
                        <SparkleCrownIcon className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="truncate">{currentSkinCfg.name}</span>
                    </div>
                    <div className="text-[10px] font-mono-tabular text-slate-400">
                      {isSkinOwned
                        ? 'Đã sở hữu trang phục'
                        : `Mở khóa: ${currentSkinCfg.cost} 💎`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCycleSkin(1)}
                    className="btn-3d btn-3d-slate px-2.5 py-1 rounded-lg font-pixel text-xs cursor-pointer"
                    aria-label="Skin Kế Tiếp"
                  >
                    ▶
                  </button>
                </div>

                {/* Unlock Hero / Unlock Skin / Companion Pet Row */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {isHeroLocked && (
                    <button
                      onClick={() => handleUnlockHero(selectedClass)}
                      className="btn-3d btn-3d-amber px-3.5 py-1.5 rounded-xl font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer"
                    >
                      <LockPixelIcon className="w-3.5 h-3.5" />
                      <span>MỞ KHÓA TƯỚNG ({classCfg.unlockCost} 💎)</span>
                    </button>
                  )}

                  {!isHeroLocked && !isSkinOwned && (
                    <button
                      onClick={() =>
                        handleUnlockSkin(selectedClass, previewSkinTier)
                      }
                      className="btn-3d btn-3d-purple px-3.5 py-1.5 rounded-xl font-pixel text-[10px] flex items-center gap-1.5 cursor-pointer"
                    >
                      <SparkleCrownIcon className="w-3.5 h-3.5" />
                      <span>MUA SKIN ({currentSkinCfg.cost} 💎)</span>
                    </button>
                  )}

                  {/* Pet Selector Pill */}
                  <div className="flex items-center gap-1 bg-[#090b10]/90 px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] font-mono-tabular">
                    <span className="text-slate-400">🐾 Pet:</span>
                    {(Object.keys(PETS) as PetId[]).map((pid) => (
                      <button
                        key={pid}
                        onClick={() => handleSelectPet(pid)}
                        className={`px-1.5 py-0.5 rounded font-bold cursor-pointer ${
                          selectedPet === pid
                            ? 'bg-sky-500/25 text-sky-300 border border-sky-400/60'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {PETS[pid].name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT DOCK (3 Cols): Hero Stats & Skill Inspect + Big 3D Start Buttons */}
            <div className="lg:col-span-3 flex flex-col gap-2 order-3">
              {/* Hero Stats & Skill Card */}
              <div className="bg-[#090b10]/95 border-2 border-slate-800 rounded-2xl p-3 text-left shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                  <span className="font-pixel text-[10px] text-amber-400">
                    CHỈ SỐ HIỆP SĨ
                  </span>
                  <span className="text-[10px] font-mono-tabular text-slate-400">
                    CRIT {Math.round(classCfg.critChance * 100)}%
                  </span>
                </div>

                {/* Stat Bars */}
                <div className="grid grid-cols-3 gap-1.5 mb-2.5 text-center font-mono-tabular">
                  <div className="p-1.5 rounded-lg bg-[#111726] border border-rose-500/30">
                    <div className="text-[9px] text-rose-300">HP</div>
                    <div className="text-xs font-bold text-rose-400">
                      {classCfg.maxHp + profile.upgrades.hpLevel * 15}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#111726] border border-slate-600/40">
                    <div className="text-[9px] text-slate-300">SHIELD</div>
                    <div className="text-xs font-bold text-slate-200">
                      {classCfg.maxArmor + profile.upgrades.armorLevel * 8}
                    </div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-[#111726] border border-sky-500/30">
                    <div className="text-[9px] text-sky-300">MANA</div>
                    <div className="text-xs font-bold text-sky-400">
                      {classCfg.maxMana + profile.upgrades.manaLevel * 25}
                    </div>
                  </div>
                </div>

                {/* Active Skill Box */}
                <div className="p-2 rounded-xl bg-[#111726] border border-amber-500/30">
                  <div className="flex items-center gap-1.5 text-[11px] font-pixel text-amber-300 mb-0.5">
                    <SkillStarIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{classCfg.skillName}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug">
                    {classCfg.skillDesc}
                  </p>
                </div>
              </div>

              {/* Primary 3D Action Launch Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleStartDungeonDirect}
                  className="btn-3d btn-3d-emerald min-h-[46px] w-full py-2.5 px-4 rounded-2xl font-pixel text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <SwordPixelIcon className="w-5 h-5" />
                  <span>XUẤT TRẬN (1-1)</span>
                </button>

                <button
                  onClick={handleEnterLivingRoom}
                  className="btn-3d btn-3d-amber min-h-[42px] w-full py-2 px-4 rounded-2xl font-pixel text-[10px] tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>VÀO PHÒNG CHỜ LOBBY</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM ROSTER DOCK: 6 HERO CLASSES (WITH SILHOUETTES FOR LOCKED) ================= */}
          <div className="relative z-10 w-full max-w-6xl pointer-events-auto">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-[#090b10]/95 p-2 rounded-2xl border-2 border-slate-800 shadow-2xl">
              {(Object.keys(HERO_CLASSES) as HeroClassId[]).map((clsId) => {
                const cfg = HERO_CLASSES[clsId];
                const isSelected = selectedClass === clsId;
                const locked = !profile.unlockedHeroes.includes(clsId);
                const equippedSkin = profile.selectedSkins?.[clsId] || 'default';

                return (
                  <button
                    key={clsId}
                    onClick={() => handleSelectClass(clsId)}
                    className={`relative p-1.5 sm:p-2 rounded-xl border-2 flex items-center gap-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#161f33] border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.3)] -translate-y-0.5'
                        : 'bg-[#0d121d] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <HeroMiniPortrait
                        heroId={clsId}
                        skinTier={
                          isSelected ? previewSkinTier : equippedSkin
                        }
                        locked={locked}
                      />
                      {locked && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-950 border border-amber-400 flex items-center justify-center">
                          <LockPixelIcon className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className="font-pixel text-[9px] sm:text-[10px] truncate"
                        style={{
                          color: locked
                            ? '#94a3b8'
                            : isSelected
                            ? cfg.accentColor
                            : '#f8fafc',
                        }}
                      >
                        {cfg.name.split(' ').slice(-1)[0]}
                      </div>
                      {locked ? (
                        <div className="text-[9px] font-mono-tabular text-amber-300 font-bold">
                          🔒 {cfg.unlockCost} 💎
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono-tabular text-emerald-400 truncate">
                          ★ Đã Mở
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 1: MYSTERY CHEST GACHA (Mở Rương Bí Ẩn - Skins, Vũ Khí, Kim Cương)
         ===================================================================== */}
      {activeModal === 'GACHA' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-md bg-[#090b10] border-2 border-purple-500 rounded-2xl p-6 text-center shadow-[0_0_50px_rgba(168,85,247,0.35)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ChestGachaIcon className="w-6 h-6" />
                <h2 className="font-pixel text-xs sm:text-sm text-amber-300">
                  RƯƠNG BÍ ẨN GACHA
                </h2>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-xs font-mono-tabular text-slate-400">
                Kim cương hiện có:
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-sky-500/40 text-sky-300 font-pixel text-xs">
                <SoulGemIcon className="w-4 h-4" />
                {profile.soulGems}
              </span>
            </div>

            {/* Animated Chest Pedestal Stage */}
            <div className="relative h-44 rounded-2xl bg-gradient-to-b from-purple-950/50 to-[#0d121d] border-2 border-purple-500/40 flex flex-col items-center justify-center p-4 mb-4 overflow-hidden">
              <div
                className={`transition-transform ${
                  gachaState === 'SHAKING'
                    ? 'animate-chest-shake'
                    : 'scale-110'
                }`}
              >
                <ChestGachaIcon className="w-20 h-20 drop-shadow-[0_0_24px_rgba(250,204,21,0.65)]" />
              </div>

              {gachaState === 'IDLE' && (
                <p className="text-xs font-mono-tabular text-purple-200 mt-3">
                  Mở Rương để nhận ngẫu nhiên: Trang phục Hiếm/Huyền Thoại, Vũ
                  Khí Khởi Điểm mới hoặc Nổ Hũ Kim Cương!
                </p>
              )}

              {gachaState === 'SHAKING' && (
                <p className="font-pixel text-xs text-amber-300 mt-3 animate-pulse">
                  ĐANG RUNG LẮC RƯƠNG BÍ ẨN...
                </p>
              )}

              {gachaState === 'REVEALED' && gachaReward && (
                <div className="animate-modal-pop mt-2 text-center">
                  <div
                    className="font-pixel text-xs sm:text-sm mb-1"
                    style={{ color: gachaReward.accent }}
                  >
                    ★ {gachaReward.title} ★
                  </div>
                  <div className="text-xs font-mono-tabular text-slate-200">
                    {gachaReward.subtitle}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleRollGachaChest}
              disabled={gachaState === 'SHAKING' || profile.soulGems < 120}
              className="btn-3d btn-3d-amber w-full min-h-[48px] py-3 px-5 rounded-xl font-pixel text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ChestGachaIcon className="w-5 h-5" />
              <span>
                {gachaState === 'SHAKING'
                  ? 'ĐANG MỞ RƯƠNG...'
                  : 'MỞ RƯƠNG NGAY (120 💎)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: BLACKSMITH ARMORY & SANCTUARY UPGRADES (Thợ Rèn & Thánh Điện)
         ===================================================================== */}
      {activeModal === 'SHOP' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-3 sm:p-5">
          <div className="animate-modal-pop w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#090b10] border-2 border-amber-400 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="font-pixel text-xs sm:text-base text-amber-400">
                  THỢ RÈN VŨ KHÍ & THÁNH ĐIỆN NÂNG CẤP
                </h2>
                <p className="text-xs font-mono-tabular text-slate-400 mt-1">
                  Rèn vũ khí khởi điểm vĩnh viễn hoặc cường hóa chỉ số cho toàn
                  bộ 6 Hiệp Sĩ
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-sky-500/40 text-sky-300 font-pixel text-xs">
                  <SoulGemIcon className="w-4 h-4" />
                  <span>{profile.soulGems}</span>
                </div>
                <button
                  onClick={() => {
                    sound.playUiClick(false);
                    setActiveModal('NONE');
                  }}
                  className="btn-3d btn-3d-slate px-3 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer"
                >
                  ĐÓNG ✕
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 my-3">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setShopTab('ARMORY');
                }}
                className={`btn-3d px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer ${
                  shopTab === 'ARMORY' ? 'btn-3d-cyan' : 'btn-3d-slate'
                }`}
              >
                ⚒ 1. THỢ RÈN & VŨ KHÍ KHỞI ĐIỂM
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setShopTab('UPGRADES');
                }}
                className={`btn-3d px-4 py-2 rounded-xl font-pixel text-[10px] cursor-pointer ${
                  shopTab === 'UPGRADES' ? 'btn-3d-amber' : 'btn-3d-slate'
                }`}
              >
                ★ 2. THÁNH ĐIỆN CHỈ SỐ VĨNH VIỄN
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto pr-1">
              {shopTab === 'ARMORY' ? (
                <div className="space-y-3">
                  {/* Extra Vial Supply */}
                  <div className="p-3 rounded-xl bg-[#111726] border border-rose-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <PotionPixelIcon className="w-7 h-7 shrink-0" />
                      <div>
                        <div className="font-pixel text-xs text-rose-300">
                          BÌNH MÁU TIẾP TẾ (+1 HEALING VIAL)
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Mang thêm 1 bình máu & năng lượng dự trữ vào trận kế
                          tiếp.
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleBuyPreRunPotion}
                      disabled={profile.preRunPotion || profile.soulGems < 50}
                      className={`btn-3d min-h-[38px] px-4 py-2 rounded-xl font-pixel text-[10px] shrink-0 cursor-pointer ${
                        profile.preRunPotion
                          ? 'btn-3d-emerald'
                          : 'btn-3d-rose'
                      }`}
                    >
                      {profile.preRunPotion ? 'ĐÃ TRANG BỊ' : 'MUA (50 💎)'}
                    </button>
                  </div>

                  {/* All 9 Weapons Blueprint Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {(Object.keys(WEAPONS) as WeaponId[]).map((wId) => {
                      const w = WEAPONS[wId];
                      const unlocked = profile.unlockedWeapons.includes(wId);
                      const isEquippedStarter =
                        profile.selectedStarterWeapon === wId;

                      return (
                        <div
                          key={wId}
                          className={`p-3 rounded-xl bg-[#111726] border-2 flex flex-col justify-between ${
                            isEquippedStarter
                              ? 'border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
                              : 'border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <WeaponMiniSprite weaponId={wId} />
                              <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                                {w.rarity}
                              </span>
                            </div>
                            <div
                              className="font-pixel text-xs truncate"
                              style={{ color: w.rarityColor }}
                            >
                              {w.name}
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
                            onClick={() => handleUnlockOrEquipWeapon(wId)}
                            disabled={
                              !unlocked && profile.soulGems < w.shopGemsCost
                            }
                            className={`btn-3d mt-3 min-h-[38px] w-full py-1.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer ${
                              isEquippedStarter
                                ? 'btn-3d-emerald'
                                : unlocked
                                ? 'btn-3d-cyan'
                                : 'btn-3d-amber'
                            }`}
                          >
                            {isEquippedStarter
                              ? '★ ĐANG MANG VÀO TRẬN'
                              : unlocked
                              ? 'CHỌN MANG VÀO TRẬN'
                              : `RÈN VŨ KHÍ (${w.shopGemsCost} 💎)`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {UPGRADE_DEFINITIONS.map((u) => {
                    const lv = profile.upgrades[u.key];
                    const isMax = lv >= 5;
                    const cost = u.baseCost + lv * 60;
                    const canAfford = profile.soulGems >= cost && !isMax;

                    return (
                      <div
                        key={u.key}
                        className="p-3.5 rounded-xl bg-[#111726] border-2 border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-pixel text-xs"
                              style={{ color: u.accent }}
                            >
                              {u.name}
                            </span>
                            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-slate-900 text-amber-300">
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
                          className={`btn-3d min-h-[42px] px-3.5 py-2 rounded-xl font-pixel text-[10px] shrink-0 cursor-pointer ${
                            isMax ? 'btn-3d-emerald' : 'btn-3d-amber'
                          }`}
                        >
                          {isMax ? 'TỐI ĐA' : `NÂNG (${cost} 💎)`}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 3: DAILY QUESTS SCROLL (Nhiệm Vụ Hằng Ngày)
         ===================================================================== */}
      {activeModal === 'QUESTS' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-lg bg-[#090b10] border-2 border-amber-400 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <QuestScrollIcon className="w-6 h-6" />
                <h2 className="font-pixel text-xs sm:text-sm text-amber-300">
                  CUỘN NHIỆM VỤ HẰNG NGÀY
                </h2>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {profile.dailyQuests.map((q) => {
                const completed = q.progress >= q.target;
                const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
                return (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-xl bg-[#111726] border-2 border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-pixel text-[10px] sm:text-xs text-slate-100">
                        {q.title}
                      </div>
                      <div className="text-xs font-mono-tabular text-slate-400 mt-0.5">
                        {q.desc}
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-2">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono-tabular text-slate-400 mt-1">
                        Tiến độ: {q.progress}/{q.target}
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimQuest(q.id)}
                      disabled={!completed || q.claimed}
                      className={`btn-3d min-h-[40px] px-3.5 py-2 rounded-xl font-pixel text-[10px] shrink-0 cursor-pointer ${
                        q.claimed
                          ? 'btn-3d-slate'
                          : completed
                          ? 'btn-3d-emerald'
                          : 'btn-3d-amber'
                      }`}
                    >
                      {q.claimed
                        ? 'ĐÃ NHẬN'
                        : completed
                        ? `NHẬN +${q.rewardGems} 💎`
                        : `+${q.rewardGems} 💎`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 4: AVATAR & PLAYER PROFILE (Hồ Sơ Hiệp Sĩ)
         ===================================================================== */}
      {activeModal === 'AVATAR' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-lg bg-[#090b10] border-2 border-amber-500/70 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-pixel text-xs sm:text-sm text-amber-400">
                HỒ SƠ HIỆP SĨ & AVATAR
              </h2>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-mono-tabular text-slate-400 mb-1">
                Biệt Danh Hiệp Sĩ:
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
                        sound.playUiClick(true);
                        updateAndSaveProfile((prev) => ({
                          ...prev,
                          avatarId: av.id as AvatarId,
                        }));
                      }}
                      className={`p-2.5 rounded-xl border-2 flex items-center gap-2.5 text-left transition-all cursor-pointer ${
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
                        <div className="text-xs font-bold text-slate-100 truncate">
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
          MODAL 5: SETTINGS (Cài Đặt Game, Âm Thanh, Rung, Auto-Aim)
         ===================================================================== */}
      {activeModal === 'SETTINGS' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/90 flex items-center justify-center p-4">
          <div className="animate-modal-pop w-full max-w-md bg-[#090b10] border-2 border-slate-700 rounded-2xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="font-pixel text-xs sm:text-sm text-amber-400">
                CÀI ĐẶT HỆ THỐNG (SETTINGS)
              </h2>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono-tabular text-xs">
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
                  className={`btn-3d px-3.5 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer ${
                    !settings.muted ? 'btn-3d-emerald' : 'btn-3d-slate'
                  }`}
                >
                  {!settings.muted ? 'BẬT' : 'TẮT'}
                </button>
              </div>

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
                      onClick={() => {
                        sound.playUiClick(true);
                        updateAndSaveSettings((s) => ({
                          ...s,
                          shakeIntensity: lvl,
                        }));
                      }}
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
                  onClick={() => {
                    sound.playUiClick(true);
                    updateAndSaveSettings((s) => ({
                      ...s,
                      autoAim: !s.autoAim,
                    }));
                  }}
                  className={`btn-3d px-3.5 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer ${
                    settings.autoAim ? 'btn-3d-emerald' : 'btn-3d-slate'
                  }`}
                >
                  {settings.autoAim ? 'BẬT' : 'TẮT'}
                </button>
              </div>

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
                  onClick={() => {
                    sound.playUiClick(true);
                    updateAndSaveSettings((s) => ({
                      ...s,
                      showDamageNumbers: !s.showDamageNumbers,
                    }));
                  }}
                  className={`btn-3d px-3.5 py-1.5 rounded-lg font-pixel text-[10px] cursor-pointer ${
                    settings.showDamageNumbers
                      ? 'btn-3d-emerald'
                      : 'btn-3d-slate'
                  }`}
                >
                  {settings.showDamageNumbers ? 'HIỆN' : 'ẨN'}
                </button>
              </div>

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
                      onClick={() => {
                        sound.playUiClick(true);
                        updateAndSaveSettings((s) => ({
                          ...s,
                          controlScale: sz,
                        }));
                      }}
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

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    sound.playChing();
                    updateAndSaveProfile((p) => ({
                      ...p,
                      soulGems: p.soulGems + 300,
                    }));
                  }}
                  className="btn-3d btn-3d-cyan flex-1 py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer"
                >
                  + NHẬN 300 💎 QUÀ TÂN THỦ
                </button>
                <button
                  onClick={() => {
                    sound.playUiClick(false);
                    updateAndSaveProfile(() => ({ ...DEFAULT_PROFILE }));
                  }}
                  className="btn-3d btn-3d-rose py-2.5 px-3 rounded-xl font-pixel text-[10px] cursor-pointer"
                >
                  RESET LƯU TRỮ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 6: GITHUB PAGES & MOBILE PWA INSTALL (Tải Game Về Điện Thoại)
         ===================================================================== */}
      {activeModal === 'MOBILE_INSTALL' && (
        <div className="absolute inset-0 z-30 bg-[#06080d]/92 flex items-center justify-center p-3 sm:p-5">
          <div className="animate-modal-pop w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#090b10] border-2 border-emerald-400 rounded-2xl p-4 sm:p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <PhoneDownloadIcon className="w-6 h-6" />
                <h2 className="font-pixel text-xs sm:text-sm text-emerald-400">
                  CÀI GAME VỀ ĐIỆN THOẠI & TRIỂN KHAI GITHUB
                </h2>
              </div>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  setActiveModal('NONE');
                }}
                className="btn-3d btn-3d-slate px-3 py-1 rounded-lg font-pixel text-[10px] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-mono-tabular">
              {/* 1. Direct Mobile PWA Install */}
              <div className="p-3.5 rounded-xl bg-[#111726] border-2 border-emerald-500/50">
                <div className="font-pixel text-[11px] text-emerald-300 mb-1.5">
                  1. CÀI ĐẶT TRỰC TIẾP LÊN MÀN HÌNH CHÍNH (PWA OFFLINE)
                </div>
                <p className="text-slate-300 leading-relaxed mb-3">
                  Game đã tích hợp chuẩn <strong>Progressive Web App (PWA)</strong>. Khi mở trên điện thoại, bạn có thể cài đặt thành ứng dụng full-screen (chơi không cần mạng):
                </p>

                {isInstallable ? (
                  <button
                    onClick={async () => {
                      sound.playChing();
                      await install();
                    }}
                    className="btn-3d btn-3d-emerald w-full py-3 px-4 rounded-xl font-pixel text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PhoneDownloadIcon className="w-5 h-5" />
                    <span>BẤM ĐỂ CÀI ĐẶT GAME VỀ MÁY NGAY</span>
                  </button>
                ) : isIOS ? (
                  <div className="p-3 rounded-lg bg-slate-950 border border-sky-500/40 text-sky-200">
                    <strong>Hướng dẫn cho iPhone / iPad (Safari):</strong>
                    <br />
                    1. Bấm nút <strong>Chia sẻ (Share)</strong> ở thanh dưới cùng trình duyệt Safari.
                    <br />
                    2. Cuộn xuống chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={window.location.origin}
                      className="flex-1 w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sky-300 text-xs"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.origin);
                        sound.playChing();
                        setCopiedUrl(true);
                        setTimeout(() => setCopiedUrl(false), 2000);
                      }}
                      className="btn-3d btn-3d-cyan px-4 py-2 rounded-lg font-pixel text-[10px] shrink-0 cursor-pointer"
                    >
                      {copiedUrl ? 'ĐÃ COPY LINK!' : 'COPY LINK MỞ TRÊN ĐT'}
                    </button>
                  </div>
                )}
              </div>

              {/* 2. GitHub Export & Automatic GitHub Pages Workflow */}
              <div className="p-3.5 rounded-xl bg-[#111726] border border-amber-500/40">
                <div className="font-pixel text-[11px] text-amber-300 mb-1.5">
                  2. ĐẨY LÊN GITHUB & TỰ ĐỘNG CHẠY GITHUB PAGES
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Mình đã tạo sẵn file cấu hình <code>.github/workflows/deploy.yml</code> và cấu hình đường dẫn tương đối <code>base: './'</code> trong dự án. Bạn chỉ cần làm 3 bước:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-200 mt-2">
                  <li>
                    Nhìn lên <strong>thanh công cụ góc trên bên phải của AI Studio</strong>, bấm biểu tượng <strong>GitHub (Export to GitHub)</strong> để đẩy code lên tài khoản GitHub của bạn.
                  </li>
                  <li>
                    Mở kho lưu trữ (Repository) vừa tạo trên GitHub, vào mục <strong>Settings → Pages</strong>.
                  </li>
                  <li>
                    Tại mục <strong>Build and deployment (Source)</strong>, chọn <strong>GitHub Actions</strong>. GitHub sẽ tự động đóng gói và cấp cho bạn link game vĩnh viễn để tải về điện thoại!
                  </li>
                </ol>
              </div>

              {/* 3. Optional APK Packaging via Capacitor */}
              <div className="p-3.5 rounded-xl bg-[#111726] border border-slate-800">
                <div className="font-pixel text-[11px] text-sky-300 mb-1">
                  3. XUẤT FILE .APK CHO ANDROID (TÙY CHỌN)
                </div>
                <p className="text-slate-400 mb-1.5">
                  Sau khi tải repo từ GitHub về máy tính, bạn có thể đóng gói thành file <code>.apk</code> bằng lệnh:
                </p>
                <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto">
                  {`npm install && npm run build\nnpx @capacitor/cli init "SoulKnights" "com.obsidian.soulknights" --web-dir dist\nnpx cap add android && npx cap open android`}
                </pre>
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
                  <div className="text-xs font-pixel text-amber-400">
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
                    className="btn-3d btn-3d-amber min-h-[42px] px-3 rounded-xl font-pixel text-[10px] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    VÀO 1-1 →
                  </button>
                )}
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    setActiveModal('SETTINGS');
                  }}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#090b10]/92 border border-slate-800 text-slate-300 hover:border-amber-400 flex items-center justify-center cursor-pointer"
                  aria-label="Settings"
                >
                  <SettingsPixelIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playUiClick(true);
                    engineRef.current?.setGameState('PAUSED');
                  }}
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
          <div className="animate-modal-pop w-full max-w-xl bg-[#090b10] border-2 border-amber-500/70 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-xs font-pixel text-amber-400 tracking-widest mb-1">
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
                  className="text-left p-4 rounded-xl bg-[#111726] border-2 border-slate-800 hover:border-amber-400 active:scale-[0.98] transition-all flex flex-col justify-between cursor-pointer"
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
                  <div className="mt-4 pt-2 border-t border-slate-800 text-xs font-pixel text-amber-300">
                    CHỌN BUFF →
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
          <div className="animate-modal-pop w-full max-w-sm bg-[#090b10] border-2 border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="font-pixel text-lg text-amber-400 mb-1">
              TẠM DỪNG (PAUSED)
            </h2>
            <p className="text-xs font-mono-tabular text-slate-400 mb-5">
              Tầng 1-{hud.floor} · {DIFFICULTIES[hud.difficulty].name} ·{' '}
              {hud.gold} Vàng · +{hud.soulGemsEarned} 💎
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  engineRef.current?.setGameState('PLAYING');
                }}
                className="btn-3d btn-3d-amber min-h-[46px] w-full py-2.5 px-4 rounded-xl font-pixel text-xs cursor-pointer"
              >
                TIẾP TỤC CHIẾN ĐẤU
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  setActiveModal('SETTINGS');
                }}
                className="btn-3d btn-3d-slate min-h-[44px] w-full py-2.5 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                MỞ CÀI ĐẶT (SETTINGS)
              </button>
              <button
                onClick={handleEnterLivingRoom}
                className="btn-3d btn-3d-cyan min-h-[44px] w-full py-2.5 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                VỀ PHÒNG CHỜ (LIVING ROOM)
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(false);
                  engineRef.current?.setGameState('TITLE_MENU');
                }}
                className="btn-3d btn-3d-rose min-h-[44px] w-full py-2.5 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                VỀ SẢNH CHÍNH (MAIN LOBBY)
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
          <div className="animate-modal-pop w-full max-w-md bg-[#090b10] border-2 border-slate-700 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-xs font-mono-tabular tracking-widest mb-1 text-slate-400">
              {gameState === 'VICTORY'
                ? 'ĐÃ ĐOẠT ĐƯỢC ĐÁ MA THUẬT!'
                : 'GỤC NGÃ TRONG HẦM NGỤC'}
            </div>
            <h2
              className={`font-pixel text-xl sm:text-2xl mb-4 ${
                gameState === 'VICTORY' ? 'text-amber-400' : 'text-rose-500'
              }`}
            >
              {gameState === 'VICTORY' ? 'CHIẾN THẮNG!' : 'THẤT BẠI'}
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
                onClick={() => {
                  sound.playUiClick(true);
                  engineRef.current?.setGameState('TITLE_MENU');
                }}
                className="btn-3d btn-3d-amber min-h-[46px] flex-1 py-3 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                VỀ SẢNH CHÍNH
              </button>
              <button
                onClick={() => {
                  sound.playUiClick(true);
                  engineRef.current?.setGameState('TITLE_MENU');
                  setActiveModal('GACHA');
                }}
                className="btn-3d btn-3d-purple min-h-[46px] py-3 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                MỞ RƯƠNG 💎
              </button>
              <button
                onClick={handleStartDungeonDirect}
                className="btn-3d btn-3d-emerald min-h-[46px] py-3 px-4 rounded-xl font-pixel text-[10px] cursor-pointer"
              >
                CHƠI LẠI (1-1)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
