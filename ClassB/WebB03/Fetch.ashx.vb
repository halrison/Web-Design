Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Fetch
  Implements IHttpHandler
  Dim connection As New SqlConnection
  Dim command As New SqlCommand
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
    connection.Open()
    connection.ChangeDatabase("DB03")
    If context.Request.Params.HasKeys Then
      command.Connection = connection
      command.CommandText = "select * from " & context.Request.Params.Get("item") & " for json auto"
      Dim reader = command.ExecuteReader()
      If reader.HasRows Then
        Dim result As New StringBuilder
        While reader.Read
          result.Append(reader.GetValue(0))
        End While
        context.Response.ContentType = "text/plain"
        context.Response.Write(result.ToString())
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
