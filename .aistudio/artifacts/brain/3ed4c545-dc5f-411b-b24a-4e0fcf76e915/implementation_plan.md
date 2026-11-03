# Obsidian Soul Knights — Definitive Edition Upgrade Plan

Bản kế hoạch nâng cấp toàn diện **Obsidian Soul Knights** thành một tựa game **Pixel Action-Roguelike** hoàn chỉnh với hệ thống **Đa ngôn ngữ (4 thứ tiếng)**, **Phòng Tùy Chỉnh Chủng Tộc (Racial Character Studio)**, **Màn hình Title Screen Điện Ảnh (Press Start)**, **Hệ thống Chém Kiếm Tốc Độ Cao & Phản Đòn Đạn (Bullet Deflection)**, **Kho 16 Vũ Khí Đa Hệ**, và **Bộ Tổng Hợp Nhạc Nền 8-Bit Chiptune (BGM Sequencer)** theo từng màn chơi.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là 4 quyết định thiết kế trọng tâm được xây dựng trực tiếp từ các lựa chọn của bạn:

- **Confirmed Decision 1 — Đa ngôn ngữ Toàn diện (`VI / EN / JA / KO`)**: Tích hợp hệ thống đa ngôn ngữ thời gian thực cho **Tiếng Việt (`vi`)**, **Tiếng Anh (`en`)**, **Tiếng Nhật (`ja`)**, và **Tiếng Hàn (`ko`)**. Toàn bộ giao diện Title Screen, Phòng chờ, Tùy chỉnh chủng tộc, Kho vũ khí, Cửa hàng, Nhiệm vụ hằng ngày, chỉ số và HUD trong trận đều tự động chuyển đổi tức thì và lưu vào bộ nhớ máy.
- **Confirmed Decision 2 — Tự do Phối Ngoại Hình Chủng Tộc (Modular Race Customizer)**: Người chơi có thể chọn nhanh 5 Chủng tộc mẫu (*Nhân Loại, Tinh Linh Elf, Huyết Quỷ Demon, Chiến Binh Orc, Xương Bất Tử Undead*) hoặc **tự do phối từng bộ phận pixel**: **Màu da (6 tông màu)**, **Sừng (4 kiểu)**, **Cánh (4 kiểu)**, **Tai (3 kiểu)**, và **Màu mắt phát sáng (5 màu)**. Ngoại hình tùy chỉnh được vẽ trực tiếp lên nhân vật cả ở **Bục Phòng Chờ** lẫn khi **Chiến Đấu trong Hầm Ngục**.
- **Confirmed Decision 3 — Động Tác Chém Kiếm Tốc Độ Cao & Phản Đòn Đạn (`Soul Knight Deflect`) + 16 Vũ Khí**:
  - **Hoạt ảnh Chém Đảo Chiều (Alternating High-Speed Slash)**: Vũ khí cận chiến không còn đứng yên mà vung qua lại liên hoàn từ trên xuống / từ dưới lên (`swingParity`) kèm lướt nhẹ về phía trước, vệt kiếm khí bán nguyệt nhiều lớp và dư ảnh (Afterimage).
  - **Phản Đòn Đạn (`Bullet Deflection`)**: Mọi nhát chém cận chiến đều chém tan đạn địch; đặc biệt các thanh kiếm cao cấp (*Excalibur, Huyết Kiếm Katana, Lưỡi Hái Hư Không*) hoặc khi có *Boon Phản Đòn* sẽ **đánh bật đạn của quái bay ngược lại phía kẻ địch** với tốc độ tăng `135%`, đổi sang màu vàng kim rực rỡ kèm tiếng ngân kim loại *"CLANG!"*.
