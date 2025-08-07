
export const RAW_SYMBOLS = [
  'XAUUSD.rh', 'XAUUSD.rb', 'XAUUSD.a', 'XAUUSD.d', 'XAUUSD.c', 'XAUUSD.r', 'XAUUSD', 'XAGUSD.c', 'XAGUSD',
  'XAUUSD.h', 'SP500SEPT25', 'DJ30SEPT25', 'NDQ100SEPT25', 'USDJPY', 'USDCHF', 'USDCAD', 'SP500EPT25.d',
  'NDQ100SEPT25.c', 'NACUSD', 'GOLDDEC25.rb', 'GOLDDEC25.d', 'AUDCAD', 'AUDCHF', 'AUDJPY', 'AUDNZD', 'AUDSGD',
  'AUDUSD', 'BTCEUR', 'BTCUSD', 'CADCHF', 'CHFJPY', 'CHFSGD', 'DJCUSD', 'DJI30SEPT25', 'ETHEUR', 'ETHUSD',
  'EURAUD', 'EURCAD', 'EURCHF', 'EURCZK', 'EURDKK', 'EURGBP', 'EURHKD', 'EURJPY', 'EURMXN', 'EURNOK', 'EURNZD',
  'EURPLN', 'EURSEK', 'EURSGD', 'EURTRY', 'EURUSD', 'EURZAR', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPDKK', 'GBPHKD',
  'GBPJPY', 'GBPNOK', 'GBPNZD', 'GBPPLN', 'GBPSEK', 'GBPSGD', 'GBPTRY', 'GBPUSD', 'GBPZAR', 'GOLDDEC25', 'LTCEUR',
  'LTCUSD', 'MXNJPY', 'NDQ100SEPT25', 'NGASSEPT25', 'NOKJPY', 'NOKSEK', 'NZDCAD', 'NZDCHF', 'NZDJPY', 'NZDSGD',
  'NZDUSD', 'SILSEPT25', 'SOLUSD', 'SP500SEPT25', 'SPCUSD', 'USDCAD', 'USDCHF', 'USDCZK', 'USDDKK', 'USDHKD',
  'USDHUF', 'USDJPY', 'USDTRY', 'USDTUSD', 'USDZAR', 'USOILSEPT25', 'XAGUSD', 'XAUUSD', 'XPDUSD', 'XPTUSD',
  'GOLDDEC25.c', 'EURSEPT2025', 'DJ30SEPT25.c', 'AUDCAD.c', 'AUDCHF.d', 'AUDJPY.d', 'AUDNZD.bg', 'AUDNZD.d',
  'AUDUSD.bg', 'AUDUSD.c', 'AUDUSD.d', 'CADCHF.c2', 'CADCHF.d', 'CHFJPY.bg', 'DAX40SEPT25.k', 'DJCUSD.d',
  'DJCUSD.rb', 'DJI30SEPT25.c', 'DJI30SEPT25.d', 'EURAUD.bg', 'EURAUD.d', 'EURCHF.c2', 'EURCHF.d', 'EURGBP.bg',
  'EURGBP.c2', 'EURGBP.d', 'EURJPY.d', 'EURNOK.i', 'EURNZD.bg', 'EURNZD.d', 'EURSEK.i', 'EURUSD.bg', 'EURUSD.c',
  'EURUSD.d', 'EURUSD.j', 'EURUSD.rh', 'GBPAUD.d', 'GBPAUD.j', 'GBPCAD.d', 'GBPCHF.d', 'GBPJPY.c2', 'GBPJPY.d',
  'GBPNZD.j', 'GBPUSD.bg', 'GBPUSD.c', 'GBPUSD.d', 'GBPUSD.j', 'GECEUR', 'GECEUR.d', 'GOLDDEC25.rh', 'GOOG',
  'HOOD', 'INTC.mix', 'MSFT', 'NACUSD.bg', 'NACUSD.d', 'NACUSD.rb', 'NDQ100SEPT25.d', 'NVDA', 'NZDCAD.d',
  'NZDJPY.bg', 'NZDSGD.rh', 'NZDUSD.bg', 'NZDUSD.d', 'SHBUSD', 'SILSEPT25.c', 'SP500SEPT25.c', 'SP500SEPT25.d',
  'SPCUSD.c', 'SPCUSD.d', 'TRXUSD', 'USDCAD.bg', 'USDCAD.d', 'USDCHF.bg', 'USDCHF.c2', 'USDCHF.d', 'USDCNH.bg',
  'USDCNH.i', 'USDJPY.bg', 'USDJPY.d', 'USDSGD.c2', 'USDZAR.bg', 'USOIL', 'XAGUSD.bg', 'XAGUSD.d', 'XAGUSD.rb',
  'XAGUSD.rh', 'XAUUSD#', 'XAUUSD.bg', 'XAUUSD.c2', 'XAUUSD.ft', 'XAUUSD.gm', 'XAUUSD.i', 'XAUUSD.j', 'XAUUSD.k',
  'XAUUSD.mp', 'XAUUSD.s', 'XAUUSD.tdh1', 'XAUUSD.test', 'XPTUSD.c', 'XRPUSD'
];

export const groupedSymbols: { [key: string]: Set<string> } = {};
RAW_SYMBOLS.forEach(sym => {
    const parent = sym.includes('.') ? sym.split('.')[0] : sym;
    if (!groupedSymbols[parent]) {
        groupedSymbols[parent] = new Set();
    }
    groupedSymbols[parent].add(sym);
});
