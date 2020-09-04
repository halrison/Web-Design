<%@ Page Title="" Language="vb" AutoEventWireup="false" MasterPageFile="~/Site.Master" CodeBehind="counter.aspx.vb" Inherits="WebB01.counter" %>
<asp:Content ID="CounterContent" ContentPlaceHolderID="PlaceHolder" runat="server">
    <p class="t cent botli">進站總人數管理</p>
    <table>
        <tr class="cent yel">
            <th>進站總人數：</th>
            <td><input type="number" id="TextboxCounter"/></td>
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
            $("#TextboxCounter").val(localStorage.getItem('counter'));
            $("form").submit(event => {
                event.preventDefault();
                localStorage.setItem('counter', $("#TextboxCounter").val());
            });      
        });          
    </script>
</asp:Content>