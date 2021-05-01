Imports System.Collections.Generic
Imports System.Linq
Imports System.Web
Imports System.Web.Optimization

Public Class BundleConfig
	' 如需統合的詳細資訊，請前往 https://go.microsoft.com/fwlink/?LinkID=303951
	Public Shared Sub RegisterBundles(ByVal bundles As BundleCollection)
		bundles.Add(New ScriptBundle("~/bundles/WebFormsJs").Include(
						"~/Scripts/WebForms/WebForms.js",
						"~/Scripts/WebForms/WebUIValidation.js",
						"~/Scripts/WebForms/MenuStandards.js",
						"~/Scripts/WebForms/Focus.js",
						"~/Scripts/WebForms/GridView.js",
						"~/Scripts/WebForms/DetailsView.js",
						"~/Scripts/WebForms/TreeView.js",
						"~/Scripts/WebForms/WebParts.js"))

		' 順序對於這些檔案產生作用而言相當重要，它們有明確的相依性
		bundles.Add(New ScriptBundle("~/bundles/MsAjaxJs").Include(
				"~/Scripts/WebForms/MsAjax/MicrosoftAjax.js",
				"~/Scripts/WebForms/MsAjax/MicrosoftAjaxApplicationServices.js",
				"~/Scripts/WebForms/MsAjax/MicrosoftAjaxTimer.js",
				"~/Scripts/WebForms/MsAjax/MicrosoftAjaxWebForms.js"))

		' 使用 Modernizr 的開發版本來開發並深入了解。當您準備好量產時，
		' 準備好生產時，請使用 https://modernizr.com 中的建置工具，只挑選您需要的測試
		bundles.Add(New ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"))
	End Sub
End Class
