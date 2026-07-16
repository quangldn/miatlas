# MiAtlas ☁ Cloud Sync — Hướng dẫn cài đặt

Mục tiêu: để MiAtlas lưu dữ liệu vào **Google Sheet riêng của bạn**, đồng bộ giữa các thiết bị, mà **không cần server** và **không phải để Sheet ở chế độ public**.

Cách này dùng **Google Apps Script Web App** làm cầu nối. Script chạy bằng quyền của bạn nên Sheet vẫn riêng tư; chỉ đường link script + một **khóa bí mật** mới đọc/ghi được.

Bạn chỉ cần làm **một lần** (khoảng 5 phút). Sau đó mọi thiết bị chỉ việc dán link + khóa.

**Điểm mới:** tab **`Places`** trong Sheet chính là dữ liệu sống — bạn có thể **sửa điểm thẳng trên Google Sheet** (thêm/xoá hàng, đổi tên, note, status…) và MiAtlas sẽ đọc được. Ảnh và route nặng được để riêng ở tab ẩn `_blobs`.

---

## Phần A — Tạo "database" trên Google (làm 1 lần)

**1. Tạo Google Sheet — dùng file mẫu có sẵn 33 điểm**
- Cách nhanh (khuyến nghị): mở **`MiAtlas-Database-Starter.xlsx`** (mình gửi kèm, đã có sẵn 33 điểm) → tải lên Google Drive → chuột phải → **Open with → Google Sheets**. Có thể sửa các điểm ngay tại đây trước khi dùng.
  - Quan trọng: giữ **tên tab là `Places`** và **giữ nguyên hàng tiêu đề** (id, name, cat, status, lat, lng, note, photos, detail, detailEditedAt).
- Hoặc bắt đầu trống: vào https://sheets.new — không cần thêm gì, script sẽ tự tạo bảng `Places` và bơm 33 điểm mặc định vào lần sync đầu.

**2. Mở trình soạn Apps Script**
- Trong Sheet: menu **Extensions → Apps Script** (Tiện ích mở rộng → Apps Script).
- Cửa sổ mới hiện ra, có sẵn 1 file `Code.gs` với hàm rỗng.

**3. Dán code**
- Xoá hết nội dung có sẵn trong `Code.gs`.
- Mở file **`MiAtlas-Sync.gs`** (mình gửi kèm), copy toàn bộ, dán vào.

**4. Đặt khóa bí mật của bạn**
- Ở gần đầu file, tìm dòng:
  ```
  var SECRET = "change-me-to-something-private";
  ```
- Đổi `change-me-to-something-private` thành mật khẩu riêng của bạn (chữ và/hoặc số, **không dấu, không khoảng trắng**). Ví dụ: `82893`.
- **Ghi nhớ chuỗi này** — lát nữa bạn sẽ nhập y hệt vào MiAtlas.
- Nhấn biểu tượng **💾 Save** (Ctrl/Cmd+S).

**5. Deploy thành Web App**
- Nhấn nút **Deploy → New deployment** (Triển khai → Bản triển khai mới).
- Bấm bánh răng ⚙ cạnh "Select type" → chọn **Web app**.
- Cấu hình:
  - **Description**: gì cũng được (ví dụ `miatlas`).
  - **Execute as**: **Me** (chính bạn). ← quan trọng, để Sheet vẫn riêng tư.
  - **Who has access**: **Anyone** (Bất kỳ ai). ← để MiAtlas gọi được; bảo vệ đã nằm ở khóa bí mật.
- Bấm **Deploy**.
- Google sẽ hỏi cấp quyền → bấm **Authorize access** → chọn tài khoản → nếu hiện cảnh báo "Google hasn't verified this app", bấm **Advanced → Go to … (unsafe)** → **Allow**. (Cảnh báo này là bình thường vì đây là script của chính bạn.)

**6. Copy đường link**
- Sau khi deploy, Google hiện **Web app URL** dạng:
  ```
  https://script.google.com/macros/s/AKfy…/exec
  ```
