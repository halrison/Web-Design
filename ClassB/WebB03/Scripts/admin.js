jQuery(document).ready(
	() => {
		//若未登入則導向登入頁
		if (sessionStorage.getItem('role') === null) {
			location.assign('login.html');
		}
		//簡易路由
		let page = new URLSearchParams(location.search);
		jQuery.get(
			`${page.get('do')}.html`,
			returns => {
				jQuery('#content').html(returns)
			}
		)
	}
);