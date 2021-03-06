<div class="new-page" ev-back-click="backPrePage">
    {{: topBarTitle = {"zh_Hans":"关于"+it.walletName,"zh_Hant":"關於"+it.walletName,"en":""} }}
    <app-components1-topBar-topBar>{title:{{topBarTitle}} }</app-components1-topBar-topBar>
    <div w-class="content">
        <div w-class="aboutus-img">
            <img src="{{it.walletLogo}}" w-class="logoimg"/>
        </div>
        <div w-class="version">V{{it.version}}</div>
        {{: shortMess = {"zh_Hans":it.walletName+"是一款功能全面、简单易用的钱包应用。","zh_Hant":it.walletName+"是一款功能全面、簡單易用的錢包應用。","en":""} }}
        <div w-class="shortmess">
            <pi-ui-lang>{{shortMess}}</pi-ui-lang>
        </div>

        {{: itemName = [
            {"zh_Hans":"协议及隐私","zh_Hant":"協議及隱私","en":""},
            {"zh_Hans":"版本更新","zh_Hant":"版本更新","en":""},
            {"zh_Hans":"分享下载链接","zh_Hant":"分享下載鏈接","en":""}] }}
        
        {{for ind,val of it.data}}
            <div on-tap="itemClick(e,{{ind}})">
                <app-components-basicItem-basicItem>{"name":{{itemName[ind]}},"describe":{{val.desc}} }</app-components-basicItem-basicItem>
            </div>
        {{end}}
    </div>
</div>