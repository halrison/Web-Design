jQuery(document).ready(function() {
    jQuery("#LabelCounter").text(localStorage.getItem('counter'));
    jQuery("#footer .t").text(localStorage.getItem('footer'));
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
    jQuery("#ci").on('click', "#prev", () => { pp(1); });
    jQuery("#ci").on('click', "#next", () => { pp(2); });
    jQuery("button").click(() => {
        location.reload();
    })
    jQuery(".mainmu").mouseover(
		function()
		{
			jQuery(this).children(".mw").stop().show()
		}
	)
	jQuery(".mainmu").mouseout(
		function ()
		{
			jQuery(this).children(".mw").hide()
		}
	)
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
                        alert('±b¸¹©Î±K½X¿é¤J¿ù»~');
                        jQuery("input:text").val('');
                        jQuery("input:password").val('');
                    }
                }
            );
        }
    );
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
