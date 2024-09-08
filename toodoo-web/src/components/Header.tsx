interface HeaderProps {
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="text-4xl font-bold text-violet-600 mb-4">
      {children}
    </header>
  );
};

export default Header;
