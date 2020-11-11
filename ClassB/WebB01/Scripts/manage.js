jQuery(document).ready(
	function ()
	{
		if (sessionStorage.getItem('role') === 'admin') {
			jQuery.getJSON('/ClassB/WebB01/Fetch.ashx',
				{
					item: 'Title'
				},
				returns => {							
					jQuery.each(returns, (key, value) => {
						if (value.Display === 'yes') {
							jQuery("#header").attr({
								'src':`/ClassB/WebB01/Images/${value.FileName}`,
								'alt': value.Alt
							});
						}
					});
				}
			);
		} else {
			location.assign('/ClassB/WebB01/login.html');
		}
		jQuery("#LabelCounter").text(localStorage.getItem('counter'));
		jQuery("#SpanFooter").text(localStorage.getItem('footer'));
		jQuery(".mainmu").mouseover(function()			
			{
				jQuery(this).children(".mw").stop().show();
			}
		)
		jQuery(".mainmu").mouseout(function ()			
			{
				jQuery(this).children(".mw").hide();
			}
		)
		var item = new URLSearchParams(location.search);
		jQuery("#content").load(`${item.get('item')}.html`);
		jQuery("#logout").click(() => {
			sessionStorage.removeItem('role');
			location.replace('/ClassB/WebB01/index.html');
		});
		jQuery("#x").click(() => { jQuery("#cover").fadeOut(); });
	}
);
function op(x,y,url)
{
	jQuery(x).fadeIn()
	if (y)
	{
		jQuery(y).fadeIn();
	}
	if (y && url)
	{
		jQuery(y).load(url);
	}
}