Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Add
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString
		connection.Open()
		command.Connection = connection
		command.CommandType = CommandType.Text
		If context.Request.Form.HasKeys Then
			Dim item = context.Request.Form.Get("item")
			command.CommandText = "insert into " & item.ToString()
			Select Case item
				Case "Member"
					command.CommandText &= "(username,password,email) values(@username,@password,@email)"
					command.Parameters.AddWithValue("@username", context.Request.Form.Item("username"))
					command.Parameters.AddWithValue("@password", context.Request.Form.Item("password"))
					command.Parameters.AddWithValue("@email", context.Request.Form.Item("email"))
				Case "Good"
					command.CommandText &= "(account,article) values(@account,@article)"
					command.Parameters.AddWithValue("@account", context.Request.Form.Item("account"))
					command.Parameters.AddWithValue("@article", context.Request.Form.Item("article"))
				Case "QuestionnaireTopic"
					command.CommandText &= "(topic,static) values(@topic,0)"
					command.Parameters.AddWithValue("@topic", context.Request.Form.Item("topic"))
				Case "QuestionnaireOption"
					command.CommandText &= "(topic,options,count) values(@topic,@option,0)"
					command.Parameters.AddWithValue("@topic", context.Request.Form.Item("topic"))
					command.Parameters.AddWithValue("@option", context.Request.Form.Item("option"))
			End Select
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