- **Confirmed Decision 4 — Title Screen Điện Ảnh (`Press Start`) & Nhạc Nền 8-Bit Chiptune Theo Màn**:
  - Mở đầu game bằng **Màn hình Title Screen Điện Ảnh** có cảnh chiến đấu pixel động phía sau, nút đổi nhanh ngôn ngữ (`🇻🇳 VI | 🇺🇸 EN | 🇯🇵 JA | 🇰🇷 KO`), và dòng chữ **PRESS START / CHẠM ĐỂ BẮT ĐẦU** nhấp nháy trước khi bước vào Phòng Chờ & Phòng Tạo Nhân Vật.
  - Bộ phát nhạc nền **8-Bit Chiptune BGM Sequencer** (Web Audio API đa kênh) tự động chuyển giai điệu theo ngữ cảnh: *Nhạc Title Hào Hùng*, *Nhạc Phòng Chờ Ấm Áp*, *Nhạc Hầm Ngục Dồn Dập*, và *Nhạc Đấu Boss Cao Trào*.

---

## 1. Overview & Core Concept

- **What It Does**: Nâng cấp *Obsidian Soul Knights* thành một tựa game hành động Roguelike hoàn chỉnh từ khoảnh khắc khởi động (Cinematic Title Screen), cá nhân hóa nhân vật chuyên sâu (Tùy chỉnh Chủng tộc + 6 Hệ phái + 3 bậc Skin), đến trải nghiệm chiến đấu chặt chém phản đạn tốc độ cao với 16 vũ khí và nhạc nền 8-bit sống động.
- **Key Value**: Mỗi người chơi có thể tạo ra một chiến binh mang dấu ấn riêng (ví dụ: *Sát Thủ Tinh Linh Cánh Dơi Sừng Rồng* hay *Hiệp Sĩ Quỷ Tộc Cánh Thiên Thần*), trải nghiệm cảm giác vung kiếm gạt mưa đạn mượt mà như *Soul Knight*, và thưởng thức trọn vẹn bằng ngôn ngữ yêu thích.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Màn hình Title Screen Điện Ảnh (`SPLASH_TITLE`)**:
   - Hiển thị bức tranh diorama pixel chuyển động (anh hùng đối đầu Boss giữa mưa đạn và lửa đuốc), logo **OBSIDIAN SOUL KNIGHTS** nổi khối 3D, thanh chọn nhanh 4 ngôn ngữ ở góc trên, và nút **PRESS START** phát sáng kèm nhạc hiệu 8-bit.
2. **Phòng Chờ Tương Tác (`TITLE_MENU` - Interactive Lobby) & Phòng Tạo Chủng Tộc (`RACE_STUDIO`)**:
   - Từ Phòng Chờ, người chơi có thể bấm nút **Chủng Tộc / Ngoại Hình (Race & Customizer)** ngay cạnh bục nhân vật để mở **Phòng Tạo Nhân Vật**.
   - Tại đây, người chơi chọn **Preset Chủng Tộc** (*Human, Elf, Demon, Orc, Undead*) hoặc tùy chỉnh từng tab: **Màu Da**, **Kiểu Sừng**, **Đôi Cánh**, **Đôi Tai**, **Màu Mắt**, xem trước trực tiếp trên nhân vật đang thở và vung vũ khí.
3. **Chiến Đấu Cận Chiến Phản Đạn & Đa Hệ Vũ Khí (`PLAYING`)**:
   - Khi cầm kiếm/đao/rìu/thương, mỗi lần vung vũ khí sẽ xoay góc chém linh hoạt, phát ra sóng kiếm khí và chém tan hoặc phản xạ đạn quái vật bay ngược lại.
   - Nhạc nền tự động chuyển từ giai điệu Phòng Chờ sang nhịp trống & bass 8-bit hành động khi bước vào Hầm ngục, và đẩy lên nhịp độ dồn dập khi chạm trán Boss.

### Visual Identity & Typography
- **Multi-Script Pixel & Display Typography**: Kết hợp phông chữ Pixel (`Press Start 2P`) với hệ font hỗ trợ trọn vẹn dấu Tiếng Việt và ký tự CJK (`Plus Jakarta Sans` / system CJK fallback) để hiển thị sắc nét cả Tiếng Việt, Tiếng Anh, Tiếng Nhật và Tiếng Hàn.
- **Procedural Pixel Character Compositor**: Các lớp ngoại hình chủng tộc (Cánh đập nhịp nhàng phía sau lưng, Màu da khuôn mặt, Tai nhọn/Tai thú hai bên, Mắt phát sáng và Sừng trên mũ giáp) được vẽ đồng bộ theo nhịp nhún nhảy (`bobY`) của nhân vật.

