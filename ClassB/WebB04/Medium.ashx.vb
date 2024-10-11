Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Medium
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Dim response As New StringBuilder
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
		command.Connection = connection
		connection.Open()
		command.CommandType = CommandType.Text

    If context.Request.Params.HasKeys() Then
      Select Case context.Request.Params.Get("action")
        '查詢
        Case "fetch"
          command.CommandText = "select * from Medium where big=@big for json auto"
          command.Parameters.AddWithValue("@big", context.Request.Params.Get("big"))
        '刪除
        Case "remove"
          command.CommandText = "delete from Medium where big=@big and medium=@medium"
          command.Parameters.AddWithValue("@big", context.Request.Params.Item("big"))
          command.Parameters.AddWithValue("@medium", context.Request.Params.Item("medium"))
        '修改
        Case "modify"
          command.CommandText = "update Medium set name=@name  where big=@big and medium=@medium"
          command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
          command.Parameters.AddWithValue("@big", context.Request.Params.Item("big"))
          command.Parameters.AddWithValue("@medium", context.Request.Params.Item("medium"))
        '新增
        Case "add"
          command.CommandText = "insert into Medium(name,big,count) values(@name,@big,0)"
          command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
          command.Parameters.AddWithValue("@big", context.Request.Params.Item("big"))
      End Select
      '查詢
      If command.CommandText.StartsWith("select") Then
        Dim reader = command.ExecuteReader()
        If reader.HasRows Then
          Do While reader.Read()
            response.Append(reader.GetValue(0))
          Loop
        End If
        '新增/刪除/修改
      Else
        Dim result = IIf(command.ExecuteNonQuery() > 0, "Success", "Fail")
        response.Append(result)
      End If
      context.Response.ContentType = "text/plain"
      If response.Length > 0 Then context.Response.Write(response.ToString())
    End If
    connection.Close()
	End Sub
	ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property
End Class