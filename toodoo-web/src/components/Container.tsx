interface ContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="flex flex-col items-center justify-center 
          min-h-screen bg-gray-900"
    >
      {children}
    </div>
  );
};

export default MainContainer;
