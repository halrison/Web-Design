Imports System.IO
Public Class Upload
    Implements IHttpHandler
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim FilePath = context.Server.MapPath("/ClassB/WebB03/")
        If context.Request.Files.Count > 0 Then
            Dim files = context.Request.Files, name As String, file
            If files.Get("poster") IsNot Nothing Then
                file = files.Get("poster")
                FilePath &= "Images/"
                name = Path.GetFileName(file.FileName)
                file.SaveAs(Path.Combine(FilePath, name))
            ElseIf files.Get("trailer") IsNot Nothing Then
                file = files.Get("trailer")
                FilePath &= "Videos/"
                name = Path.GetFileName(file.FileName)
                file.SaveAs(Path.Combine(FilePath, name))
            End If
        End If
    End Sub
    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property
End Class