# HƯỚNG DẪN SỬ DỤNG MANUL — CHO NGƯỜI MỚI

## Kết quả đã có

Bạn nhận được một website tĩnh hoàn chỉnh gồm giao diện giống phong cách trong video, mascot mèo Manul khăn len xanh, 25 frame WebP, thuật toán Canvas điều khiển theo tọa độ con trỏ, chuyển tiếp mượt, nút CTA, menu điện thoại, bản tiếng Nhật/tiếng Anh và mã nguồn có thể sửa tiếp bằng Codex.

**Giới hạn:** 25 frame là phiên bản tạo từ **một ảnh** để dựng mẫu, không phải 25 góc 3D thực. Phần thuật toán website hoạt động thật, nhưng dáng đầu chỉ biến đổi nhẹ. Muốn nhân vật thực sự quay đầu theo nhiều hướng như clip cần thay bằng 25 ảnh chụp từ animation AI đa góc nhất quán.

## Bước 1: Giải nén

1. Tải `motion-site.zip` và nhấn chuột phải > Extract All.
2. Bạn sẽ thấy thư mục `motion-site` chứa `index.html`, `style.css`, `script.js`, `assets`, `docs`, `tools`.
3. Giữ nguyên tên tệp/thư mục để website tìm được hình ảnh.

## Bước 2: Chạy thử trên Windows

Cách A (đã cài Python):

1. Mở thư mục `motion-site`.
2. Nhấp thanh địa chỉ File Explorer, nhập `cmd` rồi Enter.
3. Nhập lệnh:

   ```bash
   py -3 -m http.server 3000
   ```

4. Mở Chrome, vào `http://localhost:3000`.
5. Di chuyển chuột qua màn hình. Bấm nút `EN` để đổi ngôn ngữ.
6. Để tắt máy chủ, quay lại cửa sổ CMD và nhấn `Ctrl+C`.

Cách B (chưa có Python): Mở thư mục `motion-site` trong VS Code, cài tiện ích **Live Server**, mở `index.html`, chọn **Open with Live Server**. Địa chỉ có thể là `http://127.0.0.1:5500` thay vì cổng 3000.

## Bước 3: Dùng Codex trong Visual Studio Code

1. Mở VS Code.
2. Vào File > Open Folder, chọn thư mục `motion-site` vừa giải nén.
3. Mở Codex trong IDE, đăng nhập nếu tiện ích yêu cầu.
4. Đảm bảo Codex được mở trong **chính workspace `motion-site`**, không phải một thư mục khác.
5. Mở `docs/prompts-analysis.md`, đến phần **Prompt C**, sao chép prompt và gửi cho Codex. Cho phép Codex xem/chỉnh sửa file theo yêu cầu nếu bạn đồng ý.
6. Chạy lại website bằng trình duyệt để xem thay đổi; nếu cần kiểm thử chuyên sâu, tiếp tục đưa **Prompt D**.
7. Bảo Codex giữ nguyên kiến trúc frame/WebP/Canvas và không đổi thành CSS rotate.

### Nếu Codex trả lời đã sửa nhưng trang không thay đổi

- Kiểm tra đúng thư mục workspace chưa.
- Kiểm tra file bạn mở trong VS Code có thay đổi không.
- Nhấn Ctrl+S để lưu tất cả.
- Tải lại trình duyệt bằng Ctrl+Shift+R.
- Nếu vẫn không thấy, kiểm tra Terminal đang chạy web server ở thư mục `motion-site` hay không.

## Bước 4: Đưa lên internet

**Cách dễ:** dùng Vercel Drop: truy cập `https://vercel.com/drop`, kéo thư mục `motion-site` vào, đặt tên dự án rồi Deploy. Bạn cần quyền đăng nhập vào tài khoản Vercel; đây là bước do bạn thực hiện.

**Nếu dùng GitHub:** tạo repository mới, upload nội dung bên trong `motion-site`, kết nối repository đó với Vercel. Chọn **Framework Preset: Other**, Build Command: để trống, Output Directory: `.`. Bấm Deploy. Các lần push sau có thể tạo deployment mới.

## Bước 5: Muốn giống hệt kỹ thuật video hơn

1. Đọc `docs/prompts-analysis.md` — Prompt A: tạo mascot chuẩn.
2. Prompt B: tạo video/ảnh đa hướng chân thật (một góc chuẩn, các góc kế tiếp phải nhất quán).
3. Chọn và chuẩn hóa 25 ảnh cho lưới 5 x 5, xuất WebP với đúng tên trong thư mục `assets/poses`.
4. Thay các file `pose-0-0.webp` đến `pose-4-4.webp` và tải lại web.
5. Nhờ Codex tinh chỉnh điểm neo mắt/mũi, viền lông, tốc độ nội suy và hiệu năng.

**Không cần gọi OpenAI API trả phí mỗi lần truy cập website:** logic sau khi mở trang chạy ở trình duyệt người dùng.
