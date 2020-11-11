Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Remove
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString
		connection.Open()
		command.Connection = connection
		command.CommandType = CommandType.Text
		If context.Request.QueryString.HasKeys Then
			Dim item = context.Request.QueryString.Get("item")
			command.CommandText = "delete * from " & item & "where id=@id"
			command.Parameters.AddWithValue("@id", context.Request.QueryString.Get("id"))
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