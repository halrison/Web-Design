jQuery(document).ready(
	function () {
		let item = new URLSearchParams(location.search), date = new Date, days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], user = sessionStorage.getItem('user');
		let counter_today = counter_total = 0;
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB02' : '..';
    if (user !== null) {
			let welcome_messege = `歡迎，${user}`;
			if (user === 'admin') {
				welcome_messege+=`<br/><a href="" style="border: 1px solid black;">管理</a> | `
			}
			welcome_messege += `<a href="?do=logout" style="border: 1px solid black;">登出</a>`;
			jQuery("#marquee+span").html(welcome_messege);
		}
		if (sessionStorage.getItem('first view') === 'true' || sessionStorage.getItem('first view') === null) {
			jQuery.getJSON(
				`${API_PATH}/Counter.ashx`,
				{
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					date:date.getDate()
				},
				response => {
					jQuery("#counter-today").text(response.today);
					jQuery("#counter-total").text(response.total);
					localStorage.setItem('counter_today', response.today);
					localStorage.setItem('counter_total', response.total);
					sessionStorage.setItem('first view', 'false');
				}
			);
		} else {
			counter_today =localStorage.getItem('counter_today');
			counter_total = localStorage.getItem('counter_total');
			jQuery("#counter-today").text(counter_today);
			jQuery("#counter-total").text(counter_total);
		} 
		jQuery("#date").text(`${date.getMonth() + 1}月${date.getDate()}日${days[date.getDay()]}`);
		let conpoment = item.get('do') || 'ribbon';
		jQuery.get(
			`${conpoment}.html`,
			returns => {
				jQuery("#content").html(returns);
			}
		);
	}
);
function good(id, type, user) {
	if (type === "plus") {
		jQuery.post(
			`${API_PATH}/Add.ashx`,
			{
				item: 'Good',
				account: user,
				article: id
			},
			response => {
				if (response === 'Success') {
					jQuery.post(
						`${API_PATH}/Modify.ashx`,						
						{
							item: 'Article',
							id: id,
							action: type
						},
						response => {
              if(response === 'Success'){
							  location.reload();
              }
						}
					);
				}
			}
		);
	}
	else {
		jQuery.post(
			`${API_PATH}/Remove.ashx`,
			{
				item: 'Good',
				account: user,
				article: id
			},
			response => {
				if (response === 'Success') {
					jQuery.post(
						`${API_PATH}/Modify.ashx`,						
						{
							item: 'Article',
							id: id,
							action: type
						},
						response => {
              if(response === 'Success'){
							  location.reload();
              }
						}
					);
				}
			}
		);
	}
}