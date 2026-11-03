import React from 'react';
import { AvatarId } from '../game/types';

export function ObsidianTitleLockup() {
  return (
    <svg
      viewBox="0 0 540 128"
      className="w-full max-w-[420px] h-auto select-none drop-shadow-[0_10px_24px_rgba(0,0,0,0.85)]"
      aria-label="Obsidian Descent: Soul Knight Edition"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>

      <g transform="translate(270, 20)">
        <polygon
          points="0,-16 28,0 0,16 -28,0"
          fill="#0F172A"
          stroke="url(#goldGrad)"
          strokeWidth="2.5"
        />
        <polygon points="0,-9 16,0 0,9 -16,0" fill="url(#crimsonGrad)" />
        <polygon points="0,-4 7,0 0,4 -7,0" fill="#FEF08A" />
        <path
          d="M -38,0 L -130,0 M 38,0 L 130,0"
          stroke="url(#goldGrad)"
          strokeWidth="2"
          strokeLinecap="square"
        />
        <rect x="-136" y="-3" width="6" height="6" fill="#F59E0B" />
        <rect x="130" y="-3" width="6" height="6" fill="#F59E0B" />
      </g>

      <text
        x="270"
        y="74"
        textAnchor="middle"
        fill="#090B10"
        stroke="#090B10"
        strokeWidth="8"
        strokeLinejoin="round"
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 800,
          fontSize: '44px',
          letterSpacing: '0.12em',
        }}
      >
        OBSIDIAN
      </text>
      <text
        x="270"
        y="74"
        textAnchor="middle"
        fill="url(#goldGrad)"
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 800,
          fontSize: '44px',
          letterSpacing: '0.12em',
        }}
      >
        OBSIDIAN
      </text>

      <text
        x="270"
        y="108"
        textAnchor="middle"
        fill="#090B10"
        stroke="#090B10"
        strokeWidth="6"
        strokeLinejoin="round"
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: '20px',
          letterSpacing: '0.32em',
        }}
      >
        SOUL KNIGHTS
      </text>
      <text
        x="270"
        y="108"
        textAnchor="middle"
        fill="url(#bladeGrad)"
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: '20px',
          letterSpacing: '0.32em',
        }}
      >
        SOUL KNIGHTS
      </text>

      <path
        d="M 155,120 L 385,120"
        stroke="#334155"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <rect x="266" y="117" width="8" height="6" fill="#38BDF8" />
    </svg>
  );
}

export function PixelAvatarGraphic({
  avatarId,
  className = 'w-9 h-9',
}: {
  avatarId: AvatarId;
  className?: string;
}) {
  if (avatarId === 'knight_helm') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect width="16" height="16" rx="3" fill="#1E293B" />
        <rect x="5" y="1" width="6" height="2" fill="#E11D48" />
        <rect x="4" y="3" width="8" height="9" fill="#CBD5E1" />
        <rect x="5" y="5" width="6" height="2" fill="#0F172A" />
        <rect x="7" y="5" width="2" height="5" fill="#F59E0B" />
        <rect x="3" y="12" width="10" height="3" fill="#F59E0B" />
      </svg>
    );
  }
  if (avatarId === 'pyro_hood') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect width="16" height="16" rx="3" fill="#1E293B" />
        <rect x="3" y="2" width="10" height="11" fill="#C2410C" />
        <rect x="5" y="4" width="6" height="6" fill="#090B10" />
        <rect x="6" y="6" width="2" height="2" fill="#FDE047" />
        <rect x="9" y="6" width="2" height="2" fill="#FDE047" />
        <rect x="4" y="12" width="8" height="3" fill="#F59E0B" />
      </svg>
    );
  }
  if (avatarId === 'rogue_mask') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect width="16" height="16" rx="3" fill="#0F172A" />
        <rect x="3" y="2" width="10" height="10" fill="#334155" />
        <rect x="5" y="5" width="2" height="2" fill="#34D399" />
        <rect x="9" y="5" width="2" height="2" fill="#34D399" />
        <rect x="3" y="9" width="10" height="5" fill="#10B981" />
      </svg>
    );
  }
  if (avatarId === 'alchemist_visor') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect width="16" height="16" rx="3" fill="#042F2E" />
        <rect x="3" y="2" width="10" height="11" fill="#14B8A6" />
        <rect x="4" y="5" width="8" height="3" fill="#090B10" />
        <rect x="5" y="6" width="2" height="1" fill="#BEF264" />
        <rect x="9" y="6" width="2" height="1" fill="#BEF264" />
        <rect x="5" y="10" width="6" height="4" fill="#84CC16" />
      </svg>
    );
  }
  if (avatarId === 'dragon_crest') {
    return (
      <svg viewBox="0 0 16 16" className={className} fill="none">
        <rect width="16" height="16" rx="3" fill="#270915" />
        <rect x="2" y="2" width="3" height="3" fill="#FDE047" />
        <rect x="11" y="2" width="3" height="3" fill="#FDE047" />
        <rect x="3" y="4" width="10" height="9" fill="#E11D48" />
        <rect x="5" y="6" width="2" height="2" fill="#FEF08A" />
        <rect x="9" y="6" width="2" height="2" fill="#FEF08A" />
        <rect x="5" y="10" width="6" height="3" fill="#FB7185" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <rect width="16" height="16" rx="3" fill="#0C1928" />
      <rect x="4" y="2" width="8" height="3" fill="#FDE047" />
      <rect x="3" y="5" width="10" height="8" fill="#38BDF8" />
      <rect x="5" y="7" width="2" height="2" fill="#090B10" />
      <rect x="9" y="7" width="2" height="2" fill="#090B10" />
    </svg>
  );
}

