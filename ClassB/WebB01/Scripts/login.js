jQuery(document).ready(function() {
    //��ܶi���`�H��
    jQuery("#LabelCounter").text(localStorage.getItem('counter'));
    //��ܭ������v
    jQuery("#footer .t").text(localStorage.getItem('footer'));
    //���J���D��
    jQuery.getJSON('/ClassB/WebB01/Fetch.ashx',
        {
            item:'Title'
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
    //���J�ô�V�D���
    jQuery.ajax({
        url: '/ClassB/WebB01/Fetch.ashx',
        method: 'get',
        data: {
            item: 'Main'
        },
        dataType: 'json',
        async: false,
        success: returns => {
            returns = returns.filter(value => value.Display === 'yes');
            jQuery.each(returns, (key, value) => {
                let menuitem =
                    `<div class="mainmu" id="main-${value.Id}">
                        <a href="${value.Url}">${value.Name}</a>`;
                if (value.Counts) {
                    let father = value.Id;            
                    //���J�ô�V�l���
                    jQuery.ajax({
                        url: '/ClassB/WebB01/Fetch.ashx',
                        method: 'get',
                        data: {
                            item: 'Sub',
                            father: father
                        },
                        dataType: 'json',
                        async: false,
                        success: returns => {
                            menuitem += `<div class="mw" style="display:none;">`;
                            jQuery.each(returns, (key, value) => {
                                menuitem +=
                                    `<div class="mainmu2" id="sub-${value.Id}">
                                        <a href="${value.Url}">${value.Name}</a>
                                    </div>`;
                            });
                            menuitem +=`</div>`;
                        }
                    });
                }
                menuitem +=`</div>`;
                jQuery("#menuput").append(menuitem);
            });
        }
    });
    //���J�ʺA��r�s�i
    jQuery.getJSON('/ClassB/WebB01/Fetch.ashx?item=DynamicText',
        returns => {
            let marquee = '';
            jQuery.each(returns, (key, value) => {
                if (value.Display === 'yes') { marquee += value.Message + ' '; }
            });
            jQuery("#marquee span").text(marquee);
        }
    );
    var num = 0, nowpage = 1;
    //���J�ô�V�ն�M��
    jQuery.getJSON('/ClassB/WebB01/Fetch.ashx',
        {
            item: 'CampusImage'
        },
        returns => {
            var images =`<img src="/ClassB/WebB01/Images/01E01.jpg" id="prev"/><br/>`;
            jQuery.each(returns, (key, value) => {
                if (value.Display === 'yes') {
                    images +=`<img src="/ClassB/WebB01/Images/${value.FileName}" id="ssaa${value.Id}" class="im" width="150" height="103"/>`;
                    num++;
                }
            });
            images +=`<br/><img src="/ClassB/WebB01/Images/01E02.jpg" id="next" />`;
            jQuery("#ci").append(images);
            pp(1);
        }
    ); 
    //�W�@��
    jQuery("#ci").on('click', "#prev", () => { pp(1); });
    //�U�@��
    jQuery("#ci").on('click', "#next", () => { pp(2); });
    //�޲z�n�J
    jQuery("button").click(
        () => {
            location.reload();
        }
    );
    //��ܩ����äl���
    jQuery(".mainmu").mouseover(
        function () {
            jQuery(this).children(".mw").stop().show()
        }
    );
    jQuery(".mainmu").mouseout(
        function () {
            jQuery(this).children(".mw").hide()
        }
    );
    //���ҵn�J
    jQuery("form").submit(
        ()=>{
            event.preventDefault();
            jQuery.post('/ClassB/WebB01/login.ashx',
                {
                    acc: jQuery("input:text").val(),
                    ps: jQuery("input:password").val()
                },
                returns => {
                    if (returns === 'success') {
                        sessionStorage.setItem('role','admin');
                        location.assign('/ClassB/WebB01/manage.html?item=title');
                    } else {
                        alert('�b���αK�X��J���~');
                        jQuery("input:text").val('');
                        jQuery("input:password").val('');
                    }
                }
            );
        }
    );
    //��ܮն�M��
    function pp(x) {
        if (x === 1 && nowpage > 1) {
            nowpage--;
        }
        if (x === 2 && nowpage < num - 2) {
            nowpage++;
        }
        jQuery(".im").hide();
        for (let s = 0; s <= 2; s++) {
            let t = s + nowpage;
            jQuery(`#ssaa${t}`).show();
        }
    }
});
