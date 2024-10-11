jQuery(document).ready(
  function () {
    //初始化進站人數
    let counter = 0;
    //根據域名決定請求路徑
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB01' : '..'
    //顯示進站總人數
    if (sessionStorage.getItem('first view') === 'true' || sessionStorage.getItem('first view') === null) {
      jQuery.get(
        `${API_PATH}/Counter.ashx`,
        {item: 'PlusViewer'},
        response => {
        jQuery("#LabelCounter").text(response);
        localStorage.setItem('counter', response);
        sessionStorage.setItem('first view', 'false');
      });
    } else {
      counter = localStorage.getItem('counter');
      jQuery("#LabelCounter").text(counter);
    }
    //顯示頁尾版權
    jQuery("#footer .t").text(localStorage.getItem('footer'));
    //載入標題區
    jQuery.getJSON(
      `${API_PATH}/Fetch.ashx`,
      {
        item: 'Title',
        display: 'yes'
      },
      returns => {
        jQuery.each(returns, (key, value) => {
          if (value.Display === 'yes') {
            jQuery("#header").attr({
              'src': `${API_PATH}/Content/Images/${value.FileName}`,
              'alt': value.Alt
            });
          }
        });
      }
    );
    //載入並渲染主選單
    jQuery.ajax({
      url: `${API_PATH}/Fetch.ashx`,
      method: 'get',
      data: {
        item: 'MainMenu'
      },
      dataType: 'json',
      async: false,
      success: returns => {
        jQuery.each(returns, (key, value) => {
          if (value.Display === 'yes') {
            let menuitem =
              `<div class="mainmu" id="main${value.Id}">
                            <a href="${value.Url}">${value.Name}</a>`;
            if (value.Count) {
              let father = value.Id;
              //載入並渲染子選單
              jQuery.ajax({
                url: `${API_PATH}/Fetch.ashx`,
                method: 'get',
                data: {
                  item: 'SubMenu',
                  Father: father
                },
                dataType: 'json',
                async: false,
                success: returns => {
                  menuitem += '<div class="mw" style="display:none;">';
                  jQuery.each(returns, (key, value) => {
                    menuitem +=
                      `<div class="mainmu2" id="sub-${value.Id}">
                                            <a href="${value.Url}">${value.Name}</a>
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
    //載入動態文字廣告
    jQuery.getJSON(
      `${API_PATH}/Fetch.ashx`,
      {
        item: 'DynamicText'
      },
      returns => {
        let marquee = '';
        jQuery.each(returns, (key, value) => {
          if (value.Display === 'yes') {
            marquee += value.Message + ' ';
          }
        });
        jQuery("#marquee span").text(marquee).css('width', `${marquee.length*100}px`);
      }
    );
    //載入動畫圖片
    jQuery.getJSON(
      `${API_PATH}/Fetch.ashx`,
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
    //載入最新消息
    jQuery.ajax({
      url: `${API_PATH}/Fetch.ashx`,
      method: 'get',
      data: {
        item: 'News',
      },
      dataType: 'json',
      async: false,
      success: returns => {
        let detail = returns.filter(value => value.Display === 'yes');
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
    //載入並渲染校園映像
    jQuery.getJSON(
      `${API_PATH}/Fetch.ashx`,
      {
        item: 'CampusImage'
      },
      returns => {
        var images = `<img src="${API_PATH}/Content/Images/01E01.jpg" id="prev"/><br/>`;
        jQuery.each(returns, (key, value) => {
          if (value.Display === 'yes') {
            images += `<img src="${API_PATH}/Content/Images/${value.FileName}" id="ssaa${value.Id}" class="im" width="150" height="103"/>`;
            num++;
          }
        });
        images += `<br/><img src="${API_PATH}/Content/Images/01E02.jpg" id="next" />`;
        jQuery("#ci").append(images);
        pp(1);
      }
    );
    //上一頁
    jQuery("#ci").on('click', "#prev", () => { pp(1); });
    //下一頁
    jQuery("#ci").on('click', "#next", () => { pp(2); });
    //管理登入按鈕
    jQuery("button").click(() => {
      location.assign("login.html");
    });
    //顯示或隱藏子選單
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
    //顯示或隱藏最新消息
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
    //渲染動態圖片
    function ww (filename) {
      jQuery("#mwww").html(`<embed loop="true" src="${API_PATH}/Content/Images/${filename}" style="width:99%; height:100%;"></embed>`);
    }
    function op (x, y, url) {
      jQuery(x).fadeIn();
      if (y) {
        jQuery(y).fadeIn();
      }
      if (y && url) {
        jQuery(y).load(url);
      }
    }
    //顯示校園映像
    function pp (x) {
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
    //渲染最新消息
    function mnl (detail) {
      let brief = detail.substr(0, 10);
      jQuery("ol").append(`<li><span class="sswww">${brief}</span><p class="all" style="display:none;">${detail}</p></li>`);
    }
  }
); 