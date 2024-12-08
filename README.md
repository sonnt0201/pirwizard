# Hướng dẫn cho Mừng

## Tổng quan

App này thực chất là một local web server.

Ông tải về, chạy app này và mở giao diện trên browser.

Hiện tại tôi mới xong phần quay vid và hiện đồ thị. Ông test xem hiện đồ thị còn giật như app cũ không.
(Khả năng cái này còn giật thì tôi cx ko biết tối ưu hơn thế nào nữa :v )

## Cài đặt

Clone git này

Mở terminal trong thư mục `pir wizard` và chạy.

```shell
npm i
```

Build bản **product**

```shell
npm run build
```

Chờ cho nó build xong.

Chạy giao diện

```shell
npm run start
```

Sau khi khởi động xong, app sẽ báo là đang chạy ở cổng  `port 3000`

```shell
> pirwizard@0.1.0 start
> next start

   ▲ Next.js 15.0.3
   - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 370ms
```

Ông truy cập vào `http://localhost:3000` ở browser.

## Gợi ý

Database của ông đầy do ghi nhiều rồi, ông nên sao lưu (copy) file database cũ `pir-dev.db` vào đâu đó.

Còn file `pir-dev.db` hiện tại, ông mở trên `DB Browser for SQLite` rồi xóa hết dữ liệu (hàng) trong table `Records` đi.

```sql
DELETE from Records where 1=1
```
Nhấn `Write Changes` để lưu database mới rồi chạy server.

Cho nhẹ database.

## Sử dụng

Khi lưu file video, không được đổi tên file do app đã tạo sẵn

## Tiến độ

Trong hết ngày hôm nay tôi cố code nhanh để xong phần gán nhãn
