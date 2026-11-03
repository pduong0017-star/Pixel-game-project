import {
  BOON_POOL,
  DIFFICULTIES,
  GeneratedFloor,
  HERO_CLASSES,
  PETS,
  WEAPONS,
  WEAPON_POOL,
  generateDungeonFloor,
  generateLivingRoom,
} from './dungeonGen';
import { SpriteBank, getSpriteBank } from './pixelSprites';
import { sound } from './sound';
import { DEFAULT_PROFILE, DEFAULT_SETTINGS } from './storage';
import {
  BoonOption,
  DestructibleProp,
  DifficultyId,
  DungeonRoom,
  DungeonTile,
  Enemy,
  FloatingText,
  GameSettings,
  GameState,
  GhostTrail,
  HeroClassId,
  HudSnapshot,
  Interactable,
  LightningBolt,
  Particle,
  PetId,
  PlayerProfile,
  Projectile,
  SkinTier,
  SlashEffect,
  TelegraphZone,
  WeaponId,
} from './types';

const TILE_SIZE = 46;
const WALL_TOP_H = 18;
const MAX_FLOORS = 3;

export class IsometricGameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private sprites: SpriteBank;

  private rafId: number | null = null;
  private lastTime: number = 0;
  private globalTime: number = 0;

  public gameState: GameState = 'TITLE_MENU';
  public selectedClass: HeroClassId = 'knight';
  public selectedSkinTier: SkinTier = 'default';
  public selectedPet: PetId = 'cat';
  public selectedDifficulty: DifficultyId = 'normal';

  private profile: PlayerProfile = { ...DEFAULT_PROFILE };
  private settings: GameSettings = { ...DEFAULT_SETTINGS };

  private onStateChange: (state: GameState) => void;
  private onHudUpdate: (hud: HudSnapshot) => void;
  private onBoonPrompt: (choices: BoonOption[]) => void;
  private onEarnSoulGems?: (
    gems: number,
    killsDelta?: number,
    runWon?: boolean,
    consumedPreRunItems?: boolean
  ) => void;

  private floorNum: number = 1;
  private dungeon!: GeneratedFloor;
  private nextInteractId: number = 600;
  private soulGemsEarnedThisRun: number = 0;

  // Portal state
  private portalOpen: boolean = false;
  private portalAngle: number = 0;

  // Player state
  private player = {
    gx: 11.5,
    gy: 9.5,
    gz: 0,
    vx: 0,
    vy: 0,
    facingX: 1,
    facingY: 0,
    aimAngle: 0,
    spriteFacing: 1,
    hp: 145,
    maxHp: 145,
    armor: 65,
    maxArmor: 65,
    mana: 200,
    maxMana: 200,
    armorRegenTimer: 0,
    damageMultiplier: 1.0,
    attackSpeedMultiplier: 1.0,
    weapons: ['broadsword', 'pioneer_pistol'] as [WeaponId, WeaponId | null],
    activeWeaponIdx: 0 as 0 | 1,
    statueBlessing: null as 'paladin' | 'sorcerer' | 'berserker' | null,
    attackCooldown: 0,
    maxAttackCooldown: 0.31,
    dashCooldown: 0,
    maxDashCooldown: 1.05,
    dashTimer: 0,
    dashDirX: 0,
    dashDirY: 0,
    ghostSpawnTimer: 0,
    invulnTimer: 0, // 0.5s I-frame on Dash
    skillCooldown: 0,
    maxSkillCooldown: 5.2,
    moveSpeed: 5.5,
    critChance: 0.18,
    gold: 30,
    level: 1,
    xp: 0,
    xpToNext: 60,
    potions: 2,
    maxPotions: 4,
    kills: 0,
    damageDealt: 0,
    hitFlash: 0,
    squashX: 1,
    squashY: 1,
    animPhase: 0,
    stepSoundTimer: 0,
    activeBoons: [] as BoonOption[],
    moveTarget: null as { gx: number; gy: number } | null,
  };

  // Companion Pet state
  private pet = {
    gx: 10.2,
    gy: 9.5,
    hopZ: 0,
    facing: 1,
    animPhase: 0,
    attackTimer: 0,
  };

  // Input state
  private heldKeys = new Set<string>();
  private virtualStick = { x: 0, y: 0 };
  private heldAttackButton: boolean = false;
  private inputBuffer: {
    action:
      | 'attack'
      | 'dash'
      | 'skill'
      | 'potion'
      | 'interact'
      | 'switch_weapon'
      | null;
    expiresAt: number;
  } = { action: null, expiresAt: 0 };

  // Camera & Juice
  private camX: number = 0;
  private camY: number = 0;
  private shakeMag: number = 0;
  private shakeX: number = 0;
  private shakeY: number = 0;
  private hitstopTimer: number = 0;

  // Visual Effects Pools
  private particles: Particle[] = [];
  private projectiles: Projectile[] = [];
  private slashes: SlashEffect[] = [];
  private ghostTrails: GhostTrail[] = [];
  private lightningBolts: LightningBolt[] = [];
  private floatingTexts: FloatingText[] = [];
  private telegraphs: TelegraphZone[] = [];
  private nextTextId: number = 1;
  private hudSyncTimer: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    onStateChange: (state: GameState) => void,
    onHudUpdate: (hud: HudSnapshot) => void,
    onBoonPrompt: (choices: BoonOption[]) => void,
    onEarnSoulGems?: (
      gems: number,
      killsDelta?: number,
      runWon?: boolean,
      consumedPreRunItems?: boolean
    ) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.sprites = getSpriteBank();
    this.onStateChange = onStateChange;
    this.onHudUpdate = onHudUpdate;
    this.onBoonPrompt = onBoonPrompt;
    this.onEarnSoulGems = onEarnSoulGems;

    for (let i = 0; i < 320; i++) {
      this.particles.push({
        active: false,
        gx: 0,
        gy: 0,
        gz: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        size: 3,
        color: '#ffffff',
        life: 0,
        maxLife: 1,
        gravity: 150,
      });
    }

    for (let i = 0; i < 110; i++) {
      this.projectiles.push({
        active: false,
        fromPlayer: true,
        gx: 0,
        gy: 0,
        gz: 14,
        vx: 0,
        vy: 0,
        damage: 10,
        radius: 0.36,
        life: 0,
        maxLife: 1,
        color: '#f97316',
        coreColor: '#fde047',
      });
    }

    this.dungeon = generateLivingRoom();
    this.player.gx = this.dungeon.spawnGx;
    this.player.gy = this.dungeon.spawnGy;
    this.pet.gx = this.player.gx - 1.2;
    this.pet.gy = this.player.gy + 0.4;
    const scr = this.gridToWorld(this.player.gx, this.player.gy, 0);
    this.camX = scr.x;
    this.camY = scr.y;

    this.bindEvents();
    this.resize();
  }

  public updateProfile(profile: PlayerProfile) {
    this.profile = profile;
  }

  public updateSettings(settings: GameSettings) {
    this.settings = settings;
    sound.setMuted(settings.muted);
  }

  public selectDifficulty(diff: DifficultyId) {
    this.selectedDifficulty = diff;
    this.syncHud();
  }

  public selectSkin(tier: SkinTier) {
    this.selectedSkinTier = tier;
    this.syncHud();
  }

  private bindEvents() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
  }

  public destroy() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
  }

  private handleResize = () => {
    this.resize();
  };

  public resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }

  private handleWindowBlur = () => {
    this.heldKeys.clear();
    this.virtualStick.x = 0;
    this.virtualStick.y = 0;
    this.heldAttackButton = false;
    this.inputBuffer.action = null;
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    const code = e.code;

    if (this.gameState === 'TITLE_MENU') {
      return;
    }

    if (this.gameState === 'GAME_OVER' || this.gameState === 'VICTORY') {
      if (code === 'Enter' || code === 'Space') {
        e.preventDefault();
        this.enterLivingRoom(this.selectedClass);
      }
      return;
    }

    if (code === 'Escape' || code === 'KeyP') {
      if (this.gameState === 'PLAYING') {
        this.setGameState('PAUSED');
      } else if (this.gameState === 'PAUSED') {
        this.setGameState('PLAYING');
      }
      return;
    }

    if (this.gameState !== 'PLAYING') return;

    if (!e.repeat) {
      if (code === 'Space' || code === 'KeyJ') {
        e.preventDefault();
        this.bufferAction('attack');
      } else if (
        code === 'ShiftLeft' ||
        code === 'ShiftRight' ||
        code === 'KeyK'
      ) {
        e.preventDefault();
        this.bufferAction('dash');
      } else if (code === 'Digit1' || code === 'KeyL' || code === 'KeyQ') {
        e.preventDefault();
        this.bufferAction('skill');
      } else if (code === 'Digit2' || code === 'KeyH') {
        e.preventDefault();
        this.bufferAction('potion');
      } else if (code === 'KeyR' || code === 'Tab') {
        e.preventDefault();
        this.bufferAction('switch_weapon');
      } else if (code === 'KeyE' || code === 'Enter') {
        e.preventDefault();
        this.bufferAction('interact');
      }
    }

    this.heldKeys.add(code);
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.heldKeys.delete(e.code);
  };

  private handlePointerDown = (e: PointerEvent) => {
    if (this.gameState !== 'PLAYING') return;
    const rect = this.canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const worldPos = this.screenToGrid(sx, sy);
    const gx = worldPos.gx;
    const gy = worldPos.gy;

    const distToPlayer = Math.hypot(gx - this.player.gx, gy - this.player.gy);
    if (distToPlayer < 2.3) {
      const nearInteract = this.dungeon.interactables.find(
        (it) =>
          !it.opened &&
          it.type !== 'gold' &&
          it.type !== 'mana_orb' &&
          it.type !== 'exp_gem' &&
          Math.hypot(it.gx - gx, it.gy - gy) < 1.5
      );
      if (nearInteract) {
        this.bufferAction('interact');
        return;
      }
    }

    const tappedEnemy = this.dungeon.enemies.find(
      (en) => Math.hypot(en.gx - gx, en.gy - gy) < 1.4
    );
    if (tappedEnemy) {
      const dx = tappedEnemy.gx - this.player.gx;
      const dy = tappedEnemy.gy - this.player.gy;
      const d = Math.hypot(dx, dy) || 1;
      this.player.facingX = dx / d;
      this.player.facingY = dy / d;
      this.player.aimAngle = Math.atan2(dy, dx);
      this.player.spriteFacing = dx >= 0 ? 1 : -1;
      this.bufferAction('attack');
      return;
    }

    if (this.isWalkable(gx, gy)) {
      this.player.moveTarget = { gx, gy };
      this.spawnParticles(gx, gy, 2, 4, '#38bdf8', 1.4);
    }
  };

  public setVirtualStick(x: number, y: number) {
    this.virtualStick.x = x;
    this.virtualStick.y = y;
    if (Math.hypot(x, y) > 0.08) {
      this.player.moveTarget = null;
    }
  }

  public setAttackHeld(held: boolean) {
    this.heldAttackButton = held;
    if (held) {
      this.bufferAction('attack');
    }
  }

  public bufferAction(
    action:
      | 'attack'
      | 'dash'
      | 'skill'
      | 'potion'
      | 'interact'
      | 'switch_weapon'
  ) {
    this.inputBuffer = {
      action,
      expiresAt: performance.now() + 150,
    };
  }

  public setGameState(state: GameState) {
    this.gameState = state;
    this.onStateChange(state);
    this.syncHud();
  }

  private applyHeroStatsAndUpgrades(cls: HeroClassId) {
    const cfg = HERO_CLASSES[cls];
    const upg = this.profile.upgrades;

    const bonusHp = upg.hpLevel * 15;
    const bonusArmor = upg.armorLevel * 8;
    const bonusMana = upg.manaLevel * 25;
    const bonusDmgMult = 1 + upg.dmgLevel * 0.08;
    const bonusGold = upg.goldLevel * 20;

    this.player.maxHp = cfg.maxHp + bonusHp;
    this.player.hp = this.player.maxHp;
    this.player.maxArmor = cfg.maxArmor + bonusArmor;
    this.player.armor = this.player.maxArmor;
    this.player.maxMana = cfg.maxMana + bonusMana;
    this.player.mana = this.player.maxMana;
    this.player.critChance = cfg.critChance;
    this.player.moveSpeed = cfg.moveSpeed;
    this.player.damageMultiplier = bonusDmgMult;
    this.player.attackSpeedMultiplier = 1.0;
    this.player.maxSkillCooldown = cfg.skillCooldown;
    this.player.gold = 30 + bonusGold;

    this.selectedSkinTier = this.profile.selectedSkins?.[cls] || 'default';

    // Equip Pre-Run Weapon or Armory Starter Weapon!
    const customPrimary =
      this.profile.preRunWeapon || this.profile.selectedStarterWeapon;
    const primaryWpn = customPrimary || cfg.starterWeaponId;
    const secondaryWpn =
      customPrimary && customPrimary !== cfg.starterWeaponId
        ? cfg.starterWeaponId
        : cfg.secondaryWeaponId;

    this.player.weapons = [primaryWpn, secondaryWpn];
    this.player.activeWeaponIdx = 0;
    this.player.potions = 2 + (this.profile.preRunPotion ? 1 : 0);
    this.player.maxPotions = 4;

    if (this.profile.preRunWeapon || this.profile.preRunPotion) {
      this.onEarnSoulGems?.(0, 0, false, true);
    }
  }

  public selectHeroClass(cls: HeroClassId) {
    this.selectedClass = cls;
    this.applyHeroStatsAndUpgrades(cls);
    this.syncHud();
  }

  public selectPet(petId: PetId) {
    this.selectedPet = petId;
    sound.playExpCoin();
    this.addFloatingText(
      this.pet.gx,
      this.pet.gy,
      26,
      PETS[petId].name.toUpperCase(),
      PETS[petId].accentColor,
      1.1
    );
    this.syncHud();
  }

  // Enter the Living Room Hub (Phòng Chờ Soul Knight)
  public enterLivingRoom(
    cls: HeroClassId = this.selectedClass,
    diff: DifficultyId = this.selectedDifficulty
  ) {
    this.selectedClass = cls;
    this.selectedDifficulty = diff;
    this.floorNum = 1;
    this.portalOpen = true;
    this.soulGemsEarnedThisRun = 0;

    this.player = {
      gx: 11.5,
      gy: 9.5,
      gz: 0,
      vx: 0,
      vy: 0,
      facingX: 1,
      facingY: 0,
      aimAngle: 0,
      spriteFacing: 1,
      hp: 145,
      maxHp: 145,
      armor: 65,
      maxArmor: 65,
      mana: 200,
      maxMana: 200,
      armorRegenTimer: 0,
      damageMultiplier: 1.0,
      attackSpeedMultiplier: 1.0,
      weapons: ['broadsword', 'pioneer_pistol'],
      activeWeaponIdx: 0,
      statueBlessing: null,
      attackCooldown: 0,
      maxAttackCooldown: 0.31,
      dashCooldown: 0,
      maxDashCooldown: 1.05,
      dashTimer: 0,
      dashDirX: 0,
      dashDirY: 0,
      ghostSpawnTimer: 0,
      invulnTimer: 0,
      skillCooldown: 0,
      maxSkillCooldown: 5.2,
      moveSpeed: 5.5,
      critChance: 0.18,
      gold: 30,
      level: 1,
      xp: 0,
      xpToNext: 60,
      potions: 2,
      maxPotions: 4,
      kills: 0,
      damageDealt: 0,
      hitFlash: 0,
      squashX: 1,
      squashY: 1,
      animPhase: 0,
      stepSoundTimer: 0,
      activeBoons: [],
      moveTarget: null,
    };

    this.applyHeroStatsAndUpgrades(cls);

    this.dungeon = generateLivingRoom();
    this.player.gx = this.dungeon.spawnGx;
    this.player.gy = this.dungeon.spawnGy;
    this.pet.gx = this.player.gx - 1.2;
    this.pet.gy = this.player.gy + 0.5;
    this.slashes = [];
    this.ghostTrails = [];
    this.lightningBolts = [];
    this.telegraphs = [];
    this.floatingTexts = [];
    this.projectiles.forEach((p) => (p.active = false));

    const scr = this.gridToWorld(this.player.gx, this.player.gy, 0);
    this.camX = scr.x;
    this.camY = scr.y;

    this.addFloatingText(
      this.player.gx,
      this.player.gy,
      30,
      `LIVING ROOM · ${DIFFICULTIES[diff].name.toUpperCase()}`,
      DIFFICULTIES[diff].accent,
      1.2
    );
    this.setGameState('PLAYING');
    sound.playPortalOpen();
  }

  public startNewRun(
    cls: HeroClassId = this.selectedClass,
    diff: DifficultyId = this.selectedDifficulty
  ) {
    this.selectedClass = cls;
    this.selectedDifficulty = diff;
    this.soulGemsEarnedThisRun = 0;
    this.applyHeroStatsAndUpgrades(cls);
    this.loadFloor(1);
    this.setGameState('PLAYING');
    sound.playStairsDescend();
  }

  private loadFloor(floorNum: number) {
    this.floorNum = floorNum;
    this.dungeon = generateDungeonFloor(floorNum, this.selectedDifficulty);
    this.portalOpen = false;
    this.player.gx = this.dungeon.spawnGx;
    this.player.gy = this.dungeon.spawnGy;
    this.player.moveTarget = null;
    this.pet.gx = this.player.gx - 1.0;
    this.pet.gy = this.player.gy + 0.5;
    this.slashes = [];
    this.ghostTrails = [];
    this.lightningBolts = [];
    this.telegraphs = [];
    this.floatingTexts = [];
    this.projectiles.forEach((p) => (p.active = false));

    this.revealFogAround(this.player.gx, this.player.gy, 10.0);
    const scr = this.gridToWorld(this.player.gx, this.player.gy, 0);
    this.camX = scr.x;
    this.camY = scr.y;

    this.addFloatingText(
      this.player.gx,
      this.player.gy,
      28,
      `STAGE 1-${floorNum} (${DIFFICULTIES[this.selectedDifficulty].name.toUpperCase()})`,
      DIFFICULTIES[this.selectedDifficulty].accent,
      1.25
    );
    this.syncHud();
  }

  public applyBoon(boon: BoonOption) {
    this.player.activeBoons.push(boon);
    if (boon.id === 'vitality_surge') {
      const bonusHp = Math.round(this.player.maxHp * 0.25);
      this.player.maxHp += bonusHp;
      this.player.hp = Math.min(
        this.player.maxHp,
        this.player.hp + Math.round(this.player.maxHp * 0.45)
      );
    } else if (boon.id === 'blitz_reflex') {
      this.player.attackSpeedMultiplier *= 1.3;
      this.player.maxSkillCooldown *= 0.8;
    } else if (boon.id === 'executioner') {
      this.player.damageMultiplier *= 1.3;
      this.player.critChance = Math.min(0.88, this.player.critChance + 0.15);
    }

    sound.playLevelUp();
    this.spawnParticles(
      this.player.gx,
      this.player.gy,
      10,
      26,
      boon.accent,
      4.2
    );
    this.addFloatingText(
      this.player.gx,
      this.player.gy,
      28,
      boon.name.toUpperCase(),
      boon.accent,
      1.2
    );
    this.setGameState('PLAYING');
  }

  private hasBoon(id: string): boolean {
    return this.player.activeBoons.some((b) => b.id === id);
  }

  private getActiveWeapon() {
    const id =
      this.player.weapons[this.player.activeWeaponIdx] ||
      this.player.weapons[0];
    return WEAPONS[id];
  }

  public switchWeapon() {
    if (!this.player.weapons[1]) return;
    this.player.activeWeaponIdx = this.player.activeWeaponIdx === 0 ? 1 : 0;
    const wpn = this.getActiveWeapon();
    sound.playWeaponSwitch();
    this.addFloatingText(
      this.player.gx,
      this.player.gy,
      26,
      wpn.name.toUpperCase(),
      wpn.rarityColor,
      1.0
    );
    this.syncHud();
  }

  public start() {
    this.lastTime = performance.now();
    const loop = (now: number) => {
      const rawDt = Math.max(0, (now - this.lastTime) / 1000);
      this.lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      this.update(dt, now);
      this.render();

      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  // Orthogonal Top-Down 2.5D Coordinate Mapping
  private gridToWorld(gx: number, gy: number, gz: number = 0) {
    return {
      x: gx * TILE_SIZE,
      y: gy * TILE_SIZE - gz,
    };
  }

  private screenToGrid(sx: number, sy: number) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const rx = sx - w / 2 + this.camX;
    const ry = sy - h / 2 + this.camY;
    return {
      gx: rx / TILE_SIZE,
      gy: ry / TILE_SIZE,
    };
  }

  private isWalkable(gx: number, gy: number): boolean {
    const tx = Math.floor(gx);
    const ty = Math.floor(gy);
    const tile = this.dungeon.tiles[ty]?.[tx];
    if (!tile) return false;
    return (
      tile.type !== 'void' &&
      tile.type !== 'wall' &&
      tile.type !== 'pillar' &&
      tile.type !== 'door_locked'
    );
  }

  private getCurrentRoom(gx: number, gy: number): DungeonRoom | null {
    for (const rm of this.dungeon.rooms) {
      if (
        gx >= rm.x + 0.6 &&
        gx <= rm.x + rm.w - 0.6 &&
        gy >= rm.y + 0.6 &&
        gy <= rm.y + rm.h - 0.6
      ) {
        return rm;
      }
    }
    return null;
  }

  private update(dt: number, now: number) {
    this.globalTime += dt;
    this.portalAngle += dt * 3.8;

    if (this.gameState === 'TITLE_MENU') {
      const centerScr = this.gridToWorld(
        this.dungeon.spawnGx + Math.cos(this.globalTime * 0.45) * 2.2,
        this.dungeon.spawnGy + Math.sin(this.globalTime * 0.45) * 1.4,
        0
      );
      this.camX += (centerScr.x - this.camX) * 2.5 * dt;
      this.camY += (centerScr.y - this.camY) * 2.5 * dt;
      return;
    }

    if (this.gameState !== 'PLAYING') {
      return;
    }

    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      this.updateCamera(dt);
      return;
    }

    this.telegraphs = [];

    this.updateSpikeTraps(dt);
    this.updatePlayer(dt, now);
    this.updateRoomLockState();
    this.updatePet(dt);
    this.updateEnemies(dt);
    this.updateProjectiles(dt);
    this.updateProps(dt);
    this.updateEffects(dt);
    this.updateCamera(dt);

    // Check if all enemies in dungeon floor are cleared -> Open swirling Portal
    if (
      !this.dungeon.inLivingRoom &&
      !this.portalOpen &&
      this.dungeon.enemies.length === 0
    ) {
      this.portalOpen = true;
      sound.playPortalOpen();
      this.addShake(6);
      const bonusGems = Math.round(
        25 * this.floorNum * DIFFICULTIES[this.selectedDifficulty].gemMult
      );
      this.soulGemsEarnedThisRun += bonusGems;
      this.onEarnSoulGems?.(bonusGems, 0, false);

      this.spawnParticles(
        this.dungeon.stairsGx,
        this.dungeon.stairsGy,
        10,
        36,
        '#a855f7',
        4.8
      );
      this.addFloatingText(
        this.player.gx,
        this.player.gy,
        34,
        `PORTAL OPEN! +${bonusGems} GEMS`,
        '#d8b4fe',
        1.35
      );
    }

    if (this.portalOpen && Math.random() < 0.45) {
      this.spawnParticles(
        this.dungeon.stairsGx + (Math.random() - 0.5) * 0.9,
        this.dungeon.stairsGy + (Math.random() - 0.5) * 0.9,
        4,
        1,
        Math.random() < 0.5 ? '#c084fc' : '#38bdf8',
        1.8
      );
    }

    // Step onto North Gate in Living Room -> Launch Floor 1-1!
    if (
      this.dungeon.inLivingRoom &&
      Math.hypot(
        this.dungeon.stairsGx - this.player.gx,
        this.dungeon.stairsGy - this.player.gy
      ) < 1.15
    ) {
      sound.playStairsDescend();
      this.loadFloor(1);
      return;
    }

    // Step onto Boss Portal in Dungeon -> Advance to next floor!
    if (
      !this.dungeon.inLivingRoom &&
      this.portalOpen &&
      Math.hypot(
        this.dungeon.stairsGx - this.player.gx,
        this.dungeon.stairsGy - this.player.gy
      ) < 0.95
    ) {
      this.enterPortal();
      return;
    }

    this.hudSyncTimer -= dt;
    if (this.hudSyncTimer <= 0) {
      this.hudSyncTimer = 0.07;
      this.syncHud();
    }
  }

  private updateSpikeTraps(dt: number) {
    if (this.dungeon.inLivingRoom) return;
    const p = this.player;
    for (let y = 0; y < this.dungeon.height; y++) {
      for (let x = 0; x < this.dungeon.width; x++) {
        const tile = this.dungeon.tiles[y][x];
        if (tile.type !== 'spike_trap' || !tile.visible) continue;
        tile.trapTimer = (tile.trapTimer || 0) + dt;
        const cycle = tile.trapTimer % 3.8;
        if (cycle < 2.2) {
          tile.trapState = 'idle';
        } else if (cycle < 2.9) {
          tile.trapState = 'windup';
        } else {
          tile.trapState = 'active';
          // Hurt player if standing on active spikes
          if (
            Math.hypot(p.gx - (x + 0.5), p.gy - (y + 0.5)) < 0.65 &&
            p.invulnTimer <= 0 &&
            p.dashTimer <= 0
          ) {
            this.damagePlayer(12);
          }
        }
      }
    }
  }

  private updateProps(dt: number) {
    for (const prop of this.dungeon.props) {
      if (prop.hp <= 0) continue;
      prop.hitFlash = Math.max(0, prop.hitFlash - dt);
    }
  }

  private damageProp(prop: DestructibleProp, dmg: number) {
    if (prop.hp <= 0) return;
    prop.hp -= dmg;
    prop.hitFlash = 0.1;
    sound.playHit(false, false);
    this.spawnParticles(
      prop.gx,
      prop.gy,
      8,
      6,
      prop.kind === 'crate' ? '#d97706' : '#06b6d4',
      2.4
    );

    if (prop.hp <= 0) {
      this.spawnParticles(
        prop.gx,
        prop.gy,
        10,
        16,
        prop.kind === 'crate' ? '#b45309' : '#22d3ee',
        3.6
      );
      // 55% chance to drop Gold, Mana Orb, or Healing Vial!
      const roll = Math.random();
      if (roll < 0.28) {
        this.dungeon.interactables.push({
          id: this.nextInteractId++,
          type: 'gold',
          gx: prop.gx,
          gy: prop.gy,
          opened: false,
          value: 8 + Math.floor(Math.random() * 10),
          bobPhase: 0,
        });
      } else if (roll < 0.52) {
        this.dungeon.interactables.push({
          id: this.nextInteractId++,
          type: 'mana_orb',
          gx: prop.gx,
          gy: prop.gy,
          opened: false,
          value: 25,
          bobPhase: 0,
        });
      } else if (roll < 0.62) {
        this.dungeon.interactables.push({
          id: this.nextInteractId++,
          type: 'potion',
          gx: prop.gx,
          gy: prop.gy,
          opened: false,
          value: 1,
          bobPhase: 0,
        });
      }
    }
  }

  // Soul Knight Multi-Room Lock & Clear Mechanics
  private updateRoomLockState() {
    if (this.dungeon.inLivingRoom) return;
    const p = this.player;
    const curRoom = this.getCurrentRoom(p.gx, p.gy);
    if (!curRoom) return;

    curRoom.visited = true;

    if (!curRoom.cleared && !curRoom.locked) {
      const roomEnemies = this.dungeon.enemies.filter(
        (e) => e.roomId === curRoom.id
      );
      if (roomEnemies.length > 0) {
        curRoom.locked = true;
        sound.playDoorLock();
        this.addShake(5);
        for (const dtile of curRoom.doorTiles) {
          this.dungeon.tiles[dtile.gy][dtile.gx].type = 'door_locked';
          this.spawnParticles(
            dtile.gx + 0.5,
            dtile.gy + 0.5,
            6,
            6,
            '#94a3b8',
            2
          );
        }
        for (const en of roomEnemies) {
          en.aggroed = true;
          en.alertTimer = 0.95;
          en.state = 'chase';
        }
      } else {
        curRoom.cleared = true;
      }
    }

    if (curRoom.locked) {
      const remaining = this.dungeon.enemies.filter(
        (e) => e.roomId === curRoom.id
      );
      if (remaining.length === 0) {
        curRoom.locked = false;
        curRoom.cleared = true;
        sound.playLevelUp();
        for (const dtile of curRoom.doorTiles) {
          this.dungeon.tiles[dtile.gy][dtile.gx].type = 'door_open';
          this.spawnParticles(
            dtile.gx + 0.5,
            dtile.gy + 0.5,
            6,
            8,
            '#38bdf8',
            2.5
          );
        }
        const roomGems = Math.round(
          10 * DIFFICULTIES[this.selectedDifficulty].gemMult
        );
        this.soulGemsEarnedThisRun += roomGems;
        this.onEarnSoulGems?.(roomGems, 0, false);

        this.addFloatingText(
          p.gx,
          p.gy,
          30,
          `ROOM CLEARED! +${roomGems}💎`,
          '#4ade80',
          1.25
        );
        this.dungeon.interactables.push({
          id: this.nextInteractId++,
          type: 'chest',
          gx: curRoom.cx,
          gy: curRoom.cy,
          opened: false,
          value: 20 * this.floorNum,
          bobPhase: 0,
          label: 'Room Clear Chest',
        });
      }
    }
  }

  private updatePlayer(dt: number, now: number) {
    const p = this.player;

    p.attackCooldown = Math.max(0, p.attackCooldown - dt);
    p.dashCooldown = Math.max(0, p.dashCooldown - dt);
    p.skillCooldown = Math.max(0, p.skillCooldown - dt);
    p.invulnTimer = Math.max(0, p.invulnTimer - dt);
    p.hitFlash = Math.max(0, p.hitFlash - dt);

    // Passive slow Mana regeneration (+2.4 MP/s) so players never get stuck
    if (p.mana < p.maxMana) {
      p.mana = Math.min(p.maxMana, p.mana + 2.4 * dt);
    }

    // Soul Knight Shield/Armor out-of-hit regeneration
    p.armorRegenTimer += dt;
    if (p.armorRegenTimer > 3.5 && p.armor < p.maxArmor) {
      p.armor = Math.min(p.maxArmor, p.armor + 12 * dt);
    }

    p.squashX += (1 - p.squashX) * 14 * dt;
    p.squashY += (1 - p.squashY) * 14 * dt;

    let sx = this.virtualStick.x;
    let sy = this.virtualStick.y;

    if (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp')) sy -= 1;
    if (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown')) sy += 1;
    if (this.heldKeys.has('KeyA') || this.heldKeys.has('ArrowLeft')) sx -= 1;
    if (this.heldKeys.has('KeyD') || this.heldKeys.has('ArrowRight')) sx += 1;

    let moveGx = 0;
    let moveGy = 0;

    if (Math.hypot(sx, sy) > 0.05) {
      p.moveTarget = null;
      const len = Math.hypot(sx, sy) || 1;
      moveGx = sx / len;
      moveGy = sy / len;
      if (Math.abs(moveGx) > 0.08) p.spriteFacing = moveGx >= 0 ? 1 : -1;
    } else if (p.moveTarget) {
      const dx = p.moveTarget.gx - p.gx;
      const dy = p.moveTarget.gy - p.gy;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.22) {
        p.moveTarget = null;
      } else {
        moveGx = dx / dist;
        moveGy = dy / dist;
        if (Math.abs(moveGx) > 0.08) p.spriteFacing = moveGx >= 0 ? 1 : -1;
      }
    }

    if (Math.hypot(moveGx, moveGy) > 0.1) {
      p.facingX = moveGx;
      p.facingY = moveGy;
      p.aimAngle = Math.atan2(moveGy, moveGx);
    }

    // Auto-track nearest enemy for weapon aiming angle if Auto-Aim is enabled in Settings
    if (this.settings.autoAim) {
      const nearestFoe = this.findNearestEnemy(10.5);
      if (nearestFoe) {
        const dx = nearestFoe.gx - p.gx;
        const dy = nearestFoe.gy - p.gy;
        p.aimAngle = Math.atan2(dy, dx);
        p.spriteFacing = dx >= 0 ? 1 : -1;
      }
    }

    // Process buffered or held actions
    if (this.inputBuffer.action && now <= this.inputBuffer.expiresAt) {
      const act = this.inputBuffer.action;
      if (act === 'switch_weapon') {
        this.inputBuffer.action = null;
        this.switchWeapon();
      } else if (act === 'attack' && p.attackCooldown <= 0) {
        this.inputBuffer.action = null;
        this.performPlayerAttack();
      } else if (act === 'dash' && p.dashCooldown <= 0) {
        this.inputBuffer.action = null;
        this.performPlayerDash(moveGx, moveGy);
      } else if (act === 'skill' && p.skillCooldown <= 0) {
        this.inputBuffer.action = null;
        this.performPlayerSkill();
      } else if (act === 'potion') {
        this.inputBuffer.action = null;
        this.usePotion();
      } else if (act === 'interact') {
        this.inputBuffer.action = null;
        this.tryInteract();
      }
    } else if (
      (this.heldKeys.has('Space') ||
        this.heldKeys.has('KeyJ') ||
        this.heldAttackButton) &&
      p.attackCooldown <= 0
    ) {
      this.performPlayerAttack();
    }

    // Apply movement or Dash with Ghost Trail
    let speed = p.moveSpeed;
    if (p.dashTimer > 0) {
      p.dashTimer -= dt;
      moveGx = p.dashDirX;
      moveGy = p.dashDirY;
      speed = p.moveSpeed * 2.95;
      p.gz = Math.sin((p.dashTimer / 0.2) * Math.PI) * 10;

      p.ghostSpawnTimer -= dt;
      if (p.ghostSpawnTimer <= 0) {
        p.ghostSpawnTimer = 0.028;
        this.ghostTrails.push({
          gx: p.gx,
          gy: p.gy,
          gz: p.gz,
          spriteFacing: p.spriteFacing,
          frameIdx: Math.floor(p.animPhase) % 2,
          alpha: 0.72,
          maxAlpha: 0.72,
          tint: HERO_CLASSES[this.selectedClass].accentColor,
        });
      }
    } else {
      if (Math.hypot(moveGx, moveGy) > 0.1) {
        p.animPhase += dt * 14;
        p.gz = Math.abs(Math.sin(p.animPhase)) * 5.0;

        p.stepSoundTimer -= dt;
        if (p.stepSoundTimer <= 0) {
          p.stepSoundTimer = 0.24;
          sound.playFootstep();
        }
      } else {
        p.animPhase += dt * 3;
        p.gz = 0;
        p.stepSoundTimer = 0.05;
      }
    }

    const nextGx = p.gx + moveGx * speed * dt;
    const nextGy = p.gy + moveGy * speed * dt;

    if (this.isWalkable(nextGx, p.gy)) p.gx = nextGx;
    if (this.isWalkable(p.gx, nextGy)) p.gy = nextGy;

    // Magnetic pickup for Gold, Mana Orbs, EXP Gems, and Potions
    for (const item of this.dungeon.interactables) {
      if (item.opened) continue;
      item.bobPhase += dt * 5;
      const dx = p.gx - item.gx;
      const dy = p.gy - item.gy;
      const d = Math.hypot(dx, dy);

      if (
        (item.type === 'exp_gem' ||
          item.type === 'gold' ||
          item.type === 'mana_orb') &&
        d < 4.2 &&
        d > 0.1
      ) {
        const pullSpeed = 9.0 * (1 - d / 4.5 + 0.4);
        item.gx += (dx / d) * pullSpeed * dt;
        item.gy += (dy / d) * pullSpeed * dt;
      }

      if (d < 0.85) {
        if (item.type === 'exp_gem') {
          item.opened = true;
          sound.playExpCoin();
          this.spawnParticles(item.gx, item.gy, 8, 7, '#34d399', 2.4);
          this.gainExp(item.value);
        } else if (item.type === 'mana_orb') {
          item.opened = true;
          p.mana = Math.min(p.maxMana, p.mana + item.value);
          sound.playExpCoin();
          this.spawnParticles(item.gx, item.gy, 8, 7, '#3b82f6', 2.4);
          this.addFloatingText(
            item.gx,
            item.gy,
            18,
            `+${item.value} MP`,
            '#60a5fa',
            0.9
          );
        } else if (item.type === 'gold') {
          item.opened = true;
          p.gold += item.value;
          sound.playExpCoin();
          this.addFloatingText(
            item.gx,
            item.gy,
            18,
            `+${item.value}G`,
            '#fde047',
            0.95
          );
          this.spawnParticles(item.gx, item.gy, 6, 7, '#fde047', 2.4);
        } else if (item.type === 'potion' && p.potions < p.maxPotions) {
          item.opened = true;
          p.potions++;
          sound.playPickup('potion');
          this.addFloatingText(
            item.gx,
            item.gy,
            18,
            '+1 VIAL',
            '#fb7185',
            1.0
          );
        }
      }
    }

    if (!this.dungeon.inLivingRoom) {
      this.revealFogAround(p.gx, p.gy, 10.0);
    }
  }

  // Companion Pet AI
  private updatePet(dt: number) {
    const petCfg = PETS[this.selectedPet];
    const p = this.player;
    this.pet.animPhase += dt * 10;
    this.pet.attackTimer = Math.max(0, this.pet.attackTimer - dt);

    const targetFoe = this.findNearestEnemy(6.8);
    if (targetFoe && (targetFoe.aggroed || targetFoe.type === 'dummy')) {
      const dx = targetFoe.gx - this.pet.gx;
      const dy = targetFoe.gy - this.pet.gy;
      const d = Math.hypot(dx, dy) || 1;
      this.pet.facing = dx >= 0 ? 1 : -1;

      const desiredRange = petCfg.isRanged ? 4.4 : 1.15;
      if (d > desiredRange) {
        const nx = this.pet.gx + (dx / d) * 5.0 * dt;
        const ny = this.pet.gy + (dy / d) * 5.0 * dt;
        if (this.isWalkable(nx, this.pet.gy)) this.pet.gx = nx;
        if (this.isWalkable(this.pet.gx, ny)) this.pet.gy = ny;
        this.pet.hopZ = Math.abs(Math.sin(this.pet.animPhase)) * 5;
      } else {
        this.pet.hopZ = 0;
        if (this.pet.attackTimer <= 0) {
          this.pet.attackTimer = petCfg.attackCooldown;
          if (petCfg.isRanged) {
            this.spawnProjectile({
              fromPlayer: true,
              gx: this.pet.gx,
              gy: this.pet.gy,
              vx: (dx / d) * 12.0,
              vy: (dy / d) * 12.0,
              damage: petCfg.damage,
              radius: 0.3,
              maxLife: 0.7,
              color: petCfg.projectileColor,
              coreColor: '#ffffff',
            });
          } else {
            this.damageEnemy(targetFoe, petCfg.damage, dx / d, dy / d);
          }
        }
      }
      return;
    }

    const dx = p.gx - 1.1 * p.spriteFacing - this.pet.gx;
    const dy = p.gy + 0.5 - this.pet.gy;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.35) {
      this.pet.gx += dx * 4.6 * dt;
      this.pet.gy += dy * 4.6 * dt;
      this.pet.facing = dx >= 0 ? 1 : -1;
      this.pet.hopZ = Math.abs(Math.sin(this.pet.animPhase)) * 4.5;
    } else {
      this.pet.hopZ = 0;
    }
  }

  private findNearestEnemy(maxDist: number): Enemy | null {
    const p = this.player;
    let best: Enemy | null = null;
    let bestD = maxDist;
    for (const en of this.dungeon.enemies) {
      const d = Math.hypot(en.gx - p.gx, en.gy - p.gy);
      if (d < bestD) {
        bestD = d;
        best = en;
      }
    }
    return best;
  }

  private gainExp(amount: number) {
    const p = this.player;
    p.xp += amount;
    if (p.xp >= p.xpToNext) {
      p.xp -= p.xpToNext;
      p.level++;
      p.xpToNext = Math.round(p.xpToNext * 1.35);
      p.maxHp += 12;
      p.hp = Math.min(p.maxHp, p.hp + 30);
      p.mana = Math.min(p.maxMana, p.mana + 45);
      this.triggerBoonSelection();
    }
  }

  // Dual-Weapon Attack System
  private performPlayerAttack() {
    const p = this.player;
    const wpn = this.getActiveWeapon();

    if (wpn.manaCost > 0 && p.mana < wpn.manaCost) {
      this.addFloatingText(p.gx, p.gy, 26, 'NO MANA!', '#60a5fa', 1.0);
      const otherIdx = p.activeWeaponIdx === 0 ? 1 : 0;
      const otherId = p.weapons[otherIdx];
      if (otherId && WEAPONS[otherId].manaCost === 0) {
        this.switchWeapon();
      }
      return;
    }

    p.mana = Math.max(0, p.mana - wpn.manaCost);
    p.maxAttackCooldown = wpn.cooldown / p.attackSpeedMultiplier;
    p.attackCooldown = p.maxAttackCooldown;
    p.squashX = 1.26;
    p.squashY = 0.78;

    if (this.settings.autoAim) {
      const target = this.findNearestEnemy(wpn.range + 1.8);
      if (target) {
        const dx = target.gx - p.gx;
        const dy = target.gy - p.gy;
        const len = Math.hypot(dx, dy) || 1;
        p.facingX = dx / len;
        p.facingY = dy / len;
        p.aimAngle = Math.atan2(dy, dx);
        p.spriteFacing = dx >= 0 ? 1 : -1;
      }
    }

    const scaledDamage = Math.round(wpn.damage * p.damageMultiplier);

    // 1. MELEE WEAPON (Fan-shaped Hitbox + Slash VFX + Bullet Deflection + Prop Smashing!)
    if (wpn.type === 'melee') {
      sound.playSlash(wpn.id === 'broadsword' || wpn.id === 'excalibur');
      const fanSpread = wpn.id === 'excalibur' ? Math.PI * 0.88 : Math.PI * 0.72;

      this.slashes.push({
        gx: p.gx,
        gy: p.gy,
        angle: p.aimAngle,
        arcSpread: fanSpread,
        radius: wpn.range,
        timer: 0.17,
        maxTimer: 0.17,
        color: wpn.color,
        coreColor: wpn.coreColor,
      });

      // Excalibur also launches a piercing golden sword wave projectile!
      if (wpn.id === 'excalibur') {
        this.spawnProjectile({
          fromPlayer: true,
          gx: p.gx + Math.cos(p.aimAngle) * 0.5,
          gy: p.gy + Math.sin(p.aimAngle) * 0.5,
          vx: Math.cos(p.aimAngle) * wpn.projectileSpeed,
          vy: Math.sin(p.aimAngle) * wpn.projectileSpeed,
          damage: Math.round(scaledDamage * 0.85),
          radius: 0.52,
          maxLife: 0.55,
          color: '#fde047',
          coreColor: '#ffffff',
          piercing: true,
        });
      }

      // Destroy incoming enemy projectiles inside melee slash range AND restore +2 Mana per bullet!
      for (const proj of this.projectiles) {
        if (!proj.active || proj.fromPlayer) continue;
        if (Math.hypot(proj.gx - p.gx, proj.gy - p.gy) <= wpn.range + 0.45) {
          proj.active = false;
          p.mana = Math.min(p.maxMana, p.mana + 2);
          this.spawnParticles(proj.gx, proj.gy, 12, 6, '#fde047', 2.5);
        }
      }

      // Smash destructible crates & vases in slash radius
      for (const prop of this.dungeon.props) {
        if (prop.hp <= 0) continue;
        if (Math.hypot(prop.gx - p.gx, prop.gy - p.gy) <= wpn.range + 0.35) {
          this.damageProp(prop, scaledDamage);
        }
      }

      let hitAny = false;
      for (const en of [...this.dungeon.enemies]) {
        const dx = en.gx - p.gx;
        const dy = en.gy - p.gy;
        const dist = Math.hypot(dx, dy);
        if (dist <= wpn.range + (en.isBoss ? 0.65 : 0.42)) {
          const dirX = dx / (dist || 1);
          const dirY = dy / (dist || 1);
          const dot =
            dirX * Math.cos(p.aimAngle) + dirY * Math.sin(p.aimAngle);
          if (dot >= 0.18 || dist < 1.2) {
            this.damageEnemy(en, scaledDamage, dirX, dirY);
            hitAny = true;
          }
        }
      }
      if (hitAny) this.addShake(4.2);
      return;
    }

    // 2. RANGED GUN / STAFF / BOW
    if (wpn.id === 'splitter_shotgun') sound.playGunshot('shotgun');
    else if (
      wpn.id === 'plasma_rifle' ||
      wpn.id === 'thunder_staff' ||
      wpn.id === 'frost_laser'
    )
      sound.playGunshot('plasma');
    else if (wpn.id === 'inferno_bow') sound.playGunshot('bow');
    else sound.playGunshot('pistol');

    const count = wpn.projectiles;
    for (let i = 0; i < count; i++) {
      const offset =
        count === 1
          ? (Math.random() - 0.5) * wpn.spreadAngle
          : (i / (count - 1) - 0.5) * wpn.spreadAngle;
      const ang = p.aimAngle + offset;

      this.spawnProjectile({
        fromPlayer: true,
        gx: p.gx + Math.cos(ang) * 0.45,
        gy: p.gy + Math.sin(ang) * 0.45,
        vx: Math.cos(ang) * wpn.projectileSpeed,
        vy: Math.sin(ang) * wpn.projectileSpeed,
        damage: scaledDamage,
        radius: wpn.type === 'staff' ? 0.44 : 0.35,
        maxLife: wpn.range / wpn.projectileSpeed,
        color: wpn.color,
        coreColor: wpn.coreColor,
        piercing: wpn.piercing,
        explosive: wpn.explosive,
        chainLightning: wpn.chainLightning,
      });
    }

    this.addShake(wpn.id === 'splitter_shotgun' ? 3.5 : 1.5);
  }

  private performPlayerDash(moveGx: number, moveGy: number) {
    const p = this.player;
    p.dashCooldown = p.maxDashCooldown;
    p.dashTimer = 0.2;
    p.invulnTimer = 0.5; // 0.5s I-frame invulnerability
    p.ghostSpawnTimer = 0;
    p.dashDirX =
      Math.hypot(moveGx, moveGy) > 0.1 ? moveGx : Math.cos(p.aimAngle);
    p.dashDirY =
      Math.hypot(moveGx, moveGy) > 0.1 ? moveGy : Math.sin(p.aimAngle);
    p.squashX = 0.74;
    p.squashY = 1.32;

    sound.playDash();
    this.spawnParticles(p.gx, p.gy, 6, 14, '#38bdf8', 3.4);
    this.addFloatingText(p.gx, p.gy, 26, 'I-FRAME', '#38bdf8', 0.85);

    if (this.hasBoon('ember_nova')) {
      this.addShake(6);
      this.spawnParticles(p.gx, p.gy, 8, 24, '#f97316', 4.6);
      for (const en of [...this.dungeon.enemies]) {
        const dx = en.gx - p.gx;
        const dy = en.gy - p.gy;
        const d = Math.hypot(dx, dy);
        if (d <= 2.8) {
          this.damageEnemy(en, 50, dx / (d || 1), dy / (d || 1));
        }
      }
    }
  }

  public performPlayerSkill() {
    const p = this.player;
    if (p.skillCooldown > 0) return;
    p.skillCooldown = p.maxSkillCooldown;
    p.squashX = 1.38;
    p.squashY = 0.7;
    sound.playSkillCast();
    this.addShake(10.0);

    if (p.statueBlessing === 'paladin') {
      p.invulnTimer = Math.max(p.invulnTimer, 1.5);
      p.armor = Math.min(p.maxArmor, p.armor + 25);
      this.addFloatingText(p.gx, p.gy, 34, 'PALADIN AEGIS!', '#fde047', 1.15);
    }

    if (this.selectedClass === 'knight') {
      p.mana = Math.min(p.maxMana, p.mana + 35);
      this.slashes.push({
        gx: p.gx,
        gy: p.gy,
        angle: 0,
        arcSpread: Math.PI * 2,
        radius: 3.6,
        timer: 0.26,
        maxTimer: 0.26,
        color: '#f59e0b',
        coreColor: '#fef08a',
      });
      this.spawnParticles(p.gx, p.gy, 10, 32, '#fde047', 5.2);
      for (const en of [...this.dungeon.enemies]) {
        const d = Math.hypot(en.gx - p.gx, en.gy - p.gy);
        if (d <= 3.7) {
          const dx = (en.gx - p.gx) / (d || 1);
          const dy = (en.gy - p.gy) / (d || 1);
          this.damageEnemy(
            en,
            Math.round(58 * p.damageMultiplier),
            dx * 1.6,
            dy * 1.6
          );
          en.state = 'recover';
          en.stateTimer = 1.1;
        }
      }
    } else if (this.selectedClass === 'pyromancer') {
      p.mana = Math.min(p.maxMana, p.mana + 45);
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        this.spawnProjectile({
          fromPlayer: true,
          gx: p.gx,
          gy: p.gy,
          vx: Math.cos(ang) * 10.5,
          vy: Math.sin(ang) * 10.5,
          damage: Math.round(44 * p.damageMultiplier),
          radius: 0.45,
          maxLife: 0.85,
          color: '#f97316',
          coreColor: '#fef08a',
          piercing: true,
          explosive: true,
        });
      }
      this.spawnParticles(p.gx, p.gy, 10, 28, '#f97316', 4.6);
    } else if (this.selectedClass === 'alchemist') {
      // Cyber Alchemist Skill: Alchemical Venom & Cryo Nova + Shield & Mana Regen
      p.armor = Math.min(p.maxArmor, p.armor + 15);
      p.mana = Math.min(p.maxMana, p.mana + 35);
      for (let i = 0; i < 6; i++) {
        const ang = p.aimAngle + ((i - 2.5) / 6) * Math.PI * 1.6;
        this.spawnProjectile({
          fromPlayer: true,
          gx: p.gx,
          gy: p.gy,
          vx: Math.cos(ang) * 11.5,
          vy: Math.sin(ang) * 11.5,
          damage: Math.round(46 * p.damageMultiplier),
          radius: 0.48,
          maxLife: 0.78,
          color: '#84cc16',
          coreColor: '#ecfccb',
          piercing: true,
          explosive: true,
          chainLightning: true,
        });
      }
      this.spawnParticles(p.gx, p.gy, 10, 30, '#84cc16', 4.8);
      this.addFloatingText(p.gx, p.gy, 30, 'VENOM CONCOCTION!', '#a3e635', 1.15);
    } else if (this.selectedClass === 'necromancer') {
      // Soul Necromancer Skill: Abyssal Soul Harvest (+15 HP, +40 MP & 10 Soul Bolts)
      p.hp = Math.min(p.maxHp, p.hp + 15);
      p.mana = Math.min(p.maxMana, p.mana + 40);
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2 + this.globalTime;
        this.spawnProjectile({
          fromPlayer: true,
          gx: p.gx,
          gy: p.gy,
          vx: Math.cos(ang) * 11.2,
          vy: Math.sin(ang) * 11.2,
          damage: Math.round(52 * p.damageMultiplier),
          radius: 0.45,
          maxLife: 0.9,
          color: '#c084fc',
          coreColor: '#38bdf8',
          piercing: true,
          chainLightning: true,
        });
      }
      this.spawnParticles(p.gx, p.gy, 10, 34, '#c084fc', 5.0);
      this.addFloatingText(p.gx, p.gy, 30, 'SOUL HARVEST!', '#e879f9', 1.2);
    } else if (this.selectedClass === 'berserker') {
      // Blood Berserker Skill: Ragnarok Blood Rage (Giant 360 Slash + 6 Crimson Waves)
      p.invulnTimer = Math.max(p.invulnTimer, 0.9);
      p.dashCooldown = 0;
      this.slashes.push({
        gx: p.gx,
        gy: p.gy,
        angle: p.aimAngle,
        radius: 3.9,
        arcSpread: Math.PI * 2,
        timer: 0.3,
        maxTimer: 0.3,
        color: '#f43f5e',
        coreColor: '#fef08a',
      });
      for (const en of [...this.dungeon.enemies]) {
        const d = Math.hypot(en.gx - p.gx, en.gy - p.gy);
        if (d <= 4.1) {
          this.damageEnemy(
            en,
            Math.round(92 * p.damageMultiplier),
            (en.gx - p.gx) / (d || 1),
            (en.gy - p.gy) / (d || 1)
          );
        }
      }
      for (let i = -2; i <= 3; i++) {
        const ang = p.aimAngle + i * 0.25;
        this.spawnProjectile({
          fromPlayer: true,
          gx: p.gx,
          gy: p.gy,
          vx: Math.cos(ang) * 13.5,
          vy: Math.sin(ang) * 13.5,
          damage: Math.round(56 * p.damageMultiplier),
          radius: 0.5,
          maxLife: 0.72,
          color: '#f43f5e',
          coreColor: '#fde047',
          piercing: true,
          explosive: true,
        });
      }
      this.spawnParticles(p.gx, p.gy, 10, 36, '#f43f5e', 5.2);
      this.addFloatingText(p.gx, p.gy, 30, 'RAGNAROK RAGE!', '#fb7185', 1.25);
    } else {
      p.dashCooldown = 0;
      for (let i = -2; i <= 3; i++) {
        const ang = p.aimAngle + i * 0.18;
        this.spawnProjectile({
          fromPlayer: true,
          gx: p.gx,
          gy: p.gy,
          vx: Math.cos(ang) * 14.5,
          vy: Math.sin(ang) * 14.5,
          damage: Math.round(40 * p.damageMultiplier),
          radius: 0.38,
          maxLife: 0.65,
          color: '#10b981',
          coreColor: '#a7f3d0',
          piercing: true,
        });
      }
      this.spawnParticles(p.gx, p.gy, 10, 22, '#10b981', 4.2);
    }
  }

  public usePotion() {
    const p = this.player;
    if (p.potions <= 0) return;
    p.potions--;
    const heal = Math.round(p.maxHp * 0.48);
    p.hp = Math.min(p.maxHp, p.hp + heal);
    p.mana = Math.min(p.maxMana, p.mana + 65);
    sound.playPickup('potion');
    this.spawnParticles(p.gx, p.gy, 12, 18, '#f43f5e', 3.2);
    this.addFloatingText(
      p.gx,
      p.gy,
      24,
      `+${heal} HP / +65 MP`,
      '#4ade80',
      1.15
    );
    this.syncHud();
  }

  // Contextual Interaction
  public tryInteract() {
    const p = this.player;

    let closest: Interactable | null = null;
    let bestD = 2.0;
    for (const item of this.dungeon.interactables) {
      if (item.opened) continue;
      if (
        item.type === 'gold' ||
        item.type === 'mana_orb' ||
        item.type === 'exp_gem' ||
        item.type === 'potion'
      )
        continue;
      const d = Math.hypot(item.gx - p.gx, item.gy - p.gy);
      if (d < bestD) {
        bestD = d;
        closest = item;
      }
    }

    if (closest) {
      if (closest.type === 'lobby_hero' && closest.heroId) {
        this.selectHeroClass(closest.heroId);
        sound.playLevelUp();
        this.spawnParticles(
          p.gx,
          p.gy,
          10,
          20,
          HERO_CLASSES[closest.heroId].accentColor,
          3.8
        );
        this.addFloatingText(
          p.gx,
          p.gy,
          28,
          HERO_CLASSES[closest.heroId].name.toUpperCase(),
          HERO_CLASSES[closest.heroId].accentColor,
          1.2
        );
        return;
      }

      if (closest.type === 'lobby_pet') {
        const order: PetId[] = ['cat', 'mini_slime', 'baby_dragon'];
        const nextIdx = (order.indexOf(this.selectedPet) + 1) % order.length;
        this.selectPet(order[nextIdx]);
        return;
      }

      if (closest.type === 'dungeon_gate') {
        sound.playStairsDescend();
        this.loadFloor(1);
        return;
      }

      if (closest.type === 'chest') {
        closest.opened = true;
        sound.playPickup('shrine');
        this.spawnParticles(closest.gx, closest.gy, 10, 24, '#fde047', 4.2);

        const wpnId =
          WEAPON_POOL[Math.floor(Math.random() * WEAPON_POOL.length)];
        this.dungeon.interactables.push({
          id: this.nextInteractId++,
          type: 'weapon_drop',
          gx: closest.gx,
          gy: closest.gy + 0.55,
          opened: false,
          value: 0,
          bobPhase: 0,
          weaponId: wpnId,
          label: WEAPONS[wpnId].name,
        });
        this.addFloatingText(
          closest.gx,
          closest.gy,
          24,
          WEAPONS[wpnId].name.toUpperCase(),
          WEAPONS[wpnId].rarityColor,
          1.15
        );
        this.syncHud();
        return;
      }

      if (closest.type === 'weapon_drop' && closest.weaponId) {
        const newWeaponId = closest.weaponId;
        if (!p.weapons[1]) {
          p.weapons[1] = newWeaponId;
          p.activeWeaponIdx = 1;
          closest.opened = true;
        } else {
          const oldWeaponId = p.weapons[p.activeWeaponIdx]!;
          p.weapons[p.activeWeaponIdx] = newWeaponId;
          closest.weaponId = oldWeaponId;
          closest.label = WEAPONS[oldWeaponId].name;
        }
        sound.playWeaponSwitch();
        this.addFloatingText(
          p.gx,
          p.gy,
          26,
          `EQUIPPED ${WEAPONS[newWeaponId].name.toUpperCase()}`,
          WEAPONS[newWeaponId].rarityColor,
          1.15
        );
        this.syncHud();
        return;
      }

      if (closest.type === 'shop_item') {
        if (p.gold < closest.value) {
          this.addFloatingText(
            closest.gx,
            closest.gy,
            24,
            `NEED ${closest.value}G`,
            '#f43f5e',
            1.1
          );
          return;
        }
        p.gold -= closest.value;
        closest.opened = true;
        sound.playLevelUp();

        if (closest.shopKind === 'weapon' && closest.weaponId) {
          if (!p.weapons[1]) {
            p.weapons[1] = closest.weaponId;
            p.activeWeaponIdx = 1;
          } else {
            p.weapons[p.activeWeaponIdx] = closest.weaponId;
          }
          this.addFloatingText(
            p.gx,
            p.gy,
            26,
            `BOUGHT ${WEAPONS[closest.weaponId].name.toUpperCase()}`,
            '#fde047',
            1.15
          );
        } else if (closest.shopKind === 'potion') {
          p.hp = Math.min(p.maxHp, p.hp + Math.round(p.maxHp * 0.5));
          p.potions = Math.min(p.maxPotions, p.potions + 1);
          this.addFloatingText(p.gx, p.gy, 26, '+50% HP & VIAL', '#4ade80', 1.15);
        } else if (closest.shopKind === 'mana_pack') {
          p.mana = Math.min(p.maxMana, p.mana + 120);
          this.addFloatingText(p.gx, p.gy, 26, '+120 MANA', '#60a5fa', 1.15);
        }
        this.syncHud();
        return;
      }

      if (closest.type === 'statue') {
        if (p.gold < closest.value) {
          this.addFloatingText(
            closest.gx,
            closest.gy,
            24,
            `NEED ${closest.value}G`,
            '#f43f5e',
            1.1
          );
          return;
        }
        p.gold -= closest.value;
        closest.opened = true;
        p.statueBlessing = closest.statueBuffId || 'paladin';
        sound.playLevelUp();
        this.spawnParticles(closest.gx, closest.gy, 12, 28, '#a855f7', 4.5);
        this.addFloatingText(
          p.gx,
          p.gy,
          28,
          'BLESSED BY STATUE!',
          '#d8b4fe',
          1.25
        );
        this.syncHud();
        return;
      }
    }

    const dPortal = Math.hypot(
      this.dungeon.stairsGx - p.gx,
      this.dungeon.stairsGy - p.gy
    );
    if (dPortal <= 2.0 && this.portalOpen) {
      this.enterPortal();
    }
  }

  private enterPortal() {
    if (this.floorNum >= MAX_FLOORS) {
      const clearGems = Math.round(
        100 * DIFFICULTIES[this.selectedDifficulty].gemMult
      );
      this.soulGemsEarnedThisRun += clearGems;
      this.onEarnSoulGems?.(clearGems, 0, true);
      sound.playGameOver(true);
      this.setGameState('VICTORY');
    } else {
      sound.playStairsDescend();
      this.loadFloor(this.floorNum + 1);
    }
  }

  private triggerBoonSelection() {
    const shuffled = [...BOON_POOL]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    this.onBoonPrompt(shuffled);
    this.setGameState('BOON_SELECT');
  }

  // Hit Feedback: 0.1s Red Flash + Smooth Knockback + Chain Lightning + Boss Enrage
  private damageEnemy(
    en: Enemy,
    baseDamage: number,
    knockDirX: number,
    knockDirY: number
  ) {
    const isCrit = Math.random() < this.player.critChance;
    const finalDmg = Math.round(baseDamage * (isCrit ? 1.65 : 1));
    en.hp -= finalDmg;
    en.hitFlash = 0.11; // 0.1s Red Flash
    en.squashX = 1.32;
    en.squashY = 0.72;
    this.player.damageDealt += finalDmg;

    // Training dummy never dies—just shows DPS numbers and bounces!
    if (en.type === 'dummy') {
      en.hp = en.maxHp;
      sound.playHit(isCrit, false);
      this.spawnParticles(en.gx, en.gy, 10, 6, '#fde047', 2.4);
      this.addFloatingText(
        en.gx,
        en.gy,
        24,
        isCrit ? `${finalDmg}!` : `${finalDmg}`,
        isCrit ? '#fde047' : '#f8fafc',
        isCrit ? 1.25 : 0.98
      );
      return;
    }

    if (!en.aggroed) {
      en.aggroed = true;
      en.alertTimer = 0.85;
      en.state = 'chase';
    }

    // Check Boss Enrage Phase (<50% HP)
    if (en.isBoss && !en.enraged && en.hp > 0 && en.hp <= en.maxHp * 0.5) {
      en.enraged = true;
      en.speed *= 1.25;
      en.windupDuration *= 0.8;
      this.addShake(9);
      this.spawnParticles(en.gx, en.gy, 12, 34, '#f43f5e', 5.2);
      this.addFloatingText(
        en.gx,
        en.gy,
        36,
        'BOSS ENRAGED!',
        '#f43f5e',
        1.35
      );
    }

    const kbForce = en.isBoss ? 2.0 : en.isElite ? 3.8 : 5.8;
    en.vx = knockDirX * kbForce;
    en.vy = knockDirY * kbForce;

    sound.playHit(isCrit, en.isBoss);
    this.spawnParticles(
      en.gx,
      en.gy,
      10,
      isCrit ? 15 : 8,
      en.type === 'slime' ? '#34d399' : '#f43f5e',
      isCrit ? 3.6 : 2.6
    );
    this.addFloatingText(
      en.gx,
      en.gy,
      24,
      isCrit ? `${finalDmg}!` : `${finalDmg}`,
      isCrit ? '#fde047' : '#f8fafc',
      isCrit ? 1.28 : 0.96
    );

    const wpn = this.getActiveWeapon();
    if (this.hasBoon('chain_arc') || wpn.chainLightning) {
      this.triggerChainLightning(en, Math.round(finalDmg * 0.65));
    }

    if (en.hp <= 0) {
      this.killEnemy(en);
    }
  }

  private triggerChainLightning(source: Enemy, arcDmg: number) {
    for (const other of this.dungeon.enemies) {
      if (other.id === source.id || other.hp <= 0) continue;
      const d = Math.hypot(other.gx - source.gx, other.gy - source.gy);
      if (d <= 4.5) {
        other.hp -= arcDmg;
        other.hitFlash = 0.1;
        this.player.damageDealt += arcDmg;

        const s1 = this.gridToWorld(source.gx, source.gy, 16);
        const s2 = this.gridToWorld(other.gx, other.gy, 16);
        this.lightningBolts.push({
          x1: s1.x,
          y1: s1.y,
          x2: s2.x,
          y2: s2.y,
          timer: 0.18,
          maxTimer: 0.18,
        });

        this.spawnParticles(other.gx, other.gy, 12, 8, '#38bdf8', 3.0);
        this.addFloatingText(other.gx, other.gy, 22, `${arcDmg}`, '#38bdf8', 0.9);
        if (other.hp <= 0 && other.type !== 'dummy') {
          this.killEnemy(other);
        }
        break;
      }
    }
  }

  private killEnemy(en: Enemy) {
    const idx = this.dungeon.enemies.findIndex((e) => e.id === en.id);
    if (idx === -1) return;
    this.dungeon.enemies.splice(idx, 1);

    this.player.kills++;
    this.hitstopTimer = en.isBoss ? 0.11 : 0.03;
    this.addShake(en.isBoss ? 12.0 : en.isElite ? 6.5 : 4.2);

    // Award Soul Gems for defeating foes!
    const gemMult = DIFFICULTIES[this.selectedDifficulty].gemMult;
    const gemsEarned = Math.round(
      (en.isBoss ? 40 : en.isElite ? 12 : 4) * gemMult
    );
    this.soulGemsEarnedThisRun += gemsEarned;
    this.onEarnSoulGems?.(gemsEarned, 1, false);

    // Burst death particles
    this.spawnParticles(
      en.gx,
      en.gy,
      10,
      en.isBoss ? 48 : en.isElite ? 30 : 20,
      en.type === 'slime' ? '#10b981' : '#e11d48',
      en.isBoss ? 5.8 : 4.0
    );
    this.spawnParticles(
      en.gx,
      en.gy,
      14,
      en.isBoss ? 24 : 10,
      '#fde047',
      3.5
    );

    if (this.hasBoon('vampiric_edge')) {
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + 10);
      this.player.mana = Math.min(this.player.maxMana, this.player.mana + 18);
      this.addFloatingText(
        this.player.gx,
        this.player.gy,
        24,
        '+10 HP / +18 MP',
        '#4ade80',
        0.92
      );
    }

    // Spawn EXP Gems, Mana Orbs, and Gold Coins
    const gemCount = en.isBoss ? 5 : en.isElite ? 3 : 2;
    for (let i = 0; i < gemCount; i++) {
      this.dungeon.interactables.push({
        id: this.nextInteractId++,
        type: 'exp_gem',
        gx: en.gx + (Math.random() - 0.5) * 0.9,
        gy: en.gy + (Math.random() - 0.5) * 0.9,
        opened: false,
        value: en.isBoss ? 26 : 15,
        bobPhase: Math.random() * 6,
      });
    }

    const manaCount = en.isBoss ? 5 : en.isElite ? 3 : 2;
    for (let i = 0; i < manaCount; i++) {
      this.dungeon.interactables.push({
        id: this.nextInteractId++,
        type: 'mana_orb',
        gx: en.gx + (Math.random() - 0.5) * 1.0,
        gy: en.gy + (Math.random() - 0.5) * 1.0,
        opened: false,
        value: 16,
        bobPhase: Math.random() * 6,
      });
    }

    this.dungeon.interactables.push({
      id: this.nextInteractId++,
      type: 'gold',
      gx: en.gx + (Math.random() - 0.5) * 0.8,
      gy: en.gy + (Math.random() - 0.5) * 0.8,
      opened: false,
      value: en.isBoss ? 50 : en.isElite ? 22 : 9 + this.floorNum * 3,
      bobPhase: Math.random() * 6,
    });
  }

  private damagePlayer(amount: number) {
    const p = this.player;
    if (p.invulnTimer > 0 || this.gameState !== 'PLAYING') return;

    p.invulnTimer = 0.5;
    p.armorRegenTimer = 0;
    p.hitFlash = 0.2;
    p.squashX = 1.32;
    p.squashY = 0.68;

    let remaining = amount;
    if (p.armor > 0) {
      const absorbed = Math.min(p.armor, remaining);
      p.armor -= absorbed;
      remaining -= absorbed;
    }
    p.hp = Math.max(0, p.hp - remaining);

    sound.playPlayerHurt();
    this.hitstopTimer = 0.055;
    this.addShake(11.5);
    this.spawnParticles(p.gx, p.gy, 12, 16, '#f43f5e', 3.8);
    this.addFloatingText(p.gx, p.gy, 26, `-${amount}`, '#f43f5e', 1.2);

    if (p.hp <= 0) {
      sound.playGameOver(false);
      this.setGameState('GAME_OVER');
    }
    this.syncHud();
  }

  private updateEnemies(dt: number) {
    const p = this.player;

    for (const en of this.dungeon.enemies) {
      en.hitFlash = Math.max(0, en.hitFlash - dt);
      en.alertTimer = Math.max(0, en.alertTimer - dt);
      en.squashX += (1 - en.squashX) * 12 * dt;
      en.squashY += (1 - en.squashY) * 12 * dt;

      if (en.type === 'dummy') continue;

      if (Math.hypot(en.vx, en.vy) > 0.05) {
        const kx = en.gx + en.vx * dt;
        const ky = en.gy + en.vy * dt;
        if (this.isWalkable(kx, en.gy)) en.gx = kx;
        if (this.isWalkable(en.gx, ky)) en.gy = ky;
        en.vx *= Math.pow(0.002, dt);
        en.vy *= Math.pow(0.002, dt);
      } else {
        en.vx = 0;
        en.vy = 0;
      }

      const dx = p.gx - en.gx;
      const dy = p.gy - en.gy;
      const dist = Math.hypot(dx, dy);

      if (!en.aggroed) {
        en.hopZ = 0;
        const tileVisible =
          this.dungeon.tiles[Math.floor(en.gy)]?.[Math.floor(en.gx)]?.visible;
        if (dist <= en.detectRange && tileVisible) {
          en.aggroed = true;
          en.alertTimer = 0.9;
          en.state = 'chase';
          en.squashX = 0.8;
          en.squashY = 1.28;
          sound.playAggroAlert();
        }
        continue;
      }

      if (Math.abs(dx) > 0.05) {
        en.facing = dx >= 0 ? 1 : -1;
      }

      if (en.state === 'chase') {
        en.animPhase += dt * (en.type === 'slime' ? 12 : 10);
        en.hopZ =
          Math.abs(Math.sin(en.animPhase)) *
          (en.type === 'slime' ? 11.5 : 4.5);

        if (dist <= en.attackRange) {
          en.state = 'windup';
          en.stateTimer = 0;
          en.targetGx = p.gx;
          en.targetGy = p.gy;
          en.hopZ = 0;
        } else {
          const dirX = dx / (dist || 1);
          const dirY = dy / (dist || 1);
          const nx = en.gx + dirX * en.speed * dt;
          const ny = en.gy + dirY * en.speed * dt;
          if (this.isWalkable(nx, en.gy)) en.gx = nx;
          if (this.isWalkable(en.gx, ny)) en.gy = ny;
        }
      } else if (en.state === 'windup') {
        en.stateTimer += dt;
        const prog = Math.min(1, en.stateTimer / en.windupDuration);
        en.squashX = 1 + Math.sin(prog * Math.PI * 4) * 0.14;
        en.squashY = 1 - Math.sin(prog * Math.PI * 4) * 0.14;

        if ((en.type === 'goblin' || en.type === 'necro_mage') && prog < 0.6) {
          en.targetGx = p.gx;
          en.targetGy = p.gy;
        }

        if (en.type === 'goblin' || en.type === 'necro_mage') {
          this.telegraphs.push({
            id: en.id,
            shape: 'line',
            gx: en.gx,
            gy: en.gy,
            endGx: en.targetGx,
            endGy: en.targetGy,
            radius: 0.25,
            progress: prog,
            color: en.type === 'necro_mage' ? '#c084fc' : '#a855f7',
          });
        } else {
          const rad =
            en.type === 'warden_boss'
              ? 2.4
              : en.type === 'golem'
              ? 1.95
              : 1.25;
          const cx = en.type === 'slime' ? en.targetGx : en.gx;
          const cy = en.type === 'slime' ? en.targetGy : en.gy;
          this.telegraphs.push({
            id: en.id,
            shape: 'circle',
            gx: cx,
            gy: cy,
            radius: rad,
            progress: prog,
            color: en.isBoss ? '#f43f5e' : '#10b981',
          });
        }

        if (en.stateTimer >= en.windupDuration) {
          this.executeEnemyAttack(en);
          en.state = 'recover';
          en.stateTimer = en.isBoss ? 0.6 : 0.52;
        }
      } else if (en.state === 'recover') {
        en.stateTimer -= dt;
        if (en.stateTimer <= 0) {
          en.state = 'chase';
        }
      }
    }
  }

  private executeEnemyAttack(en: Enemy) {
    const p = this.player;
    en.squashX = 0.78;
    en.squashY = 1.26;

    if (en.type === 'slime') {
      if (this.isWalkable(en.targetGx, en.targetGy)) {
        en.gx = en.targetGx;
        en.gy = en.targetGy;
      }
      this.spawnParticles(en.gx, en.gy, 4, 8, '#34d399', 2.2);
      if (Math.hypot(p.gx - en.gx, p.gy - en.gy) <= 1.35) {
        this.damagePlayer(en.damage);
      }
    } else if (en.type === 'goblin') {
      const dx = en.targetGx - en.gx;
      const dy = en.targetGy - en.gy;
      const baseAng = Math.atan2(dy, dx);
      sound.playSlash(false);
      const shots = en.isElite ? 2 : 1;
      for (let i = 0; i < shots; i++) {
        const ang = baseAng + (shots > 1 ? (i - 0.5) * 0.18 : 0);
        this.spawnProjectile({
          fromPlayer: false,
          gx: en.gx,
          gy: en.gy,
          vx: Math.cos(ang) * 8.6,
          vy: Math.sin(ang) * 8.6,
          damage: en.damage,
          radius: 0.36,
          maxLife: 1.5,
          color: '#a855f7',
          coreColor: '#fde047',
        });
      }
    } else if (en.type === 'necro_mage') {
      // Skeleton Necro Mage fires a 3-way fan of dark soul orbs!
      const dx = en.targetGx - en.gx;
      const dy = en.targetGy - en.gy;
      const baseAng = Math.atan2(dy, dx);
      sound.playSlash(false);
      const count = en.isElite ? 5 : 3;
      for (let i = 0; i < count; i++) {
        const ang = baseAng + (i - (count - 1) / 2) * 0.24;
        this.spawnProjectile({
          fromPlayer: false,
          gx: en.gx,
          gy: en.gy,
          vx: Math.cos(ang) * 7.8,
          vy: Math.sin(ang) * 7.8,
          damage: en.damage,
          radius: 0.38,
          maxLife: 1.65,
          color: '#9333ea',
          coreColor: '#38bdf8',
        });
      }
    } else if (en.type === 'golem') {
      this.addShake(7);
      sound.playHit(false, true);
      this.spawnParticles(en.gx, en.gy, 6, 24, '#f97316', 4.5);
      if (Math.hypot(p.gx - en.gx, p.gy - en.gy) <= 2.05) {
        this.damagePlayer(en.damage);
      }
      if (en.isElite) {
        for (let i = 0; i < 4; i++) {
          const ang = (i / 4) * Math.PI * 2;
          this.spawnProjectile({
            fromPlayer: false,
            gx: en.gx,
            gy: en.gy,
            vx: Math.cos(ang) * 6.5,
            vy: Math.sin(ang) * 6.5,
            damage: Math.round(en.damage * 0.7),
            radius: 0.38,
            maxLife: 1.2,
            color: '#f97316',
            coreColor: '#fde047',
          });
        }
      }
    } else if (en.type === 'warden_boss') {
      this.addShake(9.5);
      sound.playHit(true, true);
      this.spawnParticles(en.gx, en.gy, 8, 30, '#f43f5e', 5.2);
      if (Math.hypot(p.gx - en.gx, p.gy - en.gy) <= 2.5) {
        this.damagePlayer(en.damage);
      }
      // Soul Knight Boss radial bullet ring (12 spiral bolts when Enraged!)
      const bulletCount = en.enraged ? 12 : 8;
      for (let i = 0; i < bulletCount; i++) {
        const ang = (i / bulletCount) * Math.PI * 2 + this.globalTime * 1.4;
        this.spawnProjectile({
          fromPlayer: false,
          gx: en.gx,
          gy: en.gy,
          vx: Math.cos(ang) * (en.enraged ? 7.8 : 6.8),
          vy: Math.sin(ang) * (en.enraged ? 7.8 : 6.8),
          damage: Math.round(en.damage * 0.75),
          radius: 0.38,
          maxLife: 1.7,
          color: en.enraged ? '#f43f5e' : '#e11d48',
          coreColor: '#fde047',
        });
      }
    }
  }

  private spawnProjectile(opts: {
    fromPlayer: boolean;
    gx: number;
    gy: number;
    vx: number;
    vy: number;
    damage: number;
    radius: number;
    maxLife: number;
    color: string;
    coreColor: string;
    piercing?: boolean;
    explosive?: boolean;
    chainLightning?: boolean;
  }) {
    const slot = this.projectiles.find((p) => !p.active);
    if (!slot) return;
    slot.active = true;
    slot.fromPlayer = opts.fromPlayer;
    slot.gx = opts.gx;
    slot.gy = opts.gy;
    slot.gz = 14;
    slot.vx = opts.vx;
    slot.vy = opts.vy;
    slot.damage = opts.damage;
    slot.radius = opts.radius;
    slot.life = opts.maxLife;
    slot.maxLife = opts.maxLife;
    slot.color = opts.color;
    slot.coreColor = opts.coreColor;
    slot.piercing = opts.piercing;
    slot.explosive = opts.explosive;
    slot.chainLightning = opts.chainLightning;
  }

  private updateProjectiles(dt: number) {
    for (const proj of this.projectiles) {
      if (!proj.active) continue;
      proj.life -= dt;
      if (proj.life <= 0) {
        proj.active = false;
        continue;
      }

      proj.gx += proj.vx * dt;
      proj.gy += proj.vy * dt;

      if (!this.isWalkable(proj.gx, proj.gy)) {
        proj.active = false;
        this.spawnParticles(proj.gx, proj.gy, 12, 7, proj.color, 2.4);
        continue;
      }

      if (proj.fromPlayer) {
        // Check destructible props collision
        for (const prop of this.dungeon.props) {
          if (prop.hp <= 0) continue;
          if (Math.hypot(prop.gx - proj.gx, prop.gy - proj.gy) <= proj.radius + 0.4) {
            this.damageProp(prop, proj.damage);
            if (!proj.piercing) {
              proj.active = false;
              break;
            }
          }
        }
        if (!proj.active) continue;

        for (const en of [...this.dungeon.enemies]) {
          const d = Math.hypot(en.gx - proj.gx, en.gy - proj.gy);
          if (d <= proj.radius + (en.isBoss ? 0.65 : 0.45)) {
            const len = Math.hypot(proj.vx, proj.vy) || 1;
            this.damageEnemy(
              en,
              proj.damage,
              proj.vx / len,
              proj.vy / len
            );
            if (proj.explosive) {
              this.spawnParticles(proj.gx, proj.gy, 12, 16, '#f97316', 3.6);
            }
            if (!proj.piercing) {
              proj.active = false;
              break;
            }
          }
        }
      } else {
        const d = Math.hypot(
          this.player.gx - proj.gx,
          this.player.gy - proj.gy
        );
        if (d <= proj.radius + 0.38) {
          this.damagePlayer(proj.damage);
          proj.active = false;
        }
      }
    }
  }

  private spawnParticles(
    gx: number,
    gy: number,
    gz: number,
    count: number,
    color: string,
    speedScale: number
  ) {
    let spawned = 0;
    for (const pt of this.particles) {
      if (pt.active) continue;
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.5 + Math.random() * 1.2) * speedScale;
      pt.active = true;
      pt.gx = gx + (Math.random() - 0.5) * 0.25;
      pt.gy = gy + (Math.random() - 0.5) * 0.25;
      pt.gz = gz;
      pt.vx = Math.cos(ang) * spd;
      pt.vy = Math.sin(ang) * spd;
      pt.vz = 38 + Math.random() * 58;
      pt.size = 3 + Math.floor(Math.random() * 3);
      pt.color = color;
      pt.maxLife = 0.3 + Math.random() * 0.28;
      pt.life = pt.maxLife;
      pt.gravity = 150;
      spawned++;
      if (spawned >= count) break;
    }
  }

  private addFloatingText(
    gx: number,
    gy: number,
    gz: number,
    text: string,
    color: string,
    scale: number = 1
  ) {
    if (!this.settings.showDamageNumbers && /^[0-9!+-]+$/.test(text)) {
      return;
    }
    this.floatingTexts.push({
      id: this.nextTextId++,
      gx: gx + (Math.random() - 0.5) * 0.3,
      gy: gy + (Math.random() - 0.5) * 0.3,
      gz,
      text,
      color,
      life: 0.8,
      maxLife: 0.8,
      scale,
    });
  }

  private updateEffects(dt: number) {
    for (const pt of this.particles) {
      if (!pt.active) continue;
      pt.life -= dt;
      if (pt.life <= 0) {
        pt.active = false;
        continue;
      }
      pt.gx += pt.vx * dt;
      pt.gy += pt.vy * dt;
      pt.gz += pt.vz * dt;
      pt.vz -= pt.gravity * dt;
      if (pt.gz < 0) {
        pt.gz = 0;
        pt.vx *= 0.55;
        pt.vy *= 0.55;
      }
    }

    for (let i = this.slashes.length - 1; i >= 0; i--) {
      this.slashes[i].timer -= dt;
      if (this.slashes[i].timer <= 0) {
        this.slashes.splice(i, 1);
      }
    }

    for (let i = this.ghostTrails.length - 1; i >= 0; i--) {
      this.ghostTrails[i].alpha -= dt * 2.6;
      if (this.ghostTrails[i].alpha <= 0) {
        this.ghostTrails.splice(i, 1);
      }
    }

    for (let i = this.lightningBolts.length - 1; i >= 0; i--) {
      this.lightningBolts[i].timer -= dt;
      if (this.lightningBolts[i].timer <= 0) {
        this.lightningBolts.splice(i, 1);
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life -= dt;
      ft.gz += 28 * dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private addShake(amount: number) {
    if (this.settings.shakeIntensity === 'off') return;
    const mult = this.settings.shakeIntensity === 'high' ? 1.35 : 1.0;
    this.shakeMag = Math.min(20, this.shakeMag + amount * mult);
  }

  private updateCamera(dt: number) {
    const targetScr = this.gridToWorld(this.player.gx, this.player.gy, 10);
    this.camX += (targetScr.x - this.camX) * 9.5 * dt;
    this.camY += (targetScr.y - this.camY) * 9.5 * dt;

    if (this.shakeMag > 0.1) {
      this.shakeX = (Math.random() * 2 - 1) * this.shakeMag;
      this.shakeY = (Math.random() * 2 - 1) * this.shakeMag;
      this.shakeMag *= Math.pow(0.012, dt);
    } else {
      this.shakeMag = 0;
      this.shakeX = 0;
      this.shakeY = 0;
    }
  }

  private revealFogAround(cx: number, cy: number, radius: number) {
    for (let y = 0; y < this.dungeon.height; y++) {
      for (let x = 0; x < this.dungeon.width; x++) {
        const tile = this.dungeon.tiles[y][x];
        const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (d <= radius) {
          tile.explored = true;
          tile.visible = true;
        } else {
          tile.visible = false;
        }
      }
    }
  }

  private syncHud() {
    const p = this.player;
    const boss = this.dungeon.enemies.find((e) => e.isBoss);
    const curRoom = this.getCurrentRoom(p.gx, p.gy);

    let promptText: string | null = null;
    let promptSubtext: string | null = null;

    for (const item of this.dungeon.interactables) {
      if (item.opened) continue;
      const d = Math.hypot(item.gx - p.gx, item.gy - p.gy);
      if (d <= 1.85) {
        if (item.type === 'lobby_hero' && item.heroId) {
          const cfg = HERO_CLASSES[item.heroId];
          promptText = `Play as ${cfg.name} (Tap / E)`;
          promptSubtext = `${cfg.skillName} · HP ${cfg.maxHp} · MP ${cfg.maxMana}`;
        } else if (item.type === 'lobby_pet') {
          promptText = `Switch Pet: ${PETS[this.selectedPet].name} (Tap / E)`;
          promptSubtext = PETS[this.selectedPet].role;
        } else if (item.type === 'dungeon_gate') {
          promptText = `Enter Dungeon 1-1 (${DIFFICULTIES[this.selectedDifficulty].name})`;
        } else if (item.type === 'chest') {
          promptText = `Open ${item.label || 'Weapon Chest'} (Tap / E)`;
        } else if (item.type === 'weapon_drop' && item.weaponId) {
          const w = WEAPONS[item.weaponId];
          promptText = `Equip ${w.name} (Tap / E)`;
          promptSubtext = `DMG ${w.damage} · ${w.manaCost} Mana · ${w.description}`;
        } else if (item.type === 'shop_item') {
          promptText = `Buy ${item.label} — ${item.value}G (Tap / E)`;
          if (item.weaponId) {
            const w = WEAPONS[item.weaponId];
            promptSubtext = `DMG ${w.damage} · ${w.manaCost} Mana · ${w.rarity}`;
          }
        } else if (item.type === 'statue') {
          promptText = `Worship ${item.statueName} — ${item.value}G (Tap / E)`;
          promptSubtext = 'Grants Aegis Shield every time you cast your Skill';
        }
      }
    }

    if (
      !promptText &&
      !this.dungeon.inLivingRoom &&
      Math.hypot(
        this.dungeon.stairsGx - p.gx,
        this.dungeon.stairsGy - p.gy
      ) <= 2.2
    ) {
      promptText = this.portalOpen
        ? this.floorNum >= MAX_FLOORS
          ? 'Enter Victory Portal (Step / E)'
          : `Enter Portal to Stage 1-${this.floorNum + 1}`
        : `Defeat ${this.dungeon.enemies.length} Foes to Unlock Portal`;
    }

    const activeWpn = this.getActiveWeapon();
    const secondId = p.weapons[p.activeWeaponIdx === 0 ? 1 : 0];
    const secondaryWpn = secondId ? WEAPONS[secondId] : null;

    this.onHudUpdate({
      inLivingRoom: this.dungeon.inLivingRoom,
      difficulty: this.selectedDifficulty,
      hp: Math.ceil(p.hp),
      maxHp: p.maxHp,
      armor: Math.floor(p.armor),
      maxArmor: p.maxArmor,
      mana: Math.floor(p.mana),
      maxMana: p.maxMana,
      gold: p.gold,
      soulGemsEarned: this.soulGemsEarnedThisRun,
      floor: this.floorNum,
      maxFloors: MAX_FLOORS,
      level: p.level,
      xp: p.xp,
      xpToNext: p.xpToNext,
      potions: p.potions,
      maxPotions: p.maxPotions,
      kills: p.kills,
      enemiesRemaining: this.dungeon.inLivingRoom
        ? 0
        : this.dungeon.enemies.length,
      portalOpen: this.portalOpen,
      roomLocked: Boolean(curRoom?.locked),
      damageDealt: p.damageDealt,
      heroClass: this.selectedClass,
      skinTier: this.selectedSkinTier,
      petId: this.selectedPet,
      petName: PETS[this.selectedPet].name,
      activeWeapon: activeWpn,
      secondaryWeapon: secondaryWpn,
      statueBlessing: p.statueBlessing,
      dashCooldownRatio: p.dashCooldown / p.maxDashCooldown,
      skillCooldownRatio: p.skillCooldown / p.maxSkillCooldown,
      attackCooldownRatio: p.attackCooldown / p.maxAttackCooldown,
      isInvulnerable: p.invulnTimer > 0,
      activeBoons: p.activeBoons,
      bossActive: Boolean(boss && boss.aggroed),
      bossName: boss ? boss.name : '',
      bossHp: boss ? Math.max(0, boss.hp) : 0,
      bossMaxHp: boss ? boss.maxHp : 1,
      floorCleared: this.portalOpen,
      promptText,
      promptSubtext,
      minimapRooms: this.dungeon.rooms.map((rm) => ({
        id: rm.id,
        gridX: rm.gridX,
        gridY: rm.gridY,
        kind: rm.kind,
        visited: rm.visited,
        cleared: rm.cleared,
        isCurrent: curRoom?.id === rm.id,
      })),
    });
  }

  // ============================================================================
  // UPGRADED TOP-DOWN 2.5D PIXEL-ART RENDERER (Enhanced Floor, Walls, Props & Lighting)
  // ============================================================================
  private render() {
    const ctx = this.ctx;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.fillStyle = '#06080d';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(
      Math.round(w / 2 - this.camX + this.shakeX),
      Math.round(h / 2 - this.camY + this.shakeY)
    );

    // 1. Render Multi-Layered Floor Tiles & Doors
    const minX = Math.max(
      0,
      Math.floor((this.camX - w / 2) / TILE_SIZE) - 2
    );
    const maxX = Math.min(
      this.dungeon.width - 1,
      Math.ceil((this.camX + w / 2) / TILE_SIZE) + 2
    );
    const minY = Math.max(
      0,
      Math.floor((this.camY - h / 2) / TILE_SIZE) - 2
    );
    const maxY = Math.min(
      this.dungeon.height - 1,
      Math.ceil((this.camY + h / 2) / TILE_SIZE) + 2
    );

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const tile = this.dungeon.tiles[y]?.[x];
        if (!tile || !tile.explored || tile.type === 'void') continue;
        if (tile.type === 'wall' || tile.type === 'pillar') continue;

        this.drawFloorTile25D(ctx, tile, x * TILE_SIZE, y * TILE_SIZE);

        // Cast drop shadow on floor directly south of a wall!
        const northTile = this.dungeon.tiles[y - 1]?.[x];
        if (northTile && (northTile.type === 'wall' || northTile.type === 'pillar')) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, 10);
        }
      }
    }

    // 2. Telegraphs & Move Target
    if (this.player.moveTarget && this.gameState === 'PLAYING') {
      const tScr = this.gridToWorld(
        this.player.moveTarget.gx,
        this.player.moveTarget.gy,
        0
      );
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tScr.x, tScr.y, 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const tel of this.telegraphs) {
      this.drawTelegraph25D(ctx, tel);
    }

    // 3. Depth-sorted Entities by Y coordinate (gy)
    const renderList: { depth: number; draw: () => void }[] = [];

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const tile = this.dungeon.tiles[y]?.[x];
        if (!tile || !tile.explored) continue;
        if (
          tile.type === 'wall' ||
          tile.type === 'pillar' ||
          tile.type === 'door_locked'
        ) {
          renderList.push({
            depth: y + 0.9,
            draw: () =>
              this.drawWall25D(ctx, tile, x * TILE_SIZE, y * TILE_SIZE),
          });
        }
      }
    }

    // Destructible Props (Crates & Ancient Vases)
    for (const prop of this.dungeon.props) {
      if (prop.hp <= 0) continue;
      renderList.push({
        depth: prop.gy,
        draw: () => this.drawProp(ctx, prop),
      });
    }

    // Ghost Trails
    for (const gt of this.ghostTrails) {
      renderList.push({
        depth: gt.gy - 0.1,
        draw: () => this.drawGhostTrail(ctx, gt),
      });
    }

    // Interactables
    for (const item of this.dungeon.interactables) {
      if (item.opened && item.type !== 'chest') continue;
      renderList.push({
        depth: item.gy,
        draw: () => this.drawInteractable(ctx, item),
      });
    }

    // Companion Pet
    renderList.push({
      depth: this.pet.gy,
      draw: () => this.drawPet(ctx),
    });

    // Enemies
    for (const en of this.dungeon.enemies) {
      renderList.push({
        depth: en.gy,
        draw: () => this.drawEnemy(ctx, en),
      });
    }

    // Player + Equipped Weapon in Hand
    renderList.push({
      depth: this.player.gy,
      draw: () => this.drawPlayer(ctx),
    });

    // Projectiles
    for (const proj of this.projectiles) {
      if (!proj.active) continue;
      renderList.push({
        depth: proj.gy + 0.2,
        draw: () => this.drawProjectile(ctx, proj),
      });
    }

    renderList.sort((a, b) => a.depth - b.depth);
    for (const item of renderList) {
      item.draw();
    }

    // 4. Fan Slash VFX, Chain Lightning, Particles & Floating Damage Numbers
    for (const sl of this.slashes) {
      this.drawSlash(ctx, sl);
    }

    for (const lb of this.lightningBolts) {
      this.drawLightning(ctx, lb);
    }

    for (const pt of this.particles) {
      if (!pt.active) continue;
      const scr = this.gridToWorld(pt.gx, pt.gy, pt.gz);
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillRect(
        Math.round(scr.x - pt.size / 2),
        Math.round(scr.y - pt.size / 2),
        pt.size,
        pt.size
      );
    }
    ctx.globalAlpha = 1;

    for (const ft of this.floatingTexts) {
      const scr = this.gridToWorld(ft.gx, ft.gy, ft.gz);
      const alpha = Math.min(1, (ft.life / ft.maxLife) * 1.4);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `700 ${Math.round(13 * ft.scale)}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#090b10';
      ctx.strokeText(ft.text, scr.x, scr.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, scr.x, scr.y);
      ctx.restore();
    }

    ctx.restore();
  }

  private drawFloorTile25D(
    ctx: CanvasRenderingContext2D,
    tile: DungeonTile,
    sx: number,
    sy: number
  ) {
    let color = tile.variant % 2 === 0 ? '#1e293b' : '#172030';
    if (tile.type === 'floor_wood') {
      color = tile.variant % 2 === 0 ? '#451a03' : '#3b1502';
    } else if (tile.type === 'floor_carpet') {
      color = '#7f1d1d';
    } else if (tile.type === 'floor_moss') {
      color = '#132a25';
    } else if (tile.type === 'floor_crystal') {
      color = '#172554';
    } else if (tile.type === 'spike_trap') {
      color = '#1e293b';
    } else if (tile.type === 'door_open') {
      color = '#273549';
    } else if (tile.type === 'portal_pedestal') {
      color = '#1e1b4b';
    }

    ctx.fillStyle = color;
    ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);

    // Inner stone slab bevel & mortar lines
    ctx.strokeStyle =
      tile.type === 'floor_carpet'
        ? '#b91c1c'
        : tile.type === 'floor_wood'
        ? '#290f02'
        : '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx, sy, TILE_SIZE, TILE_SIZE);

    // Detailed textures per tile type
    if (tile.type === 'floor') {
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(sx + 2, sy + 2, TILE_SIZE - 4, 2);
      if (tile.variant === 0) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(sx + 9, sy + 10, 6, 3);
        ctx.fillRect(sx + 28, sy + 30, 5, 3);
      } else if (tile.variant === 2) {
        // Subtle stone crack
        ctx.strokeStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(sx + 12, sy + 14);
        ctx.lineTo(sx + 20, sy + 22);
        ctx.lineTo(sx + 16, sy + 30);
        ctx.stroke();
      }
    } else if (tile.type === 'floor_wood') {
      ctx.fillStyle = '#290f02';
      ctx.fillRect(sx, sy + 15, TILE_SIZE, 2);
      ctx.fillRect(sx, sy + 31, TILE_SIZE, 2);
    } else if (tile.type === 'floor_carpet') {
      // Gold embroidered carpet trim
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.strokeRect(sx + 3, sy + 3, TILE_SIZE - 6, TILE_SIZE - 6);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
      ctx.fillRect(sx + 19, sy + 19, 8, 8);
    } else if (tile.type === 'floor_moss') {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(sx + 8, sy + 10, 7, 5);
      ctx.fillRect(sx + 26, sy + 28, 6, 5);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(sx + 10, sy + 11, 3, 2);
    } else if (tile.type === 'floor_crystal') {
      const pulse = 0.55 + Math.sin(this.globalTime * 4 + tile.gx) * 0.35;
      ctx.fillStyle = `rgba(56, 189, 248, ${pulse})`;
      ctx.fillRect(sx + 10, sy + 12, 8, 4);
      ctx.fillRect(sx + 24, sy + 26, 10, 4);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(sx + 12, sy + 13, 3, 2);
    } else if (tile.type === 'spike_trap') {
      // Floor Spike Trap Holes + Animated Iron Spikes
      const spots = [
        [12, 12],
        [32, 12],
        [22, 23],
        [12, 34],
        [32, 34],
      ];
      for (const [ox, oy] of spots) {
        ctx.fillStyle = '#090b10';
        ctx.fillRect(sx + ox - 3, sy + oy - 3, 6, 6);
        if (tile.trapState === 'windup') {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(sx + ox - 2, sy + oy - 2, 4, 4);
        } else if (tile.trapState === 'active') {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(sx + ox - 2, sy + oy - 9, 4, 10);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(sx + ox - 2, sy + oy - 11, 4, 3);
        }
      }
    } else if (tile.type === 'door_open') {
      ctx.fillStyle = '#475569';
      for (let i = 6; i < TILE_SIZE; i += 12) {
        ctx.fillRect(sx + i, sy + 20, 4, 4);
      }
    } else if (tile.type === 'portal_pedestal') {
      const cx = sx + TILE_SIZE / 2;
      const cy = sy + TILE_SIZE / 2;
      if (this.portalOpen) {
        for (let r = 3; r >= 1; r--) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(this.portalAngle * (r % 2 === 0 ? -1.4 : 1.1));
          ctx.strokeStyle =
            r === 3 ? '#9333ea' : r === 2 ? '#c084fc' : '#38bdf8';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 5]);
          ctx.beginPath();
          ctx.arc(0, 0, r * 7, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  private drawWall25D(
    ctx: CanvasRenderingContext2D,
    tile: DungeonTile,
    sx: number,
    sy: number
  ) {
    if (tile.type === 'door_locked') {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
      for (let i = 5; i < TILE_SIZE; i += 10) {
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(sx + i, sy - 10, 5, TILE_SIZE + 6);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(sx + i, sy - 12, 5, 4);
      }
      return;
    }

    const isPillar = tile.type === 'pillar';
    const pad = isPillar ? 6 : 0;
    const x = sx + pad;
    const w = TILE_SIZE - pad * 2;
    const topH = Math.round(TILE_SIZE * 0.62);
    const faceY = sy - WALL_TOP_H + topH;
    const faceH = TILE_SIZE - topH + WALL_TOP_H;

    // 2.5D Top Stone Cap
    ctx.fillStyle = isPillar ? '#475569' : '#334155';
    ctx.fillRect(x, sy - WALL_TOP_H, w, topH);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x + 2, sy - WALL_TOP_H + 2, w - 4, 3);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, sy - WALL_TOP_H, w, topH);

    // 2.5D Front Vertical Brick Face with mortar lines
    ctx.fillStyle = isPillar ? '#1e293b' : '#1e293b';
    ctx.fillRect(x, faceY, w, faceH);

    // Brick course lines
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, faceY + Math.floor(faceH * 0.5), w, 2);
    ctx.fillRect(x + Math.floor(w * 0.5), faceY, 2, Math.floor(faceH * 0.5));
    ctx.fillRect(
      x + Math.floor(w * 0.28),
      faceY + Math.floor(faceH * 0.5),
      2,
      Math.floor(faceH * 0.5)
    );

    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(x, faceY, w, faceH);

    if (tile.hasTorch) {
      const flicker = Math.sin(this.globalTime * 16 + tile.gx * 3) * 2;
      const tx = sx + TILE_SIZE / 2;
      const ty = sy + 6;

      // Warm radial torchlight halo
      const grad = ctx.createRadialGradient(
        tx,
        ty - 3,
        2,
        tx,
        ty - 3,
        42 + flicker * 2
      );
      grad.addColorStop(0, 'rgba(251, 146, 60, 0.35)');
      grad.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(tx, ty - 3, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.fillRect(tx - 2, ty, 4, 9);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(tx - 5, ty - 7 + flicker * 0.4, 10, 8);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(tx - 2.5, ty - 5 + flicker * 0.4, 5, 5);
    }
  }

  private drawProp(ctx: CanvasRenderingContext2D, prop: DestructibleProp) {
    const scr = this.gridToWorld(prop.gx, prop.gy, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(scr.x, scr.y, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    const sprite =
      prop.kind === 'crate' ? this.sprites.crate : this.sprites.vase;
    ctx.save();
    if (prop.hitFlash > 0) {
      ctx.filter = 'brightness(2.5)';
    }
    ctx.drawImage(
      sprite,
      Math.round(scr.x - sprite.width / 2),
      Math.round(scr.y - sprite.height + 5)
    );
    ctx.restore();
  }

  private drawTelegraph25D(ctx: CanvasRenderingContext2D, tel: TelegraphZone) {
    const scr = this.gridToWorld(tel.gx, tel.gy, 0);
    ctx.save();

    if (
      tel.shape === 'line' &&
      tel.endGx !== undefined &&
      tel.endGy !== undefined
    ) {
      const endScr = this.gridToWorld(tel.endGx, tel.endGy, 0);
      ctx.strokeStyle = tel.color;
      ctx.lineWidth = 2 + tel.progress * 2.5;
      ctx.setLineDash([6, 4]);
      ctx.globalAlpha = 0.55 + tel.progress * 0.4;
      ctx.beginPath();
      ctx.moveTo(scr.x, scr.y - 12);
      ctx.lineTo(endScr.x, endScr.y - 12);
      ctx.stroke();
    } else {
      const r = tel.radius * TILE_SIZE;
      ctx.strokeStyle = tel.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(scr.x, scr.y, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = tel.color;
      ctx.globalAlpha = 0.18 + tel.progress * 0.32;
      ctx.beginPath();
      ctx.arc(scr.x, scr.y, r * tel.progress, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawGhostTrail(ctx: CanvasRenderingContext2D, gt: GhostTrail) {
    const scr = this.gridToWorld(gt.gx, gt.gy, gt.gz);
    const sprite = this.sprites.heroesGhost[this.selectedClass][gt.frameIdx];
    ctx.save();
    ctx.globalAlpha = Math.max(0, gt.alpha);
    ctx.translate(Math.round(scr.x), Math.round(scr.y));
    ctx.scale(gt.spriteFacing, 1);
    ctx.drawImage(
      sprite,
      Math.round(-sprite.width / 2),
      Math.round(-sprite.height + 6)
    );
    ctx.restore();
  }

  private drawInteractable(ctx: CanvasRenderingContext2D, item: Interactable) {
    const bob =
      item.type === 'gold' ||
      item.type === 'mana_orb' ||
      item.type === 'exp_gem' ||
      item.type === 'weapon_drop'
        ? Math.sin(item.bobPhase) * 4
        : 0;
    const scr = this.gridToWorld(item.gx, item.gy, bob);

    if (item.type === 'lobby_hero' && item.heroId) {
      const isCurrent = item.heroId === this.selectedClass;
      ctx.fillStyle = isCurrent
        ? 'rgba(245, 158, 11, 0.32)'
        : 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.ellipse(scr.x, scr.y, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      const sprite = this.sprites.heroes[item.heroId][0];
      ctx.drawImage(
        sprite,
        Math.round(scr.x - sprite.width / 2),
        Math.round(scr.y - sprite.height + 6)
      );

      ctx.font = "700 10px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillStyle = HERO_CLASSES[item.heroId].accentColor;
      ctx.fillText(
        isCurrent ? '★ SELECTED' : HERO_CLASSES[item.heroId].name,
        scr.x,
        scr.y + 18
      );
      return;
    }

    if (item.type === 'lobby_pet') {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.ellipse(scr.x, scr.y, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "700 10px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('PET KENNEL', scr.x, scr.y + 16);
      return;
    }

    if (item.type === 'dungeon_gate') {
      ctx.font = "800 12px 'Cinzel', serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.fillText('▲ ENTER DUNGEON ▲', scr.x, scr.y - 18);
      return;
    }

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(scr.x, scr.y + bob, 11, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (item.type === 'weapon_drop' && item.weaponId) {
      const sprite = this.sprites.weapons[item.weaponId];
      ctx.drawImage(
        sprite,
        Math.round(scr.x - sprite.width / 2),
        Math.round(scr.y - sprite.height / 2 - 4)
      );
      return;
    }

    if (item.type === 'shop_item') {
      if (item.shopKind === 'potion') {
        const mSprite = this.sprites.merchant;
        ctx.drawImage(
          mSprite,
          Math.round(scr.x - mSprite.width / 2),
          Math.round(scr.y - 74)
        );
      }
      let sprite = this.sprites.potion;
      if (item.shopKind === 'weapon' && item.weaponId) {
        sprite = this.sprites.weapons[item.weaponId];
      } else if (item.shopKind === 'mana_pack') {
        sprite = this.sprites.manaOrb;
      }
      ctx.drawImage(
        sprite,
        Math.round(scr.x - sprite.width / 2),
        Math.round(scr.y - sprite.height + 4)
      );
      ctx.font = "700 11px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.fillText(`${item.value}G`, scr.x, scr.y + 16);
      return;
    }

    let sprite: HTMLCanvasElement = this.sprites.gold;
    if (item.type === 'chest') {
      sprite = item.opened ? this.sprites.chestOpen : this.sprites.chestClosed;
    } else if (item.type === 'potion') {
      sprite = this.sprites.potion;
    } else if (item.type === 'mana_orb') {
      sprite = this.sprites.manaOrb;
    } else if (item.type === 'exp_gem') {
      sprite = this.sprites.expGem;
    } else if (item.type === 'statue') {
      sprite = this.sprites.statue;
    } else if (item.type === 'shrine') {
      sprite = this.sprites.shrine;
    }

    ctx.drawImage(
      sprite,
      Math.round(scr.x - sprite.width / 2),
      Math.round(scr.y - sprite.height + 4)
    );
  }

  private drawPet(ctx: CanvasRenderingContext2D) {
    const baseScr = this.gridToWorld(this.pet.gx, this.pet.gy, 0);
    const scr = this.gridToWorld(this.pet.gx, this.pet.gy, this.pet.hopZ);

    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(baseScr.x, baseScr.y, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const frames = this.sprites.pets[this.selectedPet];
    const sprite = frames[Math.abs(Math.floor(this.pet.animPhase)) % 2];

    ctx.save();
    ctx.translate(Math.round(scr.x), Math.round(scr.y));
    ctx.scale(this.pet.facing, 1);
    ctx.drawImage(
      sprite,
      Math.round(-sprite.width / 2),
      Math.round(-sprite.height + 4)
    );
    ctx.restore();
  }

  private drawEnemy(ctx: CanvasRenderingContext2D, en: Enemy) {
    const baseScr = this.gridToWorld(en.gx, en.gy, 0);
    const scr = this.gridToWorld(en.gx, en.gy, en.hopZ);

    const shadowR = en.isBoss ? 24 : en.isElite ? 18 : 14;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(
      baseScr.x,
      baseScr.y,
      shadowR,
      shadowR * 0.5,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Elite / Enraged Boss Aura Ring under feet
    if (en.isElite || en.enraged) {
      ctx.save();
      ctx.strokeStyle = en.enraged ? '#f43f5e' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.ellipse(
        baseScr.x,
        baseScr.y,
        shadowR + 3,
        (shadowR + 3) * 0.52,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
      ctx.restore();
    }

    const frameIdx = Math.abs(Math.floor(this.globalTime * 5 + en.id)) % 2;
    const sprite =
      en.hitFlash > 0
        ? this.sprites.enemiesRedFlash[en.type][frameIdx]
        : this.sprites.enemies[en.type][frameIdx];

    const eliteScale = en.isElite ? 1.22 : 1.0;

    ctx.save();
    ctx.translate(Math.round(scr.x), Math.round(scr.y));
    ctx.scale(
      en.facing * en.squashX * eliteScale,
      en.squashY * eliteScale
    );

    ctx.drawImage(
      sprite,
      Math.round(-sprite.width / 2),
      Math.round(-sprite.height + 6)
    );
    ctx.restore();

    if (en.alertTimer > 0) {
      const bounce = Math.abs(Math.sin(en.alertTimer * 18)) * 6;
      const ax = Math.round(scr.x);
      const ay = Math.round(
        scr.y - sprite.height * eliteScale - 10 - bounce
      );
      ctx.save();
      ctx.font = "800 18px 'JetBrains Mono', monospace";
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#090b10';
      ctx.strokeText('!', ax, ay);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('!', ax, ay);
      ctx.restore();
    }

    if (en.hp < en.maxHp && !en.isBoss && en.type !== 'dummy') {
      const bw = en.isElite ? 42 : 34;
      const bh = 5;
      const bx = Math.round(scr.x - bw / 2);
      const by = Math.round(scr.y - sprite.height * eliteScale - 6);
      ctx.fillStyle = '#090b10';
      ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = en.isElite ? '#f59e0b' : '#f43f5e';
      ctx.fillRect(bx, by, Math.max(2, (en.hp / en.maxHp) * bw), bh);
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    const p = this.player;
    const baseScr = this.gridToWorld(p.gx, p.gy, 0);
    const scr = this.gridToWorld(p.gx, p.gy, p.gz);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(baseScr.x, baseScr.y, 15, 7.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle =
      p.invulnTimer > 0
        ? '#38bdf8'
        : p.statueBlessing
        ? '#c084fc'
        : HERO_CLASSES[this.selectedClass].accentColor;
    ctx.lineWidth = p.invulnTimer > 0 ? 2.5 : 1.5;
    ctx.globalAlpha = p.invulnTimer > 0 ? 0.9 : 0.6;
    ctx.beginPath();
    ctx.ellipse(baseScr.x, baseScr.y, 17, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Legendary Skin Halo & Aura Ring
    if (this.selectedSkinTier === 'legendary') {
      const skinCfg = HERO_CLASSES[this.selectedClass].skins.legendary;
      ctx.save();
      ctx.strokeStyle = skinCfg.auraColor || '#fde047';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([4, 3]);
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.ellipse(baseScr.x, baseScr.y, 22, 11.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    const skinFrames =
      this.sprites.heroesSkins?.[this.selectedClass]?.[this.selectedSkinTier] ||
      this.sprites.heroes[this.selectedClass];
    const frameIdx = Math.abs(Math.floor(p.animPhase)) % 2;
    const sprite = skinFrames[frameIdx];

    ctx.save();
    ctx.translate(Math.round(scr.x), Math.round(scr.y));
    ctx.scale(p.spriteFacing * p.squashX, p.squashY);

    if (p.hitFlash > 0) {
      ctx.filter = 'brightness(2.8) sepia(1) hue-rotate(-50deg) saturate(5)';
    } else if (p.invulnTimer > 0) {
      ctx.globalAlpha = 0.78;
    }

    ctx.drawImage(
      sprite,
      Math.round(-sprite.width / 2),
      Math.round(-sprite.height + 6)
    );
    ctx.restore();

    const wpn = this.getActiveWeapon();
    const wSprite = this.sprites.weapons[wpn.id];
    ctx.save();
    ctx.translate(
      Math.round(scr.x + Math.cos(p.aimAngle) * 10),
      Math.round(scr.y - 14 + Math.sin(p.aimAngle) * 6)
    );
    ctx.rotate(p.aimAngle);
    if (Math.cos(p.aimAngle) < 0) {
      ctx.scale(1, -1);
    }
    ctx.drawImage(
      wSprite,
      Math.round(-wSprite.width * 0.3),
      Math.round(-wSprite.height / 2)
    );
    ctx.restore();
  }

  private drawProjectile(ctx: CanvasRenderingContext2D, proj: Projectile) {
    const scr = this.gridToWorld(proj.gx, proj.gy, proj.gz);
    ctx.fillStyle = proj.color;
    ctx.beginPath();
    ctx.arc(scr.x, scr.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = proj.coreColor;
    ctx.beginPath();
    ctx.arc(scr.x, scr.y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSlash(ctx: CanvasRenderingContext2D, sl: SlashEffect) {
    const scr = this.gridToWorld(sl.gx, sl.gy, 14);
    const prog = 1 - sl.timer / sl.maxTimer;
    const alpha = Math.max(0, 1 - prog * 0.85);
    const rx = sl.radius * TILE_SIZE;

    ctx.save();
    ctx.translate(scr.x, scr.y);
    ctx.globalAlpha = alpha;

    const startAng = sl.angle - sl.arcSpread / 2;
    const endAng = sl.angle + sl.arcSpread / 2;

    ctx.fillStyle = sl.color;
    ctx.globalAlpha = alpha * 0.25;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, rx, startAng, endAng);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = sl.color;
    ctx.lineWidth = 10 * (1 - prog * 0.5);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, 0, rx, startAng, endAng);
    ctx.stroke();

    ctx.strokeStyle = sl.coreColor;
    ctx.lineWidth = 4 * (1 - prog * 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, rx * 0.92, startAng + 0.08, endAng - 0.08);
    ctx.stroke();

    ctx.restore();
  }

  private drawLightning(ctx: CanvasRenderingContext2D, lb: LightningBolt) {
    const alpha = lb.timer / lb.maxTimer;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lb.x1, lb.y1);
    const midX = (lb.x1 + lb.x2) / 2 + (Math.random() - 0.5) * 16;
    const midY = (lb.y1 + lb.y2) / 2 + (Math.random() - 0.5) * 16;
    ctx.lineTo(midX, midY);
    ctx.lineTo(lb.x2, lb.y2);
    ctx.stroke();

    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}
