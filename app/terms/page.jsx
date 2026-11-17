import Link from 'next/link';
import Contact from '@/components/Contact';

export const metadata = { alternates: { canonical: '/terms' }, title: 'Điều khoản dịch vụ' };

export default function Terms() {
  return (
    <article className="doc">
      <h1>Điều khoản dịch vụ</h1>
      <p className="meta">Có hiệu lực từ ngày 17/11/2026</p>

      <p>
        Chào mừng bạn đến với Anianiworld (“chúng tôi”, “trang”). Khi truy cập hoặc sử dụng trang tại anianiworld.com,
        bạn đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng trang.
      </p>

      <h2>1. Dịch vụ của chúng tôi</h2>
      <p>
        Anianiworld là trang lập chỉ mục anime có bản quyền được phát miễn phí trên các kênh YouTube chính thức. Mọi
        video được phát bằng trình phát nhúng của YouTube. Chúng tôi không lưu trữ, tải lên, chuyển mã hay phân phối
        bất kỳ tệp video nào, và không liên kết với YouTube, Google hay các đơn vị giữ bản quyền.
      </p>
      <p>
        Việc xem video trên trang đồng nghĩa với việc bạn cũng chịu sự ràng buộc của{' '}
        <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">Điều khoản dịch vụ của YouTube</a>.
      </p>

      <h2>2. Tài khoản</h2>
      <ul>
        <li>Bạn có thể dùng trang mà không cần tài khoản. Tài khoản cho phép đăng ký theo dõi anime, nhận email khi có tập mới và lưu lịch sử xem.</li>
        <li>Bạn có thể đăng ký bằng email (cần xác minh địa chỉ email) hoặc bằng tài khoản Google.</li>
        <li>Bạn chịu trách nhiệm giữ bí mật mật khẩu và mọi hoạt động diễn ra trong tài khoản của mình.</li>
        <li>Thông tin đăng ký phải chính xác. Không được mạo danh người khác.</li>
        <li>Người dưới 13 tuổi không được tạo tài khoản. Người chưa thành niên cần có sự đồng ý của cha mẹ hoặc người giám hộ.</li>
      </ul>

      <h2>3. Sử dụng được phép</h2>
      <p>Khi sử dụng trang, bạn đồng ý không:</p>
      <ul>
        <li>tải xuống, sao chép hoặc phát lại video bằng cách vượt qua trình phát của YouTube;</li>
        <li>dùng công cụ tự động để thu thập dữ liệu hàng loạt, làm sai lệch lượt xem hoặc bảng xếp hạng;</li>
        <li>can thiệp, tấn công hoặc gây quá tải cho hệ thống của trang;</li>
        <li>sử dụng trang cho mục đích trái pháp luật.</li>
      </ul>

      <h2>4. Nội dung và quyền sở hữu trí tuệ</h2>
      <p>
        Video, hình ảnh, tên và nhân vật thuộc về các chủ sở hữu tương ứng. Áp phích, tên phim và phần giới thiệu chỉ
        được hiển thị để giúp nhận biết tác phẩm; một phần thông tin và hình ảnh do TMDB cung cấp. Video có thể bị kênh
        phát hành gỡ xuống hoặc giới hạn theo khu vực bất kỳ lúc nào, nằm ngoài sự kiểm soát của chúng tôi.
      </p>
      <p>
        Nếu bạn là chủ sở hữu quyền và cho rằng nội dung trên trang xâm phạm quyền của mình, hãy liên hệ với chúng tôi
        kèm thông tin về tác phẩm và đường dẫn liên quan. Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.
      </p>

      <h2>5. Email thông báo</h2>
      <p>
        Khi bạn đăng ký theo dõi một anime, chúng tôi có thể gửi email khi anime đó có tập mới. Bạn có thể hủy đăng ký
        bất kỳ lúc nào tại <Link href="/account">trang cá nhân</Link>.
      </p>

      <h2>6. Tạm ngừng và chấm dứt</h2>
      <p>
        Bạn có thể ngừng sử dụng và yêu cầu xóa tài khoản bất kỳ lúc nào. Chúng tôi có thể tạm khóa hoặc xóa tài khoản
        vi phạm các điều khoản này, và có thể thay đổi hoặc ngừng cung cấp một phần hay toàn bộ dịch vụ.
      </p>

      <h2>7. Miễn trừ và giới hạn trách nhiệm</h2>
      <p>
        Trang được cung cấp miễn phí, “nguyên trạng”. Chúng tôi không bảo đảm trang luôn hoạt động liên tục, không có
        lỗi, hay nội dung luôn đầy đủ và chính xác. Trong phạm vi pháp luật cho phép, chúng tôi không chịu trách nhiệm
        về các thiệt hại phát sinh từ việc sử dụng hoặc không thể sử dụng trang.
      </p>

      <h2>8. Thay đổi điều khoản</h2>
      <p>
        Chúng tôi có thể cập nhật các điều khoản này. Phiên bản mới có hiệu lực khi được đăng tại trang này cùng ngày
        hiệu lực mới. Việc tiếp tục sử dụng trang sau đó đồng nghĩa với việc bạn chấp nhận điều khoản đã cập nhật.
      </p>

      <h2>9. Liên hệ</h2>
      <Contact />
      <p>
        Xem thêm <Link href="/privacy">Chính sách quyền riêng tư</Link>.
      </p>
    </article>
  );
}
