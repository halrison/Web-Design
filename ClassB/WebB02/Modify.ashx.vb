Imports System.Data.SqlClient
Public Class Modify
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = Web.Configuration.WebConfigurationManager.ConnectionStrings("Connection").ToString
		connection.Open()
		command.Connection = connection
		command.CommandType = CommandType.Text
		If context.Request.Form.HasKeys Then
			Dim item = context.Request.Form.Get("item")
			command.CommandText = "update " & item.ToString() & " set"
			Select Case item
				Case "Article"
					command.CommandText &= " good=good"
					If context.Request.Form.Get("action") = "plus" Then
						command.CommandText &= "+"
					Else
						command.CommandText &= "-"
					End If
					command.CommandText &= "1 where id=@id"
					command.Parameters.AddWithValue("@id", context.Request.Form.Item("id"))
				Case "QuestionnaireTopic"
					command.CommandText &= " static=static+1 where id=@id"
					command.Parameters.AddWithValue("@id", context.Request.Form.Item("id"))
				Case "QuestionnaireOption"
					command.CommandText &= " count=count+1 where topic=@topic and options=@option"
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