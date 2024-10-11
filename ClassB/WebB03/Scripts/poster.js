jQuery(document).ready(
	() => {
		let table;
		//根據網域決定路徑
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB03' : '..';
    //海報列表
		jQuery.getJSON(
			`${API_PATH}/Fetch.ashx`,
			{
				item: 'Movie'
			},
			response => {
				table = response;
				table.forEach(
					value => {
						jQuery('tbody').append(
							`<tr id='${value.id}'>
								<td>
									<img src='${API_PATH}/Content/Images/${value.poster}' width='200'/>
								</td>
								<td>
									<input type='text' name='name' value='${value.name}' />
								</td>
								<td>
									<button class='up'>往上</button>
									<button class='down'>往下</button>
								</td>
                <td>
                  <select value='${value.animation}'>
                    <option value='fadein' ${value.animation === 'fadein' ? 'selected' : ''}>淡入</option>
                    <option value='slidedown' ${value.animation === 'slidedown' ? 'selected' : ''}>滑出</option>
                    <option value='resize' ${value.animation === 'resize' ? 'selected' : ''}>縮放</option>
                  </select>
                </td>
								<td>
									<input type='checkbox' name='display' ${value.display === 'yes' ? 'checked' : ''}/>顯示
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
			async function(event){
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
						animation: nextRecord.animation
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
		//批次刪除
		jQuery('#Submit1').click(
			event => {
				event.preventDefault();
				jQuery("tbody tr").each(
					function () {
						if (jQuery(this).find("[name='delete']").prop('checked')) {
							jQuery.get(
								`${API_PATH}/Remove.ashx`,
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
			event => {
				event.preventDefault();
				var form = new FormData, file = jQuery('#poster').get(0).files;
				form.append('poster', file[0]);
				fetch(
					`${API_PATH}/Upload.ashx`,
					{
						method: 'post',
						body: form
					}
				).then(
					response => {
						if (response.ok) {
							jQuery.post(
								`${API_PATH}/Add.ashx`,
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