- **Copy link này** (kết thúc bằng `/exec`). Đây là "database link".

---

## Phần B — Nối MiAtlas với database

Làm phần này trên **mỗi thiết bị** bạn muốn dùng (điện thoại, máy tính…).

> **Quan trọng:** dù mọi thiết bị mở **cùng một đường link**, nội dung hiển thị trên mỗi máy là **khác nhau — tùy vào Database (Google Sheet) mà máy đó được nối theo hướng dẫn này**. Link chỉ là cái khung ứng dụng; dữ liệu đến từ Sheet bạn kết nối. Hai người mở cùng link nhưng nối hai Sheet khác nhau sẽ thấy hai bản đồ hoàn toàn khác nhau; máy chưa nối Sheet nào thì chỉ thấy các điểm mẫu mặc định.

1. Mở MiAtlas — tốt nhất qua link cố định GitHub Pages của bạn (dạng `https://<tên-github>.github.io/miatlas/`, xem Phần C). Trên điện thoại nên dùng link này thay vì mở file rời.
2. Bấm nút **☁ Sync** trên thanh công cụ.
3. Dán:
   - **Database link**: đường link `/exec` ở bước A6.
   - **Secret key**: đúng chuỗi bạn đặt ở bước A4.
4. Bấm **Test** để kiểm tra (báo "✓ Connection works." là ok).
5. Bấm **Connect & sync**.
   - Lần đầu: MiAtlas đẩy dữ liệu hiện có lên Sheet.
   - Thiết bị thứ hai: MiAtlas kéo dữ liệu từ Sheet về.

Xong. Từ giờ mỗi khi bạn thêm/sửa/xoá địa điểm hay viết Detail, MiAtlas **tự động đẩy** lên Google Sheet (bạn thấy chip trạng thái đổi "Changes pending…" → "Synced ✓").

---

## Phần C — Đưa MiAtlas lên GitHub Pages (URL cố định)

Mục tiêu: có **một link duy nhất mở được trên mọi thiết bị**, thay vì gửi file HTML qua lại. Link sẽ có dạng:

> **https://<tên-github>.github.io/miatlas/**

Trong đó `<tên-github>` là **tên tài khoản GitHub của bạn**, còn `miatlas` là **tên repo** ở bước 1 (đổi tên repo thì phần đuôi link đổi theo).

Trang này công khai nhưng **vô hại**: chỉ là khung ứng dụng rỗng, không chứa dữ liệu hay khóa của bạn (những thứ đó nằm trong Google Sheet + trình duyệt từng máy).

**1. Tạo repository**
- Đăng nhập https://github.com bằng tài khoản của bạn.
- Bấm **New repository** → **Repository name**: `miatlas` → để **Public** → **Create repository**.

**2. Thêm file ứng dụng — đặt tên `index.html`**
- GitHub Pages sẽ mở file **`index.html`** ở địa chỉ gốc của repo. Vì vậy hãy **đổi tên `MiAtlas.html` thành `index.html`** khi đưa lên.
- Cách nhanh: trong repo bấm **Add file → Upload files** → kéo file `MiAtlas.html` vào → **nhưng đổi tên thành `index.html`** (upload xong có thể đổi tên qua nút ✏️, hoặc đổi tên file trên máy trước khi kéo).
- Bấm **Commit changes**.

**3. Bật GitHub Pages**
- Trong repo: **Settings → Pages**.
- Mục **Build and deployment → Source**: chọn **Deploy from a branch**.
- **Branch**: chọn **main** (hoặc `master`) → thư mục **/ (root)** → **Save**.
- Đợi ~1 phút. Tải lại trang Settings → Pages sẽ thấy dòng "Your site is live at https://<tên-github>.github.io/miatlas/".

**4. Mở & dùng**
- Mở **https://<tên-github>.github.io/miatlas/** trên máy tính / điện thoại.
- Trên điện thoại (Chrome): menu ⋮ → **Add to Home screen** để dùng như một app.
- Rồi làm **Phần B** (bấm ☁ Sync, dán link `/exec` + khóa) **một lần trên mỗi thiết bị**.

