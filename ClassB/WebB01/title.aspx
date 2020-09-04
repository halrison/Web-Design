<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="title.aspx.vb" Inherits="WebB01.title" %>
<asp:Content ID="TitleContent" ContentPlaceHolderID="PlaceHolder" runat="server">    
    <p class="t cent botli">網站標題管理</p>
    <table style="width:100%">
        <thead>
            <tr class="yel">
                <th style="width:45%">網站標題</th>
                <th style="width:32%">替代文字</th>
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
                data: {item:'Title'},
                dataType: 'json',
                success: returns => {
                    let row = '';
                    $.each(returns, (key, value) => {
                        row = '<tr id="' + value.Id + '" class="trce">' +
                            '<td><img src="/ClassB/WebB01/Images/' + value.FileName + '" width="300" height="30"/></td>' +
                            '<td><input name="alt" type="text" value="' + value.AlternativeText + '"/></td>' +
                            '<td><input type="radio" name="display"';
                        if (value.Display == 'yes') { row += ' checked'; }
                        row += '/></td > ' +
                            '<td><input type="checkbox" name="delete"/></td>' +
                            '<td><input name="change_image" type="button" value="更新圖片" /></td>';
                        '</tr>';
                        $("tbody:nth-child(2)").append(row);
                    });
                }
            });
            $("#btnadd").click(() => {
                $("#cvr").html(
                    '<p class="t cent">新增標題區圖片</p>' +
                    '<hr/>' +
                    '標題區圖片：<input id="Picture" name="Picture" type="file" accept="image/*"/><br/>' +
                    '標題區替代文字：<input id="AltText" type="text"/><br/>' +
                    '<button id="Insert" type="button">新增</button>' +
                    '<button id="Clear" type="button">重置</button>'
                );
                $("#cover").fadeIn();
            });
            $("form").on('click', "input[name='change_image']",function () {
                $("#cvr").empty().html(
                    '<p class="t cent">更改標題區圖片</p>' +
                    '<hr/>' +
                    '標題區圖片：<input id="Picture" name="Picture" type="file" accept="image/*"/><br/>' +
                    '<input id="rowid" type="hidden" value="'+$(this).parent("tr").attr('id')+'"/>'+
                    '<button id="Update" type="button">更改</button>' +
                    '<button id="Clear" type="button">重置</button>'
                );
                $("#cover").fadeIn();
            });
            $("form").on('click', "#Insert",
                function (event) {
                    event.preventDefault();
                    let form = new FormData, file = $("#Picture").get(0).files[0];
                    form.set('Picture', file);
                    fetch('/ClassB/ClassB/WebB01/Upload.ashx', {
                        method: 'post',
                        body:form
                    }).then(function () {
                        $.ajax({
                            url: '/ClassB/WebB01/Add.ashx',
                            method: 'post',
                            async:false,
                            data: {
                                item: 'Title',
                                filename: file.name,
                                alternativetext: $("#AltText").val(),
                                display: 'no'
                            },
                            success: returns => {
                                $("tbody:nth-child(2)").prepend(
                                    '<tr id="' + returns + '" class="trce">' +
                                    '<td><img src="/ClassB/WebB01/Images/' + file.name + '" width="300" height="30"/></td>' +
                                    '<td><input name="alt" type="text" /></td>' +
                                    '<td><input type="radio" name="display"></td>' +
                                    '<td><input type="checkbox" name="delete"/></td>' +
                                    '<td><input name="change_image" type="button" value="更新圖片" /></td>' +
                                    '</tr>'
                                );
                                $("#cover").fadeOut();
                            }
                        });
                    });                    
                }
            );
            $("form").on('click', "#Update", () => {
                let form = new FormData, file = $("#Picture").get(0).files[0];
                form.set('Picture', file);
                fetch("/ClassB/WebB01/Upload.ashx", {
                    method: "post",
                    body: form
                }).then(function () {                    
                    $("#cover").fadeOut();                
                });                    
            });
            $("form").on('click', "#Clear", () => {
                $("#Picture").empty();
                $("#AltText").empty();
                $("#rowid").empty();
            })
            $("form").submit(
                function (event) {
                    event.preventDefault();
                    $.each($("tbody:nth-child(2) tr"), function () {
                        if ($(this).find("input:checkbox").prop('checked')) {
                            $.ajax({
                                url: '/ClassB/WebB01/delete.ashx',
                                method: 'get',
                                data: {
                                    item: 'Title',
                                    id: $(this).attr('id')
                                },
                                success: returns => {
                                    if (returns == 'success') {
                                        $("tr#" + value).remove();
                                    }
                                }
                            });
                        } else {
                            $.ajax({
                                url: '/ClassB/WebB01/Modify.ashx',
                                method: 'post',
                                data: {
                                    item: 'Title',
                                    id: $(this).attr('id'),
                                    filename: $(this).find("img").attr('src').replace('/ClassB/WebB01/Images/', ''),
                                    alternativetext: $(this).find("input:text").val(),
                                    display: $(this).find("input:radio").prop('checked') ? 'yes' : 'no'
                                }
                            });
                        }
                    });
                }
            );
        });                
    </script>        
</asp:Content>
