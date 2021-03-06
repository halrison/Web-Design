﻿Imports System.Data.SqlClient
Imports System.Web.Configuration
Public Class Modify
    Implements IHttpHandler
    Dim connection As New SqlConnection
    Dim command As New SqlCommand
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        connection.ConnectionString = ConfigurationManager.ConnectionStrings("Connection").ToString
        connection.Open()
        command.Connection = connection
        command.CommandType = CommandType.Text
        If context.Request.Form.HasKeys Then
            Dim form = context.Request.Form
            command.CommandText = "update " & form.Item("item") & " set "
            Select Case form.Get("item")
                '標題
                Case "Title"
                    command.CommandText &=
                        "FileName=@filename,
                         AlternativeText=@alternativetext,
                         Display=@display"
                    command.Parameters.AddWithValue("@filename", form.Item("filename"))
                    command.Parameters.AddWithValue("@alternativetext", form.Item("alternativetext"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '動態文字廣告
                Case "DynamicText"
                    command.CommandText &=
                        "Message=@message,
                        Display=@display"
                    command.Parameters.AddWithValue("@message", form.Item("message"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '動畫圖片
                Case "AnimatePicture"
                    command.CommandText &=
                        "FileName=@filename,
                         Display=@display"
                    command.Parameters.AddWithValue("@filename", form.Item("filename"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '校園映像
                Case "CampusImage"
                    command.CommandText &=
                        "FileName=@filename,
                         Display=@display "
                    command.Parameters.AddWithValue("@filename", form.Item("filename"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '最新消息
                Case "News"
                    command.CommandText &=
                        "Message=@message,
                        Display=@display"
                    command.Parameters.AddWithValue("@message", form.Item("message"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '管理者帳號
                Case "Account"
                    command.CommandText &=
                        "UserName=@username,
                         PassWord=@password"
                    command.Parameters.AddWithValue("@username", form.Item("username"))
                    command.Parameters.AddWithValue("@password", form.Item("password"))
                '主選單
                Case "Main"
                    command.CommandText &=
                        "Name=@name,
                         Url=@url,
                         Display= @display,
                        Counts=@count"
                    command.Parameters.AddWithValue("@name", form.Item("name"))
                    command.Parameters.AddWithValue("@url", form.Item("url"))
                    command.Parameters.AddWithValue("@display", form.Item("display"))
                '子選單
                Case "Sub"
                    command.CommandText &=
                        "Name= @name,
                         Url=@url,
                        Father=@father"
                    command.Parameters.AddWithValue("@name", form.Item("name"))
                    command.Parameters.AddWithValue("@url", form.Item("url"))
                    command.Parameters.AddWithValue("@father", form.Item("father"))
            End Select
            command.CommandText &= " where Id=@id"
            command.Parameters.AddWithValue("@id", form("id"))
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