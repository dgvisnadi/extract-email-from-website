import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 w-full flex justify-between items-center">
      <Link href="/" className="text-white text-2xl font-bold hover:text-gray-300">
        Extract Emails From Website
      </Link>
      <nav>
        <Link href="/emails-retrieved" className="text-white hover:text-gray-300">
          Emails Retrieved
        </Link>
      </nav>
    </header>
  );
};

export default Header;
