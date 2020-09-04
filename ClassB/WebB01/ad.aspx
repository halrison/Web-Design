<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="ad.aspx.vb" Inherits="WebB01.ad" %>
<asp:Content ID="AdContent" ContentPlaceHolderID="PlaceHolder" runat="server">
    <p class="t cent botli">動態文字廣告管理</p>
    <table style="width:100%">
        <thead>
            <tr class="yel">
                <th style="width:68%">動態文字廣告</th>
                <th style="width:7%">顯示</th>
                <th style="width:7%">刪除</th>
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
    <script>
        $(document).ready(function () {
            $.ajax({
                url: '/ClassB/WebB01/Fetch.ashx',
                method: 'get',
                data: { item: 'DynamicText' },
                dataType: 'json',
                success: returns => {
                    $.each(returns, (key, value) => {
                        let row = "<tr id='" + value.Id +"' class='trce'>" +
                            "<td><input type='text' value='" + value.Message + "'/></td>" +
                            "<td><input type='checkbox' name='display' ";
                        if (value.Display == 'yes') { row += "checked"; }
                        row+= "/></td>" +
                            "<td><input type='checkbox' name='delete'/></td>" +
                        "</tr>";
                        $("tbody:nth-child(2)").append(row);
                    })
                }
            })
            $("#btnadd").click(() => {
                $("#cvr").html(
                    '<p class="t cent">新增動態文字廣告</p>' +
                    '<hr/>' +
                    '動態文字廣告：<input id="AdText" type="text" /><br/>' +
                    '<button id="Insert" type="button">新增</button>' +
                    '<button id="Clear" type="button">重置</button>'
                );
                $("#cover").fadeIn();
            })
            $("form").on('click',"#Insert", () => {
                $.ajax({
                    url: '/ClassB/WebB01/Add.ashx',
                    method: 'post',
                    data: {
                        item:'DynamicText',
                        message: $("#AdText").val(),
                        display:'no'
                    },
                    success: returns => {
                        $("tbody:nth-child(2)").prepend(
                            "<tr id='" + returns + "'>" +
                                "<td><input type='text' value='" + $("#AdText").val() + "'/></td>" +
                                "<td><input type='checkbox' name='display'/></td>" +
                                "<td><input type='checkbox' name='delete'/></td>" +
                            "</tr>"
                        );
                        $("#cover").fadeOut();
                    }
                });
            });
            $("form").on('click', "#Clear", () => {
                $("#AdText").empty();
            })
            $("form").submit(function (event) {
                event.preventDefault();
                $.each($("tbody:nth-child(2) tr"), function () {
                    if ($(this).find("input[name='delete']").prop('checked')) {
                        $.ajax({
                            url: '/ClassB/WebB01/Delete.ashx?item=DynamicText&id=' + $(this).attr('id'),
                            method: 'get',
                            success: result => {
                                if (result == 'success') { $(this).remove(); }
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/ClassB/WebB01/Modify.ashx',
                            method: 'post',
                            data: {
                                item: 'DynamicText',
                                id: $(this).attr('id'),
                                message: $(this).find("input:text").val(),
                                display: $(this).find("input[name='display']").prop('checked') ? 'yes' : 'no'
                            }
                        });
                    }
                });
            });
        });        
    </script>
</asp:Content>