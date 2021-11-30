Imports Microsoft.AspNet.FriendlyUrls.Resolvers

Public Class ViewSwitcher
	Inherits UserControl

	Protected Property CurrentView() As String
		Get
			Return m_CurrentView
		End Get
		Private Set(value As String)
			m_CurrentView = value
		End Set
	End Property
	Private m_CurrentView As String

	Protected Property AlternateView() As String
		Get
			Return m_AlternateView
		End Get
		Private Set(value As String)
			m_AlternateView = value
		End Set
	End Property
	Private m_AlternateView As String

	Protected Property SwitchUrl() As String
		Get
			Return m_SwitchUrl
		End Get
		Private Set(value As String)
			m_SwitchUrl = value
		End Set
	End Property
	Private m_SwitchUrl As String

	Protected Sub Page_Load(sender As Object, e As EventArgs)
		' 決定目前檢視畫面
		Dim isMobile = WebFormsFriendlyUrlResolver.IsMobileView(New HttpContextWrapper(Context))
		CurrentView = If(isMobile, "Mobile", "Desktop")

		' 決定替代的檢視畫面
		AlternateView = If(isMobile, "Desktop", "Mobile")

		' 從路由器建立切換 URL，例如 ~/__FriendlyUrls_SwitchView/Mobile?ReturnUrl=/Page
		Dim url = GetRouteUrl("AspNet.FriendlyUrls.SwitchView", New With { _
			Key .view = AlternateView _
		})
		url += "?ReturnUrl=" & HttpUtility.UrlEncode(Request.RawUrl)
		SwitchUrl = url
	End Sub


End Class