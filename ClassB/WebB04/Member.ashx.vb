Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Member
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Dim response As New StringBuilder
	Dim authCode1, authCode2 As Integer
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
		command.Connection = connection
		connection.Open()
		command.CommandType = CommandType.Text
		If context.Request.Params.HasKeys() Then
			Select Case context.Request.Params.Get("action")
				Case "fetchall"
					command.CommandText = "select * from Member for json auto"
					Output(command, response)
				Case "fetchone"
					command.CommandText = "select * from Member where account=@account for json auto"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					Output(command, response)
				Case "login"
					command.CommandText = "select password from Member where account=@account"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					Dim password = command.ExecuteScalar()
					If context.Request.Params.Get("password") = password.ToString() Then
						command.CommandText = "select authNumber1,authNumber2 from Setting"
						Dim reader = command.ExecuteReader()
						authCode1 = reader.GetInt32(0)
						authCode2 = reader.GetInt32(1)
						If CType(context.Request.Params.Get("authcode"), Integer) = authCode1 + authCode2 Then
							response.Append("Success")
						End If
					Else
						response.Append("Fail")
					End If
				Case "add"
					command.CommandText = "insert into Member(account,password,name,email,phone,address,registered_at) values(@account,@password,@name,@email,@phone,@address,@registered_at)"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					command.Parameters.AddWithValue("@password", context.Request.Params.Item("password"))
					command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
					command.Parameters.AddWithValue("@email", context.Request.Params.Item("email"))
					command.Parameters.AddWithValue("@phone", context.Request.Params.Item("phone"))
					command.Parameters.AddWithValue("@address", context.Request.Params.Item("address"))
					command.Parameters.AddWithValue("@registered_at", context.Request.Params.Item("registered_at"))
					Output(command, response)
				Case "remove"
					command.CommandText = "delete from Member where account=@account"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					Output(command, response)
				Case "modify"
					command.CommandText = "update Member set name=@name,email=@email,phone=@phone,address=@address where account=@account"
					command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
					command.Parameters.AddWithValue("@email", context.Request.Params.Item("email"))
					command.Parameters.AddWithValue("@phone", context.Request.Params.Item("phone"))
					command.Parameters.AddWithValue("@address", context.Request.Params.Item("address"))
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					Output(command, response)
			End Select
			context.Response.ContentType = "text/plain"
			If response.Length > 0 Then context.Response.Write(response.ToString())
		End If
		connection.Close()
	End Sub
	Sub Output(ByVal command As SqlCommand, ByVal response As StringBuilder)
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
	End Sub
	ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property
End Class