Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Modify
  Implements IHttpHandler
  Dim connection As New SqlConnection
  Dim command As New SqlCommand
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    connection.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString()
    connection.Open()
    connection.ChangeDatabase("DB01")
    command.Connection = connection
    command.CommandType = CommandType.Text
    If context.Request.Form.HasKeys Then
      Dim form = context.Request.Form
      command.CommandText = "update " & form.Item("item") & " set "
      Select Case form.Get("item")
                '標題
        Case "Title"
          command.CommandText &=
              "FileName=@Filename,
                         AlternativeText=@Alternativetext,
                         Display=@display"
          command.Parameters.AddWithValue("@Filename", form.Item("Filename"))
          command.Parameters.AddWithValue("@AlternativeText", form.Item("AlternativeText"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '動態文字廣告
        Case "DynamicText"
          command.CommandText &=
              "Message=@Message,
              Display=@Display"
          command.Parameters.AddWithValue("@Message", form.Item("Message"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '動畫圖片
        Case "AnimatePicture"
          command.CommandText &=
              "FileName=@FileName,
              Display=@Display"
          command.Parameters.AddWithValue("@FileName", form.Item("FileName"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '校園映像
        Case "CampusImage"
          command.CommandText &=
              "FileName=@Filename,
              Display=@Display "
          command.Parameters.AddWithValue("@FileName", form.Item("FileName"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '最新消息
        Case "News"
          command.CommandText &=
              "Message=@Message,
              Display=@Display"
          command.Parameters.AddWithValue("@Message", form.Item("Message"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
                '管理者帳號
        Case "Account"
          command.CommandText &=
              "UserName=@UserName,
              Password=@Password"
          command.Parameters.AddWithValue("@UserName", form.Item("UserName"))
          command.Parameters.AddWithValue("@Password", form.Item("Password"))
                '主選單
        Case "MainMenu"
          command.CommandText &=
              "Name=@Name,
              Url=@Url,
              Display=@Display,
              Count=@Count"
          command.Parameters.AddWithValue("@Name", form.Item("Name"))
          command.Parameters.AddWithValue("@Url", form.Item("Url"))
          command.Parameters.AddWithValue("@Display", form.Item("Display"))
          command.Parameters.AddWithValue("@Count", form.Item("Count"))
                '子選單
        Case "SubMenu"
          command.CommandText &=
              "Name=@Name,
              Url=@Url,
              Father=@Father"
          command.Parameters.AddWithValue("@Name", form.Item("Name"))
          command.Parameters.AddWithValue("@Url", form.Item("Url"))
          command.Parameters.AddWithValue("@Father", form.Item("Father"))
      End Select
      command.CommandText &= " where Id=@Id"
      command.Parameters.AddWithValue("@Id", form.Item("Id"))
      command.ExecuteNonQuery()
    End If
    connection.Close()
  End Sub
  ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
    Get
      Return False
    End Get
  End Property
End Class