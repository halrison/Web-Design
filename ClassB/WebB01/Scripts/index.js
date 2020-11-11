// JavaScript Document
jQuery(document).ready(
    function () {
        let counter = 0;
        if (sessionStorage.getItem('first view') === 'true' || sessionStorage.getItem('first view') === null) {
            jQuery.get('/ClassB/WebB01/Counter.ashx', response => {
                jQuery("#LabelCounter").text(response);                
                localStorage.setItem('counter', response);
                sessionStorage.setItem('first view', 'false');
            });
        } else {
            counter= localStorage.getItem('counter');
            jQuery("#LabelCounter").text(counter);
        } 
        jQuery("#footer .t").text(localStorage.getItem('footer'));
        jQuery.getJSON('/ClassB/WebB01/Fetch.ashx',
            { item: 'Title' },
            returns => {
                jQuery.each(returns, (key, value) => {
                    if (value.Display == 'yes') {
                        jQuery("#header").attr({
                            'src': `/ClassB/WebB01/Images/${value.FileName}`,
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
                jQuery.each(returns, (key, value) => {
                    if (value.Display == 'yes') {
                        let menuitem =
                            `<div class="mainmu" id="main${value.Id}">
                            <a href="${ value.Url }">${value.Name}</a>`;
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
                                    menuitem += '<div class="mw" style="display:none;">';
                                    jQuery.each(returns, (key, value) => {
                                        menuitem +=
                                            `<div class="mainmu2" id="sub-${value.Id}">
                                            <a href="${ value.Url }">${ value.Name }</a>
                                            </div>`;
                                    });
                                    menuitem += '</div>';
                                }
                            });
                        }
                        menuitem += '</div>';
                        jQuery("#menuput").append(menuitem);
                    }
                });
            }
        });
        jQuery.getJSON('/ClassB/WebB01/Fetch.ashx?item=DynamicText',
            returns => {
                let marquee = '';
                jQuery.each(returns, (key, value) => {
                    if (value.Display == 'yes') {
                        marquee += value.Message+' ';
                    }
                });
                jQuery("#marquee span").text(marquee);
            }
        );
        jQuery.getJSON('/ClassB/WebB01/Fetch.ashx',
            { item: 'AnimatePicture' },
            returns => {
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
        );
        jQuery.ajax({
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
                    jQuery("#news .botli span").after('<a href="detail.html" style="float:right;">More...</a>');
                    for (let i = 0; i < 5; i++) {
                        mnl(detail[i].Message);
                    }
                } else {
                    jQuery.each(detail, (key, value) => {
                        mnl(value.Message);
                    });
                }
            }
        });
        var num = 0, nowpage = 1;
        jQuery.getJSON('/ClassB/WebB01/Fetch.ashx',
            { item: 'CampusImage' },
            returns => {
                var images = '<img src="/ClassB/WebB01/Images/01E01.jpg" id="prev"/><br/>';
                jQuery.each(returns, (key, value) => {
                    if (value.Display == 'yes') {
                        images +=`<img src="/ClassB/WebB01/Images/${ value.FileName }" id="ssaa${ value.Id }" class="im" width="150" height="103"/>`;
                        num++;
                    }
                });
                images += '<br/><img src="/ClassB/WebB01/Images/01E02.jpg" id="next" />';
                jQuery("#ci").append(images);
                pp(1);
            }
        );
        jQuery("#ci").on('click', "#prev", () => { pp(1); });
        jQuery("#ci").on('click', "#next", () => { pp(2); });
        jQuery("button").click(() => {
            location.assign("/ClassB/WebB01/login.html");
        });
        jQuery(".mainmu").mouseover(
            function () {
                jQuery(this).children(".mw").stop().show();
            }
        );
        jQuery(".mainmu").mouseout(
            function () {
                jQuery(this).children(".mw").hide();
            }
        );
        jQuery(".ssaa").on('mouseover', "li",
            function () {
                jQuery("#alt").html(`<pre>${jQuery(this).children(".all").html()}</pre>`);
                jQuery("#alt").css({
                    "top": jQuery(this).offset().top - 50,
                    'visibility': 'visible'
                });
            }
        );
        jQuery(".ssaa").on('mouseout', "li",
            function () {
                jQuery("#alt").empty().css('visibility', 'hidden');
            }
        );
        function ww(filename) {
            jQuery("#mwww").html(`<embed loop="true" src="/ClassB/WebB01/Images/${ filename }" style="width:99%; height:100%;"></embed>`);
        }
        function op(x, y, url) {
            jQuery(x).fadeIn();
            if (y) {
                jQuery(y).fadeIn();
            }
            if (y && url) {
                jQuery(y).load(url);
            }
        }
        function pp(x) {
            if (x == 1 && nowpage > 1) {
                nowpage--;
            }
            if (x == 2 && nowpage < num - 2) {
                nowpage++;
            }
            jQuery(".im").hide();
            for (let s = 0; s <= 2; s++) {
                let t = s + nowpage;
                jQuery(`#ssaa${t}`).show();
            }
        }
        function mnl(detail) {
            let brief = detail.substr(0, 10);
            jQuery("ol").append(`<li><span class="sswww">${ brief }</span><p class="all" style="display:none;">${ detail }</p></li>`);
        }
    }
); 