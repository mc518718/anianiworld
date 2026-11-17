// "Continue with Google" button in Google's light style: white surface, dark text and
// Google's own "G" mark, loaded from Google's servers.
const G_MARK = 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg';

export default function GoogleButton({ onClick, children }) {
  return (
    <button type="button" className="gbtn" onClick={onClick}>
      <img src={G_MARK} alt="" width="20" height="20" />
      <span>{children}</span>
    </button>
  );
}
