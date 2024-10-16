﻿jQuery(document).ready(
  () => {
    let trailerName = '', posterName = '', info;
    //根據網域決定路徑
    const API_PATH = location.hostname === 'localhost' ? '/ClassB/WebB03' : '..';
    //日期選單
    for (let y = 1970; y <= new Date().getFullYear(); y++) {
      jQuery("#year").append(
        `<option value='${y}'>${y}</option>`
      );
    }
    for (let m = 1; m <= 12; m++) {
      jQuery("#month").append(
        `<option value='${m}'>${m}</option>`
      );
    }
    for (let d = 1; d <= 31; d++) {
      jQuery("#date").append(
        `<option value='${d}'>${d}</option>`
      );
    }
    //若是從列表進入，則預先載入電影資訊
    if (sessionStorage.length > 1) {
      info = JSON.parse(sessionStorage.getItem('info'));
      jQuery("#name").val(info.name);
      jQuery("#length").val(info.length);
      jQuery("#level").val(info.levels)
      let date = new Date(info.date);
      jQuery("#year").val(date.getFullYear());
      jQuery("#month").val(date.getMonth() + 1);
      jQuery("#date").val(date.getDate());
      jQuery("#publisher").val(info.publisher);
      jQuery("#director").val(info.director);
      jQuery("#display").prop('checked', info.display === 'yes' ? true : false);
      jQuery("#animation").val(info.animation);
      jQuery("#brief").val(info.brief);
      jQuery("#Submit").val('修改');
    } else {
      jQuery("#Submit").val('新增');
    }
    //根據提交按鈕文字決定網址
    let url = jQuery("#Submit").val() === '新增' ? 'Add' : 'Modify',
      trailer = jQuery("#trailer").get(0),
      poster = jQuery("#poster").get(0),
      formData = new FormData;
    jQuery("#trailer").change(
      async () => {
        //若有上傳預告檔案
        if (trailer.files.length > 0) {
          //移除海報檔案，以免重複上傳
          formData.delete('poster');
          formData.set('trailer', trailer.files[0]);
          await fetch(
            `${API_PATH}/Upload.ashx`,
            {
              method: 'post',
              body: formData
            }
          ).then(
            response => {
              if (response.ok) {
                trailerName = trailer.files[0].name;
              }
            }
          );
        } else {
          trailerName = info.trailer;
        }
      }
    )
    jQuery("#poster").change(
      async () => {
        //若有上傳海報檔案
        if (poster.files.length > 0) {
          //移除預告檔案，以免重複上傳								
          formData.delete('trailer');
          formData.set('poster', poster.files[0]);
          await fetch(
            `${API_PATH}/Upload.ashx`,
            {
              method: 'post',
              body: formData
            }
          ).then(
            response => {
              if (response.ok) {
                posterName = poster.files[0].name;
              }
            }
          );
        } else {
          posterName = info.poster;
        }
      }
    )
    jQuery("form").submit(
      async event => {
        event.preventDefault();
        const id = jQuery("#Submit").val() === '新增' ? 0 : info.id,
          display = jQuery("#display").prop('checked') ? 'yes' : 'no'
        jQuery.post(
          `${API_PATH}/${url}.ashx`,
          {
            item: 'Movie',
            id,
            name: jQuery("#name").val(),
            length: jQuery("#length").val(),
            levels: jQuery("#level").val(),
            date: `${jQuery("#year").val()}-${jQuery("#month").val()}-${jQuery("#date").val()}`,
            publisher: jQuery("#publisher").val(),
            director: jQuery("#director").val(),
            trailer: trailerName,
            poster: posterName,
            brief: jQuery("#brief").val(),
            display,
            animation: jQuery("#animation").val()
          },
          () => {
            location.assign('?do=trailer');
          }
        )
      }
    );
  }
);