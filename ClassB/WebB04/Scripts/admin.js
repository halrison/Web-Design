jQuery(document).ready(
	() => {
		let menu = '';
		if (sessionStorage.getItem('account') === 'admin') {
			menu += `
				<a href='?do=permit'>管理權限設置</a>
				<a href='?do=category-commodity'>商品分類與管理</a>
				<a href='?do=order'>訂單管理</a>
				<a href='?do=member'>會員管理</a>
				<a href='?do=footer'>頁尾版權管理</a>
				<a href='?do=news'>最新消息管理</a>
		`;
		} else {
			jQuery.ajax(
				{
					url: '/ClassB/WebB04/Admin.ashx',
					method: 'get',
					data:
					{
						action: 'fetchone',
						account: sessionStorage.getItem("account")
					},
					dataType: 'json',
					async: false,
					success: response => {
						let permittions = response[0].permittion;
						if (permittions.search('permittion') > -1) {
							menu += "<a href='?do=permit'>管理權限設置</a>";
						} if (permittions.search('category') > -1 && permittions.search('commodity') > -1) {
							menu += "<a href='?do=category-commodity'>商品分類與管理</a>";
						} if (permittions.search('order') > -1) {
							menu += "<a href='?do=order'>訂單管理</a>";
						} if (permittions.search('member') > -1) {
							menu += "<a href='?do=member'>會員管理</a>";
						} if (permittions.search('footer') > -1) {
							menu += "<a href='?do=footer'>頁尾版權管理</a>";
						} if (permittions.search('news') > -1) {
							menu += "<a href='?do=news'>最新消息管理</a>";
						}
					}
				}
			);
        }
		menu += "<a onclick='logout()' style='color:#f00;'>登出</a>";
		jQuery("#menu").html(menu);
		let param = new URLSearchParams(location.search);
		if (param.has('do')) {
			jQuery("#right").load(`${param.get('do')}.htm`);
		}
	}
); 
jQuery.get(
	'/ClassB/WebB04/Footer.ashx',
	{
		action: 'get'
	},
	response => {
		jQuery("#bottom").append(response);
	}
);
function logout() {
	sessionStorage.removeItem('account');
	location.assign('/ClassB/WebB04/index.htm?do=login&user=admin')
}