# Soul Knight Edition: Landscape 2.5D Pixel Dungeon Crawler

Bản kế hoạch này chuyển đổi và nâng cấp toàn diện trò chơi thành một tựa game **Action Roguelike màn hình ngang (Landscape Mobile)** lấy cảm hứng trực tiếp từ **Soul Knight**, kết hợp giữ lại toàn bộ chất lượng **Game Feel** (Ghost-Dash 0.5s I-frame, vệt chém hình quạt, chớp đỏ 0.1s, đẩy lùi Knockback, cảnh báo `!` và âm thanh 8-bit Web Audio).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là các lựa chọn thiết kế cốt lõi đã được xác nhận từ câu trả lời của bạn để định hình phiên bản **Soul Knight Landscape**:

- **Confirmed Decision 1 — Góc nhìn Top-Down 2.5D & Bố cục Màn hình ngang (Landscape UI)**: Chuyển từ góc nghiêng chéo sang góc nhìn **Top-Down 2.5D Orthogonal Pixel Art** (nhìn rõ chiều sâu tường phía bắc, sàn gạch rõ ràng, dễ quan sát đường đạn bullet-hell và tầm bắn). Giao diện tối ưu 100% cho màn hình ngang điện thoại và máy tính.
- **Confirmed Decision 2 — Hệ thống 2 Vũ khí (Dual-Weapon) & Thanh Năng lượng (Mana/Energy)**: Người chơi mang tối đa **2 vũ khí** chuyển đổi tức thời (kiếm cận chiến 0 tốn Mana + súng/trượng phép tốn Mana), tự động khóa mục tiêu gần nhất (Auto-Aim chuẩn Soul Knight) và nhặt vũ khí mới trong màn chơi.
- **Confirmed Decision 3 — Phòng chờ Living Room, Thú cưng (Pet) & Các Phòng Sự Kiện**:
  - **Phòng chờ (Living Room Hub)**: Trước khi vào hầm ngục, người chơi có thể di chuyển tự do trong căn phòng căn cứ để chọn **Tướng (Knight, Pyromancer, Rogue)**, chọn **Thú cưng đi kèm (Mèo Chiến Binh, Slime Cưng, Rồng Nhỏ)** tự động hỗ trợ tấn công quái, thử vũ khí tại bia tập, rồi bước vào cánh cửa hầm ngục.
  - **Bản đồ lưới nhiều phòng (Grid Room System)**: Gồm Phòng Khởi đầu, Phòng Quái (tự động đóng cửa sắt khi bước vào, mở cửa khi diệt hết quái), **Phòng Rương Vũ Khí**, **Phòng Thương Nhân (Merchant)** bán vũ khí & bình máu/năng lượng bằng Vàng, **Phòng Tượng Thần (Statue)** ban phước khi kích hoạt kỹ năng, và **Phòng Boss / Cổng Portal**.

---

## 1. Overview & Core Concept

- **What It Does**: Trò chơi hành động bắn súng & chặt chém (Run-and-Gun / Hack-and-Slash Roguelike) màn hình ngang, nơi người chơi khởi hành từ Phòng chờ Living Room cùng thú cưng, khám phá chuỗi phòng ngục nối nhau bằng hành lang, thu thập và hoán đổi hàng chục loại súng/kiếm/trượng phép, né mưa đạn bằng kỹ năng Dash bóng mờ (0.5s I-frame), và vượt qua các tầng hầm ngục.
- **Target Audience / Persona**: Người chơi yêu thích dòng game hành động nhịp độ nhanh kiểu *Soul Knight*, *Enter the Gungeon*, và *Hades* trên điện thoại màn hình ngang hoặc trình duyệt máy tính.
- **Key Value**: Mang lại vòng lặp gameplay hoàn chỉnh, đa dạng hoạt động trong mỗi lượt chơi (nhặt súng mới, mua đồ у Thương nhân, cầu nguyện Tượng thần, chọn Buff khi lên cấp) với cảm giác chiến đấu giòn giã và điều khiển cảm ứng đa điểm mượt mà.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Màn hình Tiêu đề (Title Screen)**: Ngắm nhìn toàn cảnh Phòng chờ Living Room sống động phía sau biểu tượng game, nhấn **Bắt đầu (Start Game)** để bước vào Phòng chờ.
2. **Phòng chờ Căn cứ (Living Room Hub)**:
   - Di chuyển tự do hoặc chạm trực tiếp vào các tướng đang ngồi trong phòng để **Đổi Tướng** (xem chỉ số Máu, Giáp, Mana, Kỹ năng chủ động).
   - Tương tác với ổ thú cưng để chọn **Pet đồng hành** (tự động chạy theo và cắn/bắn quái).
   - Mở **Rương Khởi Đầu** miễn phí tại phòng chờ và bước lên **Cánh Cửa Hầm Ngục** phía bắc để bắt đầu màn `1-1`.
