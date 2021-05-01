jQuery(document).ready(
	function(){
		var table;
		sessionStorage.removeItem('info'); 
		jQuery.getJSON(
			'/ClassB/WebB03/Fetch.ashx',
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
									<img src='/ClassB/WebB03/Images/${value.poster}' />
								</td>
								<td>`;
						switch (value.levels) {
							case 'general':
								row += `<img src="Images/03C01.png" />`;
								break;
							case 'protected':
								row += `<img src="Images/03C02.png" />`;
								break;
							case 'couching':
								row += `<img src="Images/03C03.png" />`;
								break;
							case 'restricted':
								row += `<img src="Images/03C04.png" />`;
								break;
						}
						row +=
							`	</td>
								<td>${value.name}</td>
								<td>${Math.floor(value.length / 60)}時${value.length % 60}分</td>
								<td>${value.date}</td>
								<td>${value.brief}</td>
								<td>${value.display==='yes'?'是':'否'}</td>
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
		jQuery("tbody").on(
			'click',
			".edit",
			function () {
				event.preventDefault();		
				let id = jQuery(this).parents("tr").attr('id'),
					row = table.find(value => value.id === Number(id));
				sessionStorage.setItem('info', JSON.stringify(row));
				location.assign('?do=form');
			}
		).on(
			'click',
			".remove",
			function () {
				event.preventDefault();		
				let id = jQuery(this).parents("tr").attr('id');
				jQuery.get(
					'/ClassB/WebB03/Remove.ashx',
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
		).on(
			'click',
			".up",
			async function () {
				event.preventDefault();
				const currentRow = jQuery(this).parents("tr"),
					previosRow = currentRow.prev("tr"),
					currentRecord = table.find(value => String(value.id) === currentRow.attr("id")),
					previosRecord = table.find(value => String(value.id) === previosRow.attr("id"));
				let currentAjax = await jQuery.post(
					'/ClassB/WebB03/Modify.ashx',
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
					'/ClassB/WebB03/Modify.ashx',
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
		).on(
			'click',
			".down",
			async function () {
				event.preventDefault();
				const currentRow = jQuery(this).parents("tr"),
					nextRow = currentRow.next("tr"),
					currentRecord = table.find(value => String(value.id) === currentRow.attr("id")),
					nextRecord = table.find(value => String(value.id) === nextRow.attr("id"));
				let currentAjax = await jQuery.post(
					'/ClassB/WebB03/Modify.ashx',
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
					'/ClassB/WebB03/Modify.ashx',
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
		jQuery("#add").click(
			() => {
				sessionStorage.removeItem('info'); 
				location.assign('?do=form');
			}
		);
	}
)