jQuery(document).ready(
  function () {
    //�ھڰ�W�M�w�ШD���|
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB01' : '..'
    //�P�_�O�_���޲z��
    if (sessionStorage.getItem('role') === 'admin') {
      //���J���D��
      jQuery.getJSON(`${ API_PATH }/Fetch.ashx`,
        {
          item: 'Title'
        },
        returns => {
          jQuery.each(returns, (key, value) => {
            if (value.Display === 'yes') {
              jQuery("#header").attr({
                'src': `${ API_PATH }/Content/Images/${ value.FileName }`,
                'alt': value.Alt
              });
            }
          });
        }
      );
    } else {
      //���s�ɦV�ܵn�J��
      location.assign(`${ API_PATH }/login.html`);
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
    jQuery("#content").load(`${ item.get('item') }.html`);
    //�޲z�n�X
    jQuery("#logout").click(() => {
      sessionStorage.removeItem('role');
      location.replace(`${ API_PATH }/index.html`);
    });
    //����modal
    jQuery("#x").click(() => { jQuery("#cover").fadeOut(); });
  }
);
function op (x, y, url) {
  jQuery(x).fadeIn()
  if (y) {
    jQuery(y).fadeIn();
  }
  if (y && url) {
    jQuery(y).load(url);
  }
}