3. **Khám phá & Chiến đấu trong Hầm ngục (Dungeon Run)**:
   - Di chuyển qua các hành lang nối giữa các phòng.
   - Khi bước vào **Phòng Chiến Đấu**, hàng rào gai sắt tự động sập xuống khóa cửa. Quái vật (*Slime*, *Goblin Bắn Đạn*, *Pháp Sư*, *Golem*) bật dấu chấm than `!` trên đầu và tấn công.
   - Hạ gục quái rơi ra **Vàng**, **Hạt Năng lượng (Mana Orb - màu xanh dương)**, **Máu**, và **Ngọc EXP**.
   - Khám phá các phòng nhánh để mở **Rương Vũ Khí**, mua sắm tại **Thương Nhân**, hoặc dâng vàng tại **Tượng Thần** để nhận hiệu ứng cường hóa mỗi khi dùng Skill.
   - Khi hoàn thành phòng cuối/phòng Boss, bước vào **Cổng Portal Xoay Tròn** để chọn **1 trong 3 Buff bị động (Level Up / Boon)** và sang tầng tiếp theo.

### Visual Identity & Theme
- **Aesthetic Direction**: Retro 2.5D Pixel Art Dungeon sắc nét (`imageSmoothingEnabled = false`), ánh sáng đuốc ấm áp tương phản với nền đá ngục tối và hiệu ứng đạn laser/lửa/sét rực rỡ.
- **Color Palette & Mood**:
  - **60% Nền & Kiến trúc Hầm ngục**: Đá đen tuyền (`#090b10`), gạch xám lam (`#1e293b`, `#334155`), sàn gỗ ấm tại Phòng chờ (`#451a03`, `#78350f`).
  - **30% Thanh trạng thái & Khung UI**: Viền kim loại tối giản (`#0f172a` với viền `#475569`), giữ **trên 85% diện tích màn hình** thông thoáng không che khuất tầm nhìn.
  - **10% Điểm nhấn Tín hiệu (Semantic Accents)**:
    - Máu (HP): Đỏ hồng ngọc (`#f43f5e`)
    - Giáp tự hồi (Armor/Shield): Xanh bạc (`#94a3b8` / `#38bdf8`)
    - Năng lượng (Mana/Energy): Xanh lam điện (`#2563eb` / `#60a5fa`)
    - Vàng & Chí mạng: Vàng hổ phách (`#f59e0b` / `#fde047`)
    - Cổng Portal & Tượng thần: Tím huyền bí (`#a855f7`)
- **Typography & Hierarchy**:
  - Tiêu đề & Tên Vũ khí/Boss: `Cinzel` (Bold/ExtraBold) tạo chất sử thi hầm ngục.
  - Thông số Máu, Giáp, Mana, Sát thương, Giá vàng: `JetBrains Mono` (`tabular-nums`) căn chỉnh số học thẳng hàng tuyệt đối.
  - Mô tả kỹ năng & Nút tương tác: `Plus Jakarta Sans` rõ nét trên màn hình di động.
