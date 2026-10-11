# TÀI LIỆU HƯỚNG DẪN SỬ DỤNG HỆ THỐNG MEYZI STUDIO

## 1. Giới thiệu tổng quan
MEYZI STUDIO là phần mềm quản lý chuyên biệt dành cho studio trang điểm và làm tóc (Makeup & Hair). Hệ thống hỗ trợ quản lý toàn diện lịch hẹn, thông tin khách hàng, tiền cọc, công nợ và đội ngũ nhân sự trên cùng một giao diện trực quan, đồng bộ trên cả máy tính (Desktop) và điện thoại (Mobile).

---

## 2. Khởi chạy và truy cập hệ thống
- Yêu cầu môi trường: Đã cài đặt Node.js phiên bản 18 trở lên.
- Các bước khởi chạy dự án tại thư mục nguồn:
  1. Mở cửa sổ dòng lệnh (Terminal/PowerShell) tại thư mục dự án.
  2. Cài đặt các gói phụ thuộc (nếu là lần đầu chạy):
     npm install
  3. Khởi động máy chủ phát triển cục bộ:
     npm run dev
  4. Truy cập hệ thống trên trình duyệt:
     http://localhost:5173/

- Thông tin đăng nhập bảo mật hệ thống:
  - Tài khoản: admin
  - Mật khẩu: 10102020
  - Hệ thống ghi nhớ phiên đăng nhập trên thiết bị. Bạn có thể bấm "Đăng xuất" ở menu hồ sơ hoặc thanh điều hướng bất kỳ lúc nào để khóa lại hệ thống.

---

## 3. Quản lý lịch hẹn và khách hàng

### 3.1. Thêm mới lịch hẹn
- Cách 1: Bấm nút "Thêm lịch hẹn" ở góc trên bên phải thanh Header.
- Cách 2: Di chuột vào bất kỳ ô ngày nào trên bảng lịch tháng và bấm vào biểu tượng dấu cộng lớn xuất hiện trong ô ngày đó.
- Cách 3: Bấm nút "Thêm khách mới" trong menu thông tin cá nhân ở góc trên bên phải.

Các trường thông tin trong form thêm mới:
- Họ tên khách hàng (bắt buộc): Nhập tên đầy đủ của khách.
- Số điện thoại (bắt buộc): Nhập số điện thoại liên hệ của khách.
- Địa chỉ làm việc:
  - Chọn Tỉnh / Thành phố từ danh mục 34 đơn vị hành chính sau sáp nhập.
  - Chọn Phường / Xã / Khu vực tương ứng.
  - Nhập chi tiết số nhà, ngõ/đường, thôn xóm (tùy chọn).
  - Hệ thống tự động ghép thành chuỗi địa chỉ hoàn chỉnh, có thể gõ chỉnh sửa trực tiếp.
- Ngày làm việc và Giờ hẹn: Chọn ngày thực hiện dịch vụ và thời gian đón khách hoặc đến nhà khách.
- Dịch vụ: Chọn một hoặc nhiều dịch vụ trong danh sách (Makeup cô dâu, Làm tóc, Chụp ảnh, Thuê phụ kiện, Makeup ăn hỏi, Makeup đi tiệc).
- Phân công nhân viên: Chọn thợ Makeup và thợ Làm tóc phụ trách từ danh sách nhân sự hiện có.
- Tổng tiền và Tiền cọc:
  - Nhập tổng giá trị dịch vụ.
  - Nhập số tiền khách đặt cọc trước (nếu có).
  - Hệ thống tự động tính số tiền còn lại và gắn trạng thái tương ứng (Chưa cọc, Đã cọc, Đã thanh toán).
- Ghi chú: Ghi chú yêu cầu đặc biệt của khách (phong cách trang điểm, địa điểm cụ thể, giờ khởi hành sớm).

Bấm nút "Lưu lịch hẹn" để hoàn tất.

