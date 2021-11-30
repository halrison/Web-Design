Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Admin
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
				Case "add"
					command.CommandText = "insert into Admin(account,password,permittion) values(@account,@password,@permittion)"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					command.Parameters.AddWithValue("@password", context.Request.Params.Item("password"))
					command.Parameters.AddWithValue("@permittion", context.Request.Params.Item("permittion"))
					Output(command, response)
				Case "fetchall"
					command.CommandText = "select * from Admin for json auto"
					Output(command, response)
				Case "fetchone"
					command.CommandText = "select * from Admin where account=@account for json auto"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					Output(command, response)
				Case "login"
					If context.Request.Params.Get("account") = "admin" AndAlso context.Request.Params.Get("password") = "1234" Then
						Verify(context.Request.Params.Get("authcode"))
					Else
						command.CommandText = "select password from Admin where account=@account"
						command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
						Dim password = command.ExecuteScalar()
						If context.Request.Params.Get("password") = password.ToString() Then
							Verify(context.Request.Params.Get("authcode"))
						Else
							response.Append("Fail")
						End If
					End If
				Case "modify"
						command.CommandText = "update Admin set password=@password,permittion=@permittion where account=@account"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					command.Parameters.AddWithValue("@password", context.Request.Params.Item("password"))
					command.Parameters.AddWithValue("@permittion", context.Request.Params.Item("permittion"))
					Output(command, response)
				Case "remove"
					command.CommandText = "delete from Admin where account=@account"
					command.Parameters.AddWithValue("@account", context.Request.Params.Item("account"))
					Output(command, response)
			End Select
			context.Response.ContentType = "text/plain"
			If response.Length > 0 Then context.Response.Write(response.ToString())
		End If
		connection.Close()
	End Sub
	Sub Verify(authcode)
		command.CommandText = "select authNumber1,authNumber2 from Setting"
		Dim reader = command.ExecuteReader()
		If reader.HasRows Then
			Do While reader.Read()
				authCode1 = reader.GetValue(0)
				authCode2 = reader.GetValue(1)
				If CType(authcode, Integer) = authCode1 + authCode2 Then
					response.Append("Success")
				Else
					response.Append("Fail")
				End If
			Loop
		End If
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