- **Landscape Mobile HUD Layout (Chuẩn Soul Knight)**:
  - **Góc Trên-Trái**: Khung trạng thái 3 thanh chuẩn Soul Knight: **HP (Đỏ)**, **Giáp tự hồi (Xám xanh)**, **Mana/Energy (Xanh dương)** + Thanh nhỏ **Lv/EXP** và số **Vàng** hiện có.
  - **Góc Trên-Phải**: **Bản đồ nhỏ (Grid Minimap)** hiển thị các phòng đã mở (Phòng hiện tại, Phòng Rương, Phòng Shop, Phòng Cổng Portal) + Nút **Tắt/Bật Âm thanh** và **Tạm dừng**.
  - **Góc Dưới-Trái (Vùng ngón cái trái)**: **Cần điều khiển Analog/D-Pad 360°** cảm ứng đa điểm mượt mà.
  - **Góc Dưới-Phải (Vùng ngón cái phải)**:
    - Nút **Tấn công / Bắn (Strike / Fire)** cỡ lớn ở vị trí trung tâm ngón cái (tự động biến thành nút **Tương tác / Nhặt súng / Mua đồ** khi đứng sát vật phẩm hoặc có nút tương tác phụ ngay cạnh).
    - Nút **Đổi Vũ Khí (Switch Weapon 1/2)** hiển thị tên vũ khí đang cầm và lượng Mana tiêu hao mỗi phát bắn.
    - Nút **Kỹ năng Tướng (Class Skill)** và nút **Lướt (Dash - Ghost Trail & 0.5s I-Frame)** bố trí vòng cung quanh nút đánh chính.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Chuyển sang Góc nhìn Top-Down 2.5D phẳng với Tường có chiều cao (Orthogonal 2.5D)**
  - *Chosen Approach*: Sử dụng hệ tọa độ lưới vuông 2.5D (tường phía bắc có mặt đứng dày tạo chiều sâu 3D, sàn gạch vuông vức) thay vì góc xoay chéo 45° Isometric.
  - *Why*: Trong các game bắn súng và né đạn dày đặc như *Soul Knight*, góc nhìn 2.5D phẳng giúp người chơi căn chính xác 100% quỹ đạo đạn bay, dễ di chuyển qua các hành lang ngang/dọc bằng D-Pad và tận dụng tối đa khung hình ngang (16:9 / 20:9) của điện thoại.
- **Decision 2: Cơ chế Kho Vũ khí Đa dạng & Tự động Khóa mục tiêu (Auto-Aim)**
  - *Chosen Approach*: Mỗi vũ khí có thông số riêng (Sát thương, Tốc độ bắn, Tiêu hao Mana, Độ lệch đạn, Hiệu ứng đạn/vệt chém). Khi nhấn nút Đánh/Bắn, nhân vật tự động xoay súng/kiếm về phía quái vật gần nhất trong tầm nhìn (nếu không có quái sẽ bắn theo hướng đang di chuyển).
  - *Why*: Giúp thao tác trên màn hình cảm ứng điện thoại cực kỳ sướng tay—người chơi chỉ cần tập trung lách né đạn bằng tay trái và xả đạn/đổi súng/tung Skill bằng tay phải đúng chất *Soul Knight*.
- **Decision 3: Cân bằng Tài nguyên bằng Hạt Mana & Giáp Tự Hồi**
  - *Chosen Approach*: Súng mạnh (Súng trường Plasma, Trượng Lửa, Cung Băng, Súng Shotgun) tốn từ `1` đến `4` Mana mỗi lần bắn; Vũ khí cận chiến (Kiếm Rộng, Song Đao, Giáo Ánh Sáng) tốn `0` Mana và có thể **chém phá hủy đạn của quái**! Quái bị hạ hoặc trúng đòn sẽ văng ra hạt Mana xanh và Vàng tự động hút vào người chơi.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                   Landscape Mobile Game Shell (React UI)                     │
