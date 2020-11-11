Public Class Counter
	Implements IHttpHandler
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		Dim counter = Convert.ToInt32(ConfigurationManager.AppSettings.Get("Counter"))
		counter += 1
		context.Response.ContentType = "text/plain"
		context.Response.Write(counter)
	End Sub
	ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property
End Class