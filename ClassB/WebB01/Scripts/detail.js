jQuery(document).ready(function (e) {
  //根據域名決定請求路徑
  const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB01' : '..'
  //顯示進站總人數
  jQuery("#LabelCounter").text(localStorage.getItem('counter'));
  //載入標題區
  jQuery.getJSON(
    `${API_PATH}/Fetch.ashx`,
    {
      item: 'Title'
    },
    returns => {
      jQuery.each(returns, (key, value) => {
        if (value.Display === 'yes') {
          jQuery("#header").attr({
            'src': `${API_PATH}/Content/Images/${value.FileName}`,
            'alt': value.AlternativeText
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
      returns = returns.filter(value => value.Display === 'yes');
      jQuery.each(returns, (key, value) => {
        let menuitem =
          `<div class="mainmu" id="main-${value.Id}">
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
              menuitem += `<div class="mw" style="display:none;">`;
              jQuery.each(returns, (key, value) => {
                menuitem +=
                  `<div class="mainmu2" id="sub-${value.Id}">
                                        <a href="${value.Url}">${value.Name}</a>
                                    </div>`;
              });
              menuitem += `</div>`;
            }
          });
        }
        menuitem += `</div>`;
        jQuery("#menuput").append(menuitem);
      });
    }
  });
  //載入動態文字廣告
  jQuery.getJSON(
    `${API_PATH}/Fetch.ashx`,
    {
      item: 'DynamicText',
      Display: 'yes'
    },
    returns => {
      let marquee = '';
      jQuery.each(returns, (key, value) => {
        marquee += value.Message + ' ';
      });
      jQuery("#marquee span").text(marquee).css('width', `${marquee.length*100}px`);
    }
  );
  let pagecount, rowcount, pagecurrent = 1, details;
  //載入並渲染最新消息分頁
  jQuery.ajax({
    url: `${API_PATH}/Fetch.ashx`,
    method: 'get',
    data: {
      item: 'News',
    },
    dataType: 'json',
    async: false,
    success: returns => {
      details = returns.filter(value => value.Display === 'yes');
      rowcount = details.length, pagecount = Math.ceil(rowcount / 4), pagecurrent = 1;
      if (details.length > 5) {
        var paginationlink =
          `<li>
              <a href="" id="newsprev" style="text-decoration:none"><</a>
          </li>`;
        for (var i = 1; i <= pagecount; i++) {
          paginationlink +=
            `<li`;
          if (i === pagecurrent) {
            paginationlink +=
                ` style="font-size:20px"`;
          }
          paginationlink +=
            `>${i}</li>`;
        }
        paginationlink +=
          `<li>
              <a href="" id="newsnext" style="text-decoration:none">></a>
          </li>`;
        jQuery("#pagination-item").html(paginationlink);
      }
      fetchrow(0, 5);
    }
  });
  var num, nowpage = 1;
  //載入並渲染校園映像
  jQuery.getJSON(
    `${API_PATH}/Fetch.ashx`,
    {
      item: 'CampusImage',
      Display: 'yes'
    },
    returns => {
      var images = `<img src="${API_PATH}/Content/Images/01E01.jpg" id="imgprev"/><br/>`;
      num = returns.length;
      jQuery.each(returns, (key, value) => {
        images += `<img src="${API_PATH}/Content/Images/${value.FileName}" id="ssaa${value.Id}" class="im" width="150" height="103"/>`;
      });
      images += `<br/><img src="${API_PATH}/Content/Images/01E02.jpg" id="imgnext" />`;
      jQuery("#ci").append(images);
      pp(1);
    }
  );
  //校園映像上一頁
  jQuery("#ci").on('click', "#imgprev", () => { pp(1); });
  //校園映像下一頁
  jQuery("#ci").on('click', "#imgnext", () => { pp(2); });
  //最新消息上一頁
  jQuery("#pagination-item").on('click', "#newsprev", function (event) {
    event.preventDefault();
    pagecurrent--;
    if (pagecurrent < 1) {
      pagecurrent = 1;
    } else {
      jQuery("#pagination-item").children("li").each(function () {
        if (jQuery(this).text() == pagecurrent) {
          jQuery(this).css('font-size', '20px');
        } else {
          jQuery(this).css('font-size', '12px');
        }
      });
      fetchrow((pagecurrent - 1) * 5, 5);
    }
  });
  //最新消息下一頁
  jQuery("#pagination-item").on('click', "#newsnext", function (event) {
    event.preventDefault();
    pagecurrent++;
    if (pagecurrent > pagecount) {
      pagecurrent = pagecount;
    } else {
      jQuery("#pagination-item").children("li").each(function () {
        if (jQuery(this).text() == pagecurrent) {
          jQuery(this).css('font-size', '20px');
        } else {
          jQuery(this).css('font-size', '12px');
        }
      });
      fetchrow((pagecurrent - 1) * 5, 5);
    }
  });
  //頁尾版權
  jQuery("#footer .t").text(localStorage.getItem('footer'));
  //管理登入
  jQuery("button").click(() => {
    location.assign(`${API_PATH}/login.html`);
  });
  //顯示或隱藏子選單
  jQuery(".mainmu").mouseover(
    function () {
      jQuery(this).children(".mw").stop().show()
    }
  )
  jQuery(".mainmu").mouseout(
    function () {
      jQuery(this).children(".mw").hide()
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
  function op (x, y, url) {
    jQuery(x).fadeIn();
    if (y)
      jQuery(y).fadeIn();
    if (y && url)
      jQuery(y).load(url);
  }
  //渲染最新消息
  function mnl (detail) {
    let brief = detail.substr(0, 10);
    jQuery("ol").append(`<li><span class="sswww">${brief}</span><p class="all" style="display:none;">${detail}</p></li>`);
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
  //載入最新消息
  function fetchrow (skipnum, fetchnum) {
    jQuery("ol").empty().attr('start', skipnum + 1);
    for(let key = skipnum; key < skipnum + fetchnum; key++) {
      if(key === rowcount) break
      mnl(details[key].Message); 
    }
  }
});