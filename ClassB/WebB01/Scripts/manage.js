jQuery(document).ready(
	function ()
	{
		//判斷是否為管理員
		if (sessionStorage.getItem('role') === 'admin') {
			//載入標題區
			jQuery.getJSON('/ClassB/WebB01/Fetch.ashx',
				{
					item: 'Title'
				},
				returns => {							
					jQuery.each(returns, (key, value) => {
						if (value.Display === 'yes') {
							jQuery("#header").attr({
								'src':`/ClassB/WebB01/Images/${value.FileName}`,
								'alt': value.Alt
							});
						}
					});
				}
			);
		} else {
			//重新導向至登入頁
			location.assign('/ClassB/WebB01/login.html');
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
		jQuery("#content").load(`${item.get('item')}.html`);
		//管理登出
		jQuery("#logout").click(() => {
			sessionStorage.removeItem('role');
			location.replace('/ClassB/WebB01/index.html');
		});
		//隱藏modal
		jQuery("#x").click(() => { jQuery("#cover").fadeOut(); });
	}
);
function op(x,y,url)
{
	jQuery(x).fadeIn()
	if (y)
	{
		jQuery(y).fadeIn();
	}
	if (y && url)
	{
		jQuery(y).load(url);
	}
}