export function SoulGemIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <polygon points="8,1 14,6 8,15 2,6" fill="#38BDF8" />
      <polygon points="8,3 11.5,6 8,12.5 4.5,6" fill="#BAE6FD" />
      <polygon points="8,4 9.5,6 8,9 6.5,6" fill="#FFFFFF" />
    </svg>
  );
}

export function ShopPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path d="M2 3H14L13 7H3L2 3Z" fill="#F59E0B" />
      <rect x="3" y="7" width="10" height="7" fill="#334155" />
      <rect x="6" y="9" width="4" height="5" fill="#FDE047" />
    </svg>
  );
}

export function SettingsPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path
        d="M6 1H10V3L12 4L14 3L15 5L13 7V9L15 11L14 13L12 12L10 13V15H6V13L4 12L2 13L1 11L3 9V7L1 5L2 3L4 4L6 3V1Z"
        fill="#94A3B8"
      />
      <circle cx="8" cy="8" r="3" fill="#0F172A" />
    </svg>
  );
}

export function HeartPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path
        d="M2 5H5V3H7V5H9V3H11V5H14V9H12V11H10V13H8V15H8V13H6V11H4V9H2V5Z"
        fill="#F43F5E"
      />
      <rect x="3" y="4" width="3" height="2" fill="#FDA4AF" />
    </svg>
  );
}

export function ShieldPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path
        d="M3 2H13V8C13 11 10 13.5 8 15C6 13.5 3 11 3 8V2Z"
        fill="#94A3B8"
        stroke="#475569"
        strokeWidth="1.5"
      />
      <path d="M5 4H11V7H5V4Z" fill="#E2E8F0" />
    </svg>
  );
}

export function ManaPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <polygon points="8,1 13,6 11,14 5,14 3,6" fill="#3B82F6" />
      <polygon points="8,3 11,6 9.5,12 6.5,12 5,6" fill="#93C5FD" />
    </svg>
  );
}

export function CoinPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <rect x="3" y="2" width="10" height="12" rx="2" fill="#F59E0B" />
      <rect x="5" y="4" width="6" height="8" fill="#FDE047" />
      <rect x="7" y="5" width="2" height="6" fill="#B45309" />
    </svg>
  );
}

export function StairsPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path d="M2 13H14V11H11V8H8V5H5V2H2V13Z" fill="#A855F7" />
      <path d="M3 12H13V11H10V8H7V5H4V3H3V12Z" fill="#D8B4FE" />
    </svg>
  );
}

