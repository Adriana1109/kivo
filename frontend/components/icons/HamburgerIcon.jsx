/**
 * HamburgerIcon - Ícono de menú hamburguesa reutilizable
 */
function HamburgerIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20 5H4a1 1 0 000 2h16a1 1 0 100-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Zm0 6H4a1 1 0 000 2h16a1 1 0 000-2Z" />
    </svg>
  );
}

export default HamburgerIcon;
