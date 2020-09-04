<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="news.aspx.vb" Inherits="WebB01.news" %>
<asp:Content ID="NewsContent" ContentPlaceHolderID="PlaceHolder" runat="server">
    <p class="t cent botli">最新消息管理</p>
    <table style="width:100%">
        <thead>
            <tr class="yel">
                <th style="width:68%">最新消息資料內容</th>
                <th style="width:7%">顯示</th>
                <th style="width:7%">刪除</th>
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
                    <input type="button" id="btnadd" />
                </td>
                <td class="cent">
                    <input type="submit" value="修改確定" />
                    <input type="reset" value="重置" />
                </td>
            </tr>
        </tbody>
    </table>        
    <script type="text/javascript">
        $(document).ready(() => {
            var pagecount,rowcount,pagecurrent=1;
            $.ajax({
                url: '/ClassB/WebB01/Fetch.ashx',
                method: 'get',
                data: { item: 'News' },
                dataType: 'json',
                success: returns => {
                    rowcount = returns.length;
                    pagecount = Math.ceil(rowcount / 4);
                    var paginationlink = '<a href="#" id="prev"><</a>';
                    for (var i = 1; i <= pagecount; i++) {
                        paginationlink += '<li';
                        if (i == pagecurrent) {
                            paginationlink += ' class="current"';
                        }
                        paginationlink+='"> ' + i + '</li > ';
                    }
                    paginationlink += '<a href="#" id="next">></a>';
                    $("#pagination-item").html(paginationlink);
                    fetchrow(0, 4);
                }
            });
            $("#btnadd").click(() => {
                $("#cvr").html(
                    '<p class="cent botli t">新增最新消息資料</p>' +
                    '最新消息資料：<textarea id="News" rows="2" cols="20"></textarea>' +
                    '<button id="Insert" type="button">新增</button>' +
                    '<button id="Clear" type="button">重置</button>'
                );
                $("#cover").fadeIn();
            });
            $("form").on('click', "#Insert", () => {
                $.ajax({
                    url: '/ClassB/WebB01/Add.ashx',
                    method: 'post',
                    data: {
                        item: 'News',
                        message: $("#News").val(),
                        display:'no'
                    },
                    success: returns => {
                        if (returns !== 'fail') {
                            $("tbody:nth-child(2)").prepend(
                                '<tr id=' + returns + ' class="trce">' +
                                '<td class="cent"><textarea name="news" rows="3" cols="60%">' + $("#News").val() + '</textarea></td>' +
                                '<td><input type="checkbox" name="display"/></td>' +
                                '<td><input name="delete" type="checkbox" /></td>' +
                                '</tr>');
                            $("#cover").fadeOut();
                        }
                    }
                });
            });
            $("form").on('click', "#Clear", () => { $("#News").empty(); });
            $("form").on('click', "#prev", function() {
                pagecurrent--;
                if (pagecurrent < 1) {
                    pagecurrent=1;
                } else {
					$("#pagination-item").children().each(function(){
                        if ($(this).text() == pagecurrent) {
							$(this).addClass('current');
                        } else {
							$(this).removeClass('current');
						}
					});
                    fetchrow((pagecurrent - 1) * 4, 4);
                }
            });
            $("form").on('click', "#next", function(){
                pagecurrent++;
                if (pagecurrent > pagecount) {
                    pagecurrent=pagecount;
                } else {
					$("#pagination-item").children().each(function(){
						if ($(this).text() == pagecurrent) {
							$(this).addClass('current');
						}else {
							$(this).removeClass('current');
						}
					});
                    fetchrow((pagecurrent - 1) * 4, 4);
                }
            });
            $("form").submit(event => {
                event.preventDefault();
                $.each($("tbody:nth-child(2) tr"), function(){
                    if ($(this).find("input[name='delete']").prop('checked')) {
                        $.ajax({
                            url: '/ClassB/WebB01/Delete.ashx' ,
                            method: 'get',
                            data: {
                                item: 'News',
                                id:$(this).attr('id')
							},
                            success: responses => {
                                if (responses == 'success') { $(this).remove(); }
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/ClassB/WebB01/Modify.ashx',
                            method: 'post',
                            data: {
                                item: 'News',
                                id:$(this).attr('id'),
                                message: $(this).find("textarea").val(),
                                display: $(this).find("input[name='display']").prop('checked') ? 'yes' : 'no'
                            }
                        });
                    }
                });
            });
            function fetchrow(skipnum, fetchnum) {
                $("tbody:nth-child(2)").empty();
                $.ajax({
                    url: '/ClassB/WebB01/Fetch.ashx',
                    method: 'get',
                    data: {
                        item: 'News',
                        skipnum: skipnum,
                        fetchnum: fetchnum
                    },
                    dataType: 'json',
                    success: returns => {
                        $.each(returns, (key, value) => {
                            if (key < 4) {
                                let row = '<tr id=' + value.Id + ' class="trce">' +
                                '<td class="cent"><textarea name="news" rows="3" cols="60%">' + value.Message + '</textarea></td>' +
                                '<td><input type="checkbox" name="display"';
                                if (value.Display == 'yes') { row += ' checked'; }
                                row += '/></td>' +
                                    '<td><input name="delete" type="checkbox" /></td>' +
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