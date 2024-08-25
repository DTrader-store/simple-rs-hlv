import { NewAPI } from "@dtrader/api";
import cron from 'cron'

const api = NewAPI(Bun.env.host!, Bun.env.port!, Bun.env.api_key!);

const code = "510300"; // 只做 沪深300ETF
const hlv_n = 38; // 38日高低点

// 指标辅助函数
const calcHHV = (arr: number[], n: number) => Math.max(...arr.slice(-n));
const calcLLV = (arr: number[], n: number) => Math.min(...arr.slice(-n));

const HHV = (arr: number[], n: number) => {
  if (arr.length == 0) return [];
  return arr.map((_, i) => calcHHV(arr.slice(0, i + 1), n));
};

const LLV = (arr: number[], n: number) => {
  if (arr.length == 0) return [];
  return arr.map((_, i) => calcLLV(arr.slice(0, i + 1), n));
};

const REF = (arr: number[], n: number):number[] => {
   const result = new Array(arr.length).fill(NaN);
   if (arr.length < n) return result;
    for (let i = n; i < arr.length; i++) {
      result[i] = arr[i - n];
    }
    return result;
}

// hlv 指标
const hlv = async (code: string, n: number) => {
  const klines = await api.hq.stock.kline(code, "daily", 500);
  if (klines.code !== 0) {
    return {
      resistance: [],
      support: [],
      close: [],
    };
  }
  const resistance = REF(HHV(
    klines.data.list.map((it) => it.high),
    hlv_n
  ),1);
  const support = REF(LLV(
    klines.data.list.map((it) => it.low),
    hlv_n
  ),1);
  const close = klines.data.list.map((it) => it.close);
  return {
    resistance,
    support,
    close,
  };
};

// 买入信号
const buySignal = (support: number[], close: number[]) => {
  const length  = support.length
  if (length < 2) return false;
  if (
    close[close.length - 2] < support[length - 2] &&
    close[close.length - 1] > support[length - 1]
  ) {
    return true;
  }
  return false;
};
// 卖出信号
const sellSignal = (resistance: number[],  close: number[]) => {
  const length  = resistance.length
  if (length < 2) return false;
  if (
    close[close.length - 2] > resistance[length - 2] &&
    close[close.length - 1] < resistance[length - 1]
  ) {
    return true;
  }
  return false;
};

// 主函数
const job = async () => {
  const { resistance, support, close } = await hlv(code, hlv_n);

  if (buySignal( support, close)) {
    await api.trader.buy(code, close[close.length - 1], 100);
  }else{
    console.log('no buy signal',support[support.length - 1],close[close.length - 1])
  }
  if (sellSignal(resistance,  close)) {
    await api.trader.sell(code, close[close.length - 1], 100);
  }else{
    console.log('no sell signal',resistance[resistance.length - 1],close[close.length - 1])
  }
};



//定时任务
new cron.CronJob('50 14 * * 1-5', job, null, true, 'Asia/Shanghai');



