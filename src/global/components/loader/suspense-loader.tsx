import "./style.css";
const SuspenseLoader = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen bg-[#2e2e2e]">
        <div className="loader">
          <div className="face">
            <div className="circle"></div>
          </div>
          <div className="face">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuspenseLoader;
