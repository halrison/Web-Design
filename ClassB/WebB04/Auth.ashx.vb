Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Auth
	Implements IHttpHandler
	Dim authCode1, authCode2 As Integer
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		Randomize()
		context.Response.ContentType = "text/plain"
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
		connection.Open()
		If context.Request.Params.Get("authcode") Is vbNullString Then
			command.Connection = connection
			command.CommandType = 1
			command.CommandText = "update Setting set authNumber1=@auth_number1,authNumber2=@auth_number2"
			authCode1 = Int(Rnd() * 100)
			command.Parameters.AddWithValue("@auth_number1", authCode1)
			authCode2 = Int(Rnd() * 100)
			command.Parameters.AddWithValue("@auth_number2", authCode2)
			If command.ExecuteNonQuery() Then
				context.Response.Write(authCode1 & " " & authCode2)
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