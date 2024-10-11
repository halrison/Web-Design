Imports System.Data.SqlClient
Imports System.Web
Imports System.Web.Services

Public Class Modify
  Implements System.Web.IHttpHandler
  Dim connection As New SqlConnection
  Dim command As New SqlCommand
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    connection.ConnectionString = Web.Configuration.WebConfigurationManager.ConnectionStrings("Connection").ToString
    connection.Open()
    connection.ChangeDatabase("DB02")
    command.Connection = connection
    command.CommandType = CommandType.Text
    If context.Request.Form.HasKeys Then
      Dim form = context.Request.Form
      command.CommandText = "update " & form.Get("item").ToString() & " set"
      Select Case form.Get("item")
        Case "Article"
          If form.Item("display") IsNot vbNullString Then
            command.CommandText &= " display=@display"
            command.Parameters.AddWithValue("@display", form.Item("display"))
          ElseIf form.Item("action") IsNot vbNullString Then
            command.CommandText &= " good=good"
            If form.Item("action") = "plus" Then
              command.CommandText &= "+"
            Else
              command.CommandText &= "-"
            End If
            command.CommandText &= "1"
          End If
          command.CommandText &= " where id=@id"
          command.Parameters.AddWithValue("@id", form.Item("id"))
        Case "QuestionnaireTopic"
          command.CommandText &= " static=static+1 where id=@id"
          command.Parameters.AddWithValue("@id", form.Item("id"))
        Case "QuestionnaireOption"
          command.CommandText &= " count=count+1 where topic=@topic and [option]=@option"
          command.Parameters.AddWithValue("@topic", form.Item("topic"))
          command.Parameters.AddWithValue("@option", form.Item("option"))
      End Select
      context.Response.ContentType = "text/plain"
      If command.ExecuteNonQuery() > 0 Then
        context.Response.Write("Success")
      Else
        context.Response.Write("Fail")
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