│  ┌─────────────────────┐  ┌─────────────────────────┐  ┌──────────────────┐  │
│  │ Top-Left Status Bar │  │ Contextual World Prompt │  │ Top-Right Radar  │  │
│  │ HP / Armor / Mana   │  │ Pickup / Buy / Pray CTA │  │ Room Grid Map    │  │
│  └─────────────────────┘  └─────────────────────────┘  └──────────────────┘  │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │             Isolated 60FPS HTML5 Canvas Simulation Engine              │  │
│  │                                                                        │  │
│  │  ┌──────────────────┐   ┌───────────────────────┐   ┌───────────────┐  │  │
│  │  │ World Mode State │   │ Combat & Weapon Core  │   │ Game Feel VFX │  │  │
│  │  │ • Living Room Hub│──▶│ • Dual Weapon Slots   │──▶│ • Ghost Trail │  │  │
│  │  │ • Multi-Room Map │   │ • Auto-Aim Targeter   │   │ • 0.1s Red Hit│  │  │
│  │  │ • Locking Doors  │   │ • Melee Bullet-Slash  │   │ • Screen Shake│  │  │
│  │  └──────────────────┘   └───────────────────────┘   └───────────────┘  │  │
│  │           │                         │                       │          │  │
│  │           ▼                         ▼                       ▼          │  │
│  │  ┌──────────────────┐   ┌───────────────────────┐   ┌───────────────┐  │  │
│  │  │ AI & Companion   │   │ Dungeon Activities    │   │ 8-Bit Audio   │  │  │
│  │  │ • Pet Follower   │   │ • Weapon Chests       │   │ • Footsteps   │  │  │
│  │  │ • Slime & Goblin │   │ • NPC Shopkeeper      │   │ • Gun/Slash   │  │  │
│  │  │ • '!' Aggro Alert│   │ • Blessing Statues    │   │ • Coin/Mana   │  │  │
│  │  └──────────────────┘   └───────────────────────┘   └───────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────┐                               ┌──────────────────┐  │
│  │ Left Multi-Touch    │                               │ Right Combat Hub │  │
│  │ 360° Virtual D-Pad  │                               │ Fire / Switch /  │  │
│  │                     │                               │ Skill / Dash     │  │
│  └─────────────────────┘                               └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Arsenal Catalog
- **Danh mục Vũ khí (Weapon Arsenal)**:
  1. *Broadsword (Đại Kiếm)*: Cận chiến hình quạt rộng, `0 Mana`, chém tan đạn địch.
  2. *Twin Daggers (Song Đao)*: Chém kép tốc độ cao, tỉ lệ chí mạng lớn, `0 Mana`.
  3. *Pioneer Pistol (Súng Lục Tân Binh)*: Bắn đạn đơn chuẩn xác, `0 Mana`.
  4. *Splitter Shotgun (Súng Hoa Cải)*: Bắn chùm 5 viên đạn hình nón, đẩy lùi mạnh, `2 Mana`.
  5. *Plasma Rifle (Súng Trường Điện Từ)*: Xả đạn liên thanh tốc độ cao, `1 Mana`.
  6. *Thunder Staff (Trượng Sấm Sét)*: Phóng cầu sét tự động giật dây chuyền qua nhiều quái, `3 Mana`.
  7. *Inferno Bow (Cung Hỏa Long)*: Bắn mũi tên lửa xuyên thấu gây nổ diện rộng, `3 Mana`.
- **Hệ thống Phòng (Multi-Room Dungeon Graph)**:
  - Mỗi tầng gồm lưới phòng kết nối qua hành lang có **Cửa Sắt Tự Động**:
    - `START_ROOM`: Điểm xuất phát an toàn.
    - `COMBAT_ROOM`: Chứa 1–2 đợt (Waves) quái *Slime*, *Goblin Bắn Đạn*, *Golem*. Cửa tự khóa khi bước vào và mở lại kèm rương thưởng khi sạch quái.
    - `CHEST_ROOM`: Chứa **Rương Vũ Khí** miễn phí mở ra súng/kiếm ngẫu nhiên.
    - `SHOP_ROOM`: **Thương Nhân Hầm Ngục** bày bán 3 vật phẩm (Vũ khí cấp cao, Bình Máu, Bình Năng Lượng) mua bằng Vàng.
    - `STATUE_ROOM`: **Tượng Thần Cổ Đại** (Tượng Hiệp Sĩ / Tượng Phù Thủy) cho phép dâng một lượng Vàng nhỏ để nhận hiệu ứng tự động phóng kiếm khí hoặc vòng nổ mỗi khi bấm Skill.
    - `BOSS_ROOM`: Chứa Boss canh giữ **Cổng Portal Xoay Tròn** qua màn.

### Interactive Component & State Mapping
- **Cơ chế Nhặt & Đổi Vũ Khí**:
  - Người chơi mang tối đa 2 vũ khí (`weapons[0]`, `weapons[1]`).
  - Bấm nút **Switch Weapon** trên màn hình (hoặc phím `R` / `Tab`) để đổi tức thì giữa 2 vũ khí.
  - Khi đứng gần vũ khí rơi trên sàn (từ Rương hoặc Shop), một khung thông tin nhỏ hiện tên vũ khí, sát thương, Mana tiêu hao và nút **Nhặt / Đổi (Pickup / Swap)**.
- **Thú cưng Đồng hành (Pet AI)**:
  - Luôn chạy theo người chơi, không thể bị tiêu diệt, tự động lao tới cắn hoặc bắn đạn phụ vào quái đang tỉnh giấc (`aggroed`), có thể đổi loài thú cưng ngay tại Phòng chờ Living Room.
