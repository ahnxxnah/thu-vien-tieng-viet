# Hướng dẫn làm game Thư viện Mây Nhỏ (pixel 2.5D chuyển động)

## Bài 1. Hiểu được cách game hoạt động
**Công cụ:** máy tính Windows hoặc macOS, trình duyệt Chrome/Edge/Safari, trình biên tập Visual Studio Code (miễn phí).

Game dùng 3 công nghệ: **HTML** (nút bấm, hộp thoại, biểu mẫu), **CSS** (kiểu dáng ấm áp), và **JavaScript + Canvas 2D** (vẽ và di chuyển nhân vật, quy luật trò chơi). Không cần học Godot trước.

Trong game: `index.html` gọi `data.js` trước rồi gọi `game.js`. File `data.js` tạo ngân hàng câu hỏi; file `game.js` đọc ngân hàng đó để chọn ngữ cảnh theo `zone` và `grade`.

## Bài 2. Chạy game lần đầu
1. Giải nén tệp ZIP mã nguồn.
2. Vào thư mục `thu_vien_may_nho` rồi nhấp đúp `index.html` để thử.
3. Nếu trình duyệt có giới hạn với tệp cục bộ, mở thư mục trong VS Code, cài extension **Live Server**, bấm chuột phải `index.html` → **Open with Live Server**.
4. Đặt tên và chọn lớp 1, bấm “Lưu và bắt đầu”.
5. Nhấn WASD hoặc các phím mũi tên. Giữ nút di chuyển trên điện thoại; chạm phòng để nhân vật tự đi tới.
6. Khi gần khách, bấm **E** hay nút **Nói chuyện**. Mọi câu hỏi vẫn xuất hiện như hội thoại trong bảng bên phải (trên điện thoại ở dưới bản đồ).

## Bài 3. Chuyển động nhân vật được lập trình như thế nào?

Mở `game.js`. Tìm `stepActor(dt)`.

- `actor.x` và `actor.y` là vị trí của bé trên bản đồ.
- `actor.keys` lưu các phím đang được giữ.
- `actor.dest` là điểm đích khi bé chạm vào một phòng.
- `dt` là số giây trôi qua giữa hai khung hình. Nhờ nhân tốc độ với `dt`, máy nhanh hay chậm đều có tốc độ di chuyển gần giống nhau.
- `art(time)` vẽ lại cảnh và các nhân vật bằng `requestAnimationFrame(art)` khoảng mỗi khung hình hiển thị.
- `drawLibrarian()` dùng các ô màu nhỏ để tạo hình nhân vật pixel. Nếu muốn nhân vật khác đẹp hơn, thay bằng **sprite sheet PNG**, vẽ bằng `drawImage()` và cắt theo từng khung hình.
- `drawGuestSprites(dt)` theo dõi vị trí của khách. Khách đi từ cửa ra tới phòng đúng yêu cầu; khi phục vụ xong sẽ rời thư viện.

**Phần nâng cao sau này:** TileMap để giới hạn đường đi, va chạm với bàn ghế; A* để khách tìm đường tránh vật cản; sprite 4 hướng đi, đứng, tương tác.

## Bài 4. Tự thêm câu hỏi tiếng Việt đúng khu vực
Mở `data.js`, tìm các câu bắt đầu bằng `mc(`, `multi(`, `order(` hoặc `write(`. Mỗi câu có trường **zone** và **grade**.

Ví dụ thêm câu hỏi trắc nghiệm chỉ xuất hiện ở góc cà phê, lớp 1:

```js
mc('cafe',1,'Nguyên âm','Khách mua cà phê',
  'Trong từ “cà phê” có các nguyên âm nào?',
  ['a','ê','a và ê','Không có'],
  2,
  'Tiếng “cà” có nguyên âm a; tiếng “phê” có nguyên âm ê.');
```