### 3.2. Xem thông tin chi tiết khách hàng
- Trên bảng lịch: Bấm vào thanh tên khách hàng trong ô ngày hoặc khung giờ.
- Trên bảng danh sách khách hàng phía dưới: Bấm vào dòng khách hàng tương ứng.
- Thanh chi tiết bên phải màn hình sẽ mở ra với đầy đủ thông tin: họ tên, phân loại, trạng thái, số điện thoại, địa chỉ, ngày giờ, nhân viên phụ trách, danh sách dịch vụ, tiền cọc, số tiền còn lại và lịch sử các lần thanh toán.

### 3.3. Chỉnh sửa thông tin lịch hẹn
- Trong thanh chi tiết khách hàng bên phải, bấm nút "Sửa lịch" hoặc bấm nút "Sửa" trên thanh tiêu đề trang chi tiết mobile.
- Cửa sổ biểu mẫu sẽ mở ra với toàn bộ thông tin hiện tại của khách hàng.
- Thực hiện cập nhật các trường cần thay đổi và bấm "Cập nhật thay đổi".

### 3.4. Xóa lịch hẹn
- Trong thanh chi tiết khách hàng bên phải, bấm nút "Xóa khách".
- Xác nhận hộp thoại đồng ý xóa để gỡ lịch hẹn khỏi hệ thống.

---

## 4. Quản lý tiền cọc, thanh toán và công nợ

### 4.1. Trạng thái thanh toán tự động
- Chưa cọc: Số tiền cọc bằng 0. Thẻ hiển thị màu vàng hổ phách.
- Đã cọc: Số tiền cọc lớn hơn 0 nhưng nhỏ hơn tổng tiền. Thẻ hiển thị màu xanh lá cây hoặc đỏ nhạt.
- Đã thanh toán: Số tiền đã cọc/đã thanh toán bằng tổng tiền (số tiền còn lại bằng 0). Thẻ hiển thị nhãn Đã thanh toán.

### 4.2. Thu thêm tiền cọc hoặc thanh toán từng phần
- Khi khách hàng còn nợ (số tiền còn lại lớn hơn 0), mở thanh chi tiết khách hàng và bấm nút "Thu thêm".
- Nhập số tiền thực nhận thêm từ khách.
- Nhập nội dung ghi chú (ví dụ: Chuyển khoản cọc đợt 2, Tiền mặt thanh toán thử váy).
- Bấm "Xác nhận thu tiền". Hệ thống sẽ cộng dồn số tiền đã thu, giảm trừ tiền còn nợ và tự động lưu vào lịch sử thanh toán với thời gian thực.

### 4.3. Tất toán đủ công nợ (1-Click)
- Tại thanh chi tiết của khách hàng còn nợ, bấm nút "Thanh toán đủ".
- Hệ thống tự động thu nốt toàn bộ số tiền còn thiếu, đưa dư nợ về 0, chuyển trạng thái sang "Đã thanh toán" và ghi nhận vào lịch sử giao dịch.

---

## 5. Quản lý đội ngũ nhân sự (Thợ Makeup & Làm tóc)

### 5.1. Mở giao diện quản lý nhân sự
Có thể mở hộp thoại quản lý nhân sự theo 3 cách:
- Cách 1: Bấm mục "Đội ngũ nhân sự" trên thanh điều hướng Sidebar bên trái.
- Cách 2: Bấm nút biểu tượng nhân sự nằm cạnh ô chọn thợ trên thanh Top Header.
- Cách 3: Bấm nút "+ Quản lý thợ" ngay trong form thêm/sửa lịch hẹn khách hàng.
- Cách 4: Bấm mục "Quản lý nhân viên" trong menu tài khoản góc trên bên phải.

### 5.2. Thêm nhân viên mới
- Trong hộp thoại "Đội Ngũ Nhân Viên MEYZI STUDIO", bấm nút "+ Thêm thợ mới".
- Điền các trường:
  - Họ và tên (bắt buộc): Tên của thợ.
  - Số điện thoại: Số điện thoại liên hệ cá nhân.
  - Chuyên môn chính: Chọn một trong ba nhóm (Chuyên Makeup, Chuyên Làm tóc, Cả hai Makeup & Làm tóc).
  - Chức danh / Vai trò hiển thị: Nhập vai trò hiển thị (ví dụ: Makeup Artist, Hair Stylist, Chuyên viên chính).
  - Ghi chú kinh nghiệm / phong cách: Ví dụ về phong cách sở trường, số năm kinh nghiệm.
