// JavaScript Document
$(document).ready(function(e) {
    let counter = parseInt(localStorage.getItem('counter')) || 0;
    if (performance.getEntriesByType('navigation')[0].type !== 'reload') {
        counter++;
        localStorage.setItem('counter', counter);
    }
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
            item: 'DynamicText',
            display: 'yes'
        },
        dataType: 'json',
        success: returns => {
            let marquee = '';
            $.each(returns, (key, value) => {
                marquee += value.Message + ' ';
            });
            $("marquee").text(marquee);
        }
    });
    var pagecount, rowcount, pagecurrent = 1;
    $.ajax({
        url: '/ClassB/WebB01/Fetch.ashx',
        method: 'get',
        data: {
            item: 'News',
        },
        dataType: 'json',
        async: false,
        success: returns => {
            let detail = returns.filter(value => value.Display == 'yes');
            var  rowcount=detail.length, pagecount= Math.ceil(rowcount / 4),pagecurrent = 1;
            if (detail.length > 5) {
                var paginationlink = '<li><a href="" id="newsprev" style="text-decoration:none"><</a></li>';
                for (var i = 1; i <= pagecount; i++) {
                    paginationlink += '<li';
                    if (i == pagecurrent) {
                        paginationlink += ' style="font-size:20px"';
                    }
                    paginationlink += '>' + i + '</li>';
                }
                paginationlink += '<li><a href="" id="newsnext" style="text-decoration:none">></a></li>';
                $("#pagination-item").html(paginationlink);
            }
            fetchrow(0, 5);
        }
    });
    var num, nowpage = 1;
    $.ajax({
        url: '/ClassB/WebB01/Fetch.ashx',
        method: 'get',
        data: {
            item: 'CampusImage',
            display: 'yes'
        },
        dataType: 'json',
        success: returns => {
            var images = '<img src="/ClassB/WebB01/Images/01E01.jpg" id="imgprev"/><br/>';
            num = returns.length;
            $.each(returns, (key, value) => {
                images += '<img src="/ClassB/WebB01/Images/' + value.FileName + '" id="ssaa' + value.Id + '" class="im" width="150" height="103"/>';
            });
            images += '<br/><img src="/ClassB/WebB01/Images/01E02.jpg" id="imgnext" />';
            $("#ci").append(images);
            pp(1);
        }
    });
    $("#ci").on('click', "#imgprev", () => { pp(1); });
    $("#ci").on('click', "#imgnext", () => { pp(2); });
    $("#pagination-item").on('click', "#newsprev", function (event) {
        event.preventDefault();
        pagecurrent--;
        if (pagecurrent < 1) {
            pagecurrent = 1;
        } else {
            $("#pagination-item").children("li").each(function () {
                if ($(this).text() == pagecurrent) {
                    $(this).css('font-size', '20px');
                } else {
                    $(this).css('font-size', '12px');
                }
            });
            fetchrow((pagecurrent - 1) * 5,5);
        }
    });
    $("#pagination-item").on('click', "#newsnext", function (event) {
        event.preventDefault();
        pagecurrent++;
        if (pagecurrent > pagecount) {
            pagecurrent = pagecount;
        } else {
            $("#pagination-item").children("li").each(function () {
                if ($(this).text() == pagecurrent) {
                    $(this).css('font-size', '20px');
                } else {
                    $(this).css('font-size', '12px');
				}
            });
            fetchrow((pagecurrent - 1) * 5, 5);
        }
    });
    $("#LabelCounter").text(localStorage.getItem('counter'));
    $("#footer .t").text(localStorage.getItem('footer'));
    $("button").click(() => {
        location.assign("/ClassB/WebB01/login.html");
    });
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
    );
    $(".ssaa").on('mouseover',"li",
        function () {
            $("#alt").html("" + $(this).children(".all").html() + "");
            $("#alt").css({
                "top": $(this).offset().top - 50,
                'visibility':'visible'
            });
        }
    );
    $(".ssaa").on('mouseout',"li",
        function () {
            $("#alt").empty().css('visibility','hidden');
        }
    );
    function op(x, y, url) {
        $(x).fadeIn();
        if (y)
            $(y).fadeIn();
        if (y && url)
            $(y).load(url);
    }
    function mnl(detail) {
        let brief = detail.substr(0, 10);
        $("ol").append('<li><span class="sswww">' + brief + '</span><p class="all" style="display:none;">' + detail + '</p></li>');
    }
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
    function fetchrow(skipnum, fetchnum) {
        $("ol").empty().attr('start', skipnum + 1);
        $.ajax({
            url: '/ClassB/WebB01/Fetch.ashx',
            method: 'get',
            data: {
                item: 'News',
                skipnum: skipnum,
                fetchnum: fetchnum
            },
            async:false,
            dataType: 'json',
            success: returns => {
                $.each(returns, (key, value) => {
                    if (key < 5) {
                        mnl(value.Message);
                    }
                });
            }
        });
    }
});