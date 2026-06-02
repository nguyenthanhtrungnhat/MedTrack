**TÀI LIỆU TỔNG QUAN & TIẾN ĐỘ DỰ ÁN MEDTRACK MOBILE**
*(Sử dụng làm prompt bối cảnh cho các phiên làm việc tiếp theo)*

**1. Mục tiêu cốt lõi của dự án**
Xây dựng một ứng dụng di động (Mobile App) bằng React Native (Expo) và TypeScript cho hệ thống quản lý y tế đa người dùng. Ứng dụng này kết nối trực tiếp với backend đã có sẵn (Node.js/Express, MySQL, JWT) của phiên bản Web, chuyển đổi toàn bộ logic nghiệp vụ, hiển thị dữ liệu bảng biểu phức tạp thành giao diện Mobile-friendly (dạng Card, FlatList) và tối ưu trải nghiệm thiết bị di động.

**2. Quản lý mã nguồn & Môi trường**
* **Cấu trúc thư mục:** Triển khai theo dạng Monorepo. Thư mục `MedTrackMobile` nằm cùng cấp với `Backend` và `Frontend`. Thư mục `.git` con bên trong mobile app đã được gỡ bỏ để Github quản lý tập trung ở thư mục gốc.
* **Kết nối API:** Sử dụng địa chỉ IPv4 vật lý của máy tính (thay vì `localhost`) để đảm bảo Mobile App (chạy qua Expo Go hoặc Simulator) kết nối thành công với Backend nội bộ.
* **Thư viện cốt lõi:** `@react-navigation/native` (điều hướng), `axios` (giao tiếp API), `expo-secure-store` (lưu trữ token an toàn mã hóa bằng phần cứng), `jwt-decode` (giải mã token).

**3. Lộ trình triển khai tổng thể (Roadmap)**
Kế hoạch được chia thành 5 giai đoạn để dễ kiểm soát:
* **Giai đoạn 1: Nền tảng & Xác thực (Authentication) - *Đang thực hiện***. Xây dựng cấu trúc thư mục, quản lý trạng thái đăng nhập, lưu Token an toàn, cấu hình Axios Interceptors và điều hướng phân quyền dựa trên Role (Role-based Navigation).
* **Giai đoạn 2: Module Bệnh nhân (Patient Flow)**. Xây dựng giao diện trang chủ, chức năng đặt lịch khám, quét QR code hồ sơ và xem lịch sử khám bệnh.
* **Giai đoạn 3: Module Nhân sự (Doctor/Nurse Flow)**. Tính năng quản lý phòng bệnh, giường bệnh, form cập nhật sinh hiệu (Daily Checking), kê đơn thuốc (Prescription) và quản lý ca trực.
* **Giai đoạn 4: Tối ưu UI/UX & Native Features**. Xử lý layout bằng Flexbox, tích hợp Push Notifications, tối ưu hiệu năng danh sách dài với FlatList.
* **Giai đoạn 5: Testing & Build**. Kiểm thử toàn bộ API qua Token, đóng gói APK/IPA bằng EAS Build.

**4. Tiến độ đã hoàn thành (Tính đến bước "Kết nối Tab Navigator vào App Navigator")**

* **Setup Axios Client:** Đã cấu hình `axiosClient` tích hợp Interceptors để tự động lấy JWT từ `SecureStore` đính kèm vào Header `Authorization` của mọi request.
* **Quản lý State toàn cục (AuthContext):** Đã xây dựng `AuthContext` có khả năng tự động kiểm tra phiên đăng nhập khi mở app, giải mã Token để lấy `roleID`, cung cấp hàm `login` (lưu token, chuyển state) và `logout` (xóa token, reset state).
* **Luồng Đăng nhập (LoginScreen):** Đã thiết kế xong màn hình UI đăng nhập chống spam click (state `isLoading`), tối ưu bàn phím (`KeyboardAvoidingView`), gọi API `/login` thành công để lấy token.
* **Hệ thống điều hướng lõi (App Navigator):** Đã thiết lập xong `AppNavigator` hoạt động như một "người gác cổng" (Gatekeeper). Nếu chưa có Token -> Hiển thị `LoginScreen`. Nếu có Token -> Đọc `roleID` để đẩy vào các Stack tương ứng (Doctor: 1, Nurse: 2, Patient: 3).
* **Khởi tạo luồng Bệnh nhân (Patient Flow):** * Đã cài đặt `@react-navigation/bottom-tabs`.
    * Đã xây dựng UI cho `PatientHomeScreen` (Dashboard hiển thị tên bệnh nhân, sinh hiệu, nút chức năng) và `PatientProfileScreen` (Giao diện hồ sơ, nút Đăng xuất).
    * Đã tạo `PatientTabNavigator` (chứa 2 tab Home và Profile) và đưa thành công cụm Tab này vào `AppNavigator` tại luồng xử lý của `roleID === 3`. Toàn bộ vòng lặp Đăng nhập -> Vào Trang chủ -> Đăng xuất -> Về Đăng nhập đã hoạt động hoàn hảo.

**5. Bước tiếp theo cần làm**
Chuyển đổi Tab "Home" thành một Stack Navigator nội bộ để có thể xử lý thao tác nhấp chuột từ Trang chủ chuyển sang các trang màn hình con (ví dụ: nhấp vào nút "Hồ sơ bệnh án" để mở ra trang `MedicalHistoryScreen` sử dụng `FlatList`).