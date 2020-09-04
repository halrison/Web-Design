<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="bottom.aspx.vb" Inherits="WebB01.bottom" %>
<asp:Content ID="BottomContent" ContentPlaceHolderID="PlaceHolder" runat="server">
    <p class="t cent botli">頁尾版權資料管理</p>
    <table>
        <tr class="cent yel">
            <th>頁尾版權資料：</th>
            <td><input id="TextboxFooter" type="text" /></td>
        </tr>
    </table>
    <table style="margin-top:10px; width:70%;">
        <tbody>
            <tr>
                <td style="width:200px"></td>
                <td class="cent">
                    <input type="submit" value="修改確定" />
                    <input type="reset" value="重置" />
                </td>
            </tr>
        </tbody>
    </table> 
    <script type="text/javascript">
        $(document).ready(() => {
            $("#TextboxFooter").val(localStorage.getItem('footer'));
            $("form").submit(event => {
                event.preventDefault();
                localStorage.setItem('footer', $("#TextboxFooter").val());
            });      
        });
    </script>
</asp:Content>