- Bấm nút "Lưu nhân viên". Dữ liệu sẽ lưu ngay lập tức vào bộ nhớ máy và đồng bộ vào file staff.json.

### 5.3. Chỉnh sửa nhân viên
- Tại thẻ của nhân viên cần sửa trong danh sách, bấm nút biểu tượng cây bút.
- Biểu mẫu chỉnh sửa sẽ hiển thị thông tin hiện tại của thợ.
- Điều chỉnh thông tin và bấm nút "Cập nhật thay đổi".

### 5.4. Xóa nhân viên
- Tại thẻ của nhân viên cần xóa, bấm nút biểu tượng thùng rác màu đỏ.
- Xác nhận hộp thoại xóa để gỡ nhân viên khỏi danh sách.

### 5.5. Xem lịch làm việc theo từng thợ
- Tại thẻ của nhân viên trong hộp thoại quản lý nhân sự, bấm nút "Xem lịch".
- Bảng lịch làm việc bên ngoài sẽ tự động lọc và chỉ hiển thị các khách hàng được phân công cho nhân viên đó.
- Hoặc chọn trực tiếp tên thợ tại thanh thả xuống trên Header để lọc nhanh.

---

## 6. Xem và lọc lịch làm việc

### 6.1. Chế độ xem thời gian
- Xem theo Tháng (Month): Hiển thị toàn bộ các ngày trong tháng theo dạng ô lịch lưới. Các ngày có lịch hẹn sẽ hiển thị thanh tóm tắt khách hàng.
- Xem theo Tuần (Week): Hiển thị 7 ngày trong tuần với phân bổ theo từng khung giờ từ 06:00 đến 18:00.
- Xem theo Ngày (Day): Hiển thị chi tiết toàn bộ các khung giờ và danh sách khách hàng trong ngày được chọn.

### 6.2. Điều hướng thời gian
- Nút mũi tên trái / phải: Chuyển lùi hoặc tiến một tháng/tuần/ngày.
- Nút "Hôm nay": Đưa lịch làm việc quay trở về ngày thực tế hiện tại.
- Hộp chọn tháng: Bấm trực tiếp vào tên tháng (ví dụ: Tháng 11, 2026) để chọn nhanh bất kỳ tháng nào trong năm từ danh sách xổ xuống.

### 6.3. Bộ lọc trạng thái và dịch vụ
- Lọc theo thanh bên trái (Sidebar):
  - Lịch hẹn khách: Xem toàn bộ lịch hẹn.
  - Khách đã cọc: Chỉ xem các khách đã đóng cọc.
  - Chưa cọc & Nợ: Lọc nhanh các khách chưa đóng cọc hoặc chưa hoàn tất tiền nợ.
- Lọc theo loại dịch vụ: Bấm các thẻ lọc phía trên bảng danh sách khách (Tất cả, Cô dâu, Ăn hỏi, Tiệc, Chụp ảnh).

### 6.4. Tìm kiếm thông minh
- Bấm vào thanh tìm kiếm trên Top Header.
- Nhập từ khóa: Tên khách hàng, số điện thoại, ghi chú dịch vụ hoặc khu vực địa chỉ.
- Bảng dữ liệu tự động lọc theo thời gian thực ngay khi gõ.

---

## 7. Báo cáo doanh thu và nhắc nhở công nợ

### 7.1. Báo cáo doanh thu
- Bấm mục "Báo cáo doanh thu" trên Sidebar hoặc menu tài khoản.
- Xem tổng hợp các chỉ số:
  - Tổng doanh thu dự kiến (tổng giá trị tất cả hợp đồng).
  - Thực thu (tiền cọc và tiền đã thanh toán đã vào quỹ).
  - Tổng công nợ còn lại cần thu.
  - Danh sách chi tiết các khách hàng đang nợ tiền kèm số điện thoại để liên hệ thu hồi nợ.

