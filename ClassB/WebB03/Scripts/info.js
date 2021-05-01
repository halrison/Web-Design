jQuery(document).ready(
	() => {
		const info = JSON.parse(sessionStorage.getItem('info'))[0];
		jQuery("font>img").attr('src', `Images/${info.poster}`);
		jQuery("video").attr('src', `Videos/${info.trailer}`);
		jQuery("#name").text(info.name);
		switch (info.levels) {
			case 'general':
				jQuery("#level").html('<img src="Images/03C01.png" />普遍級');
				break;
			case 'protected':
				jQuery("#level").html('<img src="Images/03C02.png" />保護級');
				break;
			case 'couching':
				jQuery("#level").html('<img src="Images/03C03.png" />輔導級');
				break;
			case 'restricted':
				jQuery("#level").html('<img src="Images/03C04.png" />限制級');
				break;
		}
		jQuery("#length").text(info.length);
		jQuery("#date").text(info.date);
		jQuery("#publisher").text(info.publisher);
		jQuery("#director").text(info.director);
		jQuery("#brief").text(info.brief);
		jQuery("#list").click(
			() => {
				sessionStorage.removeItem('info');
				location.assign('index.html');
			}
		);
		jQuery("#ticket").click(
			() => {
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