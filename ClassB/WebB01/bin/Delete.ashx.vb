Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Delete
    Implements IHttpHandler
    Dim connection As New SqlConnection
    Dim command As New SqlCommand
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        connection.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString
        connection.Open()
        command.Connection = connection
        command.CommandType = CommandType.Text
        context.Response.ContentType = "text/plain"
        If context.Request.QueryString.HasKeys Then
            Dim item = context.Request.QueryString("item")
            command.CommandText = "delete from " & item.ToString & " where Id=@id"
            command.Parameters.AddWithValue("@id", context.Request.QueryString("id").ToString)
            If command.ExecuteNonQuery Then
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