Imports System.Data.SqlClient

Public Class Fetch
  Implements IHttpHandler
  Dim connection As New SqlConnection
  Dim command As New SqlCommand
  Dim result As New StringBuilder
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    connection.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString()
    connection.Open()
    connection.ChangeDatabase("DB01")
    command.Connection = connection
    command.CommandType = CommandType.Text
    If context.Request.QueryString.HasKeys Then
      Dim item = context.Request.QueryString("item")
      command.CommandText = "select * from " & item.ToString()
      '子選單
      If item = "SubMenu" Then
        command.CommandText &= " where Father=@Father"
        command.Parameters.AddWithValue("@Father", Convert.ToInt16(context.Request.QueryString("Father")))
      End If
      '轉換成JSON格式
      command.CommandText &= " for json auto"
      Dim reader = command.ExecuteReader()
      If reader.HasRows Then
        Do While reader.Read
          result.Append(reader.GetValue(0))
        Loop
      Else
        result.Append("[]")
      End If
      context.Response.Write(result.ToString())
    End If
    connection.Close()
  End Sub
  ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
    Get
      Return False
    End Get
  End Property
End Class