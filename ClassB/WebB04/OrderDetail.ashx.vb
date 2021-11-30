Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class OrderDetail
	Implements IHttpHandler
	Dim connection As New SqlConnection
	Dim command As New SqlCommand
	Dim response As New StringBuilder
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
		command.Connection = connection
		connection.Open()
		command.CommandType = CommandType.Text
		context.Response.ContentType = "text/plain"
		If context.Request.Params.HasKeys() Then
			Select Case context.Request.Params.Get("action")
				Case "add"
					command.CommandText = "insert into OrderDetail(order_number,commodity_number,amount)values(@order_number,@commodity_number,@amount)"
					command.Parameters.AddWithValue("@order_number", context.Request.Params.Item("order_number"))
					command.Parameters.AddWithValue("@commodity_number", context.Request.Params.Item("commodity_number"))
					command.Parameters.AddWithValue("@amount", context.Request.Params.Item("amount"))
				Case "fetch"
					command.CommandText = "select * from OrderDetail where order_number=@order_number for json auto"
					command.Parameters.AddWithValue("@order_number", context.Request.Params.Item("order_number"))
				Case "remove"
					command.CommandText = "delete from OrderDetail where order_number=@order_number"
					command.Parameters.AddWithValue("@order_number", context.Request.Params.Item("order_number"))
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