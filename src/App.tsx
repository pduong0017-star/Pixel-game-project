import React, { useEffect, useRef, useState } from 'react';
import {
  BootPixelIcon,
  CoinPixelIcon,
  HeartPixelIcon,
  ManaPixelIcon,
  ObsidianTitleLockup,
  PausePixelIcon,
  PotionPixelIcon,
  ShieldPixelIcon,
  SkillStarIcon,
  SoundIcon,
  StairsPixelIcon,
  SwapWeaponIcon,
  SwordPixelIcon,
} from './components/Icons';
import { IsometricGameEngine } from './game/GameEngine';
import { HERO_CLASSES, PETS, WEAPONS } from './game/dungeonGen';
import { sound } from './game/sound';
import {
  BoonOption,
  GameState,
  HeroClassId,
  HudSnapshot,
  PetId,
} from './game/types';

const INITIAL_HUD: HudSnapshot = {
  inLivingRoom: true,
  hp: 140,
  maxHp: 140,
  armor: 60,
  maxArmor: 60,
  mana: 200,
  maxMana: 200,
  gold: 30,
  floor: 1,
  maxFloors: 3,
  level: 1,
  xp: 0,
  xpToNext: 60,
  potions: 2,
  maxPotions: 3,
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

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<IsometricGameEngine | null>(null);
  const dpadRef = useRef<HTMLDivElement | null>(null);
  const dpadPointerId = useRef<number | null>(null);

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [selectedClass, setSelectedClass] = useState<HeroClassId>('knight');
  const [selectedPet, setSelectedPet] = useState<PetId>('cat');
  const [hud, setHud] = useState<HudSnapshot>(INITIAL_HUD);
  const [boonChoices, setBoonChoices] = useState<BoonOption[]>([]);
  const [muted, setMuted] = useState<boolean>(false);
  const [knobOffset, setKnobOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new IsometricGameEngine(
      canvasRef.current,
      (newState) => setGameState(newState),
      (newHud) => setHud(newHud),
      (choices) => setBoonChoices(choices)
    );
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

  const handleEnterLivingRoom = () => {
    engineRef.current?.enterLivingRoom(selectedClass);
  };

  const handleStartDungeonDirect = () => {
    engineRef.current?.startNewRun(selectedClass);
  };

  const handleToggleMute = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07090e] select-none">
      {/* Isolated 60fps 2.5D Pixel-Art Canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair"
      />

      {/* =====================================================================
          1. TITLE SCREEN OVERLAY (Landscape Mobile Soul Knight Style)
         ===================================================================== */}
      {gameState === 'TITLE_MENU' && (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between items-center px-4 py-4 sm:py-6 bg-gradient-to-b from-[#07090e]/90 via-[#07090e]/45 to-[#07090e]/95">
          {/* Top Utility Row */}
          <div className="w-full max-w-5xl flex items-center justify-between pointer-events-auto">
            <span className="text-xs font-mono-tabular tracking-widest text-slate-400">
              LANDSCAPE 2.5D · SOUL KNIGHT EDITION
            </span>
            <button
              onClick={handleToggleMute}
              className="min-h-[44px] min-w-[44px] px-3 py-2 flex items-center gap-2 rounded-lg bg-[#090b10] border border-slate-800 text-slate-300 hover:border-amber-500/60 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
            >
              <SoundIcon muted={muted} className="w-4 h-4" />
              <span className="text-xs font-mono-tabular whitespace-nowrap shrink-0">
                {muted ? '8-Bit Audio Muted' : '8-Bit Audio On'}
              </span>
            </button>
          </div>

          {/* Center Hero Lockup, Hero & Pet Selector */}
          <div className="w-full max-w-4xl flex flex-col items-center text-center my-auto pointer-events-auto">
            <ObsidianTitleLockup />

            {/* Landscape 2-Column Hero & Pet Selection */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full mt-2 mb-4">
              {/* 3 Hero Classes */}
              <div className="md:col-span-8 grid grid-cols-3 gap-2.5">
                {(Object.keys(HERO_CLASSES) as HeroClassId[]).map((clsId) => {
                  const cfg = HERO_CLASSES[clsId];
                  const isSelected = selectedClass === clsId;
                  return (
                    <button
                      key={clsId}
                      onClick={() => handleSelectClass(clsId)}
                      className={`text-left p-2.5 sm:p-3 rounded-xl border transition-transform active:scale-[0.98] cursor-pointer ${
                        isSelected
                          ? 'bg-[#111726] border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.22)]'
                          : 'bg-[#090b10]/90 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="font-display font-bold text-xs sm:text-sm tracking-wide truncate mb-1"
                        style={{
                          color: isSelected ? cfg.accentColor : '#f8fafc',
                        }}
                      >
                        {cfg.name}
                      </div>
                      <div className="text-[11px] font-mono-tabular text-slate-300 flex items-center gap-1.5 flex-wrap">
                        <span>HP {cfg.maxHp}</span>
                        <span aria-hidden="true">·</span>
                        <span>ARM {cfg.maxArmor}</span>
                        <span aria-hidden="true">·</span>
                        <span>MP {cfg.maxMana}</span>
                      </div>
                      <div className="mt-1.5 text-[10px] font-mono-tabular text-amber-300 truncate">
                        {WEAPONS[cfg.starterWeaponId].name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Companion Pet Selector */}
              <div className="md:col-span-4 bg-[#090b10]/92 border border-slate-800 rounded-xl p-2.5 flex flex-col justify-between text-left">
                <div className="text-[11px] font-mono-tabular text-slate-400 mb-1">
                  Companion Pet · {PETS[selectedPet].role}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.keys(PETS) as PetId[]).map((pid) => {
                    const pCfg = PETS[pid];
                    const active = selectedPet === pid;
                    return (
                      <button
                        key={pid}
                        onClick={() => handleSelectPet(pid)}
                        className={`px-2 py-1.5 rounded-lg border text-[11px] font-mono-tabular font-semibold transition-colors cursor-pointer truncate ${
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
            </div>

            {/* Active Skill Banner */}
            <div className="w-full max-w-2xl mb-4 px-3.5 py-2 rounded-lg bg-[#090b10]/95 border border-slate-800/90 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-left">
                <SkillStarIcon className="w-4 h-4 shrink-0" />
                <div>
                  <span className="font-semibold text-amber-300">
                    {classCfg.skillName}:{' '}
                  </span>
                  <span className="text-slate-300">{classCfg.skillDesc}</span>
                </div>
              </div>
            </div>

            {/* Primary Start CTAs */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleEnterLivingRoom}
                className="min-h-[48px] px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 font-display font-extrabold text-sm sm:text-base tracking-wider shadow-[0_6px_24px_rgba(245,158,11,0.35)] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                Enter Living Room
              </button>
              <button
                onClick={handleStartDungeonDirect}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-[#090b10] hover:bg-slate-900 border border-slate-700 text-slate-200 font-mono-tabular font-bold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Quick Dive (1-1)
              </button>
            </div>
          </div>

          {/* Single Flat Control-Hint Line */}
          <div className="text-xs font-mono-tabular text-slate-400 tracking-wide text-center">
            WASD / D-Pad Move · Space Fire/Strike · R Switch Weapon · Shift Dash · 1 Skill · Esc Pause
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
            {/* Top-Left: Soul Knight 3-Bar Status Frame (HP, Shield, Mana) */}
            <div className="pointer-events-auto bg-[#090b10]/92 border border-slate-800 rounded-xl p-2.5 shadow-lg min-w-[205px] sm:min-w-[238px]">
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
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden border border-slate-800 mb-1.5">
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
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden border border-slate-800 mb-1.5">
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
              <div className="w-full h-2 bg-slate-900 rounded overflow-hidden border border-slate-800 mb-2">
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

              {/* Unboxed Metadata Row: Level, Pet, Gold */}
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
                <span className="text-sky-300 truncate">{hud.petName.split(' ')[0]}</span>
              </div>
            </div>

            {/* Top-Center: Boss Bar, Living Room Banner, or Interactive Pickup/Shop Prompt */}
            <div className="flex flex-col items-center gap-1.5 max-w-xs sm:max-w-md w-full px-1">
              {hud.inLivingRoom && !hud.promptText && (
                <div className="bg-[#090b10]/90 border border-slate-800 rounded-xl px-3.5 py-1.5 text-center">
                  <div className="text-xs font-display font-bold text-amber-400">
                    LIVING ROOM BASE
                  </div>
                  <div className="text-[11px] font-mono-tabular text-slate-300">
                    Pick Hero & Pet · Open Chest · Walk North to Start 1-1
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
                        : `${hud.enemiesRemaining} Left`}
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
                          return <div key={`${gx}-${gy}`} className="rounded-xs bg-transparent" />;
                        }
                        let bg = 'bg-slate-800';
                        if (rm.isCurrent) bg = 'bg-sky-400';
                        else if (rm.kind === 'BOSS_ROOM') bg = 'bg-rose-500/80';
                        else if (rm.kind === 'CHEST_ROOM') bg = 'bg-amber-400/80';
                        else if (rm.kind === 'SHOP_ROOM' || rm.kind === 'STATUE_ROOM')
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
                    Start 1-1 →
                  </button>
                )}
                <button
                  onClick={handleToggleMute}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-[#090b10]/92 border border-slate-800 text-slate-300 hover:border-amber-400 flex items-center justify-center cursor-pointer"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  <SoundIcon muted={muted} className="w-4 h-4" />
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
              className="pointer-events-auto relative w-[128px] h-[128px] sm:w-[140px] sm:h-[140px] rounded-full bg-[#090b10]/85 border-2 border-slate-800 flex items-center justify-center touch-none cursor-pointer shadow-xl"
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
              {/* Weapon Switch Slot Bar (Shows Equipped Weapon, Mana Cost & Swap Icon) */}
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
                      ? ` · 2nd: ${hud.secondaryWeapon.name.split(' ')[0]}`
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
                  className="relative min-w-[48px] min-h-[48px] rounded-xl bg-[#090b10]/92 border border-slate-800 hover:border-rose-400 active:scale-95 flex flex-col items-center justify-center p-1.5 disabled:opacity-45 transition-transform cursor-pointer"
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
                  className="relative min-w-[54px] min-h-[54px] rounded-xl bg-[#090b10]/92 border border-slate-800 hover:border-amber-400 active:scale-95 flex flex-col items-center justify-center p-1.5 overflow-hidden transition-transform cursor-pointer"
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
                  className="relative min-w-[56px] min-h-[56px] rounded-2xl bg-[#090b10]/92 border-2 border-sky-500/70 hover:border-sky-400 active:scale-95 flex flex-col items-center justify-center p-1.5 overflow-hidden transition-transform cursor-pointer"
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
                  className="relative min-w-[70px] min-h-[70px] rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 border-2 border-amber-300 text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.38)] flex flex-col items-center justify-center p-2 transition-transform cursor-pointer"
                  aria-label="Fire or Strike"
                >
                  <SwordPixelIcon className="w-6 h-6" />
                  <span className="text-[11px] font-mono-tabular font-extrabold mt-0.5 whitespace-nowrap shrink-0">
                    {hud.activeWeapon.type === 'melee' ? 'Slash' : 'Fire'}
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
        <div className="absolute inset-0 bg-[#07090e]/88 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#090b10] border border-amber-500/50 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-xs font-mono-tabular text-amber-400 tracking-widest mb-1">
                LEVEL UP! · LEVEL {hud.level}
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-100">
                Select a Dungeon Buff
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
                    Select Buff →
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
        <div className="absolute inset-0 bg-[#07090e]/85 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090b10] border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <h2 className="font-display font-bold text-2xl text-amber-400 mb-2">
              Game Paused
            </h2>
            <p className="text-xs font-mono-tabular text-slate-400 mb-5">
              Stage 1-{hud.floor} · Lv.{hud.level} · {hud.gold} Gold
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => engineRef.current?.setGameState('PLAYING')}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Resume Game
              </button>
              <button
                onClick={handleEnterLivingRoom}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Return to Living Room
              </button>
              <button
                onClick={() => engineRef.current?.setGameState('TITLE_MENU')}
                className="min-h-[46px] w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Title Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          5. VICTORY / GAME OVER MODAL
         ===================================================================== */}
      {(gameState === 'GAME_OVER' || gameState === 'VICTORY') && (
        <div className="absolute inset-0 bg-[#07090e]/90 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090b10] border border-slate-800 rounded-2xl p-6 text-center shadow-2xl">
            <div className="text-xs font-mono-tabular tracking-widest mb-1 text-slate-400">
              {gameState === 'VICTORY'
                ? 'MAGIC STONE RECOVERED'
                : 'DEFEATED IN THE DUNGEON'}
            </div>
            <h2
              className={`font-display font-extrabold text-3xl mb-4 ${
                gameState === 'VICTORY' ? 'text-amber-400' : 'text-rose-500'
              }`}
            >
              {gameState === 'VICTORY' ? 'Victory!' : 'Game Over'}
            </h2>

            <div className="grid grid-cols-2 gap-2.5 mb-6 text-left bg-[#111726] border border-slate-800/90 rounded-xl p-4 font-mono-tabular">
              <div>
                <div className="text-[11px] text-slate-400">Stage Reached</div>
                <div className="text-base font-bold text-slate-100">
                  1-{hud.floor}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Enemies Slain</div>
                <div className="text-base font-bold text-slate-100">
                  {hud.kills}
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Gold Collected</div>
                <div className="text-base font-bold text-amber-400">
                  {hud.gold} G
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Total Damage</div>
                <div className="text-base font-bold text-rose-400">
                  {hud.damageDealt}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleEnterLivingRoom}
                className="min-h-[48px] flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-sm tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Back to Living Room
              </button>
              <button
                onClick={handleStartDungeonDirect}
                className="min-h-[48px] py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Quick Retry (1-1)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
