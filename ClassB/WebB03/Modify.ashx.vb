Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Modify
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
		connection.Open()
		If context.Request.Params.HasKeys Then
			command.Connection = connection
			command.CommandType = CommandType.Text
			command.CommandText = "update Movie set name=@name,levels=@levels,length=@length,date=@date,publisher=@publisher,director=@director,trailer=@trailer,poster=@poster,brief=@brief,display=@display,animation=@animation where id=@id"
			command.Parameters.AddWithValue("@name", context.Request.Params.Get("name"))
			command.Parameters.AddWithValue("@levels", context.Request.Params.Get("levels"))
			command.Parameters.AddWithValue("@length", context.Request.Params.Get("length"))
			command.Parameters.AddWithValue("@date", context.Request.Params.Get("date"))
			command.Parameters.AddWithValue("@publisher", context.Request.Params.Get("publisher"))
			command.Parameters.AddWithValue("@director", context.Request.Params.Get("director"))
			command.Parameters.AddWithValue("@trailer", context.Request.Params.Get("trailer"))
			command.Parameters.AddWithValue("@poster", context.Request.Params.Get("poster"))
			command.Parameters.AddWithValue("@brief", context.Request.Params.Get("brief"))
			command.Parameters.AddWithValue("@display", context.Request.Params.Get("display"))
			command.Parameters.AddWithValue("@animation", context.Request.Params.Get("animation"))
			command.Parameters.AddWithValue("@id", context.Request.Params.Get("id"))
			context.Response.ContentType = "text/plain"
			If command.ExecuteNonQuery() > 0 Then
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