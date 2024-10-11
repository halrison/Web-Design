Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class OrderSummary
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Dim response As New StringBuilder
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
		command.Connection = connection
		connection.Open()
		command.CommandType = CommandType.Text
    connection.ChangeDatabase("DB04")
    If context.Request.Params.HasKeys() Then
      Select Case context.Request.Params.Get("action")
        '取得
        Case "fetch"
          command.CommandText = "select * from OrderSummary for json auto"
        '新增
        Case "add"
          command.CommandText = "insert into OrderSummary(number,account,total)values(@number,@account,@total)"
          command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
          command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
          command.Parameters.AddWithValue("@total", context.Request.Params.Item("total"))
        '刪除
        Case "remove"
          command.CommandText = "delete from OrderSummary where number=@number"
          command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
      End Select
      '查詢類型為選擇
      If command.CommandText.StartsWith("select") Then
        Dim reader = command.ExecuteReader()
        If reader.HasRows Then
          Do While reader.Read()
            response.Append(reader.GetValue(0))
          Loop
        End If
      Else
        '查詢類型為新增/刪除/修改
        Dim result = IIf(command.ExecuteNonQuery() > 0, "Success", "Fail")
        response.Append(result)
      End If
      context.Response.ContentType = "text/plain"
      If response.Length > 0 Then context.Response.Write(response)
    End If
    connection.Close()
	End Sub
	ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property
End Class