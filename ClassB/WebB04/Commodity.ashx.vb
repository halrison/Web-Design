Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Commodity
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
			Select Case context.Request.Params.Get("action")
				Case "fetchall"
					command.CommandText = "select * from Commodity"
					If context.Request.Params.AllKeys.Contains("status") Then
						command.CommandText &= " where status='up'"
					End If
					command.CommandText &= " for json auto"
				Case "fetchsome"
					command.CommandText = "select * from Commodity"
					If context.Request.Params.AllKeys.Contains("big") Then
						command.CommandText &= " where big=@big"
						command.Parameters.AddWithValue("@big", context.Request.Params.Item("big"))
					End If
					If context.Request.Params.AllKeys.Contains("medium") Then
						command.CommandText &= " and medium=@medium"
						command.Parameters.AddWithValue("@medium", context.Request.Params.Item("medium"))
					End If
					command.CommandText &= " for json auto"
				Case "fetchone"
					command.CommandText = "select * from Commodity where number=@number for json auto"
					command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
				Case "add"
					command.CommandText = "insert into Commodity(number,name,price,picture,big,medium,quantity,specification,description,status) values(@number,@name,@price,@picture,@big,@medium,@quantity,@specification,@description,'down')"
					command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
					command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
					command.Parameters.AddWithValue("@price", context.Request.Params.Item("price"))
					command.Parameters.AddWithValue("@picture", context.Request.Params.Item("picture"))
					command.Parameters.AddWithValue("@big", context.Request.Params.Item("big"))
					command.Parameters.AddWithValue("@medium", context.Request.Params.Item("medium"))
					command.Parameters.AddWithValue("@quantity", context.Request.Params.Item("quantity"))
					command.Parameters.AddWithValue("@specification", context.Request.Params.Item("specification"))
					command.Parameters.AddWithValue("@description", context.Request.Params.Item("description"))
				Case "remove"
					command.CommandText = "delete from Commodity where number=@number"
					command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
				Case "modify"
					command.CommandText = "update Commodity set name=@name,price=@price,picture=@picture,big=@big,medium=@medium,quantity=@quantity,specification=@specification,description=@description where number=@number"
					command.Parameters.AddWithValue("@name", context.Request.Params.Item("name"))
					command.Parameters.AddWithValue("@price", context.Request.Params.Item("price"))
					command.Parameters.AddWithValue("@picture", context.Request.Params.Item("picture"))
					command.Parameters.AddWithValue("@big", context.Request.Params.Item("big"))
					command.Parameters.AddWithValue("@medium", context.Request.Params.Item("medium"))
					command.Parameters.AddWithValue("@quantity", context.Request.Params.Item("quantity"))
					command.Parameters.AddWithValue("@specification", context.Request.Params.Item("specification"))
					command.Parameters.AddWithValue("@description", context.Request.Params.Item("description"))
				Case "up"
					command.CommandText = "update Commodity set status='up' where number=@number"
					command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
				Case "down"
					command.CommandText = "update Commodity set status='down' where number=@number"
					command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
				Case "decrease"
					command.CommandText = "update Commodity set quantity=quantity-1 where number=@number"
					command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
				Case "increase"
					command.CommandText = "update Commodity set quantity=quantity+1 where number=@number"
					command.Parameters.AddWithValue("@number", context.Request.Params.Item("number"))
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