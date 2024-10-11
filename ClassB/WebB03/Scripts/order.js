jQuery(document).ready(
	() => {
		//根據網域決定路徑
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB03' : '..';
    let nameMap, ticketList;
		//片名選單
		jQuery.getJSON(
			`${API_PATH}/Fetch.ashx`,
			{
				item:'Movie'
			},
			response => {
				let nameList = response.reduce(
					(list, movie) => list + `<option value='${movie.id}'>${movie.name}</option>`
					,
					"<option value=''>請選擇</option>"
				);
				nameMap = response.map(
					movie => {
						return {
							id: movie.id,
							name: movie.name
						}
					}
				);
				jQuery("#NameFilter").append(nameList).val('').change();
			}
		);
		//訂單列表
		jQuery.getJSON(
			`${API_PATH}/Fetch.ashx`,
			{
				item:'Ticket'
			},
			response => {
				ticketList = response.sort(
					(prev, next) => parseInt(next.number) - parseInt(prev.number)
				);
				let orderTable = ticketList.reduce(
					(table, row) => {
						table +=
							`<tr id='${row.id}'>
									<td>${row.number}</td>
									<td>${nameMap.find(movie => movie.id === row.movie).name}</td>
									<td>${row.date}</td>
									<td>${row.time}~${row.time + 2 === 24 ? '00' : row.time + 2}</td>`;
						let seats = row.seat.split(' ');
						table +=
									`<td>${seats.length}</td>
									<td>`;
						table += seats.reduce(
							(seat, position) => seat +
										`<p>${Math.ceil(position / 5)}排${position % 5 === 0 ? 5 : position % 5}號</p>`
							, ''
						);
						table +=
									`</td>
									<td><input name="delete" type="button" value="刪除" /></td>
								</tr>`;
						return table;
					},
					''
				);
				jQuery("tbody").html(orderTable);
			}
		);
		//刪除單筆訂單
		jQuery("tbody").on(
			'click',
			"input:button[name='delete']",
			function () {
				let row = jQuery(this).parents("tr");
				if (confirm('確定要刪除這筆訂單嗎')) {
					jQuery.get(
						`${API_PATH}/Remove.ashx`,
						{
							item: 'Ticket',
							id: row.attr('id')
						},
						response => {
							if (response === 'Success') {
								row.remove();
							}
						}
					);
				}
			}
		);
		//批次刪除訂單
		jQuery("form").submit(
			event => {
				event.preventDefault();
				if (confirm('確定要刪除這些訂單嗎')) {
					//根據日期
					if (jQuery("[value='ByDate']").prop('checked')) {
						let dateFilter = new Date(jQuery("#DateFilter").val());
						ticketList = ticketList.filter(ticket => ticket.date === `${dateFilter.getFullYear()}-${(dateFilter.getMonth() + 1).toString().padStart(2, 0)}-${dateFilter.getDate()}`);
						ticketList.forEach(
							ticket => {
								jQuery.get(
									`${API_PATH}/Remove.ashx`,
									{
										item: 'Ticket',
										id: ticket.id
									},
									response => {
										if (response === 'Success') {
											jQuery("tbody").find(`tr#${ticket.id}`).remove();
										}
									}
								);
							}
						);
					//根據片名
					} else if (jQuery("[value='ByName']").prop('checked')) {
						let nameFilter = jQuery("#NameFilter").val();
						ticketList = ticketList.filter(ticket => ticket.movie === parseInt(nameFilter));
						ticketList.forEach(
							ticket => {
								jQuery.get(
									`${API_PATH}/Remove.ashx`,
									{
										item: 'Ticket',
										id: ticket.id
									},
									response => {
										if (response === 'Success') {
											jQuery("tbody").find(`tr#${ticket.id}`).remove();
										}
									}
								);
							}
						);
					}
				}
			}
		);
	}
);