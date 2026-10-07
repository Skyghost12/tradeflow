import "./LoadingScreen.css";

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-screen__mark">TradeFlow</div>
    <div className="loading-screen__bar">
      <div className="loading-screen__bar-fill" />
    </div>
  </div>
);

export default LoadingScreen;
