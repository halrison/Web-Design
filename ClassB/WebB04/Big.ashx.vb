Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Big
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
			Dim action = context.Request.Params.Get("action")
			Select Case action
				Case "fetch"
					command.CommandText = "select * from Big for json auto"
				Case "remove"
					command.CommandText = "delete from Big where id=@id"
					command.Parameters.AddWithValue("@id", context.Request.Params.Item("id"))
				Case "modify"
					command.CommandText = "update Big set name=@name where id=@id"
					command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
					command.Parameters.AddWithValue("@id", context.Request.Params.Item("id"))
				Case "add"
					command.CommandText = "insert into Big(name,count) values(@name,0)"
					command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
			End Select
			If command.CommandText.StartsWith("select") Then
				Dim reader = command.ExecuteReader()
				If reader.HasRows Then
					Do While reader.Read()
						response.Append(reader.GetValue(0))
					Loop
				End If
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