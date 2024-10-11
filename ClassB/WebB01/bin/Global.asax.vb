Imports System.Web.Optimization
Imports System.Web.Routing

Public Class Global_asax
  Inherits HttpApplication

  Sub Application_Start(sender As Object, e As EventArgs)
    ' 在應用程式啟動時引發
    RouteConfig.RegisterRoutes(RouteTable.Routes)
    BundleConfig.RegisterBundles(BundleTable.Bundles)
  End Sub
End Class