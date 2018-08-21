/**
 * @file 入口文件，用于登录，唤起hall界面
 * @author henk<speoth@163.com>
 */

// tslint:disable-next-line:no-any
// tslint:disable-next-line:no-reserved-keywords
declare const module;

import { popNew } from '../../../pi/ui/root';
import { Forelet } from '../../../pi/widget/forelet';
import { addWidget } from '../../../pi/widget/util';
import { Api as EthApi } from '../../core/eth/api';
import { ERC20Tokens } from '../../core/eth/tokens';
import { EthWallet } from '../../core/eth/wallet';
import { sign } from '../../core/genmnemonic';
import { shapeshift } from '../../exchange/shapeshift/shapeshift';
import { dataCenter } from '../../store/dataCenter';
import { LockScreen } from '../../store/interface';
import { find, initStore, updateStore } from '../../store/store';

// ============================== 导出

export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');
export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    // 设置开发环境
    // eth代币精度初始化
   
    // 数据检查
    checkUpdate();
    // 初始化数据
    initStore();
    dataCenter.init();
    initEthTokenDecimals();
    const props = {
        width:120,
        borderWidth:15,
        activeColor:'red',
        bgColor:'#ccc',
        activePercent:0.3,
        centerStyle:'fontSize:36px;',
        centerText:'30%'
    };
    // popNew('app-view-base-test');
    // makepayment();
    // exchangeManage.init();
    // 打开界面
    // popNew('app-view-guidePages-privacyAgreement');
    /*  popNew('app-components-share-share', { 
         shareType: ShareToPlatforms.TYPE_LINK,
         url:'http://www.kupay.io',
         title:'测试',
         content:'测试'
     }); */

    popNewPage();
    // popNew('app-view-guidePages-unlockScreen');
    // // 后台切前台
    backToFront();

    // popNew('app-view-redEnvelope-send-inviteRedEnvelope',{ amount:100,leaveMessage:'大吉大利',currencyName:'ETH' });
    // popNew('app-view-redEnvelope-receive-redEnvelopeDetails',{ amount:100,leaveMessage:'大吉大利',currencyName:'ETH' });
    // popNew('app-view-redEnvelope-receive-redEnvelopeRecord');
    // popNew('app-view-guidePages-setLockScreenScret',{ jump:true });

    // popNew('app-view-application-home', {}); 
    // popNew('app-view-mine-cloud-mining', {}); 
    // popNew('app-view-mine-FAQ-FAQ', {}); 
    if (cb) cb();
    // test();
};

/**
 * 界面入口
 */
const popNewPage = () => {
    const readedPriAgr = find('readedPriAgr');
    if (readedPriAgr) {
        popNew('app-view-base-app');
        if (ifNeedUnlockScreen()) {
            popNew('app-view-guidePages-unlockScreen');
        }

    } else {
        popNew('app-view-guidePages-privacyAgreement');
    }
};
const checkUpdate = () => {
    // todo
};

// 0xf4750c579799634CBBD1F5EFa662abb828b6EfE7
// 0x940703fD0525f75190F84D62Ea578F1A5beF2172
// 0xDEadcA0CF78Caac23a59FfF4353b3D715e26C367
// 0xFeA9610a4C2fCDF63A1755384B42ff760dB68EFC
// tslint:disable-next-line:only-arrow-functions
/* function  test() {
    
} */

/**
 * 后台切换到前台
 */
const backToFront = () => {
    (<any>window).handle_app_lifecycle_listener = (iType: string) => {
        if ((iType === 'onAppResumed') && ifNeedUnlockScreen()) {
            popNew('app-view-guidePages-unlockScreen');
        }
    };
};

// ============================== 立即执行

/**
 * eth代币精度初始化
 */
const initEthTokenDecimals = () => {
    const newTokenNames = checkHasNewTokens();
    if (newTokenNames.length === 0) return;

    newTokenNames.forEach(tokenName => {
        const decimalsCode = EthWallet.tokenOperations('decimals', tokenName);
        const api = new EthApi();
        api.ethCall(ERC20Tokens[tokenName], decimalsCode).then(r => {
            const ERC20TokenDecimals = find('ERC20TokenDecimals');
            ERC20TokenDecimals[tokenName] = Math.pow(10, parseInt(r,16));
            updateStore('ERC20TokenDecimals', ERC20TokenDecimals);
        });

    });

};

/**
 * 检测是否有新增代币
 */
const checkHasNewTokens = () => {
    const localTokenNames = Object.keys(find('ERC20TokenDecimals'));
    const tokenNames = Object.keys(ERC20Tokens);
    const newTokenNames = [];
    tokenNames.forEach(tokenName => {
        if (localTokenNames.indexOf(tokenName) < 0) {
            newTokenNames.push(tokenName);
        }
    });

    return newTokenNames;
};

/**
 * 是否需要解锁屏幕
 */
const ifNeedUnlockScreen = () => {
    const unlockScreen = document.querySelector('#unlock-screen');
    if (unlockScreen) return false;
    const ls: LockScreen = find('lockScreen');
    const lockScreenPsw = ls.psw;
    const openLockScreen = ls.open !== false;

    return lockScreenPsw && openLockScreen;
};

const test = async () => {
    const msg = '111';
    // tslint:disable-next-line:max-line-length
    const pubKey = '42c678868fe222f2acc0b05c93e554fee9b3f7a2a29ded93f6efcdc7b2b3e566353a6a8fa0943965ca906165d026de5d848e776dbaa2ecad632d0f98e7474a6e';
    const signStr = sign(msg, 'ddc495b23b0f559b284e42d96604d6499dd8dc894250a99131529af592c15a4d');
    console.log(msg, signStr, pubKey);
    // const m = generate('english', 128);
    // const r = getRandomValuesByMnemonic('english', m);
    // console.log(m, r, toMnemonic('english', r));

};

const testShapeShift = () => {
    const pair = 'btc_ltc';
    shapeshift.depositLimit(pair, (err, limit) => {
        console.log(limit); // => '4.41101872'
    });

    // console.log(shapeshift);
};