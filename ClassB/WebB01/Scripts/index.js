jQuery(document).ready(
  function () {
    //��l�ƶi���H��
    let counter = 0;
    //�ھڰ�W�M�w�ШD���|
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB01' : '..'
    //��ܶi���`�H��
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
    //��ܭ������v
    jQuery("#footer .t").text(localStorage.getItem('footer'));
    //���J���D��
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
    //���J�ô�V�D���
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
              //���J�ô�V�l���
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
    //���J�ʺA��r�s�i
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
    //���J�ʵe�Ϥ�
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
    //���J�̷s����
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
    //���J�ô�V�ն�M��
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
    //�W�@��
    jQuery("#ci").on('click', "#prev", () => { pp(1); });
    //�U�@��
    jQuery("#ci").on('click', "#next", () => { pp(2); });
    //�޲z�n�J���s
    jQuery("button").click(() => {
      location.assign("login.html");
    });
    //��ܩ����äl���
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
    //��ܩ����ó̷s����
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
    //��V�ʺA�Ϥ�
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
    //��ܮն�M��
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
    //��V�̷s����
    function mnl (detail) {
      let brief = detail.substr(0, 10);
      jQuery("ol").append(`<li><span class="sswww">${brief}</span><p class="all" style="display:none;">${detail}</p></li>`);
    }
  }
); 