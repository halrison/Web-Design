Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Add
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
			command.CommandText = "insert into " & item
			Select Case item
				'新增電影
				Case "Movie"
					Dim keys = context.Request.Params.AllKeys
					'完整新增
					If keys.Contains("levels") AndAlso keys.Contains("length") AndAlso keys.Contains("date") AndAlso keys.Contains("publisher") AndAlso keys.Contains("director") AndAlso keys.Contains("trailer") AndAlso keys.Contains("brief") AndAlso keys.Contains("animation") Then
						command.CommandText &= " (name,levels,length,date,publisher,director,trailer,poster,brief,display,animation) values (@name,@levels,@length,@date,@publisher,@director,@trailer,@poster,@brief,@display,@animation)"
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
						'部分新增
					Else
						command.CommandText &= " (name,poster,display) values(@name,@poster,@display)"
						command.Parameters.AddWithValue("@name", context.Request.Params.Get("name"))
						command.Parameters.AddWithValue("@poster", context.Request.Params.Get("poster"))
						command.Parameters.AddWithValue("@display", context.Request.Params.Get("display"))
					End If
				'新增訂票
				Case "Ticket"
					command.CommandText &= " (movie,date,time,seat,number) values (@movie,@date,@time,@seat,@number)"
					command.Parameters.AddWithValue("@movie", context.Request.Params.Get("movie"))
					command.Parameters.AddWithValue("@date", context.Request.Params.Get("date"))
					command.Parameters.AddWithValue("@time", context.Request.Params.Get("time"))
					command.Parameters.AddWithValue("@seat", context.Request.Params.Get("seat"))
					command.Parameters.AddWithValue("@number", context.Request.Params.Get("number"))
			End Select
			context.Response.ContentType = "text/plain"
			If command.ExecuteNonQuery() > 0 Then
				command.CommandType = CommandType.StoredProcedure
				command.CommandText = "getLastInsertedId"
				command.Parameters.Clear()
				command.Parameters.AddWithValue("@table", item)
				Dim id = command.ExecuteScalar()
				context.Response.Write(id)
			Else
				context.Response.Write("failed")
			End If
		End If
	End Sub
	ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property
End Class