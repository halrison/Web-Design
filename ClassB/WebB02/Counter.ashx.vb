Imports System.Web.Script
Public Class Counter
	Implements IHttpHandler
	Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
		Dim Time = Date.Now, CounterTotal = Convert.ToInt32(ConfigurationManager.AppSettings.Get("CounterTotal")), CounterToday = Convert.ToInt32(ConfigurationManager.AppSettings.Get("CounterToday"))
		CounterTotal += 1
		If Time.Year = Convert.ToInt32(context.Request.QueryString.Get("year")) AndAlso Time.Month = Convert.ToInt32(context.Request.QueryString.Get("month")) AndAlso Time.Day = Convert.ToInt32(context.Request.QueryString.Get("date")) Then
			CounterToday += 1
		Else
			CounterToday = 1
		End If
		ConfigurationManager.AppSettings.Set("CounterTotal", CounterTotal)
		ConfigurationManager.AppSettings.Set("CounterToday", CounterToday)
		context.Response.ContentType = "text/plain"
		context.Response.Write(New Serialization.JavaScriptSerializer().Serialize(New CounterObject With {.today = CounterToday, .total = CounterTotal}))
	End Sub
	ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			Return False
		End Get
	End Property
End Class
Public Class CounterObject
	Public Property today As Integer
	Public Property total As Integer
End Class