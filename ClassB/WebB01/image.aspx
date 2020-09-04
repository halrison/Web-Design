<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="image.aspx.vb" Inherits="WebB01.image" %>
<asp:Content ID="ImageContent" ContentPlaceHolderID="PlaceHolder" runat="server">
    <p class="t cent botli">動畫圖片管理</p>
    <table style="width:100%">
        <thead>
            <tr class="yel">
                <th style="width:68%">校園映像圖片</th>
                <th style="width:7%">顯示</th>
                <th style="width:7%">刪除</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <nav id="pagination-bar">
        <ul id="pagination-item"></ul>
    </nav>
    <table style="margin-top:10px; width:70%;">
        <tbody>
            <tr>
                <td style="width:200px">
                    <input type="button" id="btnadd"/>
                </td>
                <td class="cent">
                    <input type="submit" value="修改確定" />
                    <input type="reset" value="重置" />
                </td>
            </tr>
        </tbody>
    </table>        
    <script type="text/javascript">
        $(document).ready(function () {
            var pagecount, rowcount, pagecurrent=1;
            $.ajax({
				url: '/ClassB/WebB01/Fetch.ashx',
				method: 'get',
				data: {
					item: 'CampusImage'
				},
				dataType: 'json',
                success: returns => {
                    rowcount = returns.length;
                    pagecount = Math.ceil(rowcount / 3);
					var paginationlink = '<a href="#" id="prev"><</a>';
					for (var i = 1; i <= pagecount; i++) {
						paginationlink += '<li';
                        if (i == pagecurrent) {
                            paginationlink += ' class="current"';
						} 
						paginationlink += '"> ' + i + '</li > ';
					}
					paginationlink += '<a href="#" id="next">></a>';
					$("#pagination-item").html(paginationlink);
					fetchrow(0, 3);
                }
            });
			$("form").on('click', "#prev", function(){
				pagecurrent--;
				if (pagecurrent < 1) {
					pagecurrent = 1;
				} else {
                    $("#pagination-item").children().each(function(){
                        if ($(this).text() == pagecurrent) {
							$(this).addClass('current');
						} else {
							$(this).removeClass('current');
						}
                    });
                    fetchrow((pagecurrent - 1) * 3, 3);
				}
			});
			$("form").on('click', "#next", function(){
				pagecurrent++;
				if (pagecurrent > pagecount) {
					pagecurrent = pagecount;
				} else {
                    $("#pagination-item").children().each(function() {
						if ($(this).text() == pagecurrent) {
							$(this).addClass('current');
						} else {
							$(this).removeClass('current');
						}
					});
					fetchrow((pagecurrent - 1) * 3, 3);
				}
			});
            $("#btnadd").click(() => {
                $("#cvr").html(
                    '<p class="t cent">新增校園映像圖片</p>' +
                    '<hr/>' +
                    '校園映像圖片：<input id="Picture" name="Picture" type="file" accept="image/*"/><br/>' +
                    '<button id="Insert" type="button">新增</button>' +
                    '<button id="Clear" type="button">重置</button>'
                );
                $("#cover").fadeIn();
            });
            $("form").on('click', "input[name='update']", function(){
                $("#cvr").html(
                    '<p class="t cent">變更校園映像圖片</p><hr/>' +
                    '<input id="rowid" type="hidden" value="'+$(this).parent("tr").attr('id')+'"/>'+
                    '校園映像圖片：<input id="Picture" name="Picture" type="file" accept="image/*"/><br/>' +
                    '<button id="Update" type="button">變更</button>' +
                    '<button id="Clear" type="button">重置</button>'
                );
                $("#cover").fadeIn();
            });
            var form = new FormData();
            $("form").on('click', "#Insert", () => {
                let file = $("#Picture").get(0).files[0];
                form.append('Picture', file);
                fetch('/ClassB/WebB01/Upload.ashx', {
                    method: 'post',
                    body:form
                }).then(() => {
                    $.ajax({
                        url: '/ClassB/WebB01/Add.ashx',
                        method: 'post',
                        data: {
                            item: 'CampusImage',
                            filename: file.name,
                            display: 'no'
                        },
                        success: returns => {
                            $("tbody:nth-child(2)").prepend(
                                '<tr id="' + returns + '">' +
                                    '<td><img src="/ClassB/WebB01/Images/' + file.name + '"/></td>' +
                                    '<td><input type="checkbox" name="display"/></td>' +
                                    '<td><input type="checkbox" name="delete"/></td>' +
                                '</tr>'
                            );
                            $("#cover").fadeOut();
                        }
                    });
                });
                $("form").on('click', "#update", () => {
                    let file = $("#Picture").get(0).files[0];
                    form.append('Picture', file);
                    fetch('/ClassB/WebB01/Upload.ashx', {
                        method: 'post',
                        body: form
                    }).then(() => {
                        $("#cover").fadeOut();
                    });
                });
                $("form").on('click', "#Clear", () => {
                    $("#Picture").empty();
                });
                $("form").submit(function (event) {
                    event.preventDefault();
                    $.each($("tbody:nth-child(2) tr"), function () {
                        if ($(this).find("input[name='delete']").prop('checked')) {
                            $.ajax({
                                url: '/ClassB/WebB01/Delete.ashx',
                                method: 'get',
                                data: {
                                    item: 'CampusImage',
                                    id:$(this).attr('id')
                                },
                                success: returns => {
                                    if (returns == 'success') { $(this).remove(); }
                                }
                            });
                        } else {
                            $.ajax({
                                url: '/ClassB/WebB01/Modify.ashx',
                                method: 'post',
                                data: {
                                    item: 'CampusImage',
                                    id: $(this).attr('id'),
                                    filename: $(this).find("img").attr('src').replace('/ClassB/WebB01/Images/', ''),
                                    display: $(this).find("input[name='display']").prop('checked') ? 'yes' : 'no'
                                }
                            });
                        }
                    });
                });
            });
			function fetchrow(skipnum, fetchnum) {
				$("tbody:nth-child(2)").empty();
				$.ajax({
					url: '/ClassB/WebB01/Fetch.ashx',
					method: 'get',
					data: {
						item: 'CampusImage',
						skipnum: skipnum,
						fetchnum: fetchnum
					},
					dataType: 'json',
					success: returns => {
						$.each(returns, (key, value) => {
                            if (key < 3) {
								let row = '<tr id="' + value.Id + '" class="trce">' +
									'<td><img src="/ClassB/WebB01/Images/' + value.FileName + '" height="100" width="68"/></td>' +
									'<td><input type="checkbox" name="display"';
								if (value.Display == 'yes') { row += ' checked'; }
								row += '/></td>' +
									'<td><input type="checkbox" name="delete"/>' +
									'<td><input name="update" type="button" value="變更圖片" /></td>' +
									'</tr>';
								$("tbody:nth-child(2)").append(row);
                            }
						});
					}
				});
			}
        });
	</script>
</asp:Content>