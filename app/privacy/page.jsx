import Link from 'next/link';
import Contact from '@/components/Contact';

export const metadata = { alternates: { canonical: '/privacy' }, title: 'Chính sách quyền riêng tư' };

export default function Privacy() {
  return (
    <article className="doc">
      <h1>Chính sách quyền riêng tư</h1>
      <p className="meta">Có hiệu lực từ ngày 17/11/2026</p>

      <p>
        Chính sách này giải thích Anianiworld (“chúng tôi”) thu thập những thông tin nào, dùng vào việc gì và bạn có
        những lựa chọn nào. Chúng tôi chỉ thu thập những gì cần thiết để trang hoạt động.
      </p>

      <h2>1. Thông tin chúng tôi thu thập</h2>
      <h3>Khi bạn tạo tài khoản</h3>
      <ul>
        <li>Đăng ký bằng email: địa chỉ email, tên hiển thị và mật khẩu. Mật khẩu được lưu dưới dạng đã băm, chúng tôi không thể đọc được.</li>
        <li>Đăng nhập bằng Google: tên, địa chỉ email và ảnh đại diện do Google cung cấp. Chúng tôi không nhận được mật khẩu Google của bạn.</li>
      </ul>
      <h3>Khi bạn sử dụng tài khoản</h3>
      <ul>
        <li>Danh sách anime bạn đăng ký theo dõi.</li>
        <li>Lịch sử xem: tập bạn đã xem và thời điểm xem. Lịch sử chỉ được ghi khi bạn đã đăng nhập.</li>
      </ul>
      <h3>Với mọi khách truy cập</h3>
      <ul>
        <li>
          Lượt xem: để mỗi người chỉ được tính một lượt cho mỗi tập trong một ngày, chúng tôi tạo một mã băm không thể
          đảo ngược từ địa chỉ IP và mã video. Chúng tôi không lưu địa chỉ IP; các mã băm này được xóa sau tối đa hai ngày.
        </li>
        <li>
          Thống kê truy cập ẩn danh: chúng tôi đếm số lượt truy cập theo ngày, loại trang được xem và trang web đã dẫn
          bạn tới đây. Số liệu chỉ là tổng theo ngày, không gắn với tài khoản và không dùng cookie; mã băm dùng để
          đếm số khách trong ngày được xóa sau tối đa ba ngày.
        </li>
        <li>Nhật ký kỹ thuật do nhà cung cấp máy chủ ghi lại (ví dụ địa chỉ IP, loại trình duyệt) để vận hành và bảo vệ trang.</li>
        <li>Bộ nhớ trình duyệt: khi bạn đăng nhập, phiên đăng nhập được lưu trên thiết bị của bạn. Chúng tôi không dùng cookie quảng cáo.</li>
      </ul>

      <h2>2. Mục đích sử dụng</h2>
      <ul>
        <li>Tạo và bảo vệ tài khoản, xác minh email, đặt lại mật khẩu.</li>
        <li>Hiển thị danh sách đăng ký và lịch sử xem của bạn.</li>
        <li>Gửi email khi anime bạn đăng ký có tập mới.</li>
        <li>Tính lượt xem và bảng xếp hạng trên trang.</li>
        <li>Phát hiện lạm dụng và duy trì hoạt động ổn định của trang.</li>
      </ul>
      <p>Chúng tôi không bán thông tin cá nhân của bạn và không dùng thông tin đó để quảng cáo.</p>

      <h2>3. Dịch vụ của bên thứ ba</h2>
      <ul>
        <li>
          <strong>YouTube (Google)</strong>: video được phát bằng trình phát nhúng của YouTube. Trang sử dụng YouTube
          API Services. Khi xem video, Google có thể thu thập dữ liệu theo{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Chính sách quyền riêng tư của Google</a>.
        </li>
        <li><strong>Google Sign-In</strong>: dùng khi bạn chọn đăng nhập bằng Google.</li>
        <li><strong>Supabase</strong>: lưu trữ cơ sở dữ liệu và xử lý đăng nhập.</li>
        <li><strong>Vercel</strong>: máy chủ của trang.</li>
        <li><strong>Resend</strong>: gửi email xác minh và email thông báo.</li>
        <li><strong>TMDB</strong>: cung cấp áp phích và thông tin phim. Chúng tôi không gửi thông tin cá nhân của bạn cho TMDB.</li>
      </ul>
      <p>Các nhà cung cấp này có thể xử lý dữ liệu trên máy chủ đặt ngoài quốc gia của bạn.</p>

      <h2>4. Thời gian lưu trữ</h2>
      <p>
        Thông tin tài khoản, danh sách đăng ký và lịch sử xem được lưu cho tới khi bạn xóa chúng hoặc yêu cầu xóa tài
        khoản. Khi tài khoản bị xóa, danh sách đăng ký và lịch sử xem cũng bị xóa theo.
      </p>

      <h2>5. Lựa chọn và quyền của bạn</h2>
      <ul>
        <li>Hủy đăng ký anime và xóa lịch sử xem bất kỳ lúc nào tại <Link href="/account">trang cá nhân</Link>.</li>
        <li>Ngừng nhận email thông báo bằng cách hủy đăng ký anime tương ứng.</li>
        <li>Yêu cầu xem, sửa hoặc xóa dữ liệu cá nhân và tài khoản bằng cách liên hệ với chúng tôi.</li>
        <li>
          Thu hồi quyền truy cập của trang vào tài khoản Google tại{' '}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">trang cài đặt bảo mật của Google</a>.
        </li>
      </ul>

      <h2>6. Trẻ em</h2>
      <p>
        Trang không dành cho người dưới 13 tuổi và chúng tôi không cố ý thu thập thông tin của trẻ em dưới 13 tuổi. Nếu
        bạn cho rằng một trẻ đã cung cấp thông tin cho chúng tôi, hãy liên hệ để chúng tôi xóa.
      </p>

      <h2>7. Bảo mật</h2>
      <p>
        Dữ liệu được truyền qua kết nối mã hóa (HTTPS) và quyền truy cập cơ sở dữ liệu được giới hạn để mỗi thành viên
        chỉ đọc được dữ liệu của chính mình. Không hệ thống nào an toàn tuyệt đối; hãy dùng mật khẩu mạnh và không dùng
        lại mật khẩu ở nơi khác.
      </p>

      <h2>8. Thay đổi chính sách</h2>
      <p>Khi chính sách thay đổi, chúng tôi sẽ đăng phiên bản mới tại trang này cùng ngày hiệu lực mới.</p>

      <h2>9. Liên hệ</h2>
      <Contact />
      <p>
        Xem thêm <Link href="/terms">Điều khoản dịch vụ</Link>.
      </p>
    </article>
  );
}