export function SwordPixelIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path d="M11 2L14 2L14 5L7 12L4 9L11 2Z" fill="#E2E8F0" />
      <path d="M3 8L8 13L6 14L2 10L3 8Z" fill="#F59E0B" />
      <path d="M2 12L4 14L2 15L1 14L2 12Z" fill="#92400E" />
    </svg>
  );
}

export function SwapWeaponIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path
        d="M3 5H12L10 3M13 11H4L6 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BootPixelIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path d="M6 2H11V9H14V13H3V10L6 8V2Z" fill="#38BDF8" />
      <path d="M2 5H5V7H2V5ZM1 8H4V9H1V8Z" fill="#BAE6FD" />
    </svg>
  );
}

export function PotionPixelIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <rect x="6" y="2" width="4" height="2" fill="#FDE047" />
      <rect x="7" y="4" width="2" height="2" fill="#94A3B8" />
      <path d="M4 6H12L13 13H3L4 6Z" fill="#F43F5E" />
      <rect x="5" y="8" width="3" height="3" fill="#FDA4AF" />
    </svg>
  );
}

export function SkillStarIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <polygon
        points="8,1 10,6 15,8 10,10 8,15 6,10 1,8 6,6"
        fill="#F59E0B"
      />
      <polygon points="8,4 9,7 12,8 9,9 8,12 7,9 4,8 7,7" fill="#FEF08A" />
    </svg>
  );
}

export function SoundIcon({
  muted,
  className = 'w-4 h-4',
}: {
  muted: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path d="M2 6H5L9 2V14L5 10H2V6Z" fill="currentColor" />
      {!muted ? (
        <>
          <path
            d="M11 5C12 6 12 10 11 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M13 3C15 5.5 15 10.5 13 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="M11 6L15 10M15 6L11 10"
          stroke="#F43F5E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function PausePixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <rect x="3" y="2" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="9" y="2" width="4" height="12" rx="1" fill="currentColor" />
    </svg>
  );
}

export function LockPixelIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path d="M5 7V4H6V3H10V4H11V7H9V5H7V7H5Z" fill="#CBD5E1" />
      <rect x="3" y="7" width="10" height="8" rx="1" fill="#F59E0B" />
      <rect x="4" y="8" width="8" height="6" fill="#FDE047" />
      <rect x="7" y="9" width="2" height="3" fill="#0F172A" />
    </svg>
  );
}

export function QuestScrollIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <rect x="2" y="1" width="12" height="2" fill="#D97706" />
      <rect x="3" y="3" width="10" height="10" fill="#FEF08A" />
      <rect x="5" y="5" width="6" height="1.5" fill="#92400E" />
      <rect x="5" y="8" width="6" height="1.5" fill="#92400E" />
      <rect x="5" y="11" width="4" height="1.5" fill="#92400E" />
      <rect x="2" y="13" width="12" height="2" fill="#D97706" />
    </svg>
  );
}

export function ChestGachaIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <rect x="1" y="3" width="14" height="4" fill="#A855F7" />
      <rect x="1" y="7" width="14" height="7" fill="#7E22CE" />
      <rect x="1" y="6" width="14" height="2" fill="#FDE047" />
      <rect x="6" y="5" width="4" height="4" fill="#FEF08A" />
      <rect x="7" y="6" width="2" height="2" fill="#38BDF8" />
    </svg>
  );
}

export function AnvilArmoryIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <path d="M1 5H13V8H10V11H12V14H4V11H6V8H3L1 5Z" fill="#94A3B8" />
      <rect x="4" y="3" width="8" height="2" fill="#E2E8F0" />
      <rect x="7" y="1" width="2" height="2" fill="#F59E0B" />
    </svg>
  );
}

export function SparkleCrownIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <polygon points="2,13 1,5 5,8 8,3 11,8 15,5 14,13" fill="#FDE047" />
      <rect x="2" y="13" width="12" height="2" fill="#F59E0B" />
      <rect x="7" y="9" width="2" height="2" fill="#EF4444" />
    </svg>
  );
}

export function PhoneDownloadIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none">
      <rect x="3" y="1" width="10" height="14" rx="1.5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
      <path d="M8 4V10M8 10L5.5 7.5M8 10L10.5 7.5" stroke="#4ADE80" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="6" y="12" width="4" height="1.2" fill="#94A3B8" />
    </svg>
  );
}


