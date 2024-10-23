// import { useEffect } from "react";

const TradingView = () => {
  // useEffect(() => {
  //   if (window.TradingView) {
  //     new window.TradingView.widget({
  //       symbol: "BNBUSDT", // BNB/CAKE symbol on Binance
  //       container_id: "tradingview_chart",
  //       autosize: true,
  //       theme: "dark", // You can set it to 'light' if you want
  //       style: "1", // 1 represents the bar chart style (1 for candlestick)
  //       locale: "en",
  //       toolbar_bg: "#f1f3f6",
  //       enable_publishing: false,
  //       withdateranges: true,
  //       hide_side_toolbar: false,
  //       allow_symbol_change: true,
  //       show_popup_button: true,
  //       popup_width: "1000",
  //       popup_height: "650",
  //     });
  //   }
  // }, []);

  return (
    // <div id="tradingview_chart" style={{ height: '700px', marginTop: '40px' }} />
    <div className="w-full relative pb-[650px]">
      <iframe className="absolute inset-0 w-full h-full" src="https://dexscreener.com/bsc/0xe83997D3Ab561f2B6B65FdF83135B638404660bD?embed=1"></iframe>
    </div>
  )
}

export default TradingView;