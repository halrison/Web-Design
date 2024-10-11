Imports System.Data.SqlClient

Public Class Counter
  Implements IHttpHandler
  Dim connection As New SqlConnection
  Dim command As New SqlCommand
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    connection.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString()
    connection.Open()
    connection.ChangeDatabase("DB01")
    command.Connection = connection
    command.CommandType = CommandType.Text
    context.Response.ContentType = "text/plain"
    Select Case context.Request.Params.Item("item")
      Case "PlusViewer"
        Dim counter = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Counter"))
        counter += 1
        context.Response.Write(counter)
      Case "PlusMenu"
        command.CommandText = "update MainMenu set Count=Count+1 where Id=@Id"
        command.Parameters.AddWithValue("@Id", context.Request.Params.Item("Id"))
        If command.ExecuteNonQuery() Then
          context.Response.Write("success")
        Else
          context.Response.Write("fail")
        End If
      Case "MinusMenu"
        command.CommandText = "update MainMenu set Count=Count-1 where Id=@Id"
        command.Parameters.AddWithValue("@Id", context.Request.Params.Item("Id"))
        If command.ExecuteNonQuery() Then
          context.Response.Write("success")
        Else
          context.Response.Write("fail")
        End If
    End Select
  End Sub
  ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
    Get
      Return False
    End Get
  End Property
End Class