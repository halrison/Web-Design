Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Login
    Implements IHttpHandler
    Dim connection As New SqlConnection
    Dim command As New SqlCommand
    Dim param As New SqlParameter
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        connection.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString
        connection.Open()
        command.Connection = connection
        command.CommandType = CommandType.Text
        If context.Request.Form.HasKeys() Then
            Dim form = context.Request.Form
            command.CommandText = "select PassWord from Account where UserName=@username"
            param.ParameterName = "@username"
            param.Value = form("acc").ToString()
            command.Parameters.Add(param)
            context.Response.ContentType = "text/html"
            Dim scalar = command.ExecuteScalar()
            If form("ps").ToString() = scalar.ToString() Then
                context.Response.Write("success")
            Else
                context.Response.Write("fail")
            End If
        End If
        connection.Close()
    End Sub

    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class