// JavaScript Document
$(document).ready(
	function ()
	{
		if (sessionStorage.getItem('role') === 'admin') {
			$.ajax(
				{
					url: '/ClassB/WebB01/Fetch.ashx',
					method: 'get',
					data: {
						item:'Title'
					},
					dataType: 'json',
					success:
						returns => {							
							$.each(returns, (key, value) => {
								if (value.Display == 'yes') {
									$("#header").attr({
										'src': '/ClassB/WebB01/Images/' + value.FileName,
										'alt': value.Alt
									});
								}
							});
						}
				}
			);
		} else {
			location.assign('/ClassB/WebB01/login.html');
		}
		$("#LabelCounter").text(localStorage.getItem('counter'));
		$("#SpanFooter").text(localStorage.getItem('footer'));
		$(".mainmu").mouseover(function()			
			{
				$(this).children(".mw").stop().show();
			}
		)
		$(".mainmu").mouseout(function ()			
			{
				$(this).children(".mw").hide();
			}
		)
		var item = location.pathname.replace('/ClassB/WebB01/', '');
		switch (item) {
			case 'title.aspx':
				$("#btnadd").val('新增網站標題圖片');
				break;
			case 'ad.aspx':
				$("#btnadd").val('新增動態文字廣告');
				break;
			case 'mvim.aspx':
				$("#btnadd").val('新增動畫圖片');
				break;
			case 'image.aspx':
				$("#btnadd").val('新增校園映像圖片');
				break;
			case 'news.aspx':
				$("#btnadd").val('新增最新消息資料');
				break;
			case 'accounts.aspx':
				$("#btnadd").val('新增管理員帳號');
				break;
			case 'menu.aspx':
				$("#btnadd").val('新增主選單');
		}
		$("#logout").click(() => {
			sessionStorage.removeItem('role');
			location.replace('/ClassB/WebB01/index.html');
		});
	}
);
function op(x,y,url)
{
	$(x).fadeIn()
	if (y)
	{
		$(y).fadeIn();
	}
	if (y && url)
	{
		$(y).load(url);
	}
}