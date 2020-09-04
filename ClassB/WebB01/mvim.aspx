<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="mvim.aspx.vb" Inherits="WebB01.mvim" %>
<asp:Content ID="Content1" ContentPlaceHolderID="PlaceHolder" runat="server">
    <p class="t cent botli">動畫圖片管理</p>
    <table style="width:100%">
        <thead>
            <tr class="yel">
                <th style="width:68%">動畫圖片</th>
                <th style="width:7%">顯示</th>
                <th style="width:7%">刪除</th>
                <th></th>
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
        $(document).ready(function () {
            $.ajax({
                url: '/ClassB/WebB01/Fetch.ashx',
                method: 'get',
                data: {item:'AnimatePicture'},
                dataType: 'json',
                success: returns => {
                    $.each(returns, (key, value) => {
                        let rows = '<tr id="' + parseInt(value.Id) + '" class="trce">' +
                            '<td><img src="/ClassB/WebB01/Images/' + value.FileName + '" height="120" width="80"/></td>' +
                            '<td><input name="display" type="checkbox"';
                        if (value.Display == 'yes') {
                            rows += ' checked';
                        }
                        rows += '/></td>' +
                            '<td><input name="delete" type="checkbox" /></td>' +
                            '<td><input name="Update" type="button" value="更換動畫" />' +
                            '</tr>';
                        $("tbody:nth-child(2)").append(rows);
                    });
                }
            });
            var form = new FormData();
            $("#btnadd").click(() => {
                $("#cvr").html(
                    '<p class="t cent botli">新增動畫圖片</p>' +
                    '動畫圖片：<input id="Picture" name="Picture" type="file" accept="image/*"/><br/>' +
                    '<button id="Insert" type="button">新增</button>' +
                    '<button id="Clear" type="button">重置</button>'
                );
                $("#cover").fadeIn();
            })
            $("form").on('click', "#Insert", function () {
                let file = $("#Picture").get(0).files[0];
                form.append('Picture', file);
                fetch('/ClassB/WebB01/Upload.ashx', {
                    method: 'post',
                    body: form
                }).then(() => {
                    $.ajax({
                        url: '/ClassB/WebB01/Add.ashx',
                        method: 'post',
                        data: {
                            item: 'AnimatePicture',
                            filename: file.name,
                            display: 'no'
                        },
                        success: returns => {
                            $("tbody:nth-child(2)").prepend(
                                '<tr id="' + returns + '" class="trce">' +
								'<td><img src="' + file.name + '" height="120" width="80"/></td>' +
                                '<td><input name="display" type="checkbox" /></td>' +
                                '<td><input name="delete" type="checkbox" /></td>' +
                                '<td><input name="Update" type="button" value="更換動畫" />' +
                                '</tr>');
                            $("#cover").fadeOut();
                        }
                    });
                });
            });
            $("form").on('click', "input[name='Update']", function () {
                $("#cvr").html(
                    '<p class="t cent">變更動畫圖片</p>' +
                    '<hr/>' +
                    '動畫圖片：<input id="File" type="file" accept="image/*"/><br/>' +
                    '<input id="rowid" type="hidden" value="' + $(this).parents("tr").attr('id') + '"/>' +
                    '<button id="Modify">變更< /button>' +
                    '<button id="Clear">重置< /button>'
                );
                $("#cover").fadeIn();
            });
            $("form").on('click', "#Modify", function () {
                let file = $("#File").get(0).files[0];
                form.append('Picture', file);
                fetch('/ClassB/WebB01/Upload.ashx', {
                    method: 'post',
                    body: form
                }).then(() => {
                    $("tr" + $("#rowid").val()).find("img").attr('src', "/ClassB/WebB01/Images/"+file.name);
                    $("#cover").fadeOut();
                });
            });
            $("form").submit(function (event) {
                event.preventDefault();
                $.each($("tbody:nth-child(2) tr"), function () {
                    if ($(this).find("input[name='delete']").prop('checked')) {
                        $.ajax({
                            url: '/ClassB/WebB01/Delete.ashx?item=AnimatePicture&id=' + $(this).attr('id'),
                            method: 'get',
                            success: responses => {
                                if (responses == 'success') { $(this).remove(); }
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/ClassB/WebB01/Modify.ashx',
                            method: 'post',
                            data: {
                                item: 'AnimatePicture',
                                id: $(this).attr('id'),
                                filename: $(this).find("img").attr('src').replace("/ClassB/WebB01/Images/",""),
                                display: $(this).find("input[name='display']").prop('checked') ? 'yes' : 'no'
                            }
                        });
                    }
                });
            });
        });
	</script>
</asp:Content>