Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Add
  Implements IHttpHandler
  Dim connect As New SqlConnection
  Dim command As New SqlCommand
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    connect.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString()
    connect.Open()
    connect.ChangeDatabase("DB01")
    command.Connection = connect
    command.CommandType = CommandType.Text
    If context.Request.Form.HasKeys Then
      Dim form = context.Request.Form
      command.CommandText = "insert into " & form.Item("item")
      Select Case form.Item("item")
                '標題
        Case "Title"
          command.CommandText &= " (FileName,AlternativeText,Display) values(@FileName,@AlternativeText,@Display)"
          command.Parameters.AddWithValue("@FileName", form.Item("FileName"))
          command.Parameters.AddWithValue("@AlternativeText", form.Item("AlternativeText"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '動態文字廣告
        Case "DynamicText"
          command.CommandText &= " (Message,Display) values(@Message,@Display)"
          command.Parameters.AddWithValue("@Message", form.Item("Message"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '動畫圖片
        Case "AnimatePicture"
          command.CommandText &= " (FileName,Display) values(@FileName,@Display)"
          command.Parameters.AddWithValue("@FileName", form.Item("FileName"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '校園映像
        Case "CampusImage"
          command.CommandText &= " (FileName,Display) values(@FileName,@Display)"
          command.Parameters.AddWithValue("@FileName", form.Item("FileName"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '最新消息
        Case "News"
          command.CommandText &= " (Message,Display) values(@Message,@Display)"
          command.Parameters.AddWithValue("@Message", form.Item("Message"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '管理者帳號
        Case "Account"
          command.CommandText &= " (UserName,Password) values(@Username,@Password)"
          command.Parameters.AddWithValue("@UserName", form.Item("UserName"))
          command.Parameters.AddWithValue("@Password", form.Item("Password"))
                '主選單
        Case "MainMenu"
          command.CommandText &= " (Name,Url,Display,Count) values(@Name,@Url,@Display,@Count)"
          command.Parameters.AddWithValue("@Name", form.Item("Name"))
          command.Parameters.AddWithValue("@Url", form.Item("Url"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
          command.Parameters.AddWithValue("@Count", form.Item("Count"))
        Case "SubMenu"
          command.CommandText &= " (Name,Url,Father) values(@Name,@Url,@Father)"
          command.Parameters.AddWithValue("@Name", form.Item("Name"))
          command.Parameters.AddWithValue("@Url", form.Item("Url"))
          command.Parameters.AddWithValue("@Father", form.Item("Father"))
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