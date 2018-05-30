import { Widget } from "../../../../pi/widget/widget";
import { popNew } from "../../../../pi/ui/root";
import { getLocalStorage, getCurrentWallet, setLocalStorage } from "../../../utils/tools";
import { register } from "../../../store/store";

export class AddAsset extends Widget {

    public ok: () => void;

    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init(): void {
        register("wallets", (wallets) => {
            const wallet = getCurrentWallet(wallets);
            if(!wallet) return;
            let showCurrencys = wallet.showCurrencys || [];
            this.state.list = this.state.currencyList.map(v => {
                v.isChoose = showCurrencys.indexOf(v.name) >= 0
                return v
            })

            this.paint()

        });

        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);

        const currencyList = [{ icon: "../../../res/image/BTC.png", name: "ETH", description: "Ethereum", isChoose: false }
            , { icon: "../../../res/image/ETH.png", name: "BTC", description: "Bit coin", isChoose: false }
            , { icon: "../../../res/image/EOS.png", name: "EOS", description: "EOS currency", isChoose: false }
            , { icon: "../../../res/image/ETC.png", name: "ETC", description: "Ethereum Classic", isChoose: false }
            , { icon: "../../../res/image/BCH.png", name: "BCH", description: "Bitcoin Cash", isChoose: false }
            , { icon: "../../../res/image/XRP.png", name: "XRP", description: "Ripple", isChoose: false }]

        let showCurrencys = wallet.showCurrencys || [];


        this.state = {
            title: "添加资产",
            currencyList: currencyList,
            list: currencyList.map(v => {
                v.isChoose = showCurrencys.indexOf(v.name) >= 0
                return v
            })
        }
    }

    /**
     * 处理关闭
     */
    public doClose() {
        this.ok && this.ok();
    }

    /**
     * 处理查找
     */
    public doSearch() {
        popNew("app-view-wallet-assets-search_asset", { list: this.state.list })
    }

    /**
     * 处理滑块改变
     */
    public onSwitchChange(e, index) {
        let currencys = this.state.list[index];
        let newType = !currencys.isChoose;
        currencys.isChoose = newType;
        this.paint();

        // 处理search数据
        let wallets = getLocalStorage("wallets");
        const wallet = getCurrentWallet(wallets);
        let showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.name);
        if (newType && oldIndex < 0) {
            showCurrencys.push(currencys.name)
        } else if (!newType && oldIndex >= 0) {
            showCurrencys.splice(oldIndex, 1);
        }
        wallet.showCurrencys = showCurrencys;

        setLocalStorage("wallets", wallets, true);
    }

}