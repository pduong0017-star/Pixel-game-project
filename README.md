# ⚔️ Obsidian Soul Knights — Mobile Pixel Action-Roguelike

Tựa game hầm ngục **Pixel Action-Roguelike** phong cách *Soul Knight* kết hợp *Hades*, tối ưu cho màn hình cảm ứng điện thoại (Mobile Touch Controls + PWA Offline) và máy tính.

---

## 📱 Cách Tải & Cài Đặt Game Về Điện Thoại

Dự án đã được tích hợp sẵn **Progressive Web App (PWA)** và **GitHub Actions (`.github/workflows/deploy.yml`)** để tự động xuất bản lên **GitHub Pages**.

### Cách 1: Đẩy lên GitHub & Chơi qua GitHub Pages (Khuyên dùng)
1. Trên thanh công cụ góc trên bên phải của **Google AI Studio**, bấm vào biểu tượng **GitHub (Export to GitHub)** để tạo kho lưu trữ (repository) trên tài khoản GitHub của bạn.
2. Vào repository vừa tạo trên GitHub -> chọn mục **Settings** -> **Pages**.
3. Tại phần **Build and deployment (Source)**, chọn **GitHub Actions**.
4. Workflow `.github/workflows/deploy.yml` sẽ tự động chạy và xuất bản game tại địa chỉ:
   `https://<tên-github-của-bạn>.github.io/<tên-repo>/`
5. Mở đường link đó trên điện thoại:
   - **Android (Chrome)**: Bấm nút **"📲 TẢI VỀ ĐIỆN THOẠI"** ngay ở góc trên màn hình chính của game (hoặc chọn *Thêm vào màn hình chính / Cài đặt ứng dụng*).
   - **iPhone / iPad (Safari)**: Bấm nút **Chia sẻ (Share)** ở thanh dưới cùng Safari -> chọn **Thêm vào MH chính (Add to Home Screen)**.

---

### Cách 2: Đóng gói thành file `.APK` cài trực tiếp cho Android (Qua Capacitor)
Nếu bạn muốn xuất ra file `.apk` độc lập:
```bash
npm install
npm run build
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Obsidian Soul Knights" "com.obsidian.soulknights" --web-dir dist
npx cap add android
npx cap sync
npx cap open android
```
Sau đó trong Android Studio chọn **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.

---

## 🎮 Tính Năng Nổi Bật
- **Sảnh Chờ Tương Tác (Interactive Lobby)**: Bục đá cổ ngữ hiển thị Hiệp Sĩ thở & vung vũ khí kèm Thú Cưng chạy quanh chân.
- **6 Class Nhân Vật & 18 Trang Phục (3 Bậc Skin)**: *Aegis Knight, Pyromancer, Shadowblade, Cyber Alchemist, Soul Necromancer, Blood Berserker*.
- **Meta-Game**: Mở Rương Bí Ẩn (Gacha Chest), Thợ Rèn Kho Vũ Khí Khởi Điểm, Cuộn Nhiệm Vụ Hằng Ngày, Thánh Điện Nâng Cấp Vĩnh Viễn.
