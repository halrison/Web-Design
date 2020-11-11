Imports System.Web.Configuration
Imports System.Data.SqlClient
Public Class Fetch
    Implements IHttpHandler
    Dim connection As New SqlConnection
    Dim command As New SqlCommand
    Dim result As New StringBuilder
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        connection.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString
        connection.Open()
        command.Connection = connection
        command.CommandType = CommandType.Text
        If context.Request.QueryString.HasKeys Then
            Dim item = context.Request.QueryString("item")
            command.CommandText = "select * from " & item.ToString()
            If item = "Sub" Then
                command.CommandText &= " where Father=@father"
                command.Parameters.AddWithValue("@father", context.Request.QueryString("father"))
            Else
                If context.Request.QueryString("skipnum") IsNot vbNullString And context.Request.QueryString("fetchnum") IsNot vbNullString Then
                    command.CommandText &= " order by Id ASC offset @skipnum rows fetch next @fetchnum rows only"
                    command.Parameters.AddWithValue("@skipnum", Convert.ToInt16(context.Request.QueryString("skipnum")))
                    command.Parameters.AddWithValue("@fetchnum", Convert.ToInt16(context.Request.QueryString("fetchnum")))
                End If
            End If
            command.CommandText &= " for json auto"
            Dim reader = command.ExecuteReader()
            If reader.HasRows Then
                Do While reader.Read
                    result.Append(reader.GetValue(0))
                Loop
            Else
                result.Append("[]")
            End If
            context.Response.Write(result.ToString())
        End If
        connection.Close()
    End Sub

    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property

End Class