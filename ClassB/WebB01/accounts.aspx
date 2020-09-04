<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="accounts.aspx.vb" Inherits="WebB01.accounts" %>
<asp:Content ID="AccountsContent" ContentPlaceHolderID="PlaceHolder" runat="server">
    <p class="botli cent t">管理者帳號管理</p>
    <table style="width: 100%;">
        <thead>
            <tr class="yel">
                <th>帳號</th>
                <th>密碼</th>
                <th>刪除</th>
            </tr>
        </thead>
        <tbody> 
        </tbody>   
    </table>    
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
        $(document).ready(() => {
            $.ajax({
                url: '/ClassB/WebB01/Fetch.ashx',
                method: 'get',
                data: { item: 'Account' },
                dataType:'json',
                success: responses => {
                    $.each(responses, (key, value) => {
                        $("tbody:nth-child(2)").append(
                            '<tr id="' + value.Id + '" class="trce">' +
                            '<td><input name="username" type="text" value="' + value.UserName + '"/></td>' +
                            '<td><input name="password" type="password" value="' + value.PassWord + '"/></td>' +
                            '<td><input name="delete" type="checkbox" /></td>' +
                            '</tr>'
                        );
                    });
				}
            });
            $("#btnadd").click(() => {
                $("#cvr").html(
                    '<p class="botli t">新增管理員帳號</p>' +
                    '帳號：<input id="username" type="text" autocomplete="off"/><br>' +
                    '密碼：<input id="password" type="password" autocomplete="off"/><br>' +
                    '確認密碼：<input id="confirm" type="password" autocomplete="off"/><br>' +
                    '<button id="Insert">新增</button>' +
					'<button id="Clear">重置</button>'
                );
                $("#cover").addClass('cent').fadeIn();
            });
            $("form").on('click', "#Insert", () => {
                $.ajax({
                    url: '/ClassB/WebB01/Add.ashx',
                    method: 'post',
                    data: {
                        item:'Account',
                        username: $("#username").val(),
                        password:$("#password").val()
                    },
                    success: returns => {
						$("tbody:nth-child(2)").prepend(
							'<tr id="' + returns + '" class="trce">' +
							'<td><input name="username" type="text" value="' +$("#username").val() + '"/></td>' +
							'<td><input name="password" type="password" value="' + $("#password").val() + '"/></td>' +
							'<td><input name="delete" type="checkbox" /></td>' +
							'</tr>'
                        );
                        $("#cover").fadeOut();
					}
                });
            });
            $("form").on('click', "#Clear", () => {
                $("#usesrname").empty();
                $("#password").empty();
            });
            $("form").submit(event => {
                event.preventDefault();
                $.each($("tbody:nth-child(2) tr"), function() {
                    if ($(this).find("input[name='delete']").prop('checked')) {
                        $.ajax({
                            url: '/ClassB/WebB01/Delete.ashx',
                            method: 'get',
                            data: {
                                item: 'Account',
                                id: $(this).attr('id')
                            },
                            success: responses => {
                                if (responses == 'success') {
                                    $(this).remove();
                                }
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/ClassB/WebB01/Modify.ashx',
                            method: 'post',
                            data: {
                                item: 'Account',
                                id: $(this).attr('id'),
                                username: $(this).find("input:text").val(),
                                password: $(this).find("input:password").val()
                            }
                        });
					}
                });
            });
        });
	</script>
</asp:Content>