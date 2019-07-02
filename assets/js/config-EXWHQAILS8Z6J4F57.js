function getLocalServiceWorkerPath(config) {

  var js = ['0FW5L1AR4VTHEQGO6', 'K78WA2F9SYZV53D4J', '72P0BXLHZ3R1S965K', 
    '9SK38RWNHBZPC0UJL', '4SORW057B69ZLP1C8', '69TNGW8C4PKYRX1LI', '43VA65ZYUN1XE8T02',
     'CW598XLRMJ3YUBTZI'];
  var accountKey = config.accountKey;
  if (config.isShopify) {

    var appName = config.shopifyAppName;
    return '/apps/' + appName + '/js/service-worker-' + accountKey + '.js';
  } else if (js.indexOf(accountKey) != -1 || config.httpsInstalled) {

    if (js.indexOf(accountKey) != -1 ||
      config.httpsInstalled ||
      config.isNotWordpress)  {

      return '/service-worker-' + accountKey + '.js';      
    }
    return '/service-worker-' + accountKey + '.php';
  } else if (accountKey == 'E5PDJUO3K6TCHSAFG') {

    return '/articles/service-worker-' + accountKey + '.js';    
  }
  return '/service-worker-' + accountKey + '.php';    
}

function getSdkCss() {

  return `#pushmonkey-prompt-container {
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 99999999999;
}

#pushmonkey-prompt-container.bottom {
  bottom: 0;
  top: auto;
}

#pushmonkey-prompt-container .pm-dialog {
  background-color: #F0EFF0;
  border-radius: 0 0 2px 2px;
  box-shadow: 5px 5px 40px 0px rgba(0,0,0,0.3);
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  font-family: sans-serif;
  font-size: 12px !important;  
  height: 100%;
  justify-content: space-between;
  margin: 0 auto;
  padding-bottom: 5px;
  padding: 10px 20px 0 20px;
  position: relative;
  width: 427px;
}

@media(max-width:767px) {
  #pushmonkey-prompt-container .pm-dialog {
    width: 100%;
  }
}

#pushmonkey-prompt-container.bottom .pm-dialog {
  border-radius: 0;
}

#pushmonkey-prompt-container .pm-dialog-inner {
  display: flex;
  justify-content: space-between;
}

#pushmonkey-prompt-container .pm-dialog .pm-icon {
  height: 65px;
  margin-top: 5px;
  width: 65px;
}

#pushmonkey-prompt-container .pm-dialog .pm-icon img {
  height: 100% !important;
  width: 100% !important;
}

#pushmonkey-prompt-container .pm-dialog .pm-message {
  margin-left: 15px;
  margin-top: 5px;
  width: 305px;
}

@media(max-width:767px){
  #pushmonkey-prompt-container .pm-dialog .pm-message {
    width: 63%;
  }
}

#pushmonkey-prompt-container .pm-dialog .pm-message .pm-title {
  color: black;
  font-size: 14px !important;
}

#pushmonkey-prompt-container .pm-dialog .pm-message p {
  color: black;  
  margin-bottom: 0.5rem;
}

#pushmonkey-prompt-container .pm-close-x {
  display: none;
  text-align: right;
  font-size: 22px !important;
}

#pushmonkey-prompt-container .pm-close-x a {
  color: #ccc !important;  
}

@media(max-width:767px){
  #pushmonkey-prompt-container .pm-close-x {
    display: block;
  }  
}

#pushmonkey-prompt-container .pm-dialog .pm-footer {
  float: right;
  font-size: 1rem;
  margin-left: auto;  
  margin-top: 10px;
  margin-bottom: 20px;
  text-align: right;
}

#pushmonkey-prompt-container .pm-dialog .pm-sub-footer {
  float: left;  
  margin-top: 10px;
}

#pushmonkey-prompt-container .pm-dialog .pm-sub-footer img {
  width: 140px !important;
}

#pushmonkey-prompt-container .pm-dialog .pm-sub-footer a {
  opacity: 0.2;
  -webkit-transition: opacity 0.2s ease-in-out;
  -moz-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
}

#pushmonkey-prompt-container .pm-dialog .pm-sub-footer a:hover {
  opacity: 0.4;
}

#pushmonkey-prompt-container .pm-dialog .pm-cta {
  background: white;
  border-radius: 5px;
  border: 1px solid #ccc!important;
  color: black !important;
  font-size: 12px !important;
  padding: 10px;
  padding: 4px 20px;  
  text-decoration: none;
}

@media(max-width:767px) {
  #pushmonkey-prompt-container .pm-dialog .pm-cta {
    display: none;
    font-size: 16px !important;
    padding: 6px 22px;
  }
}

#pushmonkey-prompt-container .pm-dialog .pm-cta:hover {
  color: gray;
  cursor: pointer;
  text-decoration: underline;
}

#pushmonkey-prompt-container .pm-dialog .pm-allow {
  background: linear-gradient(to bottom,#64b4f4,#0084f6) !important;
  border-color: #42a2f2!important;
  border-radius: 5px;
  color: white !important;
  margin-left: 20px;
}

@media(max-width:767px) {
  #pushmonkey-prompt-container .pm-dialog .pm-allow {
    display: inline;
  } 
}

#pushmonkey-prompt-container .pm-dialog .pm-allow:hover {
  color: white;
}

#pm-bell-dialog {
 font-family: sans-serif;
}

#pm-bell-dialog .partner-info {
  color: #2b2b2b;
  font-size: 12px;
  line-height: 20px;
  margin: 0 12px 10px 12px;
}

#pm-bell-dialog .push-monkey-link {
  text-decoration: underline;
}

/******
 * Floating Labels
 ******/

.pushmonkey-floating-label-container {
  background: white;
  border-radius: 5px 5px 0 0;
  position: fixed;
  bottom: 0;
  min-width: 100px;
  max-width: 300px;
  z-index: 10000;
}

.pushmonkey-floating-label-content {
  border: 1px solid #2fcc70;
  height: 0;
  margin-top: -4px;
  overflow: hidden;
  position: relative;
  text-align: center;
  transition: all .5s ease-in-out;
}

.pushmonkey-floating-label-content h5 {
  color: #2b2b2b;
  padding: 0 10px;
}

.pushmonkey-floating-label-container button {
  background: #2fcc70;
  color: white;
  font-size: 16px;
  text-align: center;
  padding: 10px 20px;
  outline: none;
  outline-color: transparent;
}

.pushmonkey-floating-label-container .pushmonkey-btn-pricedrop, 
.pushmonkey-floating-label-container .pushmonkey-btn-backinstock {
  border-radius: 5px 5px 0 0;
  border: 0;
  font-weight: normal;  
  line-height: 22px;
  margin-bottom: 0;
  min-width: auto;
  text-align: center;
  vertical-align: bottom;
  width: 100%;
}

.pushmonkey-floating-label-container .pushmonkey-btn-signmeup {
  background: #2fcc70;
  border-radius: 10px;
  border: 0;
  color: white;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 0;
  outline-color: transparent;
  outline: none;
  padding: 10px 20px;
  text-align: center;
}

.pushmonkey-floating-label-container .pushmonkey-btn-signmeup:hover {
  background: #58d68c;
}

.pushmonkey-floating-label-container .pushmonkey-powered-by {
  margin-top: 10px;
}

.pushmonkey-floating-label-container .pushmonkey-powered-by a {
  opacity: 0.4;
}

.pushmonkey-floating-label-container .pushmonkey-powered-by a:hover {
  transition: opacity .5s ease-in-out;
  opacity: 1;
}

.pushmonkey-circle {
  border-radius: 10%;
  width: 20px;
  height: 20px;
  background-color: white;
  position: relative;
  float: left;
  margin-right: 5px;
  margin-top: 3px;
}

.pushmonkey-bar {
  margin: 0 auto;
  position: absolute;
  background-color: #2fcc70;
}

.pushmonkey-horizontal {
  width: 70%;
  height: 20%;
  left: 15%;
  top: 40%;
}

.pushmonkey-vertical {
  width: 20%;
  height: 70%;
  left: 40%;
  top: 15%;
}

#pushmonkey-subscribe-window-title {
  color: #2b2b2b;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 0 50px;
}

#pushmonkey-product-img-container {
  margin-top: 10px;
}

#pushmonkey-product-img-container img {
  width: auto;
  max-height: 60px;
}


/* 
 * Back in Stock
 */

#pushmonkey-backinstock-container {
  right: 40px;
}

/*
 * Price Drop
 */

#pushmonkey-pricedrop-container {
  left: 40px;
}

/*
 * Preloader 
 */

.pushmonkey-preloader {
  display: none;
  margin: 0px auto;
}

.pushmonkey-preloader .line {
  width: 1px;
  height: 12px;
  background: #cccccc;
  margin: 0 1px;
  display: inline-block;
  animation: opacity-2 1000ms infinite ease-in-out;
}

.pushmonkey-preloader .line-1 { animation-delay: 800ms; }
.pushmonkey-preloader .line-2 { animation-delay: 600ms; }
.pushmonkey-preloader .line-3 { animation-delay: 400ms; }
.pushmonkey-preloader .line-4 { animation-delay: 200ms; }
.pushmonkey-preloader .line-6 { animation-delay: 200ms; }
.pushmonkey-preloader .line-7 { animation-delay: 400ms; }
.pushmonkey-preloader .line-8 { animation-delay: 600ms; }
.pushmonkey-preloader .line-9 { animation-delay: 800ms; }

@keyframes opacity-2 {
  0% {
    opacity: 1;
    height: 15px;
  }
  50% {
    opacity: 0;
    height: 12px;
  }
  100% {
    opacity: 1;
    height: 15px;
  }
}`;
}var PushMonkeyClient=function(){var e=this;e.makePOST=function(e,t){return new Promise(function(i,n){var o=new XMLHttpRequest;o.open("POST",e,true);o.setRequestHeader("Content-Type","application/x-www-form-urlencoded");o.onload=function(){if(o.status>=200&&o.status<300&&o.readyState>=3){var e=JSON.parse(o.responseText);i(e)}else{n(o.responseText)}};o.onerror=function(){n(o.statusText)};var r=Object.keys(t).map(function(e){return encodeURIComponent(e)+"="+encodeURIComponent(t[e])}).join("&");o.send(r)})};e.makeGET=function(e){return new Promise(function(t,i){var n=new XMLHttpRequest;n.addEventListener("load",function e(){t(this.responseText)});n.open("GET",e);n.onerror=function(){i(n.statusText)};n.send()})}};var PushMonkeyCookie=function(){var e=this;e.set=function(e,t,i){var n=new Date;n.setTime(n.getTime()+i*24*60*60*1e3);var o="expires="+n.toUTCString();document.cookie=e+"="+t+";"+o+";path=/"};e.get=function(e){var t=e+"=";var i=decodeURIComponent(document.cookie);var n=i.split(";");for(var o=0;o<n.length;o++){var r=n[o];while(r.charAt(0)==" "){r=r.substring(1)}if(r.indexOf(t)==0){return r.substring(t.length,r.length)}}return""}};var PushMonkeyEcommerce=function(e,t){var i=this;var n=new PushMonkeyClient;var o=new PushMonkeyCookie;i.log=function(e){if(t.debug)console.log(e)};i.checkIfEcommerce=function(){if(i.isShopify||i.isMagento||i.isWoo){return true}return false};i.checkIfShopify=function(){if(o.get("cart")||o.get("_shopify_y")||o.get("_shopify_s")){return true}return false};i.checkIfMagento=function(){if(o.get("_push_monkey_magento_cart_id")){return true}return false};i.checkIfWoo=function(){if(o.get("_push_monkey_wc_cart_id")){return true}return false};i.attemptToUploadCartId=function(){if(!i.isEcommerce){return}var e=o.get("pm_cart_stored");if(e){return}i.uploadCartId()};i.uploadCartId=function(){if(e.isSafari){i.getDeviceToken(function(e){if(i.isShopify){i.uploadShopifyCartId(e);i.uploadShopifyProductId(e)}else if(i.isMagento){i.uploadMagentoCartId(e)}else if(i.isWoo){i.uploadWooCartId(e)}})}else{i.getSubscriptionEndpoint().then(function(e){if(i.isShopify){i.uploadShopifyCartId(e);i.uploadShopifyProductId(e)}else if(i.isMagento){i.uploadMagentoCartId(e)}else if(i.isWoo){i.uploadWooCartId(e)}}).catch(function(e){i.log("getSubscriptionEndpoint error");i.log(e)})}};i.getDeviceToken=function(t){var i=window.safari.pushNotification.permission(e.safariWebPushID);var n=i.deviceToken;t(n)};i.getSubscriptionEndpoint=function(){return new Promise(function(e,t){var n=o.get("pm_subscription_info");if(n){if(isNaN(parseInt(n))){i.log("pm_subscription_info is invalid");return}e(n)}else{i.log("error parsing subscription info.");t()}})};i.uploadShopifyCartId=function(t){var r=o.get("cart");if(!r){return}var a=e.sdkHost+"/shopify/v1/cart";var s={cart:r,endpoint:t,account_key:e.accountKey};n.makePOST(a,s).then(function(e){o.set("pm_cart_stored","yes",.01)}).catch(function(e){i.log("sendShopifyCartToServer error: ");i.log(e)})};i.uploadShopifyProductId=function(t){s=true;i.getProduct().then(function(r){var a=e.sdkHost+"/shopify/v1/product";var p=o.get("pm_subscribed_backinstock_"+r)=="yes";var c=o.get("pm_subscribed_pricedrop_"+r)=="yes";var m={product:r,endpoint:t,account_key:e.accountKey,back_in_stock:p,price_drop:c};n.makePOST(a,m).then(function(e){s=false}).catch(function(e){s=false;i.log("sendShopifyProduct error: ");i.log(e)})}).catch(function(e){s=false;i.log(e);i.log("Error in getProduct")})};i.uploadMagentoCartId=function(t){var r=o.get("_push_monkey_magento_cart_id");if(!r){return}var a=e.sdkHost+"/magento/v1/update_cart";var s={cart:r,endpoint:t,account_key:e.accountKey};n.makePOST(a,s).then(function(e){o.set("pm_cart_stored","yes",.1)}).catch(function(e){i.log("uploadMagentoCartId error: ");i.log(e)})};i.uploadWooCartId=function(t){var r=o.get("_push_monkey_wc_cart_id");if(!r){return}var a=e.sdkHost+"/magento/v1/update_cart";var s={cart:r,endpoint:t,account_key:e.accountKey};n.makePOST(a,s).then(function(e){o.set("pm_cart_stored","yes",.1)}).catch(function(e){i.log("uploadWooCartId error: ");i.log(e)})};i.getProduct=function(){return new Promise(function(e,t){var o=window.location.href.split("?")[0];var r=o.split("/").pop();if(r.indexOf(".")!==-1){t()}else{n.makeGET(o+".json").then(function(t){var i=JSON.parse(t);e(i.product.id)}).catch(function(e){i.log(e);t(e)})}})};i.showBackInStockFloatingLabel=function(n){var a=document.getElementById("pushmonkey-backinstock-container");var s=parseInt(n.quantity,10);if(a){i.log("Floating label already present.");if(s>0){i.log("Quantity >0. Remove the label.");a.remove()}return}var p=n.id;if(o.get("pm_subscribed_backinstock_"+p)=="yes"){return}if(s>0){i.log("Quantity >0");return}r("backinstock",e.backInStockPopup.title,e.backInStockPopup.message.replace("[product-name]",n.title),e.backInStockPopup.button,e.backInStockPopup.confirmation.replace("[product-name]",n.title),n,"pm_subscribed_backinstock_",t.backInStockPopup.color)};i.showPriceDropFloatingLabel=function(i){if(document.getElementById("pushmonkey-pricedrop-container")){return}var n=i.id;if(o.get("pm_subscribed_pricedrop_"+n)=="yes"){return}var a=parseFloat(i.price);if(!a){return}r("pricedrop",e.priceDropPopup.title,e.priceDropPopup.message.replace("[product-name]",i.title).replace("[price]",a),e.priceDropPopup.button,e.priceDropPopup.confirmation.replace("[product-name]",i.title).replace("[price]",a),i,"pm_subscribed_pricedrop_",t.priceDropPopup.color)};i.getProductInfo=function(t,i,o){var r=e.sdkHost+"/shopify/v1/product_info";var a={product:t,account_key:e.accountKey,endpoint:i,variant_id:o};return n.makePOST(r,a)};i.trackChangesOfVariant=function(e){if(typeof $=="undefined"){return}$("select").on("change",function(){i.log("Selection changed. Variant changed too?");i.updateBackInStockFloatingLabel(e)})};i.updateBackInStockFloatingLabel=function(t){var n=i.getVariantId();i.getProductInfo(t.id,null,n).then(function(t){if(e.backInStockEnable){i.showBackInStockFloatingLabel(t)}}).catch(function(e){i.log(error);i.log("Error in trackChangesOfVariant")})};i.getVariantId=function(){let e=new URL(document.location).searchParams;let t=e.get("variant");return t};i.showLabels=function(){if(s){i.log("another request already running");a=setInterval(i.showLabels,200);return}clearInterval(a);if(!e.backInStockEnable&&!e.priceDropEnable){i.log("not enabled notifications for back-in-stock and price-drop");return}var t=null;var n=null;i.getProduct().then(function(e){t=e;return i.getSubscriptionEndpoint()}).then(function(e){n=e;var o=i.getVariantId();return i.getProductInfo(t,n,o)}).then(function(t){if(e.backInStockEnable){i.showBackInStockFloatingLabel(t)}if(e.priceDropEnable){i.showPriceDropFloatingLabel(t)}i.trackChangesOfVariant(t)}).catch(function(e){i.log(e);i.log("Error in showLabels")})};i.debug=e.debug;i.isShopify=i.checkIfShopify();i.isMagento=i.checkIfMagento();i.isWoo=i.checkIfWoo();i.isEcommerce=i.checkIfEcommerce();var r=function(t,i,n,r,a,s,p,c){var m=document.querySelector("body");var l=document.createElement("div");l.className="pushmonkey-floating-label-container";l.id="pushmonkey-"+t+"-container";var d=document.createElement("div");d.className="pushmonkey-circle";d.innerHTML='<div class="pushmonkey-bar pushmonkey-horizontal" style="background:'+c+';""></div>'+'<div class="pushmonkey-bar pushmonkey-vertical" style="background:'+c+';"></div>';var u=document.createElement("button");u.className="pushmonkey-btn-"+t;u.id="pushmonkey-btn-"+t;u.style="background: "+c;u.innerHTML=i;var g=document.createElement("button");g.className="pushmonkey-btn-signmeup";g.style="background: "+c;g.innerHTML=r;var f=document.createElement("div");f.className="pushmonkey-floating-label-content";f.style="border-color: "+c;var h=document.createElement("h1");h.id="pushmonkey-subscribe-window-title";h.innerHTML=n;var v=s.title;var b=document.createElement("h5");b.innerHTML=v;var k=document.createElement("div");k.id="pushmonkey-product-img-container";var y=s.image;k.innerHTML="<img src="+y+">";var w=document.createElement("div");w.className="pushmonkey-powered-by";w.innerHTML="<a target='_blank' href='http://getpushmonkey.com?source=shopify'><img width='50%' src='https://snd.tc/static/images/permission-dialog-footer-logo.png'></a>";var S=document.createElement("div");S.className="pushmonkey-preloader";S.innerHTML='<span class="line line-1"></span>\n'+'<span class="line line-2"></span>\n'+'<span class="line line-3"></span>\n'+'<span class="line line-4"></span>\n'+'<span class="line line-5"></span>\n'+'<span class="line line-6"></span>\n'+'<span class="line line-7"></span>\n'+'<span class="line line-8"></span>\n'+'<span class="line line-9"></span>';f.appendChild(k).appendChild(b);f.appendChild(h);f.appendChild(g);f.appendChild(S);f.appendChild(w);var C=function(e){e.preventDefault();if(f.style.height==="280px"){f.style.height="0px";d.getElementsByClassName("pushmonkey-vertical")[0].style.display="block"}else{f.style.height="280px";d.getElementsByClassName("pushmonkey-vertical")[0].style.display="none"}};var A=function(t){t.preventDefault();g.style.display="none";S.style.display="block";setTimeout(function(){S.style.display="none";h.innerHTML=a},2e3);o.set(p+s.id,"yes",.01);if(e.isSafari){e.querySafariPermissions()}else{e.checkPermissionCookie()}};u.addEventListener("click",C);g.addEventListener("click",A);u.appendChild(d);l.appendChild(u);l.appendChild(f);m.appendChild(l)};var a=null;var s=false};var PushMonkey=function(config){var pm=this;var pmEcommerce=new PushMonkeyEcommerce(pm,config);var cookie=new PushMonkeyCookie;var client=new PushMonkeyClient;pm.initialise=function(){if(pm.isIos())return;if(pm.hasBell)pm.showBell();if(!pm.hasManifest())pm.createManifest();pmEcommerce.showLabels();if(pm.isPopUp){pm.manualStart();return}pm.log("start mode: "+pm.startMode);switch(pm.startMode){case 0:pm.manualStart(false);break;case 1:break;case 2:setTimeout(function(){pm.manualStart(false)},pm.startModeValue*1e3);break;case 3:pm.checkVisitCount();break}};pm.manualStart=function(e=true){if(pm.isSafari){pm.querySafariPermissions()}else if(pm.isNotWordpress||pm.subdomainForced){window.addEventListener("message",pm.receiveMessage,false);pm.checkPermissionCookie(e)}else if(pm.isHttps||pm.isPopUp){if(pm.hasServiceWorkers){if(pm.isPopUp){pm.registerServiceWorker()}else{pm.registerLocalServiceWorker()}}else{pm.log("Push Monkey: Service workers are not available.")}}else{window.addEventListener("message",pm.receiveMessage,false);pm.checkPermissionCookie()}var t=document.head;var i=document.createElement("style");i.type="text/css";var n=getSdkCss();i.appendChild(document.createTextNode(n));t.appendChild(i)};pm.throwError=function(e){throw Error(e)};pm.log=function(e){1==pm.debug&&console.log(e)};pm.hasManifest=function(){var e=document.querySelectorAll("head link[rel=manifest]");if(e.length){pm.log("we have manifests");pm.log(e);return true}return false};pm.createManifest=function(){pm.log("creating manifest");var e=document.createElement("link");e.href=pm.sdkHost+"/manifest-"+pm.accountKey+".json";e.id="pm-manifest";e.rel="manifest";document.head.appendChild(e)};pm.registerServiceWorker=function(){navigator.serviceWorker.register(pm.serviceWorker).then(pm.initialiseState)};pm.registerLocalServiceWorker=function(){navigator.serviceWorker.register(pm.serviceWorkerLocal,{scope:"/"}).then(pm.initialiseState)};pm.initialiseState=function(e){e.update();if(!pm.serviceWorkersSupportNotifications){pm.log("Notifications aren't supported.");return}if(Notification.permission==="denied"){pm.log("The user has blocked notifications.");return}pm.log("initialiseState. We can proceed.");navigator.serviceWorker.ready.then(function(e){pm.log("initialiseState. Service worker ready.");e.pushManager.getSubscription().then(function(e){pm.log("initialiseState. Got subscription status.");pm.log(e);if(!e){if(pm.isPopUp){pm.log("is pop up");pm.subscribe()}else{pm.log("not a pop up");pm.log(pm.hasCustomPrompt);pm.hasCustomPrompt?pm.showPermissionDialog(false):pm.permissionDialogAllowed()}}else{pm.log("initialiseState. Already subscribed.");if(pm.isPopUp){var t=JSON.stringify(e.toJSON());window.opener.postMessage(["pm_subscribed",t],"*");window.close()}else if(pm.isEcommerce){pmEcommerce.attemptToUploadCartId()}}}).catch(function(e){pm.log("Error during getSubscription()");pm.log(e)})}).catch(function(e){pm.log("Error activating service worker",e)})};pm.receiveMessage=function(ev){pm.log(ev);if(ev.data=="pm_show_permission_dialog"){pm.showPermissionDialog()}else if(ev.data=="pm_show_permission_dialog_from_bell"){pm.permissionDialogAllowed()}else if(typeof ev.data=="object"){if(ev.data[0]=="pm_subscribed"){pm.updateBellTooltipAnimated("Subscribed.");pm.sendSubscriptionToServer(ev.data[1]);pmEcommerce.attemptToUploadCartId()}else if(ev.data[0]=="pm_send_cart_token"){pmEcommerce.sendShopifyCartToServer(ev.data[1])}else if(ev.data[0]=="pm_subscription_checked"){pm.updateBellTooltip(ev.data[1])}else if(ev.data[0]=="pm_subscription_toggled"){pm.bell.tooltip.getElementsByTagName("span")[0].innerHTML="Updated!"}else if(ev.data[0]=="pm_permission_info_requested"){eval("pm."+ev.data[1]+"("+ev.data[2]+");")}}};pm.showPermissionDialog=function(e=false){if(!e){if(cookie.get("pm_permission_canceled")=="yes"){return}}if(document.getElementById("pushmonkey-permission-dark-overlay")&&document.getElementById("pushmonkey-prompt-container")){return}var t=document.createElement("div");t.id="pushmonkey-permission-dark-overlay";var i=document.createElement("div");i.id="pushmonkey-prompt-container";if(pm.isMobile()){i.className="bottom";var n=document.getElementById("pm-bell-container");if(n){var o={bottom:"170px"};pm.setStyles(n,o)}}var r=document.createElement("div");r.className="pm-dialog";var a=document.createElement("div");a.className="pm-close-x";var s=document.createElement("a");s.href="#";s.innerHTML="&#x2715;";a.appendChild(s);var p=document.createElement("div");p.className="pm-icon";p.innerHTML='<img src="'+pm.sdkHost+'/static/media/CACHE/images/secondary_website_images/976a4ec0526a42f2aff397d04eccc829/3b376a0360c3e4c935246580531903ea.png" />';var c=document.createElement("div");c.className="pm-message";c.innerHTML='<strong class="pm-title">'+pm.customPromptTitle+"</strong><p>"+pm.customPromptMessage+"</p>";var m=document.createElement("div");m.className="pm-dialog-inner";m.appendChild(p);m.appendChild(c);m.appendChild(a);r.appendChild(m);var l=document.createElement("a");l.className="pm-cta";l.innerHTML=pm.permissionDialogDenyText;var d=document.createElement("a");d.className="pm-cta pm-allow";d.innerHTML=pm.permissionDialogAllowText;var u=document.createElement("div");u.className="pm-footer";u.appendChild(l);u.appendChild(d);if(!pm.hideBranding){var g=document.createElement("div");g.className="pm-sub-footer";g.innerHTML='<a title="Send Web Push Notifications to your readers." target="_blank" href="https://getpushmonkey.com/?src=dialog"><img src="https://snd.tc/static/images/permission-dialog-footer-logo.png" /></a>';r.appendChild(g)}r.appendChild(u);i.appendChild(r);var f=document.getElementsByTagName("body")[0];f.appendChild(t);f.appendChild(i);var h=function(e){e.preventDefault();i.remove();t.remove();cookie.set("pm_permission_canceled","yes",180)};l.addEventListener("click",h);s.addEventListener("click",h);d.addEventListener("click",function(e){e.preventDefault();i.remove();t.remove();cookie.set("pm_permission_canceled","yes",180);pm.permissionDialogAllowed()})};pm.permissionDialogAllowed=function(){pm.log("permissionDialogAllowed");if(pm.isSafari){pm.requestSafariPermissions()}else if(pm.isNotWordpress){pm.openWindow()}else if(pm.isHttps&&!pm.subdomainForced&&!pm.isPopUp){pm.log("ask for permission");pm.subscribe()}else{pm.openWindow()}};pm.openWindow=function(){if(typeof pm.popupWindow!="undefined")return;var e=window.innerHeight/2-250;var t=window.innerWidth/2-250;pm.popupWindow=window.open(pm.windowSrc,pm.popupWindowName,"scrollbars=yes, width=500, height=500, top="+e+", left="+t)};pm.showBell=function(){if(pm.isIos())return;if(pm.isPopUp)return;var e=document.createElement("div");e.id="pm-bell-container";var t={bottom:"50px",height:"50px",position:"fixed","z-index":"99999"};if(pm.bellPosition=="right"){t["right"]="20px"}else{t["left"]="20px"}pm.setStyles(e,t);var i=document.createElement("a");var n={outline:"none",display:"block",width:"50px",height:"50px","background-image":"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABGdBTUEAALGPC/xhBQAAA9xJREFUeAHtWU1IVFEUPjPO1Bj+0WiZhVFWRv8RteiHFAJpUVHtkmhTUhAUWlCbiKJ2SgtDCYz8qYXoJiqXkRZYmxYmqdXCgkxIwp80nHFe36FejKPvzbtv3vOHzoGP+3POufec79737n0zRCLCgDAgDAgDwoAwIAwIA8KAMCAMCAPCgDAgDPxnDHhmK19N0zwQLd78sPPDZh+wFlgMfANewvcDyvknSGgj0AmwDADHp8sC/UnAVaAPmE7a0cnEJCQzugMQsA/RdgOro6IOob4dK9qp98EuiHozsH/87Rv62dRA410dpI2NUVJ2DgX2FFJK8WnyBJIjsLkM3wrdV7WcEQKQ0FIEdgM4AaQYBNmL/tvAA+AphUIHhqrLafRxI8EfXZPFByIyrtwi/6ZtrDgFEuomW1hruU4Agi9GKNWAUeKxkQ6gIzh87w6NNNbG6ia1vSmplFXTTN5g1hAUeSDh+yQDCw2vBRvbJkj+LJzrAavJ81zB0PsObHt2M5fIyDANVtxkozSA51IW1whA8gcRTRWgvMtGnzSRFuHHO778et1GE/19bHgovvVUC1cIQPIZmOr+1Oms9YQ+8XvSuoT/2PMxqSyuEIAozgPZytHoDqGwXrNUamE+SChgyTjGyHECsPo8JhNgW5JW5Cr5+pavZPuvSk5/jR0nAOPuAPjYsy3JhUWWfX25q8iXt47tn1t2ijJ0g4DdUePbqgYKiiiwa29cX4/XSxmXrut2NXpFpXSDgGUqARjZppddI/+afCM1eXx+SjtXRv4NW9jmIe4A7YbGJgo3COATIGHB5YYy7zZQ6skS4gtPtCxA0pmV9bToKF8siRMvidbPah0vwWrAWZkIa+EvvVroY7cWGfyhjx1GpQqw9fbXSeKPk7kv3qQWnAyZCDQd4FtPK/AI274LZULiBgE9iOiFQVT8eGw10Jl1X0Cy8/P7PzYrbNkefQ8rlDtjx3GqrXxPN5oYyfBYFwGzFeYdcBhQnZdX/xh2wTuUc084eaBOYUXtmA7BKeFfgFxhD4GV2snIhk8/fLKcTMKpe8AZJ4MyGWsJdEdM9Moqpwiw/+WnHDIxCY6JUwTYuobazOKVTT/33PBc5gP/rmg2nm2rLnVOZ6F6HBnOjwxyoCwFNgMLDQ3tKfrh9gzHYK09d/EyZMCxHWA4AxTYHQVmeujasLoTcWzmrxoE8PltJgtmKzunToF48ZebGLRg9cdN9PNfhaXnq3IlEInZBq1o8/+AsyYz8g7Qs0Oy/HPZeoA/wz9j5dX+ANAHklIYEAaEAWFAGBAGhAFhQBgQBoQBYUAYEAYSYeA3a2AFsT9cIfQAAAAASUVORK5CYII=')","background-position":"center"};if(pm.bellColor=="inverted"){n["background-image"]="url('data:image/png;base64,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')"}pm.setStyles(i,n);var o=document.createElement("div");var r=pm.bellColor=="inverted"?"#fff":"#2FCC70";var a={"background-color":r,"box-shadow":"0 2px 6px 0 rgba(0,0,0,.4)","border-radius":"5px",float:"left",height:"50px",width:"50px"};pm.setStyles(o,a);var s=document.createElement("span");var p=document.createElement("div");pm.setStyles(p,{background:"#282828","border-radius":"5px",color:"white",float:"left",height:"30px","line-height":"30px","margin-bottom":"10px","margin-left":"0","margin-top":"10px",opacity:"0",padding:"0 10px","text-align":"center",transition:"margin .4s, opacity .4s"});if(pm.bellPosition=="right"){pm.setStyles(p,{"margin-right":"0"})}o.onmouseover=function(){if(pm.isMobile())return;var e=pm.bellColor=="inverted"?"#E5E5E5":"#25A359";pm.setStyles(o,{background:e,cursor:"pointer"});pm.handleBellHover(s)};o.onmouseout=function(){if(pm.isMobile())return;var e=pm.bellColor=="inverted"?"#fff":"#2FCC70";pm.setStyles(o,{background:e})};i.addEventListener("click",function(e){e.preventDefault();pm.handleBellClick()});o.appendChild(i);p.appendChild(s);if(pm.bellPosition=="left"){e.appendChild(o);e.appendChild(p)}else{e.appendChild(p);e.appendChild(o)}pm.bell.bellContainer=e;pm.bell.tooltip=p;var c=document.getElementsByTagName("body")[0].appendChild(e)};pm.showBellDialog=function(){if(document.getElementById("pm-bell-dialog")){pm.hideBellDialog();return}var e=document.createElement("div");e.id="pm-bell-dialog";pm.setStyles(e,{background:"white","border-radius":"5px","box-shadow":"5px 5px 40px 0px rgba(0,0,0,0.3)",width:"250px","padding-bottom":"10px",position:"fixed",bottom:parseInt(document.getElementById("pm-bell-container").style.bottom)+70+"px",left:"20px","z-index":"99999"});if(pm.bellPosition=="right"){pm.setStyles(e,{left:"auto",right:"20px"})}var t=document.createElement("h1");t.innerHTML="Manage Site Notifications";pm.setStyles(t,{"font-size":"16px","font-weight":"bold",margin:"10px 12px","text-align":"left"});e.appendChild(t);if(pm.isPartner){var i=document.createElement("p");i.className="partner-info";i.innerHTML='Want push notifications on your website too? Create an account on <a target="_blank" class="push-monkey-link" href="https://getpushmonkey.com?source=oceanwp">getpushmonkey.com</a>';e.appendChild(i)}var n=document.createElement("div");pm.setStyles(n,{border:"1px solid #CCCCCC","border-radius":"3px",display:"flex","flex-direction":"row","margin-left":"10px","margin-right":"10px"});e.appendChild(n);var o=document.createElement("div");pm.setStyles(o,{margin:"10px",height:"50px",width:"50px"});var r=document.createElement("img");r.src=pm.sdkHost+"/static/media/CACHE/images/secondary_website_images/976a4ec0526a42f2aff397d04eccc829/3b376a0360c3e4c935246580531903ea.png";pm.setStyles(r,{width:"100%"});o.appendChild(r);n.appendChild(o);var a=document.createElement("div");var t=document.createElement("p");t.innerHTML="-";pm.setStyles(t,{background:"#CCCCCC",color:"#CCCCCC","line-height":"10px",margin:"0","margin-top":"10px",width:"80px"});a.appendChild(t);var s=document.createElement("p");s.innerHTML="-";pm.setStyles(s,{background:"#E5E5E5",color:"#E5E5E5","line-height":"10px",margin:"0","margin-top":"8px",width:"100px"});a.appendChild(s);var p=document.createElement("p");p.innerHTML="-";pm.setStyles(p,{background:"#E5E5E5",color:"#E5E5E5","line-height":"10px",margin:"0","margin-top":"8px",width:"120px"});a.appendChild(p);n.appendChild(a);var c=document.createElement("a");c.href="#";c.innerHTML="...";c.addEventListener("click",function(e){e.preventDefault();pm.handleBellDialogClick()});pm.setStyles(c,{background:"#E5E5E5","border-radius":"4px",color:"white",display:"block","font-family":"Helvetica Neue,Helvetica,Arial,sans-serif","font-size":"14px","font-weight":"bold","line-height":"30px",margin:"10px 10px 0 10px","text-transform":"uppercase","text-align":"center"});e.appendChild(c);pm.bell.dialogButton=c;var m=document.getElementsByTagName("body")[0].appendChild(e)};pm.hideBellDialog=function(){var e=document.getElementById("pm-bell-dialog");if(e){e.remove()}};pm.handleBellClick=function(){pm.log("handleBellClick");pm.showBellDialog();pm.checkIfSubscribed(function(e,t){pm.log(e);pm.log(t);if(e&&t){pm.bell.dialogButton.innerHTML="Unsubscribe";pm.setStyles(pm.bell.dialogButton,{background:"#EB6859"})}else{pm.bell.dialogButton.innerHTML="Subscribe";pm.setStyles(pm.bell.dialogButton,{background:"#58D68C"})}})};pm.handleBellDialogClick=function(){pm.hideBellDialog();pm.checkIfSubscribed(function(e,t){var i=false;if(e){i=true}else if(!e){if(t){i=true}else if(pm.isHttps&&!pm.isPopUp&&!pm.subdomainForced&&!pm.isNotWordpress){pm.permissionDialogAllowed()}}if(i){var n=pm.toggleSubscription;if(pm.isSafari){n=pm.toggleSubscriptionSafari}n().then(function(e){pm.log(e);var t="Subscribed!";if(e.subscribed===false){t="Unsubscribed!"}pm.hideBellDialog();pm.updateBellTooltipAnimated(t)}).catch(function(e){pm.hideBellDialog();pm.updateBellTooltipAnimated("Error :(")})}})};pm.handleBellHover=function(e){};pm.updateBellTooltip=function(e){var t=cookie.get("pm_subscription_info");var i="You are receving notifications.";if(e){pm.verifySubscription(t).then(function(e){var t="You are receving notifications.";if(e.status==false){t="Subscribe to notifications."}pm.bell.tooltip.getElementsByTagName("span")[0].innerHTML=t}).catch(function(e){pm.log(e);var t="Please try again later...";pm.bell.tooltip.getElementsByTagName("span")[0].innerHTML=t})}else{i="Subscribe to notifications.";pm.bell.tooltip.getElementsByTagName("span")[0].innerHTML=i}};pm.updateBellTooltipAnimated=function(e){if(pm.bell.tooltip==undefined){return}pm.bell.tooltip.getElementsByTagName("span")[0].innerHTML=e;pm.setStyles(pm.bell.tooltip,{"margin-left":"10px",opacity:"1"});if(pm.bellPosition=="right"){pm.setStyles(pm.bell.tooltip,{"margin-left":"0","margin-right":"10px"})}setTimeout(function(){pm.setStyles(pm.bell.tooltip,{"margin-left":"0",opacity:"0"});if(pm.bellPosition=="right"){pm.setStyles(pm.bell.tooltip,{"margin-right":"0"})}},3e3)};pm.updateBellDialog=function(e){var t=cookie.get("pm_subscription_info");var i=t!=="";var n="#EB6859";var o="#58D68C";var r=n;var a="Unsubscribe";if(e&&i){pm.verifySubscription(t).then(function(e){var t="Unsubscribe";if(e.status==false){t="Subscribe";r=o}pm.bell.dialogButton.innerHTML=t;pm.setStyles(pm.bell.dialogButton,{background:r})}).catch(function(e){pm.log(e);var t="Try again later...";pm.bell.dialogButton.innerHTML=t;pm.setStyles(pm.bell.dialogButton,{background:r})});return}else if(e&&!i){}else if(!e&&i){cookie.set("pm_subscription_info",null,-1);a="Subscribe.";r=o}else if(!e&&!i){a="Subscribe";r=o}pm.bell.dialogButton.innerHTML=a;pm.setStyles(pm.bell.dialogButton,{background:r})};pm.checkIfSubscribed=function(e){if(pm.isSafari){var t=window.safari.pushNotification.permission(pm.safariWebPushID);if(t.permission!="granted"){e(false,false);return}pm.verifySubscriptionSafari(t.deviceToken).then(function(t){e(t.status,true)}).catch(function(t){e(false)})}else if(pm.isHttps&&!pm.isPopUp&&pm.subdomainForced||!pm.isHttps||pm.isNotWordpress){pm.log(cookie.get("pm_subscription_info"));var i=cookie.get("pm_subscription_info")!=="";if(i){var n=cookie.get("pm_subscription_info");pm.verifySubscription(n).then(function(t){if(t.status==false){e(true,false)}else{e(true,true)}}).catch(function(t){pm.log(t);e(true,false)})}else{pm.log("no cookie");e(false,false)}}else if(pm.isHttps){pm.log("checkIfSubscribed isHTTPS");navigator.permissions.query({name:"notifications"}).then(function(t){if(t.state!="granted"){e(false,false);return}navigator.serviceWorker.ready.then(function(e){return e.pushManager.getSubscription()}).then(function(e){pm.log(e);var t=JSON.stringify(e);pm.log(t);return pm.verifySubscription(t)}).then(function(t){e(t.status,true)})})}};pm.checkPermissionCookie=function(e=false){if(cookie.get("pm_subscription_info")){pmEcommerce.attemptToUploadCartId()}else{pm.showPermissionDialog(e)}};pm.showSubcribingAnimation=function(){if(document.getElementsByClassName("loading").length){var e=document.getElementsByClassName("loading")[0];e.className+=" active"}};pm.querySafariPermissions=function(){var e=window.safari.pushNotification.permission(pm.safariWebPushID);if(e.permission==="default"){pm.showPermissionDialog()}else if(e.permission==="granted"){pmEcommerce.attemptToUploadCartId()}};pm.requestSafariPermissions=function(){window.safari.pushNotification.requestPermission(pm.safariEndpointURL,pm.safariWebPushID,{url:window.location.href},function(e){pm.log("requestSafariPermissions");pm.log(e);pm.log(e.permission==="granted");if(e.permission==="granted"){pm.log("try to handle eComm");pmEcommerce.attemptToUploadCartId();pm.log("check topics cookie");if(cookie.get("pm_topics")!="yes"){pm.log("topics not already shown");pm.retrieveSegments(e.deviceToken);cookie.set("pm_topics","yes",180)}}})};pm.subscribe=function(){navigator.serviceWorker.ready.then(function(e){pm.log("service worker ready");pm.log(e);var t=pm.urlBase("");e.pushManager.subscribe({userVisibleOnly:true}).then(function(e){pm.log("registration subscribed");pm.log(e);pm.showSubcribingAnimation();var t=JSON.stringify(e.toJSON());pm.sendSubscriptionToServer(t)}).catch(function(e){var t={endpoint:"https://pm-notificationhub.servicebus.windows.net/"};var i=JSON.stringify(t);pm.sendSubscriptionToServer(i);pm.log(e);if(Notification.permission==="denied"){pm.log("Permission for Notifications was denied")}else{pm.log("Unable to subscribe to push notificatins.");pm.log(e)}})}).catch(function(e){pm.log("error navigator.serviceWorker.ready");pm.log(e)})};pm.urlBase=function(e){var t="=".repeat((4-e.length%4)%4);var i=(e+t).replace(/\-/g,"+").replace(/_/g,"/");var n=window.atob(i);var o=new Uint8Array(n.length);for(var r=0;r<n.length;++r){o[r]=n.charCodeAt(r)}return o};pm.endpointWorkaround=function(e){if(e.endpoint.indexOf("https://android.googleapis.com/gcm/send")!==0){return e.endpoint}var t=e.endpoint;if(e.subscriptionId&&e.endpoint.indexOf(e.subscriptionId)===-1){t=e.endpoint+"/"+e.subscriptionId}return t};pm.sendSubscriptionToServer=function(e){pm.log(e);var t=pm.getPlatform();var i={subscription_info:e,platform:t};var n=pm.sdkHost+"/push/v1/register/"+pm.accountKey;client.makePOST(n,i).then(function(t){pm.didSendSubscriptionToServer(t,e)}).catch(function(e){pm.log("sendSubscriptionToServer error: ");pm.log(error);if(pm.isPopUp){window.close()}})};pm.didSendSubscriptionToServer=function(e,t){pm.log("sendSubscriptionToServer saved: ");var i=e.subscription_info;pm.log(e);if(pm.isPopUp){window.opener.postMessage(["pm_subscribed",t],"*");window.close()}else{cookie.set("pm_subscription_info",i,pm.cookieExpiryDays);pm.updateBellTooltipAnimated("Subscribed.");pm.retrieveSegments(i)}};pm.toggleSubscription=function(){return new Promise((e,t)=>{var i=cookie.get("pm_subscription_info");pm.log("subscription found: ");pm.log(i);var n={subscription_info:i};var o=pm.sdkHost+"/push/v1/update/"+pm.accountKey;return client.makePOST(o,n).then(function(t){e(t)}).catch(function(e){t(e)})})};pm.toggleSubscriptionSafari=function(){return new Promise((e,t)=>{var i=window.safari.pushNotification.permission(pm.safariWebPushID);pm.log(i.deviceToken);var n={token:i.deviceToken};var o=pm.sdkHost+"/push/v1/update_safari/"+pm.accountKey;client.makePOST(o,n).then(function(t){e(t)}).catch(function(e){t(e)})})};pm.retrieveSegments=function(e){pm.log("topics enabled?");if(!pm.segmentationEnabled){pm.log("Segmentation is disabled.");return}pm.log("topics enabled.");var t=pm.sdkHost+"/push/v1/segments/"+pm.accountKey;var i={id:e};client.makePOST(t,i).then(function(t){if(t.segments){if(t.segments.length>0){pm.log("show topics dialog.");pm.showSegmentsDialog(t.template,e)}}else{pm.log("error retrieving segments: ");pm.log(t)}}).catch(function(e){pm.log("error retrieving segments: ");pm.log(e)})};pm.showSegmentsDialog=function(e,t){var i=document.createElement("div");i.innerHTML=e;while(i.firstChild){document.body.appendChild(i.firstChild)}var n=document.getElementById("pm_segments_save");var o=document.getElementsByClassName("pm_segments_cancel");n.onclick=function(){var e=[];document.querySelectorAll("#pmk_segments input:checked").forEach(function(t,i){e.push(t.value)});n.innerHTML="Saving...";n.onclick=function(){};pm.saveSegments(e,t,n)};var r=o.length;while(r--){o[r].onclick=function(){pm.hideSegmentsDialog()}}};pm.saveSegments=function(e,t,i){var n=pm.sdkHost+"/push/v1/segments/save/"+pm.accountKey;var o={segments:e,token:t};client.makePOST(n,o).then(function(e){pm.log(e);i.innerHTML="Awesome!";setTimeout(function(){pm.hideSegmentsDialog()},2e3)}).catch(function(e){pm.log("error retrieving segments: ");pm.log(err)})};pm.hideSegmentsDialog=function(){document.getElementById("pmk_segments").remove()};pm.verifySubscription=function(e){var t={subscription_info:e};var i=pm.sdkHost+"/push/v1/status/"+pm.accountKey;return client.makePOST(i,t)};pm.verifySubscriptionSafari=function(e){var t={token:e};var i=pm.sdkHost+"/push/v1/status_safari/"+pm.accountKey;return client.makePOST(i,t)};pm.setStyles=function(e,t){for(var i in t){e.style[i]=t[i]}};pm.getSubscriptionInfo=function(){return cookie.get("pm_subscription_info")};pm.checkVisitCount=function(){if(!cookie.get("pm_visit_count")){cookie.set("pm_visit_count",1,90)}else{var e=parseInt(cookie.get("pm_visit_count"));if(e+1==pm.startModeValue){pm.manualStart(false);return}cookie.set("pm_visit_count",e+1,90)}};pm.checkIfFirefox=function(){var e=pm.checkBrowser().split("-");return"Firefox"==e[0]&&"44"<=e[1]?1:0};pm.checkBrowser=function(){var e=navigator.userAgent,t=navigator.appName,i=""+parseFloat(navigator.appVersion);parseInt(navigator.appVersion,10);var n="",o,r,a;-1!=(r=e.indexOf("OPR/"))?(t="Opera",i=e.substring(r+4)):-1!=(r=e.indexOf("Opera"))?(t="Opera",i=e.substring(r+6),-1!=(r=e.indexOf("Version"))&&(i=e.substring(r+8))):-1!=(r=e.indexOf("Edge"))?(t="Edge",i=e.substring(r+5)):-1!=(r=e.indexOf("Chrome"))?(t="Chrome",i=e.substring(r+7),/(.*?)wv\)/.test(e)&&(n="22")):-1!=(r=e.indexOf("Safari"))?(t="Safari",i=e.substring(r+7),-1!=(r=e.indexOf("Version"))&&(i=e.substring(r+8))):-1!=(r=e.indexOf("Firefox"))?(t="Firefox",i=e.substring(r+8)):(o=e.lastIndexOf(" ")+1)<(r=e.lastIndexOf("/"))&&(t=e.substring(o,r),i=e.substring(r+1),t.toLowerCase()==t.toUpperCase()&&(t=navigator.appName));-1!=(a=i.indexOf(";"))&&(i=i.substring(0,a));-1!=(a=i.indexOf(" "))&&(i=i.substring(0,a));e=parseInt(""+i,10);isNaN(e)&&(i=""+parseFloat(navigator.appVersion),e=parseInt(navigator.appVersion,10));"22"==n&&(e=n);return t+"-"+e+"-"+i};pm.checkIfChrome=function(){var e=pm.checkBrowser().split("-");return 1!=pm.deviceType&&"48"<=e[1]?1:"Chrome"==e[0]&&"42"<=e[1]?1:0};pm.checkIfEdge=function(){var e=pm.checkBrowser().split("-");return 1!=pm.deviceType&&"17"<=e[1]?1:"Edge"==e[0]&&"17"<=e[1]?1:0};pm.checkIfSafari=function(){var e=window.navigator.userAgent,t=e.indexOf("Safari"),i=e.indexOf("Chrome"),e=e.substring(0,t).substring(e.substring(0,t).lastIndexOf("/")+1);return/iPad|iPhone|iPod/.test(navigator.userAgent)?0:-1==i&&0<t&&7<=parseInt(e,10)?1:0};pm.checkIfEdge=function(){var e=pm.checkBrowser().split("-");return 1!=pm.deviceType&&"17"<=e[1]?1:"Edge"==e[0]&&"17"<=e[1]?1:0};pm.getPlatform=function(){if(pm.isTablet()){return"tablet"}else if(pm.isMobile()){return"mobile"}return"desktop"};pm.getDevice=function(){navigator.userAgent.toLowerCase();return pm.isTablet()?2:pm.isMobile()?3:1};pm.isTablet=function(e){if(/android/.test(e)){if(!1===/mobile/.test(e))return 1}else if(!0===/ipad/.test(e))return 1;return 0};pm.isMobile=function(){return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent||navigator.vendor||window.opera)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent||navigator.vendor||window.opera).substr(0,4))};pm.getOS=function(){var e=navigator.userAgent.toLowerCase();return/windows phone/i.test(e)?6:/android/i.test(e)?4:/ipad|iphone|ipod/.test(e)&&!window.MSStream?5:/linux/i.test(e)?2:/macintosh|mac os x/i.test(e)?3:/windows|win32/i.test(e)?1:7};pm.isIos=function(){return pm.os==5};pm.accountKey=config.accountKey;pm.bell={};pm.bellColor=config.bellColor;pm.bellPosition=config.bellPosition;pm.cookieExpiryDays=360;pm.customPromptMessage=config.customPromptMessage;pm.customPromptTitle=config.customPromptTitle;pm.debug=config.debug;pm.deviceType=pm.getDevice();pm.isDemo="0"==1;pm.dialogBackgroundColor=config.dialogColor;pm.dialogButtonBackgroundColor=config.dialogButtonColor;pm.hasBell=config.bell;pm.hasCustomPrompt=config.customPrompt;pm.hasServiceWorkers="serviceWorker"in navigator;pm.isChrome=pm.checkIfChrome();pm.isEdge=pm.checkIfEdge();pm.isEcommerce=pmEcommerce.isEcommerce;pm.isFirefox=pm.checkIfFirefox();pm.isHttps=document.location.protocol=="https:"||document.location.href.indexOf("localhost")!=-1;pm.isNotWordpress=config.isNotWordpress;pm.popupWindowName="Subscribing...";pm.isPopUp=window.name==pm.popupWindowName;pm.isSafari=pm.checkIfSafari();pm.os=pm.getOS();pm.isPartner=config.isPartner;pm.hideBranding=config.hideBranding;pm.priceDropEnable=config.priceDropEnable;pm.priceDropPopup=config.priceDropPopup;pm.backInStockEnable=config.backInStockEnable;pm.backInStockPopup=config.backInStockPopup;pm.permissionDialogAllowText=config.permissionDialogAllowText;pm.permissionDialogDenyText=config.permissionDialogDenyText;pm.safariHost="https://www.getpushmonkey.com";pm.safariEndpointURL=pm.safariHost+"/push";pm.safariWebPushID=config.safariWebPushID;pm.sdkHost="https://snd.tc";pm.segmentationEnabled=config.segmentation;pm.serviceWorker="./service-worker-"+config.accountKey+".js";pm.serviceWorkerLocal=getLocalServiceWorkerPath(config);pm.serviceWorkersSupportNotifications="undefined"!=typeof ServiceWorkerRegistration&&"showNotification"in ServiceWorkerRegistration.prototype&&"PushManager"in window;pm.startMode=config.startMode;pm.startModeValue=config.startModeValue;pm.subdomainForced=config.subdomainForced;pm.subscribeDialogText=config.subscribeDialogText;pm.subscribeDialogClose=config.subscribeDialogClose;pm.windowSrc=pm.sdkHost+"/register-service-worker-"+config.accountKey};var PushMonkeySegmentsSDK=function(e){var t=this;var i=e.accountKey;var n=new PushMonkeyClient;var o=new PushMonkeyCookie;t.trackEvent=function(e,r){url=t.sdkHost+"/segments/v1/new";data=typeof r==="object"?r:{};data["category"]=e;data["account_key"]=i;var a=o.get("pm_subscription_info");if(isNaN(parseInt(a))){t.log("pm_subscription_info is invalid");return}data["subscription_info"]=a;if(t.isSafari){data["is_safari"]=t.isSafari}n.makePOST(url,data).then(function(e){if(e.status=="ok"){t.log("Event saved")}else{t.log(e);t.log("Error event")}}).catch(function(e){t.log(e);t.log("Network error tracking event")})};t.trackPage=function(){if(!t.trackPages){return}t.trackEvent("page-viewed-url",{value:window.location.href})};t.log=function(e){if(!t.debug){return}console.log(e)};t.debug=e.debug;t.trackPages=e.trackPages;t.sdkHost=window._pushmonkey.sdkHost;t.isSafari=window._pushmonkey.isSafari};

