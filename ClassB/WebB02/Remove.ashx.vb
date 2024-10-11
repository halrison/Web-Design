Imports System.Data.SqlClient
Imports System.Web
Imports System.Web.Configuration
Imports System.Web.Services

Public Class Remove
  Implements System.Web.IHttpHandler
  Dim connection As New SqlConnection
  Dim command As New SqlCommand
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString
    connection.Open()
    connection.ChangeDatabase("DB02")
    command.Connection = connection
    command.CommandType = CommandType.Text
    If context.Request.Form.HasKeys Then
      Dim form = context.Request.Form
      If form.Get("item") = "Good" Then
        command.CommandText = "delete from Good where article=@article and account=@account"
        command.Parameters.AddWithValue("@article", form.Get("article"))
        command.Parameters.AddWithValue("@account", form.Get("account"))
      Else
        command.CommandText = "delete from " & form.Get("item") & "where id=@id"
        command.Parameters.AddWithValue("@id", form.Get("id"))
      End If
      context.Response.ContentType = "text/plain"
      If command.ExecuteNonQuery() > 0 Then
        context.Response.Write("Success")
      Else
        context.Response.Write("Fail")
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