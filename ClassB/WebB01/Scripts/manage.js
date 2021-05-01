jQuery(document).ready(
	function ()
	{
		//�P�_�O�_���޲z��
		if (sessionStorage.getItem('role') === 'admin') {
			//���J���D��
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
			//���s�ɦV�ܵn�J��
			location.assign('/ClassB/WebB01/login.html');
		}
		//��ܶi���`�H��
		jQuery("#LabelCounter").text(localStorage.getItem('counter'));
		//��ܭ������v
		jQuery("#SpanFooter").text(localStorage.getItem('footer'));
		//��ܩ����äl���
		jQuery(".mainmu").mouseover(function () {
			jQuery(this).children(".mw").stop().show();
		}
		);
		jQuery(".mainmu").mouseout(function () {
			jQuery(this).children(".mw").hide();
		}
		);
		//²������
		var item = new URLSearchParams(location.search);
		jQuery("#content").load(`${item.get('item')}.html`);
		//�޲z�n�X
		jQuery("#logout").click(() => {
			sessionStorage.removeItem('role');
			location.replace('/ClassB/WebB01/index.html');
		});
		//����modal
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