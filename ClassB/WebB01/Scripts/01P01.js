// JavaScript Document
$(document).ready(function() {
    let counter = parseInt(localStorage.getItem('counter')) || 0;
    if (performance.getEntriesByType('navigation')[0].type !== 'reload') {
        counter++;
        localStorage.setItem('counter', counter);
    } 
    $("#LabelCounter").text(localStorage.getItem('counter'));
    $("#footer .t").text(localStorage.getItem('footer'));
    $.ajax(
        {
            url: '/ClassB/WebB01/Fetch.ashx',
            method: 'get',
            data: {
                item: 'Title'
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
    $.ajax({
        url: '/ClassB/WebB01/Fetch.ashx',
        method: 'get',
        data: {
            item: 'Main'
        },
        dataType: 'json',
        async: false,
        success: returns => {
            returns = returns.filter(value => value.Display == 'yes');
            $.each(returns, (key, value) => {
                let menuitem =
                    '<div class="mainmu" id="main-' + value.Id + '">' +
                    '<a href="' + value.Url + '">' + value.Name + '</a>';
                if (value.Counts) {
                    let father = value.Id;
                    $.ajax({
                        url: '/ClassB/WebB01/Fetch.ashx',
                        method: 'get',
                        data: {
                            item: 'Sub',
                            father: father
                        },
                        dataType: 'json',
                        async: false,
                        success: returns => {
                            menuitem += '<div class="mw" style="display:none;">';
                            $.each(returns, (key, value) => {
                                menuitem +=
                                    '<div class="mainmu2" id="sub-' + value.Id + '">' +
                                    '<a href="' + value.Url + '">' + value.Name + '</a>' +
                                    '</div>';
                            });
                            menuitem += '</div>';
                        }
                    });
                }
                menuitem += '</div>';
                $("#menuput").append(menuitem);
            });
        }
    });
    $.ajax({
        url: '/ClassB/WebB01/Fetch.ashx',
        method: 'get',
        data: {
            item: 'DynamicText'
        },
        dataType: 'json',
        success: returns => {
            let marquee = '';
            $.each(returns, (key, value) => {
                if (value.Display == 'yes') { marquee += value.Message + ' '; }
            });
            $("marquee").text(marquee);
        }
    });
    var num = 0, nowpage = 1;
    $.ajax({
        url: '/ClassB/WebB01/Fetch.ashx',
        method: 'get',
        data: {
            item: 'CampusImage',
        },
        dataType: 'json',
        success: returns => {
            var images = '<img src="/ClassB/WebB01/Images/01E01.jpg" id="prev"/><br/>';
            $.each(returns, (key, value) => {
                if (value.Display == 'yes') {
                    images += '<img src="/ClassB/WebB01/Images/' + value.FileName + '" id="ssaa' + value.Id + '" class="im" width="150" height="103"/>';
                    num++;
                }
            });
            images += '<br/><img src="/ClassB/WebB01/Images/01E02.jpg" id="next" />';
            $("#ci").append(images);
            pp(1);
        }
    }); 
    $("#ci").on('click', "#prev", () => { pp(1); });
    $("#ci").on('click', "#next", () => { pp(2); });
    $("button").click(() => {
        location.reload();
    })
    $(".mainmu").mouseover(
		function()
		{
			$(this).children(".mw").stop().show()
		}
	)
	$(".mainmu").mouseout(
		function ()
		{
			$(this).children(".mw").hide()
		}
	)
    $("form").submit(
        event=>{
            event.preventDefault();
            $.ajax({
                url: '/ClassB/WebB01/login.ashx',
                type: 'post',
                data: {
                    acc: $("input:text").val(),
                    ps: $("input:password").val()
                },
                success: returns => {
                    if (returns == 'success') {
                        sessionStorage.setItem('role','admin');
                        location.assign('/ClassB/WebB01/title.aspx');
                    } else {
                        alert('±b¸¹©Î±K½X¿é¤J¿ù»~');
                        $("input:text").val('');
                        $("input:password").val('');
                    }
                }
            });
        }
    );
    function pp(x) {
        if (x == 1 && nowpage > 1) {
            nowpage--;
        }
        if (x == 2 && nowpage < num - 2) {
            nowpage++;
        }
        $(".im").hide();
        for (let s = 0; s <= 2; s++) {
            let t = s + nowpage;
            $("#ssaa" + t).show();
        }
    }
});
