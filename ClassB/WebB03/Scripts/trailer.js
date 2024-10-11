jQuery(document).ready(
	function(){
		let table;
		//根據網域決定路徑
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB03' : '..';
    sessionStorage.removeItem('info');
		//載入預告片列表
		jQuery.getJSON(
			`${API_PATH}/Fetch.ashx`,
			{
				item: 'Movie'
			},
			response => {
				table = response;
				response.forEach(
					value => {
						let row =
							`<tr id='${value.id}'>
								<td>
									<img src='${API_PATH}/Content/Images/${value.poster}' width='200'/>
								</td>
								<td>`;
						switch (value.levels) {
							case 'general':
								row += `<img src="${API_PATH}/Content/Images/03C01.png" />`;
								break;
							case 'protected':
								row += `<img src="${API_PATH}/Content/Images/03C03.png" />`;
								break;
							case 'coaching':
								row += `<img src="${API_PATH}/Content/Images/03C02.png" />`;
								break;
							case 'restricted':
								row += `<img src="${API_PATH}/Content/Images/03C04.png" />`;
								break;
						}
						row +=
							`	</td>
								<td>${value.name}</td>
								<td>${isNaN(value.length) ? 0 : Math.floor(value.length / 60)}時${isNaN(value.length) ? 0 : value.length % 60}分</td>
								<td>${value.date || new Date().toLocaleDateString()}</td>
								<td>${value.brief || ''}</td>
								<td>${value.display === 'yes' ? '是' : '否'}</td>
								<td>
									<button class='edit'>編輯電影</button>
									<button class='remove'>刪除電影</button>
									<button class='up'>往上</button>
									<button class='down'>往下</button>
								</td>
							</tr>`;
						jQuery("tbody").append(row);
					}
				);
			}
		);
		//編輯電影按鈕
		jQuery("tbody").on(
			'click',
			".edit",
			function (event) {
				event.preventDefault();		
				let id = jQuery(this).parents("tr").attr('id'),
					row = table.find(value => value.id === Number(id));
				sessionStorage.setItem('info', JSON.stringify(row));
				location.assign('?do=form');
			}
		//刪除電影按鈕
		).on(
			'click',
			".remove",
			function (event) {
				event.preventDefault();		
				let id = jQuery(this).parents("tr").attr('id');
				jQuery.get(
					`${API_PATH}/Remove.ashx`,
					{
						id:id
					},
					response => {
						if (response === 'success') {
							jQuery(this).parents("tr").remove();
						}
					}
				);
			}
		//上移按鈕
		).on(
			'click',
			".up",
			async function (event) {
				event.preventDefault();
				const currentRow = jQuery(this).parents("tr"),
					previosRow = currentRow.prev("tr"),
					currentRecord = table.find(value => String(value.id) === currentRow.attr("id")),
					previosRecord = table.find(value => String(value.id) === previosRow.attr("id"));
				let currentAjax = await jQuery.post(
					`${API_PATH}/Modify.ashx`,
					{
						item: 'Movie',
						id: currentRecord.id,
						name: previosRecord.name,
						level: previosRecord.level,
						length: previosRecord.length,
						date: previosRecord.date,
						publisher: previosRecord.publisher,
						director: previosRecord.director,
						trailer: previosRecord.trailer,
						poster: previosRecord.poster,
						brief: previosRecord.brief,
						display: previosRecord.display,
						animation: previosRecord.animation
					}
				),
					previosAjax = await jQuery.post(
					`${API_PATH}/Modify.ashx`,
					{
						item: 'Movie',
						id: previosRecord.id,
						name: currentRecord.name,
						level: currentRecord.level,
						length: currentRecord.length,
						date: currentRecord.date,
						publisher: currentRecord.publisher,
						director: currentRecord.director,
						trailer: currentRecord.trailer,
						poster: currentRecord.poster,
						brief: currentRecord.brief,
						display: currentRecord.display,
						animation: currentRecord.animation
					}
				);
				if (currentAjax.responseText === 'Success' && previosAjax.responseText === 'Success') location.reload();
			}
		//下移按鈕
		).on(
			'click',
			".down",
			async function (event) {
				event.preventDefault();
				const currentRow = jQuery(this).parents("tr"),
					nextRow = currentRow.next("tr"),
					currentRecord = table.find(value => String(value.id) === currentRow.attr("id")),
					nextRecord = table.find(value => String(value.id) === nextRow.attr("id"));
				let currentAjax = await jQuery.post(
					`${API_PATH}/Modify.ashx`,
					{
						item: 'Movie',
						id: currentRecord.id,
						name: nextRecord.name,
						level: nextRecord.level,
						length: nextRecord.length,
						date: nextRecord.date,
						publisher: nextRecord.publisher,
						director: nextRecord.director,
						trailer: nextRecord.trailer,
						poster: nextRecord.poster,
						brief: nextRecord.brief,
						display: nextRecord.display,
						animation:nextRecord.animation
					}
				),
				nextAjax = await jQuery.post(
					`${API_PATH}/Modify.ashx`,
					{
						item: 'Movie',
						id: nextRecord.id,
						name: currentRecord.name,
						level: currentRecord.level,
						length: currentRecord.length,
						date: currentRecord.date,
						publisher: currentRecord.publisher,
						director: currentRecord.director,
						trailer: currentRecord.trailer,
						poster: currentRecord.poster,
						brief: currentRecord.brief,
						display: currentRecord.display,
						animation: currentRecord.animation
					}
				);
				if (currentAjax.responseText === 'Success' && nextAjax.responseText === 'Success') location.reload();
			}
		);
		//新增按鈕
		jQuery("#add").click(
			() => {
				sessionStorage.removeItem('info'); 
				location.assign('?do=form');
			}
		);
	}
)