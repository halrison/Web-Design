jQuery(document).ready(
	() => {
		if (sessionStorage.getItem('role') === null) {
			location.assign('login.html');
		}
		let page = new URLSearchParams(location.search);
		jQuery.get(
			`${page.get('do')}.html`,
			returns => {
				jQuery('#content').html(returns)
			}
		)
	}
);