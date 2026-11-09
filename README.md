# LibraSpace — Hệ thống quản lý thư viện bằng React

Dự án React thực hành theo các bài JSX, ES6, Components, Props, State, Hooks, React Router, Bootstrap và REST API. Dữ liệu lưu trong **JSON Server**, không yêu cầu backend hay database thật.

## Cài đặt và chạy

Yêu cầu Node.js >= 20.19 (hoặc Node.js 22.12+).

```bash
npm install
```

Mở hai terminal trong thư mục `library-management`:

```bash
# Terminal 1: REST API tại http://localhost:9999
npx json-server --watch db.json --port 9999
```

Bạn cũng có thể dùng `npm run server` để chạy cùng cấu hình.

```bash
# Terminal 2: React tại http://localhost:5173
npm start
```

Sau đó truy cập **http://localhost:5173**.

Kiểm tra project: `npm test` và `npm run build`.

## Cấu trúc source code

```text
library-management/
├── db.json                         # JSON Fake Data, cập nhật khi CRUD
├── index.html
├── package.json
├── vite.config.js
├── tests/
│   └── library.test.js            # Unit test nghiệp vụ
└── src/
    ├── main.jsx                   # React root + BrowserRouter
    ├── App.jsx                    # Định tuyến tới từng màn hình
    ├── styles.css
    ├── constants/
    │   ├── forms.js               # Giá trị ban đầu của form
    │   └── navigation.js          # Cấu hình sidebar
    ├── components/common/
    │   ├── Empty.jsx
    │   ├── Modal.jsx
    │   ├── SectionHeader.jsx
    │   └── Status.jsx
    ├── context/
    │   └── LibraryContext.jsx     # State dùng chung và CRUD actions
    │   └── AuthContext.jsx        # Phiên đăng nhập và đăng xuất
    ├── features/
    │   ├── auth/
    │   │   ├── AuthLayout.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── authService.js
    │   │   └── authUtils.js
    │   ├── dashboard/DashboardPage.jsx
    │   ├── books/BooksPage.jsx
    │   ├── readers/ReadersPage.jsx
    │   ├── loans/LoansPage.jsx
    │   └── categories/CategoriesPage.jsx
    ├── layouts/
    │   └── AppLayout.jsx          # Sidebar, header, footer
    ├── services/
    │   ├── httpClient.js          # fetch, HTTP error handling
    │   └── libraryService.js      # REST endpoints
    └── utils/
        ├── format.js              # Định dạng ngày và tìm kiếm
        └── library.js             # Quy tắc mượn/trả, kho và xóa
```

## Màn hình và chức năng

| Đường dẫn | Chức năng |
| --- | --- |
| `/` | Dashboard: thống kê và phiếu gần đây |
| `/books` | CRUD sách, tìm kiếm, lọc danh mục, kiểm soát số lượng |
| `/readers` | CRUD độc giả, tìm kiếm |
| `/loans` | Lập phiếu mượn, trả sách, hiển thị quá hạn |
| `/categories` | Thêm và xóa danh mục chưa được sử dụng |
| `/login` | Đăng nhập qua email và mật khẩu |
| `/register` | Đăng ký tài khoản mới |

**Tài khoản demo:** sau khi chạy hai terminal, vào `/register` để đăng ký (chưa có tài khoản mặc định). Sau đó bạn sẽ được chuyển về Dashboard. Nút **Đăng xuất** nằm ở góc phải thanh Header và trong khu vực hồ sơ của Sidebar. Thử refresh để kiểm tra trạng thái đăng nhập được giữ, rồi logout để kiểm tra điều hướng về `/login`.

Tài khoản quản trị mẫu: `admin@library.local` / `Admin123!`. Tài khoản đăng ký mới luôn có vai trò User. Admin có thể duyệt yêu cầu mượn, quản lý sách, danh mục, độc giả và tài khoản; User có thể tra cứu sách, gửi yêu cầu mượn và xem lịch sử của mình.

## Luồng chạy ứng dụng

1. `main.jsx` render `App` trong `BrowserRouter`.
2. `LibraryProvider` tải dữ liệu bằng `libraryService.getAll()`.
3. `libraryService` gọi JSON Server qua `httpClient`.
4. Từng trang sử dụng dữ liệu và các hàm `create / update / remove` từ Context.
5. Khi thêm/sửa/xóa, Context gọi API và tải lại dữ liệu để cập nhật các trang.

## Dữ liệu giả lập

`db.json` gồm 5 collections: `users`, `books`, `readers`, `loans`, `categories`. JSON Server tạo REST endpoints tương ứng: `GET /books`, `POST /books`, `PATCH /books/:id`, `DELETE /books/:id`, v.v.

`users` chứa tài khoản đã đăng ký; password được băm bằng PBKDF2-SHA256 với salt riêng cho từng tài khoản. Chỉ thông tin tên/email/id được lưu trong localStorage để mô phỏng phiên đăng nhập.

Để reset dữ liệu, lưu bản sao `db.json` trước khi thử CRUD và chép nội dung bản sao trở lại khi dừng server.

> **Quan trọng về bảo mật:** Đây là xác thực giả lập để thực hành React, hoàn toàn không phải hệ thống xác thực an toàn. JSON Server công khai các API, bao gồm dữ liệu `users`; session trên localStorage có thể bị giả mạo và route protection chỉ thực hiện phía trình duyệt. Không dùng mật khẩu thật, không đưa dữ liệu cá nhân thật vào project. Trong production cần backend thực để xác thực, phân quyền, lưu mật khẩu và cấp session/token bảo mật.
