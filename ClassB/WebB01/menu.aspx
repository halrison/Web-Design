<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="menu.aspx.vb" Inherits="WebB01.menu" %>
<asp:Content ID="MenuContent" ContentPlaceHolderID="PlaceHolder" runat="server">
	<p class="botli t cent">選單管理</p>
	<table style="width:100%">
		<thead>
			<tr class="yel">
				<th style="width:40%">主選單名稱</th>
				<th style="width:40%">選單連結網址</th>
				<th style="width:10%">次選單數</th>
				<th>顯示</th>
				<th>刪除</th>
				<th style="width:15%"></th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
	<table style="margin-top:10px; width:70%;">
		<tbody>
			<tr>
				<td style="width:200px">
					<input type="button" id="btnadd"/>
				</td>
				<td class="cent">
					<input type="submit" value="修改確定" />
				</td>
			</tr>
		</tbody>
	</table>        
	<script type="text/javascript">
		$(document).ready(function () {
			$.ajax({
				url: '/ClassB/WebB01/Fetch.ashx',
				method: 'get',
				data: { item: 'Main' },
				dataType: 'json',
				success: returns => {
					$.each(returns, function(key, value){
						let row = '<tr id="main-' + value.Id + '" class="trce">' +
							'<td><input name="main-name" type="text" value="' + value.Name + '"/></td>' +
							'<td><input name="main-url" type="text" value="' + value.Url + '"/></td>' +
							'<td>' + value.Counts + '</td>'+
							'<td><input name="main-display" type="checkbox"';
						if (value.Display == 'yes') { row += ' ckecked';}
						row += '/></td> ' +
							'<td><input name="main-delete" type="checkbox" /></td>' +
							'<td><input name="Edit" type="button" value="編輯次選單" /></td>' +
							'</tr>';
						$("tbody:nth-child(2)").append(row);
					});
				}
			});
			$("#btnadd").click(() => {
				$("#cvr").html(
					'<p class="botli t cent">新增主選單</p>' +
					'主選單名稱：<input id="MainName" type="text" />' +
					'主選單連結網址：<input id="MainUrl" type="text" />' +
					'<button id="Insert">新增</button>'+
					'<button id="Clear">重置</button>'
				);
				$("#cover").fadeIn();
			});
			$("form").on('click', "#Insert", () => {
				$.ajax({
					url: '/ClassB/WebB01/Add.ashx',
					method: 'post',
					data: {
						item: 'Main',
						name: $("#MainName").val(),
						url: $("#MainUrl").val(),
						display: 'no',
						counts:0
					},
					success: returns => {
						$("tbody:nth-child(2)").append(
							'<tr id="main-' +returns + '" class="trce">' +
								'<td><input name="main-name" type="text" value="' + $("#MainName").val()+ '"/></td>' +
								'<td><input name="main-url" type="text" value="' + $("#MainUrl").val()+ '"/></td>' +
								'<td>' +0 + '</td>' +
								'<td><input name="main-display" type="checkbox" /></td > ' +
								'<td><input name="main-delete" type="checkbox" /></td>' +
								'<td><input name="Edit" type="button" value="編輯次選單" /></td>' +
							'</tr>'
						);
						$("#cover").fadeOut();
					}
				});
			});
			$("form").on('click', "input[name='Edit']", function () {
				$.ajax({
					url: '/ClassB/WebB01/Fetch.ashx',
					method: 'get',
					data: {
						item: 'Sub',
						father: $(this).parents("tr").attr('id').replace('main-','')
					},
					dataType:'json',
					success: returns => {
						let row = '<p class="botli t cent">編輯次選單</p>' +
							'<table> ' +
							'<thead>' +
							'<tr>' +
							'<th>次選單名稱</th>' +
							'<th>次選單連結網址</th>' +
							'<th>刪除</th>' +
							'</tr>' +
							'</thead>' +
							'<tbody>';
							$.each(returns, (key, value) => {
								row += '<tr id="sub-' + value.Id + '" class="trce">'+
									'<td><input name="sub-name" type="text" value="' + value.Name + '" /></td>' +
									'<td><input name="sub-url" type="text" value="' + value.Url + '"/></td>' +
									'<td><input name="sub-delete" type="checkbox" /></td>' +
									'</tr>';
							});
							row += '</tbody>' +
							'</table>'+
							'<input id="main-id" type="hidden" value="' + $(this).parents("tr").attr('id') + '"/>' +
							'<button id="Modify">修改確定</button><button id="btnins">更多次選單</button>';
							$("#cvr").html(row);
							$("#cover").fadeIn();	
						}
				});				
			});
			$("form").on('click', "#Modify", () => {
				let count = 0;
				$.each($("#cvr table tbody tr"), function () {
					if ($(this).find(":checkbox[name='sub-delete']").prop('checked')) {
						if ($(this).attr('id')) {
							$.ajax({
								url: '/ClassB/WebB01/Delete.ashx',
								method: 'get',
								data: {
									item: 'Sub',
									id: $(this).attr('id').substr(4)
								},
								success: response => {
									if(response=='success'){ $(this).remove();}
								}
							});
						} else { $(this).remove();}
					}
					if ($(this).attr('id')) {
						$.ajax({
							url: '/ClassB/WebB01/Modify.ashx',
							method: 'post',
							data: {
								item: 'Sub',
								id:$(this).attr('id').substr(4),
								father: $("#main-id").val().substr(5),
								name: $(this).find(":text[name='sub-name']"),
								url: $(this).find(":text[name='sub-url']")
							},
							success: () => {
								count++;
								$("#cover").fadeOut();
							}
						});
					} else {
						$.ajax({
							url: '/ClassB/WebB01/Add.ashx',
							method: 'post',
							data: {
								item: 'Sub',
								father: $("#main-id").val().substr(5),
								name: $(this).find(":text[name='sub-name']"),
								url: $(this).find(":text[name='sub-url']")
							},
							success: () => {
								count++;
								$("#cover").fadeOut();
							}
						});
					}
				});
				$("tr#" + $("#main-id").val()).find("td:nth-child(3)").text(count);
			});
			$("form").on('click', "#btnins", () => {
				$("#cvr table tbody").prepend(
					'<tr class="trce">'+
					'<td> <input name="sub-name" type="text" /></td > ' +
					'<td><input name="sub-url" type="text" /></td>' +
					'<td><input name="sub-delete" type="checkbox" /></td>' +
					'</tr>'
				);
			});
			$("form").submit(event=> {
				event.preventDefault();
				$.each($(".yel").parent("table").find("tbody tr"), function () {
					if ($(this).find(":checkbox[name='main-delete']").prop('checked')) {
						$.ajax({
							url: '/ClassB/WebB01/Delete.ashx',
							method: 'get',
							data: {
								item: 'Main',
								id: $(this).attr('id'),
							},
							success: response => {
								if (response == 'success') { $(this).remove(); }
							}
						});
					} else {
						$.ajax({
							url: '/ClassB/WebB01/Modify.ashx',
							method: 'post',
							data: {
								item: 'Main',
								id: $(this).attr('id').substr(5),
								name: $(this).find(":text[name='name']").val(),
								url: $(this).find(":text[name='url']"),
								count: $(this).find("td:nth-child(3)").text(),
								display:$(this).find(":checkbox[name='display']").prop('checked')
							}
						});
					}
				});
			});
		});
	</script>
</asp:Content>