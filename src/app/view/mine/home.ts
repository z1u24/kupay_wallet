import { Widget } from "../../../pi/widget/widget";
import { popNew } from '../../../pi/ui/root';

export class Home extends Widget{
    constructor(){
        super();
    }
    public create(){
        super.create();
        this.init();
    }
    public init(){
        this.state = {
            mineList:[{
                icon:"u250.png",
                text:"管理钱包",
                components:"app-view-mine-walletManagement-walletManagement"
            },{
                icon:"u250.png",
                text:"交易记录",
                components:"app-view-mine-walletManagement-walletManagement"
            },{
                icon:"u250.png",
                text:"地址管理",
                components:"app-view-mine-walletManagement-walletManagement"
            },{
                icon:"u250.png",
                text:"语言设置",
                components:"app-view-mine-walletManagement-walletManagement"
            },{
                icon:"u250.png",
                text:"货币设置",
                components:"app-view-mine-walletManagement-walletManagement"
            },{
                icon:"u250.png",
                text:"常见问题",
                components:"app-view-mine-walletManagement-walletManagement"
            },{
                icon:"u250.png",
                text:"关于我们",
                components:"app-view-mine-walletManagement-walletManagement"
            },{
                icon:"u250.png",
                text:"分享下载链接",
                components:"app-view-mine-walletManagement-walletManagement"
            }]
        }
    }


    public itemClick(e,index){
        popNew(this.state.mineList[index].components);
    }
}