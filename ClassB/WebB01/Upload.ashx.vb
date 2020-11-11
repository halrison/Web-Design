Imports System.IO
Public Class Upload
    Implements IHttpHandler
    Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        Dim ImageFile = context.Request.Files.Get("Picture")
        If ImageFile IsNot Nothing Then
            If ImageFile.ContentLength > 0 Then
                Dim ImageName = Path.GetFileName(ImageFile.FileName)
                Dim ImagePath = context.Server.MapPath("Images/")
                ImageFile.SaveAs(ImagePath + ImageName)
            End If
        End If
    End Sub
    ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property
End Class