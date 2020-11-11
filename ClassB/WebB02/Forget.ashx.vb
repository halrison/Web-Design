Imports System.Data.SqlClient
Public Class forget
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = Web.Configuration.WebConfigurationManager.ConnectionStrings("Connection").ToString()
		connection.Open()
		command.Connection = connection
		command.CommandType = CommandType.Text
		command.CommandText = "select password from Member"
		If context.Request.Form.HasKeys Then
			If context.Request.Form.GetValues("email") IsNot vbNullString Then
				command.CommandText &= "  where email=@email"
				command.Parameters.AddWithValue("@email", context.Request.Form.Item("email"))
			End If
			Dim result = command.ExecuteScalar()
			context.Response.ContentType = "text/plain"
			If result IsNot Nothing Then
				context.Response.Write(result)
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