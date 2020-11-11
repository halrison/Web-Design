Imports System.Data.SqlClient
Public Class Login
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Dim result As New StringBuilder
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = Web.Configuration.WebConfigurationManager.ConnectionStrings("Connection").ToString()
		connection.Open()
		command.Connection = connection
		command.CommandType = CommandType.Text
		command.CommandText = "select username,password from Member"
		context.Response.ContentType = "text/plain"
		If context.Request.Form.HasKeys Then
			If context.Request.Form.GetValues("username") IsNot vbNullString Then
				command.CommandText &= "  where username=@username"
				command.Parameters.AddWithValue("@username", context.Request.Form.Item("username"))
			End If
			command.CommandText &= " for json auto"
			Dim reader = command.ExecuteReader()
			If reader.HasRows Then
				Do While reader.Read
					result.Append(reader.GetValue(0))
				Loop
				context.Response.Write(result.ToString)
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