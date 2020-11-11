Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Fetch
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Dim result As New StringBuilder
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString
		connection.Open()
		command.Connection = connection
		command.CommandType = CommandType.Text
		If context.Request.QueryString.HasKeys Then
			Dim item = context.Request.QueryString.Item("item")
			command.CommandText = "select * from " & item.ToString()
			If context.Request.QueryString.Get("category") IsNot vbNullString Then
				command.CommandText &= " where category=@category"
				command.Parameters.AddWithValue("@category", context.Request.QueryString.Item("category"))
			ElseIf context.request.QueryString.Get("skip") IsNot vbNullString AndAlso context.Request.QueryString.Get("fetch") IsNot vbNullString Then
				command.CommandText &= " order by Id ASC offset @skip rows fetch next @fetch rows only"
				command.Parameters.AddWithValue("@skip", Convert.ToInt32(context.Request.QueryString.Get("skip")))
				command.Parameters.AddWithValue("@fetch", Convert.ToInt32(context.Request.QueryString.Get("fetch")))
			ElseIf context.Request.QueryString.Get("account") IsNot vbNullString AndAlso context.Request.QueryString.Get("article") IsNot vbNullString Then
				command.CommandText &= " where account=@account and article=@article"
				command.Parameters.AddWithValue("@account", context.Request.QueryString.Item("account"))
				command.Parameters.AddWithValue("@article", context.Request.QueryString.Item("article"))
			ElseIf context.Request.QueryString.Get("topic") IsNot Nothing Then
				command.CommandText &= " where topic=@topic"
				command.Parameters.AddWithValue("@topic", context.Request.QueryString.Item("topic"))
			End If
			command.CommandText &= " for json auto"
			Dim reader = command.ExecuteReader()
			If reader.HasRows Then
				Do While reader.Read
					result.Append(reader.GetValue(0))
				Loop
				context.Response.Write(result.ToString())
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