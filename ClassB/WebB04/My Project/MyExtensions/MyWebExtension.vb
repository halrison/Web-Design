#If _MyType <> "Empty" Then

Namespace My
    ''' <summary>
    ''' 用來定義可用於 Web 專案 My 命名空間中之屬性的模組。
    ''' </summary>
    ''' <remarks></remarks>
    <HideModuleName()> _
    Module MyWebExtension
        Private ReadOnly s_Computer As New ThreadSafeObjectProvider(Of Devices.ServerComputer)
        Private ReadOnly s_User As New ThreadSafeObjectProvider(Of ApplicationServices.WebUser)
        Private ReadOnly s_Log As New ThreadSafeObjectProvider(Of Logging.AspLog)
        ''' <summary>
        ''' 傳回主機電腦的資訊。
        ''' </summary>
        <CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")> _
        Friend ReadOnly Property Computer() As Devices.ServerComputer
            Get
                Return s_Computer.GetInstance()
            End Get
        End Property
        ''' <summary>
        ''' 傳回目前 Web 使用者的資訊。
        ''' </summary>
        <CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")> _
        Friend ReadOnly Property User() As Microsoft.VisualBasic.ApplicationServices.WebUser
            Get
                Return s_User.GetInstance()
            End Get
        End Property
        ''' <summary>
        ''' 傳回要求物件。
        ''' </summary>
        <CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")> _
        <ComponentModel.Design.HelpKeyword("My.Request")> _
        Friend ReadOnly Property Request() As HttpRequest
			<DebuggerHidden()> _
            Get
                Dim CurrentContext As HttpContext = Global.System.Web.HttpContext.Current
                If CurrentContext IsNot Nothing Then
                    Return CurrentContext.Request
                End If
                Return Nothing
            End Get
        End Property
        ''' <summary>
        ''' 傳回回應物件。
        ''' </summary>
        <CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")> _
         <ComponentModel.Design.HelpKeyword("My.Response")> _
         Friend ReadOnly Property Response() As HttpResponse
			<DebuggerHidden()> _
            Get
                Dim CurrentContext As HttpContext = Global.System.Web.HttpContext.Current
                If CurrentContext IsNot Nothing Then
                    Return CurrentContext.Response
                End If
                Return Nothing
            End Get
        End Property
        ''' <summary>
        ''' 傳回 Asp 記錄物件。
        ''' </summary>
        <CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")> _
        Friend ReadOnly Property Log() As Logging.AspLog
            Get
                Return s_Log.GetInstance()
            End Get
        End Property
     End Module
End Namespace

#End If