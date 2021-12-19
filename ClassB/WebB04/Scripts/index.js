jQuery(document).ready(
	() => {
		let comporment = new URLSearchParams(location.search);
		//如果已登入，顯示登出連結
		if (sessionStorage.getItem('account')) {
			jQuery("#top div a:nth-last-child(2)").attr('href', '?do=logout').text('會員登出');
		}
		//簡易路由
		jQuery("#content").load(`/ClassB/WebB04/${comporment.has('do') ? comporment.get('do') : 'summary'}.htm`);
		jQuery("#sub-menu").hide();
		//載入大分類
		jQuery.ajax(
			{
				url: '/ClassB/WebB04/Big.ashx',
				method: 'get',
				data:
				{
					action:'fetch'
				},
				dataType:'json',
				async: false,
				success: responses1 => {
					let menu = `<div class="ww">
												<span>全部商品</span>
											</div>`
						, total = 0;
					responses1.forEach(
						response1 => {
							menu +=
											`<div class="ww" data-big="${response1.id}">
												<span>${response1.name}(${response1.count})</span>
												<div class="sub-menu">`;
							//載入中分類
								jQuery.ajax(
									{
										url: '/ClassB/WebB04/Medium.ashx',
										method: 'get',
										data:
										{
											action: 'fetch',
											big:response1.id
										},
										dataType: 'json',
										async: false,
										success: responses2 => {
											responses2.forEach(
												response2 => {
													menu +=
														`<div class="s" data-medium="${response2.medium}">
															<span>${response2.name}(${response2.count})</span>
														</div>`;
													total += response2.count;
												}
											);
										}
									}
								);
								menu+=`</div>`
							menu+=`</div>`
						}
					);
					jQuery("#main-menu").html(menu);
					jQuery(".ww").first().children().append(`(${total})`);
				}
			}
		);
		//載入頁尾
		jQuery.get(
			'/ClassB/WebB04/Footer.ashx',
			{
				action: 'get'
			},
			response => {
				jQuery("#bottom").append(response);
			}
		);
		//游標移入主選單效果
		jQuery("#main-menu").on(
			'mouseover',
			".ww",
			function () {
				jQuery(this).children(".sub-menu").show();
			}
		//游標移出主選單效果
		).on(
			'mouseout',
			".ww",
			() => {
				jQuery(this).children(".sub-menu").hide();
			}
		//點選主選單後，只顯示該大分類的商品
		).on(
			'click',
			".ww span",
			function () {
				if (jQuery(this).text().includes('全部商品')) {
					location.assign('index.htm');
				} else {
					sessionStorage.setItem('big', jQuery(this).text().slice(0, jQuery(this).text().indexOf('(')));
					sessionStorage.removeItem('medium');
					location.assign(`?big=${jQuery(this).parent().data('big')}`);
				}
			}
		//點選子選單後，只顯示該中分類的商品
		).on(
			'click',
			".sub-menu .s span",
			function () {
				sessionStorage.setItem('big',  jQuery(this).parents(".ww").find("span").first().text().slice(0,  jQuery(this).parents(".ww").find("span").first().text().indexOf('(')));
				sessionStorage.setItem('medium', jQuery(this).text().slice(0, -3))
				location.assign(`?big=${jQuery(this).parents('.ww').data('big')}&medium=${jQuery(this).parent().data('medium')}`);
			}
		);
	}
);