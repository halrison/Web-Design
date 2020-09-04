// JavaScript Document
$(document).ready(
    function () {
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
                $.each(returns, (key, value) => {
                    if (value.Display == 'yes') {
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
                    }                   
                });
            }
        });
        $.ajax({
            url: '/ClassB/WebB01/Fetch.ashx',
            method: 'get',
            data: {
                item: 'DynamicText',
            },
            dataType: 'json',
            success: returns => {
                let marquee = '';
                $.each(returns, (key, value) => {
                    if (value.Display == 'yes') {
                        marquee += value.Message + '    ';
                    }
                });
                $("marquee").text(marquee);
            }
        });
        $.ajax({
            url: '/ClassB/WebB01/Fetch.ashx',
            method: 'get',
            data: {
                item: 'AnimatePicture',
            },
            dataType: 'json',
            success: returns => {
                var lin = returns.filter(value => value.Display === 'yes'), now = 0;
                ww(lin[now].FileName);
                if (lin.length > 1) {
                    setInterval(() => {
                        ww(lin[now].FileName);
                        now++;
                        if (now >= lin.length) {
                            now = 0;
                        }
                    }, 3000);
                    now = 1;
                }
            }
        });
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
                if (detail.length > 5) {
                    $("#news .botli span").after('<a href="detail.html" style="float:right;">More...</a>');
                    for (let i = 0; i < 5; i++) {
                        mnl(detail[i].Message);
                    }
                } else {
                    $.each(detail, (key, value) => {                       
                        mnl( value.Message);
                    });
                }
            }
        });
        var num=0,nowpage = 1;
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
            location.assign("/ClassB/WebB01/login.html");
        });
        $(".mainmu").mouseover(
            function () {
                $(this).children(".mw").stop().show();
            }
        );
        $(".mainmu").mouseout(
            function () {
                $(this).children(".mw").hide();
            }
        );
        $(".sswww").mouseover(
            function () {
                $("#alt").html("" + $(this).children(".all").html() + "");
                $("#alt").css({ "top": $(this).offset().top - 50 }).show();
            }
        );
        $(".sswww").mouseout(
            () => {
                $("#alt").empty().hide();
            }
        );
        function ww(filename) {
            $("#mwww").html('<embed loop="true" src="/ClassB/WebB01/Images/' + filename + '" style="width:99%; height:100%;"></embed>');
        }
        function op(x, y, url) {
            $(x).fadeIn();
            if (y) {
                $(y).fadeIn();
            }
            if (y && url) {
                $(y).load(url);
            }
        }
        function pp(x) {
            if (x == 1 && nowpage > 1) {
                nowpage--;
            }
            if (x == 2 && nowpage < num-2) {
                nowpage++;
            }
            $(".im").hide();
            for (let s = 0; s <= 2; s++) {
                let t = s + nowpage;
                $("#ssaa" + t).show();
            }
        }
        function mnl(detail) {
            let brief = detail.substr(0, 10);
            $("ol").append('<li class="sswww">' + brief + '<span class="all" style="display:none;">' + detail + '</span></li>');
        }
    }
);
