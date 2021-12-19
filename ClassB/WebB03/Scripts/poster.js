jQuery(document).ready(
	() => {
		var table;
		//海報列表
		jQuery.getJSON(
			'/ClassB/WebB03/Fetch.ashx',
			{
				item: 'Movie'
			},
			response => {
				table = response;
				jQuery.each(
					response,
					(key, value) => {
						jQuery('tbody').append(
							`<tr id='${value.id}'>
								<td>
									<img src='/ClassB/WebB03/Images/${value.poster}' />
								</td>
								<td>
									<input type='text' name='name' value='${value.name}' />
								</td>
								<td>
									<button class='up'>往上</button>
									<button class='down'>往下</button>
								</td>
								<td>
									<input type='checkbox' name='display' />顯示
									<input type='checkbox' name='delete' />刪除
								</td>
							</tr>`
						);
					}
				);
			}
		);
		//上移按鈕
		jQuery("tbody").on(
			'click',
			".up",
			async function(){
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
		//下移按鈕
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
						animation: nextRecord.animation
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
		//批次刪除
		jQuery('#Submit1').click(
			() => {
				event.preventDefault();
				jQuery("tbody tr").each(
					function () {
						if (jQuery(this).find("[name='delete']").prop('checked')) {
							jQuery.get(
								'/ClassB/WebB03/Remove.ashx',
								{
									id:jQuery(this).attr('id')
								},
								response => {
									if (response === 'Success') {
										jQuery(this).remove();
									}
								}
							);
						}
					}
				);
			}
		);
		jQuery('#Reset1').click(
			() => {
				jQuery("[name='delete']").prop('checked', false);
			}
		);
		jQuery('#Submit2').click(
			() => {
				event.preventDefault();
				var form = new FormData, file = jQuery('#poster').get(0).files;
				form.append('poster', file[0]);
				fetch(
					'/ClassB/WebB03/Upload.ashx',
					{
						method: 'post',
						body: form
					}
				).then(
					response => {
						if (response.ok) {
							jQuery.post(
								'/ClassB/WebB03/Add.ashx',
								{
									item: 'Movie',
									name: jQuery('#name').val(),
									poster: file[0].name,
									display: 'no'
								},
								response => {
									if (response !== 'failed') location.reload();
								}
							);
						}
					}
				);
			}
		);
	}
);