### 7.2. Trung tâm thông báo nhắc lịch
- Bấm vào biểu tượng chuông thông báo trên Header.
- Hệ thống tự động phân loại:
  - Khách hàng chưa đóng cọc: Kèm nút gửi tin nhắn nhắc nhở hoặc gọi điện xác nhận.
  - Khách hàng sắp đến ngày làm việc nhưng còn nợ tiền: Cảnh báo nhắc chuẩn bị số tiền còn thiếu.

---

## 8. Sao lưu, xuất báo cáo và khôi phục dữ liệu

### 8.1. Xuất file báo cáo Excel (CSV)
- Mở cửa sổ "Cài đặt & Sao lưu" từ Sidebar hoặc menu tài khoản.
- Bấm nút "Xuất báo cáo Excel (CSV)".
- File tải về có định dạng chuẩn tiếng Việt (UTF-8 with BOM), tương thích trực tiếp với Microsoft Excel và Google Sheets, đầy đủ các cột: STT, Họ tên, Số điện thoại, Địa chỉ, Ngày làm, Giờ làm, Dịch vụ, Thợ Makeup, Thợ Tóc, Tổng tiền, Đã cọc, Còn lại, Trạng thái, Ghi chú.

### 8.2. Sao lưu file dự phòng (JSON)
- Trong cửa sổ "Cài đặt & Sao lưu", bấm "Tải bản sao lưu (JSON)".
- Hệ thống xuất toàn bộ cơ sở dữ liệu khách hàng hiện tại thành file văn bản JSON lưu trên máy tính.

### 8.3. Khôi phục dữ liệu từ bản sao lưu
- Trong cửa sổ "Cài đặt & Sao lưu", bấm nút "Chọn file sao lưu (.json)".
- Chọn file JSON đã sao lưu trước đó từ máy tính.
- Hệ thống sẽ nạp lại toàn bộ dữ liệu khách hàng và đồng bộ tự động.

### 8.4. Xóa trắng dữ liệu để nhập mới
- Khi bắt đầu chu kỳ kinh doanh mới hoặc muốn dọn dẹp dữ liệu thử nghiệm, mở menu tài khoản ở góc trên bên phải hoặc cửa sổ Cài đặt, chọn "Xóa trắng dữ liệu".
- Xác nhận cảnh báo để đưa danh sách khách hàng về trạng thái trống và bắt đầu nhập dữ liệu mới.

---

## 9. Tùy chỉnh thông tin chủ studio và cơ sở
- Bấm vào khối tên chủ studio ở góc trên bên phải thanh Header.
- Bấm biểu tượng cây bút chỉnh sửa thông tin hồ sơ.
- Có thể thay đổi:
  - Tên chủ studio / Người quản lý.
  - Chức danh / Vị trí hiển thị.
  - Tên cơ sở / Chi nhánh làm việc.
- Bấm "Lưu" để cập nhật. Thông tin mới sẽ hiển thị tại tiêu đề và trên các hóa đơn, phiếu thu in ấn.

---

## 10. Chế độ sử dụng trên điện thoại (Mobile)
- Hệ thống tự động nhận diện kích thước màn hình điện thoại dưới 1024px để chuyển sang giao diện ứng dụng di động tối ưu cho thao tác chạm một tay.
- Các màn hình chính trên mobile:
  - Màn hình Lịch tháng: Thanh lướt chọn ngày theo tuần, lịch lưới thu gọn, danh sách khách theo ngày được chọn.
  - Màn hình Lịch giờ: Bảng phân bổ theo khung giờ 06:00 - 18:00, lọc theo thợ nhanh chóng.
  - Màn hình Thêm khách: Form nhập liệu một cột vừa vặn màn hình điện thoại, chọn nhanh dịch vụ bằng nút chạm.
  - Màn hình Chi tiết khách: Nút gọi điện và gửi tin nhắn 1-chạm, kiểm tra công nợ và thu thêm tiền thuận tiện.
  - Màn hình Danh sách khách: Xem toàn bộ khách hàng theo dạng danh sách thẻ, tìm kiếm nhanh theo tên và số điện thoại.
