import { CONTACT_EMAIL } from '@/lib/config';

export default function Contact() {
  return CONTACT_EMAIL ? (
    <p>
      Mọi câu hỏi hoặc yêu cầu, vui lòng gửi email tới <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
    </p>
  ) : (
    <p>Thông tin liên hệ sẽ được cập nhật tại trang này.</p>
  );
}
