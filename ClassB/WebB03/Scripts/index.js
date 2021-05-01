jQuery(document).ready(
	() => {		 
		var nowpage = 1,num=1,length=0,timer,table,today = new Date();
		jQuery.getJSON(
			'/ClassB/WebB03/Fetch.ashx',
			{
				item: 'Movie'
			},
			returns => {
				var images = `<img src="/ClassB/WebB03/Images/03E01.jpg" id="prev" />`;
				returns = returns.filter(
					value => {
						const ondate = new Date(value.date);
						ondate.setDate(ondate.getDate() + 3);
						return value.display === 'yes' && today< ondate;
					}
				);
				returns.forEach(
					value => {
						images +=
							`<p data-animate='${value.animation}' class="thumb">
								<img src="/ClassB/WebB03/Images/${value.poster}" width="60" height="60" />
								<br/>
								<span>${value.name}</span>
							</p>`;
					}
				);
				images += `<img src="/ClassB/WebB03/Images/03E02.jpg" id="next" />`;
				jQuery("#slideShow").append(images);
				jQuery(".thumb").hide().first().addClass('active');
				for (let s = 0; s <4; s++) {
					jQuery(".thumb").eq(s).show();
				}
				showimage();
				table = returns;
				length = returns.length;
				showlist(0);
				timer = setInterval(
					() => {
						if (num>length) {
							num = 1;
						} 
						jQuery(".thumb").removeClass('active').eq(num-1).addClass('active');
						animation();
						num++;
					}
					, 5000
				); 
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
				jQuery("#animation-area").stop();
				jQuery(this).addClass('active').siblings().removeClass('active'); 
				num = jQuery(this).index();
				animation();
			}
		).on(
			'mouseenter',
			".thumb",
			() => {
				clearInterval(timer);
			}
		).on(
			'mouseleave',
			".thumb",
			() => {
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
				pp(1);
			}
		).on(
			'click',
			"#next",
			()=> {
				pp(2);
			}
		);
		jQuery("table").on(
			'click',
			".info,a",
			function(){
				const id = jQuery(this).parents("td").attr('id'),
					info = table.filter(
						value => value.id === parseInt(id)
					);
				sessionStorage.setItem('info', JSON.stringify(info));
				location.assign('info.html');
			}
		).on(
			'click',
			".ticket",
			function () {
				const id = jQuery(this).parents("td").attr('id'),
					info = table.filter(
						value => value.id === parseInt(id)
					);
				sessionStorage.setItem('info', JSON.stringify(info));
				location.assign('ticket.html');
			}
		);
		jQuery(".ct:last-child").on(
			'click',
			"ul li a",
			function(){
				jQuery("li a").removeClass('current');
				jQuery(this).addClass('current');
				showlist(4 * (parseInt(jQuery(".current").text()) - 1));
			}
		);
		function pp(x) {
			if (x === 1 && nowpage > 1) {
				nowpage--;
			}
			if (x === 2 && nowpage < length - 3) {
				nowpage++;
			}
			jQuery(".thumb").hide();
			for (let s = 0; s <4; s++) {
				let t = s + nowpage;
				jQuery(".thumb").eq(t-1).show();
			}
		}
		function showimage() {
			jQuery("#animation-area img").attr('src', jQuery(".active img").attr('src'));
			jQuery("#animation-area span").text(jQuery(".active span").text());
		}
		function showlist(start) {
			let listArray = [];
			if (start < length - 4) {
				listArray = table.slice(start, 4);
			} else {
				listArray = table.slice(start);
			}
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
					jQuery("#animation-area").fadeOut(1000,showimage).fadeIn(1000);
					break;
				case 'slidedown':
					jQuery("#animation-area").slideUp(1000,showimage).slideDown(1000);
					break;
				case 'resize':
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