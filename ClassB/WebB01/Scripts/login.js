jQuery(document).ready(function () {
  //根據域名決定路徑
  const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB01' : '..'
  //顯示進站總人數
  jQuery("#LabelCounter").text(localStorage.getItem('counter'));
  //顯示頁尾版權
  jQuery("#footer .t").text(localStorage.getItem('footer'));
  //載入標題區
  jQuery.getJSON(`${API_PATH}/Fetch.ashx`,
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
  jQuery.getJSON(`${API_PATH}/Fetch.ashx?item=DynamicText`,
    returns => {
      let marquee = '';
      jQuery.each(returns, (key, value) => {
        if (value.Display === 'yes') { marquee += value.Message + ' '; }
      });
      jQuery("#marquee span").text(marquee).css('width', `${marquee.length*100}px`);
    }
  );
  var num = 0, nowpage = 1;
  //載入並渲染校園映像
  jQuery.getJSON(`${API_PATH}/Fetch.ashx`,
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
  //管理登入
  jQuery("button").click(
    () => {
      location.reload();
    }
  );
  //顯示或隱藏子選單
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
  //驗證登入
  jQuery("form").submit(
    event => {
      event.preventDefault();
      jQuery.post(
        `${API_PATH}/Login.ashx`,
        {
          acc: jQuery("input:text").val(),
          ps: jQuery("input:password").val()
        },
        returns => {
          if (returns === 'success') {
            sessionStorage.setItem('role', 'admin');
            location.assign(`${API_PATH}/manage.html?item=title`);
          } else {
            alert('帳號或密碼輸入錯誤');
            jQuery("input:text").val('');
            jQuery("input:password").val('');
          }
        }
      );
    }
  );
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
});