---

## 3. Technical Architecture & Feature Specifications

### Architecture & Module Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                 Obsidian Soul Knights — Full Game Architecture               │
│                                                                              │
│  ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────┐  │
│  │  i18n Engine (4 Lang)│   │ Pre-Game Flow States │   │ 8-Bit Chiptune   │  │
│  │  • Tiếng Việt (vi)   │   │ • SPLASH_TITLE Screen│   │ BGM Sequencer    │  │
│  │  • English (en)      │──▶│ • Interactive Lobby  │──▶│ • Title / Lobby  │  │
│  │  • 日本語 (ja)        │   │ • Race Studio Modal  │   │ • Dungeon Combat │  │
│  │  • 한국어 (ko)        │   │ • Armory & Gacha     │   │ • Boss Theme     │  │
│  └──────────────────────┘   └──────────────────────┘   └──────────────────┘  │
│                                        │                                     │
│                                        ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                60FPS Canvas Engine & Combat System                     │  │
│  │                                                                        │  │
│  │  ┌────────────────────┐  ┌──────────────────────┐  ┌────────────────┐  │  │
│  │  │ Modular Hero Sprite│  │ Soul Knight Melee 2.0│  │ 16-Weapon      │  │  │
│  │  │ • 5 Race Presets   │  │ • Alternating Swing  │  │ Arsenal        │  │  │
│  │  │ • Custom Skin/Ears │  │ • 360° Spin Axes     │  │ • Swords/Axes  │  │  │
│  │  │ • Animated Wings   │  │ • Piercing Lances    │  │ • Spears/Bows  │  │  │
│  │  │ • Horns & Eye Glow │  │ • Bullet Deflection! │  │ • Guns/Lasers  │  │  │
│  │  └────────────────────┘  └──────────────────────┘  └────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1. Hệ thống Đa Ngôn Ngữ (`/src/game/i18n.ts`)
- Hỗ trợ 4 mã ngôn ngữ: `'vi' | 'en' | 'ja' | 'ko'`.
- Cung cấp từ điển dịch thuật đầy đủ cho:
  - Giao diện Title Screen, Phòng chờ, Cài đặt, Cửa hàng, Gacha, Nhiệm vụ hằng ngày.
  - Tên & mô tả của **6 Hệ phái (Classes)**, **5 Chủng tộc (Races)**, **16 Vũ khí (Weapons)**, **12 Bùa lợi (Boons)**, và các thông báo trong trận (`TẦNG HẦM NGỤC`, `PHẢN ĐÒN!`, `CHÍ MẠNG!`, `CHIẾN THẮNG`).

### 2. Hệ thống Chủng Tộc & Tùy Chỉnh Ngoại Hình (`/src/game/types.ts` & `/src/game/pixelSprites.ts`)
- Cấu trúc `RaceCustomization` lưu trong `SaveData`:
  - `raceId`: `'human' | 'elf' | 'demon' | 'orc' | 'undead'` (Mỗi chủng tộc cộng thêm 1 nội tại nhẹ đặc trưng: *Human* +5% EXP/Vàng, *Elf* +15 Mana & tốc chạy, *Demon* +5% Hút máu/Sát thương, *Orc* +20 Máu tối đa, *Undead* +10% Xuyên giáp/Hồi giáp nhanh).
  - `skinColor`: Tông da nhân vật (`#fbd38d`, `#ffe4e6`, `#ef4444`, `#4ade80`, `#93c5fd`, `#e2e8f0`).
  - `hornStyle`: `'none' | 'demon_horns' | 'dragon_antlers' | 'crown_spikes'`.
  - `wingStyle`: `'none' | 'angel_wings' | 'bat_wings' | 'cyber_wings'`.
  - `earStyle`: `'human' | 'elf_long' | 'beast_ears'`.
  - `eyeColor`: `'#38bdf8' | '#ef4444' | '#facc15' | '#10b981' | '#c084fc'`.
- Hàm `drawCustomizedHero()` kết hợp sprite gốc của Class + Skin với lớp cánh đập phía sau, màu da mặt, tai, mắt phát sáng và sừng phía trên mũ.