Giải thích: `cafe` là khu cà phê; `1` là lớp 1; phương án được lưu theo thứ tự A/B/C/D; `2` là đáp án C (vì lập trình đếm từ 0).

Ví dụ câu lớp 4 chỉ xuất hiện trong phòng đọc:

```js
mc('reading',4,'Danh từ','Khách tìm sách',
  'Từ nào là danh từ trong câu “Bạn Mai đọc sách”?',
  ['đọc','sách','đang','chăm chỉ'],
  1,
  '“Sách” là danh từ chỉ đồ vật.');
```

Các khu hợp lệ: `counter` (quầy quản lí), `cafe` (cà phê), `reading` (phòng đọc), `warehouse` (kho).

Các cấp lớp phải đúng 1, 2, 3, 4 hoặc 5. Game tự lấy cả câu hỏi lớp thấp hơn ở cấp cao hơn.

**Đổi độ khó:** Tìm hàm `pickQ(zone,grade,used)` trong `game.js`. Hàm lọc `q.zone===zone` và `q.grade<=grade`, vì vậy câu cà phê không lẫn vào phòng đọc.

## Bài 5. Thêm khu và nâng cấp đồ họa

Phiên bản hiện tại có 4 khu cố định. Nếu muốn thêm **góc kể chuyện**, phải:
1. Thêm `story` vào hằng số `ZONES` ở đầu `data.js`.
2. Thêm các câu hỏi với `zone = 'story'`.
3. Thêm tọa độ tới `WALK_STOPS` trong `game.js`.
4. Vẽ góc kể chuyện trong `art(time)` và sửa phép xác định vùng khi chạm canvas.
5. Bổ sung quy tắc số khách, kho/nâng cấp nếu cần.

Để đổi màu, cỡ chữ, nút bấm: chỉnh `style.css`. Muốn ảnh pixel đẹp, bạn có thể vẽ từng sprite trong **Aseprite**, **LibreSprite** hoặc **Piskel**, rồi thay những hình nhân vật do Canvas vẽ hiện tại bằng hình PNG. Không lấy nguyên hình nhân vật từ game của người khác nếu không có quyền sử dụng.

## Bài 6. Lưu và đăng game thành link website giống mẫu
1. Tạo tài khoản GitHub, chọn **New repository** và đặt tên, ví dụ `thu-vien-may-nho`.
2. Bấm **Add file → Upload files**, tải bốn file `index.html`, `style.css`, `data.js`, `game.js` vào **thư mục gốc** repository.
3. Chọn **Commit changes**.
4. Vào **Settings → Pages**.
5. Phần **Build and deployment**, chọn **Deploy from a branch**, branch `main`, folder `/ (root)`, rồi **Save**.
6. Đợi GitHub Pages hoàn thành. Link có dạng `https://ten-tai-khoan.github.io/thu-vien-may-nho/`.

Không cần thuê hosting cho trò chơi tĩnh này. Với bản hiện tại, dữ liệu lưu trong trình duyệt qua `localStorage`; sang một thiết bị/trình duyệt mới thì cần dùng chức năng **xuất bản lưu** và **nhập bản lưu** trong Cài đặt.

## Những tính năng nên làm tiếp (sau khi thử bản này)
- Sprite nhân vật 4 hướng × 3 khung hoạt hình cho mỗi hướng.
- Đường đi dựa vào ô lưới và va chạm nội thất; khách xếp hàng thật sự trước quầy.
- Hội thoại nhiều lượt, hiệu ứng gõ chữ và âm thanh tiếng Việt đọc lời thoại.
- Dữ liệu từ vựng sâu hơn theo từng bài của SGK, phân nhóm lớp học và mức tiến bộ.
- Chấm bài viết 1–2 câu theo mẫu có kiểm tra chính tả; cung cấp lựa chọn người lớn duyệt, không chỉ dựa vào dấu chấm.
- Lưu đồng bộ giữa các thiết bị qua tài khoản nếu sau này có máy chủ.