window.addEventListener('load', function() {


    try {

      var pushMonkeyConfig = {
        accountKey: "EXWHQAILS8Z6J4F57",
        dialogColor: "#CEDE9B",
        dialogButtonColor: "#99CC56",
        httpsInstalled: 0,
        isNotWordpress: 1,
        isShopify: 0,
        segmentation: 1,
        customPrompt: 1,
        customPromptTitle: 'We would like to send you push notifications.',            
        customPromptMessage: 'Notifications can be turned off anytime from browser settings.',
        bell: 1,
        bellColor: "regular",
        bellPosition: "left",
        hideBranding: 0,
        safariWebPushID: 'web.com.pushmonkey.EXWHQAILS8Z6J4F57',
        shopifyAppName: 'push-monkey',
        subdomainForced: 0,
        subscribeDialogText: 'Thank you for subscribing!',
        subscribeDialogClose: 'Close',
        isPartner: 0,
        trackPages: 1,
        permissionDialogAllowText: 'Allow',
        permissionDialogDenyText: 'Don&#39;t Allow',
        backInStockEnable: 0,
        backInStockPopup: {
          title: '',
          message: '',
          button: '',
          confirmation: '',
          color: '',
        },
        priceDropEnable: 0,
        priceDropPopup: {
          title: '',
          message: '',
          button: '',
          confirmation: '',
          color: ''
        },
        startMode: 0,
        startModeValue: 0,
        debug: 0
      };
      (function(config) {

        if ("object" !== typeof config) {

          console.log("Push Monkey: Missing configuration.");
        } else {

          window._pushmonkey = new PushMonkey(config);
          window._pushmonkey.initialise();
          window.push_monkey_sdk = new PushMonkeySegmentsSDK(config);
          window.push_monkey_sdk.trackPage();
        }
      })(pushMonkeyConfig);

    } catch(err) {

      console.log(err);
    }
    
});