**Vì sao cách này hợp với điện thoại:** URL cố định nên localStorage ổn định (nhớ được link + khóa), không gặp cảnh "mở file rời bị mất kết nối". Dữ liệu vẫn nằm trong Sheet riêng — xoá cache điện thoại thì chỉ cần mở lại link + dán khóa là kéo về hết.

**Khi bạn sửa MiAtlas sau này:** cập nhật lại file `index.html` trong repo (**Add file → Upload files**, ghi đè, hoặc sửa trực tiếp) → Commit. GitHub Pages tự cập nhật sau ~1 phút. Nếu không thấy đổi, ở điện thoại hãy tải lại trang (đôi khi cần xoá cache trang).

---

## Cách hoạt động khi dùng nhiều thiết bị

- **Mở MiAtlas trên máy khác**: nó tự kéo bản mới nhất từ Sheet về.
- **Nếu cả hai bên đều đã thay đổi** (ví dụ bạn sửa offline trên điện thoại, đồng thời máy tính cũng đổi): MiAtlas hiện hộp thoại hỏi bạn giữ bản nào — **OK = lấy từ Sheet**, **Cancel = giữ máy này (đẩy lên)**. Không tự ghi đè khi có xung đột thật.
- **Chip trạng thái** (dưới thanh công cụ):
  - `Not linked` — chưa nối.
  - `Synced ✓` — đã đồng bộ.
  - `Changes pending… / Syncing…` — đang đẩy lên.
  - `Sync error` — không gọi được (kiểm tra mạng / link / deployment).

---

## Sửa trực tiếp trên Google Sheet (cách nhanh)

Tab **`Places`** chính là dữ liệu. Bạn có thể mở Sheet và sửa thẳng:

- **Thêm điểm mới**: thêm một hàng, điền `name`, `cat`, `status` (wish/conquered), `lat`, `lng`, `note`. **Để trống cột `id`** — app sẽ tự sinh id.
- **Loại (`cat`) mở**: dùng 4 loại sẵn có (`peak`, `sea`, `loop`, `highlight`) hoặc **tự gõ loại mới** (ví dụ `food`, `waterfall`, `camp`…). Loại mới sẽ tự hiện trên app với biểu tượng 📍 và tự vào bộ lọc. Nhớ gõ **nhất quán một cách viết** cho cùng một loại (ví dụ luôn là `food`, đừng lúc `Food` lúc `food`).
- **Sửa / xoá điểm**: sửa ô hoặc xoá cả hàng.
- **Viết cảm nhận**: gõ vào cột `detail`.
- Lần sau mở MiAtlas (hoặc mở lại), nó tự nhận thay đổi từ Sheet về.

Lưu ý khi sửa tay:

- **Giữ nguyên hàng tiêu đề** và **đừng đổi tên tab `Places`**.
- **Đừng đụng tab ẩn `_blobs`** — đó là ảnh/route do app quản lý.
- **Đừng sửa tay khi app đang mở và đang đẩy dữ liệu.** Sửa một bên (Sheet **hoặc** app), xong để bên kia kéo về, để tránh ghi đè lẫn nhau.

---

## Bảo mật & lưu ý

- Sheet **không public**. Chỉ ai có **cả link `/exec` lẫn khóa bí mật** mới đọc/ghi được. Đừng chia sẻ hai thứ này.
- Nếu nghi bị lộ: mở Apps Script → đổi `SECRET` → **Deploy → Manage deployments → Edit → New version → Deploy**, rồi cập nhật lại khóa trong MiAtlas.
- Ảnh thumbnail và route GPX được lưu ở tab ẩn `_blobs` (dạng JSON, theo id) nên không mất khi bạn sửa tay tab `Places`.
- Vẫn nên thỉnh thoảng bấm **⭳ Export** trong app để có thêm một bản sao lưu rời.

## Khi cập nhật code sau này
Nếu sửa `MiAtlas-Sync.gs`, nhớ **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy** để bản Web App dùng code mới (link `/exec` giữ nguyên).
