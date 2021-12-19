jQuery(document).ready(
	() => {		 
		var nowpage = 1, num = 1, length = 0, timer, table, today = new Date();
		//載入電影列表
		jQuery.getJSON(
			'/ClassB/WebB03/Fetch.ashx',
			{
				item: 'Movie'
			},
			returns => {
				//上一張的圖片
				var images = `<img src="/ClassB/WebB03/Images/03E01.jpg" id="prev" />`;
				//篩選上映日期
				returns = returns.filter(
					value => {
						const ondate = new Date(value.date);
						ondate.setDate(ondate.getDate() + 3);
						return value.display === 'yes' && today< ondate;
					}
				);
				returns.forEach(
					value => {
						//每部電影的海報
						images +=
							`<p data-animate='${value.animation}' class="thumb">
								<img src="/ClassB/WebB03/Images/${value.poster}" width="60" height="60" />
								<br/>
								<span>${value.name}</span>
							</p>`;
					}
				);
				//下一張的圖片
				images += `<img src="/ClassB/WebB03/Images/03E02.jpg" id="next" />`;
				jQuery("#slideShow").append(images);
				//標記第一張海報
				jQuery(".thumb").hide().first().addClass('active');
				//只顯示四張海報
				for (let s = 0; s <4; s++) {
					jQuery(".thumb").eq(s).show();
				}
				showimage();
				table = returns;
				length = returns.length;
				showlist(0);
				//動畫計時器
				timer = setInterval(
					() => {
						//超過就從頭開始
						if (num>length) {
							num = 1;
						}
						//標記第幾張海報
						jQuery(".thumb").removeClass('active').eq(num-1).addClass('active');
						animation();
						num++;
					}
					, 5000
				);
				//分頁導覽列
				if (length > 4) {
					var totalpage = Math.ceil(length / 4), pagination =
						`<ul>`;
					for (let i = 1; i <= totalpage; i++) {
						pagination +=
							`<li>
								<a>${i}</a>
							</li>`;
					}
					pagination +=
						`</ul>`;
					jQuery(".ct:last-child").html(pagination);
				}
			}
		);
		jQuery("#slideShow").on(
			'click',
			".thumb",
			function () {
				//暫停動畫
				jQuery("#animation-area").stop();
				//標記目前按下的海報
				jQuery(this).addClass('active').siblings().removeClass('active'); 
				num = jQuery(this).index();
				animation();
			}
		).on(
			'mouseenter',
			".thumb",
			() => {
				//移除計時器
				clearInterval(timer);
			}
		).on(
			'mouseleave',
			".thumb",
			() => {
				//恢復計時器
				timer = setInterval(
					() => {
						if (num > length) {
							num = 1;
						}
						jQuery(".thumb").removeClass('active').eq(num-1).addClass('active');
						animation();
						num++;
					}
					, 5000
				);
			}
		).on(
			'click',
			"#prev",
			() => {
				//上一張海報
				pp(1);
			}
		).on(
			'click',
			"#next",
			() => {
				//下一張海報
				pp(2);
			}
		);
		jQuery("table").on(
			'click',
			".info,a",
			function () {
				//篩選該部電影的資訊
				const id = jQuery(this).parents("td").attr('id'),
					info = table.filter(
						value => value.id === parseInt(id)
					);
				sessionStorage.setItem('info', JSON.stringify(info));
				//導向介紹頁
				location.assign('info.html');
			}
		).on(
			'click',
			".ticket",
			function () {				
				//篩選該部電影的資訊
				const id = jQuery(this).parents("td").attr('id'),
					info = table.filter(
						value => value.id === parseInt(id)
					);
				//保留該部電影的資訊
				sessionStorage.setItem('info', JSON.stringify(info));
				//導向購票頁
				location.assign('ticket.html');
			}
		);
		jQuery(".ct:last-child").on(
			'click',
			"ul li a",
			function () {
				//標記點擊的頁碼
				jQuery("li a").removeClass('current');
				jQuery(this).addClass('current');
				showlist(4 * (parseInt(jQuery(".current").text()) - 1));
			}
		);
		function pp(x) {
			//上一頁
			if (x === 1 && nowpage > 1) {
				nowpage--;
			}
			//下一頁
			if (x === 2 && nowpage < length - 3) {
				nowpage++;
			}
			//根據頁碼顯示四張海報
			jQuery(".thumb").hide();
			for (let s = 0; s <4; s++) {
				let t = s + nowpage;
				jQuery(".thumb").eq(t-1).show();
			}
		}
		function showimage() {
			//設定海報路徑
			jQuery("#animation-area img").attr('src', jQuery(".active img").attr('src'));
			//設定海報文字
			jQuery("#animation-area span").text(jQuery(".active span").text());
		}
		function showlist(start) {
			let listArray = [];
			//根據起始位置篩選
			if (start < length - 4) {
				listArray = table.slice(start, 4);
			} else {
				listArray = table.slice(start);
			}
			//載入電影資訊
			let listHTML =
					`<tr>`;
			jQuery.each(
				listArray,
				(key, value) => {
					listHTML +=
						`<td id='${value.id}'>
							<a>
								<img src='Images/${value.poster}' width='100' height='180' />
							</a>
							<div>
								<h4>${value.name}</h4>
								分級：`;
					switch (value.levels) {
						case 'general':
							listHTML +=
								`<img src='Images/03C01.png' />
								普遍級<br/>`;
							break;
						case 'protected':
							listHTML +=
								`<img src='Images/03C02.png' />
								保護級<br/>`;
							break;
						case 'coaching':
							listHTML +=
								`<img src='Images/03C03.png' />
								輔導級<br/>`;
							break;
						case 'restricted':
							listHTML +=
								`<img src='Images/03C04.png' />
								限制級<br/>`;
							break;
					}
					listHTML +=
								`<p>上映日期：${value.date}</p>
								<button class='info'>劇情簡介</button>
								<button class='ticket'>線上訂票</button>
							</div>
						</td>`;
					if (key === 1) {
						listHTML +=
					`</tr>
					<tr>`;
					}
				}
			);
			jQuery("#right .tab table").html(listHTML);
		}
		function animation() {
			switch (jQuery(".active").data('animate')) {
				case 'fadein':
					//淡入淡出
					jQuery("#animation-area").fadeOut(1000,showimage).fadeIn(1000);
					break;
				case 'slidedown':
					//滑入滑出
					jQuery("#animation-area").slideUp(1000,showimage).slideDown(1000);
					break;
				case 'resize':
					//放大縮小
					jQuery("#animation-area").delay(100).animate(
						{
							width: '0px',
							height: '0px',
						},
						1000,
						showimage
					).animate(
						{
							width: '250px',
							height: '300px',
						},
						1000
					);
					break;
			}
		}
	}
);