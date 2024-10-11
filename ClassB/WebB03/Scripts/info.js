jQuery(document).ready(
	() => {
		//根據網域決定路徑
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB03' : '..';
    //取得電影資訊
		const info = JSON.parse(sessionStorage.getItem('info'))[0];
		//海報圖片
		jQuery("font>img").attr('src', `${API_PATH}/Content/Images/${info.poster}`);
		//預告影片
		jQuery("video").attr('src', `${API_PATH}/Content/Videos/${info.trailer}`);
		//片名
		jQuery("#name").text(info.name);
		//分級
		switch (info.levels) {
			case 'general':
				jQuery("#level").html(`<img src="${API_PATH}/Content/Images/03C01.png" />普遍級`);
				break;
			case 'protected':
				jQuery("#level").html(`<img src="${API_PATH}/Content/Images/03C03.png" />保護級`);
				break;
			case 'couching':
				jQuery("#level").html(`<img src="${API_PATH}/Content/Images/03C02.png" />輔導級`);
				break;
			case 'restricted':
				jQuery("#level").html(`<img src="${API_PATH}/Content/Images/03C04.png" />限制級`);
				break;
		}
		//長度
		jQuery("#length").text(info.length);
		//上映日期
		jQuery("#date").text(info.date);
		//發行商
		jQuery("#publisher").text(info.publisher);
		//導演
		jQuery("#director").text(info.director);
		//簡介
		jQuery("#brief").text(info.brief);
		//回首頁
		jQuery("#list").click(
			() => {
				sessionStorage.removeItem('info');
				location.assign('index.html');
			}
		);
		//導向訂票頁
		jQuery("#ticket").click(
			() => {
        let today = new Date;
				sessionStorage.setItem(
					'info',
					JSON.stringify(
						{
							name: info.name,
							date: today.toLocaleDateString(),
							time: today.toLocaleTimeString()
						}
					)
				);
				location.assign('ticket.html');
			}
		)
	}
);