### 3. Nâng cấp Động tác Chém Kiếm & Kho 16 Vũ Khí (`/src/game/dungeonGen.ts` & `/src/game/GameEngine.ts`)
- **4 Kiểu Động Tác Cận Chiến (Melee Styles)**:
  1. **`slash` (Kiếm & Đao - Broadsword, Twin Daggers, Excalibur, Huyết Kiếm Katana, Lưỡi Hái Hư Không)**: Vung kiếm tốc độ cao đảo chiều liên tục (`swingParity = 1` rồi `-1`), tạo sóng kiếm khí lưỡi liềm nhiều tầng và đẩy nhẹ nhân vật tiến lên.
  2. **`spin` (Đại Rìu - Inferno Greataxe)**: Xoay 360° quanh người, quét sạch đạn và chém toàn bộ quái xung quanh trong bán kính rộng.
  3. **`smash` (Búa Chiến - Thunder Warhammer)**: Đập mạnh xuống đất tạo sóng chấn động tròn làm choáng (stun) và đẩy lùi quái.
  4. **`thrust` (Thương Dài - Dragon Lance)**: Đâm thẳng tầm xa xuyên thấu nhiều mục tiêu trên một đường thẳng.
- **Cơ chế Phản Đòn Đạn (`Bullet Deflection`)**:
  - Vũ khí có thuộc tính `canDeflect: true` (như *Huyết Kiếm Katana*, *Excalibur*, *Lưỡi Hái Hư Không*) hoặc khi người chơi chọn Boon **Khiên Gương Phản Đạn** sẽ biến mọi viên đạn địch nằm trong vùng chém thành đạn của người chơi (`fromPlayer = true`), đảo ngược vector vận tốc nhân `1.35x`, tăng sát thương và phát âm thanh kiếm ngân *"CLANG!"*.
- **Danh sách 7 Vũ khí Mới (Nâng tổng số lên 16 Vũ khí)**:
  - *Huyết Kiếm Katana (`blood_katana`)*: Chém cực nhanh, `0 Mana`, **Phản đòn đạn**, tỉ lệ chí mạng 35%.
  - *Lưỡi Hái Hư Không (`void_scythe`)*: Chém vòng cung tím rộng 220°, **Phản đòn đạn**, hút năng lượng.
  - *Đại Rìu Hỏa Ngục (`inferno_greataxe`)*: Xoay 360° lửa quét sạch mọi phía.
  - *Búa Sấm Sét (`thunder_warhammer`)*: Đập chấn động điện làm giật lùi quái xung quanh.
  - *Thương Long Kích (`dragon_lance`)*: Đâm xuyên phá tầm xa với mũi thương rồng lửa.
  - *Súng Máy Gatling (`gatling_minigun`)*: Xả mưa đạn tốc độ cực đại.
  - *Súng Bắn Tỉa Railgun (`sniper_railgun`)*: Bắn tia điện từ siêu tốc xuyên thấu toàn bản đồ, sát thương chí mạng khổng lồ.

### 4. Nhạc Nền 8-Bit Chiptune & Cân Bằng Game (`/src/game/sound.ts`)
- Bộ **8-Bit Chiptune Sequencer** sử dụng `AudioContext` (Square, Triangle, và Noise channels) tự động phát vòng lặp giai điệu theo 4 trạng thái:
  - `title`: Giai điệu phiêu lưu sử thi.
  - `lobby`: Giai điệu guitar/chiptune thư giãn tại căn cứ.
  - `dungeon`: Nhịp bass hành động 140 BPM kích thích chiến đấu.
  - `boss`: Nhịp trống và lead dồn dập 165 BPM.
- Bổ sung nút bật/tắt riêng cho **Nhạc nền (BGM)** và **Hiệu ứng âm thanh (SFX)**.
- **Tinh chỉnh Cân bằng (Game Balance)**: Tăng tốc độ hồi Mana tự nhiên khi tiêu diệt quái, tối ưu tốc độ bay của đạn quái để người chơi dễ căn nhịp chém phản đòn (`Deflect`), và cân bằng máu/sát thương quái tăng mượt hơn theo từng tầng.
