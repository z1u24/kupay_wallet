import { Widget } from "../../pi/widget/widget";
import { popNew } from "../../pi/ui/root";
import { getLocalStorage, getCurrentWallet } from '../utils/tools'

interface Wallet {
    walletName: string;
    walletNameDotBgColor: string;
    totalAssets: string;// total assets
    currencyList: Array<any>;//Currency list
}
export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        const wallets = getLocalStorage("wallets", (wallets) => {
            this.state.wallet = getCurrentWallet(wallets);
            this.state.currencyList = parseCurrencyList(this.state.wallet);
            this.paint();
        });
        const wallet = getCurrentWallet(wallets);
        this.state = {
            wallet,
            walletNameDotBgColor: "#fff",
            totalAssets: "0.00",
            currencyList: parseCurrencyList(wallet)
        };
    }

    public clickCurrencyItemListener(e, index) {
        let currency = this.state.currencyList[index];
        popNew("app-view-transaction-currency_details", {
            currencyName: currency.currencyName, currencyBalance: `${currency.balance} ${parseCurrencyUnit(currency)}`
            , currencyBalanceConversion: currency.balanceValue
        })

    }
    public clickAddCurrencyListener() {
        popNew("app-view-assets-add_asset")
    }
    public createWalletClick() {
        popNew("app-view-walletCreate-walletCreate");
    }
    public switchWalletClick() {
        popNew("app-view-switchWallet-switchWallet");
    }
}

/**
 * 解析钱包货币
 * @param wallet 
 */
const parseCurrencyList = (wallet) => {
    let list = [];
    //todo 测试代码  不处理没有的情况
    // if (!wallet.showCurrencys) return list;
    let showCurrencys = wallet.showCurrencys || ["ETH"];

    //todo  这里需要正确的处理钱包货币
    showCurrencys.forEach(v => {
        if (v === "BTC") {
            list.push({
                currencyName: "BTC",
                currencyFullName: "Bit coin",
                balance: "0",
                balanceValue: "￥0.00"
            });
        } else if (v === "GAIA.WORLD") {
            list.push({
                currencyName: "GAIA.WORLD",
                currencyFullName: "GAIA.WORLD currency",
                balance: "0",
                balanceValue: "￥0.00"
            });
        } else {
            list.push({
                currencyName: "ETH",
                currencyFullName: "Ether",
                balance: "0",
                balanceValue: "￥0.00"
            });
        }
    });
    return list;
}

/**
 * 解析货币单位
 * @param currency 
 */
const parseCurrencyUnit = (currency) => {
    let r;
    switch (currency.currencyName) {
        case "BTC": r = "BTC"; break;
        case "GAIA.WORLD": r = "GAIA"; break;
        case "ETH": r = "ETH"; break;
    }
    return r;
}