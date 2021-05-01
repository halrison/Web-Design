Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Add
    Implements IHttpHandler
    Dim connect As New SqlConnection
    Dim command As New SqlCommand
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        connect.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString
        connect.Open()
        command.Prepare()
        command.Connection = connect
        command.CommandType = CommandType.Text
        If context.Request.Form.HasKeys Then
            Dim form = context.Request.Form
            command.CommandText = "insert into " & form.Item("item")
            Select Case form.Item("item")
                '標題
                Case "Title"
                    command.CommandText &= " (FileName,AlternativeText,Display) values(@filename,@alternativetext,@display)"
                    command.Parameters.AddWithValue("@filename", form.Item("filename"))
                    command.Parameters.AddWithValue("@alternativetext", form.Item("alternativetext"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '動態文字廣告
                Case "DynamicText"
                    command.CommandText &= " (Message,Display) values(@message,@display)"
                    command.Parameters.AddWithValue("@message", form.Item("message"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '動畫圖片
                Case "AnimatePicture"
                    command.CommandText &= " (FileName,Display) values(@filename,@display)"
                    command.Parameters.AddWithValue("@filename", form.Item("filename"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '校園映像
                Case "CampusImage"
                    command.CommandText &= " (FileName,Display) values(@filename,@display)"
                    command.Parameters.AddWithValue("@filename", form.Item("filename"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '最新消息
                Case "News"
                    command.CommandText &= " (Message,Display) values(@message,@display)"
                    command.Parameters.AddWithValue("@message", form.Item("message"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '管理者帳號
                Case "Account"
                    command.CommandText &= " (UserName,PassWord) values(@username,@password)"
                    command.Parameters.AddWithValue("@username", form.Item("username"))
                    command.Parameters.AddWithValue("@password", form.Item("password"))
                '主選單
                Case "Main"
                    command.CommandText &= " (Name,Url,Display,Counts) values(@name,@url,@display,@count)"
                    command.Parameters.AddWithValue("@name", form.Item("name"))
                    command.Parameters.AddWithValue("@url", form.Item("url"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                    command.Parameters.AddWithValue("@count", form.Item("count"))
            End Select
            context.Response.ContentType = "text/plain"
            If command.ExecuteNonQuery() Then
                '取得最後一筆新增資料的ID
                command.CommandText = "select SCOPE_IDENTITY()"
                Dim id = command.ExecuteScalar()
                context.Response.Write(id.ToString())
            Else
                context.Response.Write("fail")
            End If
        End If
        connect.Close()
    End Sub
    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property
End Class