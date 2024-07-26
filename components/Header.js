import Link from 'next/link';

const Header = () => {
  return (
<div class="navbar bg-neutral text-neutral-content">
<div class="flex-1">
  <a class="btn btn-ghost text-xl" href="/">Extract Emails From Website</a>
</div>
<div class="flex-none">
  <ul class="menu menu-horizontal px-1">
    <li><a href="/emails-retrieved">Emails Retrieved</a></li>
  </ul>
</div>
</div>
  );
};

export default Header;
