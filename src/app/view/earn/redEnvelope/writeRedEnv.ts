/**
 * sendRedEnv
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getRealUser, getServerCloudBalance, sendRedEnvlope } from '../../../net/pull';
import { CloudCurrencyType, LuckyMoneyType } from '../../../store/interface';
import { getCloudBalances, getStore, register, setStore } from '../../../store/memstore';
import { VerifyIdentidy } from '../../../utils/walletTools';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

interface Props {
    list: any[];         // 发红包币种列表
    selected: number;    // 所选币种
    showPin: boolean;    // 是否拼手气红包
    totalAmount: number;
    // tslint:disable-next-line:no-reserved-keywords
    totalNum: number;
    oneAmount: number;
    message: string;     // 红包留言
    realUser: boolean;   // 是否真实用户
    forceHide:boolean;
    ktBalance:number;    // KT余额
}

export class WriteRedEnv extends Widget {
    public ok: () => void;
    public language:any;

    public props:Props = {
        list: [],
        selected: 0,
        showPin: false,
        totalAmount: 0,
        totalNum: 0,
        oneAmount: 0,
        message: '',
        realUser: getStore('user/info/isRealUser'),
        forceHide:false,
        ktBalance:0
    };
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
        this.updateBalance();
        if (!this.props.realUser) {
            getRealUser();
        }
    }

    public setProps(props:any) {
        super.setProps(this.props);
        this.props = {
            ...this.props,
            ktBalance:props.ktBalance
        };
    }

    /**
     * 更新真实用户
     */
    public updateRealUser() {
        this.props.realUser = getStore('user/info/isRealUser');
    }

    /**
     * 更新余额
     */
    public updateBalance() {
        const list = [
            { img: '../../res/image/currency/KT.png', name: 'KT', num: 500 },
            { img: '../../res/image/currency/BTC.png', name: 'BTC', num: 0.01 },
            { img: '../../res/image/currency/ETH.png', name: 'ETH', num: 0.5 }
        ];
        const data = getCloudBalances();
        for (const i in list) {
            list[i].num = data.get(CloudCurrencyType[list[i].name]) || 0;
        }
        this.props.list = list;
        this.paint(true);
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    public goHistory() {
        this.props.forceHide = true;
        this.paint();
        popNew('app-view-earn-redEnvelope-redEnvHistory');
        setTimeout(() => {
            this.props.forceHide = false;
            this.paint();
        }, 100);
    }

    /**
     * 切换拼手气和普通红包
     */
    public changePin() {
        this.props.showPin = !this.props.showPin;
        if (this.props.showPin) {
            this.props.totalAmount = this.props.oneAmount;
        } else {
            this.props.totalAmount = parseFloat((this.props.oneAmount * this.props.totalNum).toPrecision(12));
        }
        this.paint();
    }

    /**
     * 修改金额
     */
    public changeAmount(e: any) {
        if (this.props.showPin) {
            this.props.oneAmount = Number(e.value);
            this.props.totalAmount = Number(e.value);
        } else {
            this.props.oneAmount = Number(e.value);
            this.props.totalAmount = parseFloat((this.props.oneAmount * this.props.totalNum).toPrecision(12));
        }
        this.paint();
    }

    /**
     * 修改数量
     */
    public changeNumber(e: any) {
        this.props.totalNum = Number(e.value);
        if (!this.props.showPin) {
            this.props.totalAmount = parseFloat((this.props.oneAmount * this.props.totalNum).toPrecision(12));
        }
        this.paint();
    }

    /**
     * 修改留言
     */
    public changeMessage(e: any) {
        this.props.message = e.value;
        this.paint();
    }

    /**
     * 切换货币
     */
    public changeCoin(e: any) {
        this.props.selected = e.selected;
        this.props.oneAmount = 0;
        this.props.totalNum = 0;
        this.props.totalAmount = 0;
        this.props.message = '';
        this.paint();
    }

    /**
     * 点击发红包按钮
     */
    public async send() {
        if (Number(this.props.totalNum) === 0) {
            popNew('app-components1-message-message', { content: this.language.tips[2] });

            return;
        }
        if (Number(this.props.oneAmount) === 0 && Number(this.props.totalAmount) === 0) {
            popNew('app-components-message-message', { content: this.language.tips[1] });

            return;
        }
        const curCoin = this.props.list[this.props.selected];
        if (this.props.totalAmount > curCoin.num) {
            popNew('app-components1-message-message', { content: this.language.tips[3] });

            return;
        }
        if (this.props.message.length > 20) {
            popNew('app-components1-message-message', { content: this.language.tips[4] });

            return;
        }
        if (this.props.message === '') {
            this.props.message = this.language.messTitle[1];
        }
        if (!this.props.realUser) {
            popNew('app-components1-message-message', { content: this.language.tips[5] });

            return;
        }
        if (this.props.selected === 0) {
            if (Number(this.props.totalAmount) < this.props.totalNum) {
                popNew('app-components-message-message', { content: this.language.tips[7] });

                return;
            }
        }

        this.inputBlur();
        
        // tslint:disable-next-line:max-line-length
        const mess1 = `${this.language.phrase[0]}${this.props.totalAmount}${curCoin.name} / ${this.props.totalNum} ${this.language.phrase[1]}`;
        // tslint:disable-next-line:max-line-length
        const mess2 = this.language.phrase[2] + (this.props.showPin ? this.language.redEnvType[1] : this.language.redEnvType[0]);
        popNew('app-components1-modalBoxInput-modalBoxInput', {
            title: curCoin.name + this.language.phrase[3],
            content: [mess1, mess2],
            placeholder: this.language.phrase[4],
            itype: 'password'
        },
            async (r) => {
                const close = popNew('app-components1-loading-loading', { text: this.language.loading });
                const fg = await VerifyIdentidy(r);
                close.callback(close.widget);
                if (fg) {
                    this.sendRedEnv();
                } else {
                    popNew('app-components1-message-message', { content: this.language.tips[6] });
                }
            }
        );

    }

    /**
     * 实际发红包
     */
    public async sendRedEnv() {

        const curCoin = this.props.list[this.props.selected];
        const lm = this.props.message;  // 留言
        const rtype = this.props.showPin ? LuckyMoneyType.Random : LuckyMoneyType.Normal; // 0 等额红包  1 拼手气红包
        const ctype = Number(CloudCurrencyType[curCoin.name]);  // 货币类型
        const totalAmount = Number(this.props.totalAmount);   // 红包总金额
        const totalNum = this.props.totalNum;    // 红包总个数
        const rid = await sendRedEnvlope(rtype, ctype, totalAmount, totalNum, lm);

        if (!rid) return;
        setTimeout(() => {
            this.props.oneAmount = 0;
            this.props.totalNum = 0;
            this.props.totalAmount = 0;
            this.props.message = '';
            getServerCloudBalance();// 更新余额
            setStore('activity/luckyMoney/sends', undefined);// 更新红包记录
            this.paint(true);
        });
        popNew('app-view-earn-redEnvelope-sendRedEnv', {
            message: lm,
            rid,
            rtype: rtype,
            cname: curCoin.name
        });

        // if (!this.props.showPin) {
        //     // tslint:disable-next-line:max-line-length
        //     console.log('url', `${sharePerUrl}?type=${LuckyMoneyType.Normal}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        // } else {
        //     // tslint:disable-next-line:max-line-length
        //     console.log('url', `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${rid}&lm=${(<any>window).encodeURIComponent(lm)}`);
        // }
    }

    /**
     * 输入框取消聚焦
     */
    public inputBlur() {
        const inputs: any = document.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].blur();
        }
    }

}
// =====================================本地
register('cloud/cloudWallets', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateBalance();
    }
});

register('user/info/isRealUser', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.updateRealUser();
    }
});
