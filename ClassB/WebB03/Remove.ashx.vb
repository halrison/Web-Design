Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Remove
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
		connection.Open()
		If context.Request.Params.HasKeys Then
			Dim item = context.Request.Params.Get("item")
			command.Connection = connection
			command.CommandType = CommandType.Text
			command.CommandText = "delete from " & item & " where id=@id"
			command.Parameters.AddWithValue("@id", context.Request.Params.Get("id"))
			context.Response.ContentType = "text/plain"
			If command.ExecuteNonQuery() Then
				context.Response.Write("Success")
			Else
				context.Response.Write("Fail")
			End If
		End If
	End Sub

	ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property

End Class