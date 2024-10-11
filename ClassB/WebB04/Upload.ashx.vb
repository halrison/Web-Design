Imports System.IO
Public Class Upload
  Implements IHttpHandler
  Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
    '取得上傳的檔案
    Dim ImageFile = context.Request.Files.Get("Picture")
    If ImageFile IsNot Nothing Then
      If ImageFile.ContentLength > 0 Then
        '存入Images目錄
        Dim ImageName = Path.GetFileName(ImageFile.FileName)
        Dim ImagePath = context.Server.MapPath("Content/Images/")
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
