# Thư viện Mây Nhỏ – Bản chuyển động pixel 2.5D

Game web học ngữ pháp và mở rộng vốn từ tiếng Việt lớp 1–5, lấy cảm hứng từ chủ điểm giáo dục của bộ **Kết nối tri thức với cuộc sống**. Các câu hỏi được biên soạn mới; đây không phải trò chơi hay bộ câu hỏi chính thức của nhà xuất bản.

## Chơi nhanh
- Mở tệp `Thu_vien_May_Nho_phien_ban_chuyen_dong.html` tải riêng, hoặc mở `index.html` trong thư mục mã nguồn.
- Đặt tên, chọn cấp lớp, mở cửa thư viện.
- Trên máy tính: WASD hoặc ↑ ← ↓ → để di chuyển, phím **E** hay Space để trò chuyện khi ở gần khách.
- Trên điện thoại: chạm vào một trong bốn khu trên bản đồ để bé tự đi tới đó. Bên dưới bản đồ có các phím di chuyển cảm ứng và nút “Nói chuyện”.
- Bốn khu: phòng đọc, cà phê, quầy quản lí/thu ngân, kho. Khách di chuyển đến đúng khu trước khi bé bắt đầu phục vụ.
- Mỗi ngày bắt đầu với 10 khách, cần tối thiểu 7 sao. Không trừ xu khi trả lời sai, nhưng không nhận sao từ khách đó.
- Trả lời đúng được xu và sao, mở khóa thành tích. Quản lí kho, giá bán, nhập thêm hàng, nâng cấp và thanh toán phí duy trì.
- Kết thúc ngày xem các câu sai và đáp án. Đủ sao thì lên ngày, nếu không thì chơi lại. Tự lưu theo trình duyệt, có chức năng xuất/nhập bản lưu.

## Các tệp mã nguồn
- `index.html`: giao diện và nút điều khiển.
- `style.css`: màu sắc, bố cục, giao diện cảm ứng.
- `game.js`: chuyển động Canvas, cập nhật nhân vật, phục vụ khách, tiền sao, kho, thành tích, lưu dữ liệu.
- `data.js`: 144 tình huống tiếng Việt, lớp 1–5, đúng các bối cảnh của từng khu.
- `HUONG_DAN_LAM_GAME.md`: hướng dẫn cụ thể cho người mới từ A đến Z.

## Giới hạn hiện tại
- Nhân vật đi trên bản đồ Canvas, khách từ cửa tiến về quầy. Mẫu này chưa có hệ thống tránh va chạm với đồ nội thất, sprite sheet nhiều khung hay tìm đường thông minh (A*).
- Các bài viết mở chỉ kiểm tra nội dung không rỗng và dấu chấm cuối câu, không có AI tự chấm câu đúng nghĩa/ngữ pháp.
- Các nghiệp vụ quá hạn và thất lạc được mô phỏng bằng bài hội thoại chứ chưa có lịch trả sách chạy theo ngày thực.
- Game dành cho một thiết bị/người chơi và lưu cục bộ, không có hệ thống tài khoản đám mây.
