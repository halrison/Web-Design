Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Footer
    Implements IHttpHandler
    Dim connection As New SqlConnection
    Dim command As New SqlCommand
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        context.Response.ContentType = "text/plain"
        connection.ConnectionString = WebConfigurationManager.ConnectionStrings("Connection").ToString()
        connection.Open()
        If context.Request.Params.HasKeys() Then
            command.Connection = connection
            command.CommandType = 1
            Select Case context.Request.Params.Get("action")
                Case "get"
                    '取得頁尾
                    command.CommandText = "select footer from Setting"
                    Dim footer = command.ExecuteScalar()
                    context.Response.Write(footer)
                Case "set"
                    '設定頁尾
                    Dim footer = context.Request.Params.Get("newFooter")
                    command.CommandText = "update Setting set footer=@footer"
                    command.Parameters.AddWithValue("@footer", footer)
                    If command.ExecuteNonQuery() Then
                        context.Response.Write("Success")
                    Else
                        context.Response.Write("Fail")
                    End If
            End Select
        End If
        connection.Close()
    End Sub
    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property
End Class