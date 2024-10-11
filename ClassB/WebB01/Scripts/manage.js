jQuery(document).ready(
  function () {
    //根據域名決定請求路徑
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB01' : '..'
    //判斷是否為管理員
    if (sessionStorage.getItem('role') === 'admin') {
      //載入標題區
      jQuery.getJSON(`${ API_PATH }/Fetch.ashx`,
        {
          item: 'Title'
        },
        returns => {
          jQuery.each(returns, (key, value) => {
            if (value.Display === 'yes') {
              jQuery("#header").attr({
                'src': `${ API_PATH }/Content/Images/${ value.FileName }`,
                'alt': value.Alt
              });
            }
          });
        }
      );
    } else {
      //重新導向至登入頁
      location.assign(`${ API_PATH }/login.html`);
    }
    //顯示進站總人數
    jQuery("#LabelCounter").text(localStorage.getItem('counter'));
    //顯示頁尾版權
    jQuery("#SpanFooter").text(localStorage.getItem('footer'));
    //顯示或隱藏子選單
    jQuery(".mainmu").mouseover(function () {
      jQuery(this).children(".mw").stop().show();
    }
    );
    jQuery(".mainmu").mouseout(function () {
      jQuery(this).children(".mw").hide();
    }
    );
    //簡易路由
    var item = new URLSearchParams(location.search);
    jQuery("#content").load(`${ item.get('item') }.html`);
    //管理登出
    jQuery("#logout").click(() => {
      sessionStorage.removeItem('role');
      location.replace(`${ API_PATH }/index.html`);
    });
    //隱藏modal
    jQuery("#x").click(() => { jQuery("#cover").fadeOut(); });
  }
);
function op (x, y, url) {
  jQuery(x).fadeIn()
  if (y) {
    jQuery(y).fadeIn();
  }
  if (y && url) {
    jQuery(y).load(url);
  }
}