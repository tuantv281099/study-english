# Hướng dẫn Deploy lên GitHub Pages

Để cập nhật trang web lên GitHub Pages sau khi bạn đã chỉnh sửa code, hãy làm theo các bước sau:

1.  **Đảm bảo code của bạn đã được lưu**:
    Kiểm tra xem bạn đã lưu tất cả các file chưa.

2.  **Mở Terminal**:
    Mở terminal tại thư mục gốc của dự án (`d:\Home\Work\English\study-english`).

3.  **Chạy lệnh deploy**:
    Nhập lệnh sau và nhấn Enter:

    ```bash
    npm run deploy
    ```

    Lệnh này sẽ tự động:
    - Build dự án (tạo thư mục `dist`).
    - Đẩy nội dung thư mục `dist` lên nhánh `gh-pages` trên GitHub.

4.  **Kiểm tra kết quả**:
    Sau khi lệnh chạy xong và báo "Published", bạn có thể truy cập trang web tại:
    [https://tuantv281099.github.io/study-english/](https://tuantv281099.github.io/study-english/)

    *(Lưu ý: Có thể mất vài phút để thay đổi được cập nhật trên trang web)*
