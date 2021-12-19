jQuery(document).ready(
	() => {
		var today = new Date(), days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], orderedDate, ondate, seatList, restOfSeats = [20, 20, 20, 20, 20];
		//載入片名選單
		jQuery.getJSON(
			'/ClassB/WebB03/Fetch.ashx',
			{
				item: 'Movie'
			},
			response => {
				response = response.filter(
					value => {
						ondate = new Date(value.date);
						ondate.setDate(ondate.getDate() + 3);
						return value.display === 'yes' && today < ondate;
					}
				);
				response.forEach(
					value=> {
						jQuery("#Movie").append(
							`<option value='${value.id}'>${value.name}</option>`
						);
					}
				);			
				if (sessionStorage.getItem('info')?.length>0) {
					let info = JSON.parse(sessionStorage.getItem('info'));
					jQuery("#Movie").val(info[0].id).change();
				}
			}
		);
		//載入日期選單
		jQuery("#Movie").change(
			function(){
				jQuery.getJSON(
					'/ClassB/WebB03/Fetch.ashx',
					{
						item: 'Ticket'
					},
					response => {
						seatList = response.filter(value => value.movie === parseInt(jQuery(this).val()));
					}
				);	
				let date = new Date(today),dateList='<option selected>請選擇</option>';
				while (date <= ondate) {
					dateList+=
						`<option value='${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, 0)}-${date.getDate()}'>
							${date.getMonth() + 1}月${date.getDate()}日 ${days[date.getDay()]}
						</option>`
					;
					date.setDate(date.getDate() + 1);
				}
				jQuery("#Date").empty().append(dateList);
			}
		);
		//載入時段選單
		jQuery("#Date").change(
			function(){
				seatList = seatList.filter(value => value.date === jQuery(this).val());
				seatList.forEach(
					value => {
						let presale = value.seat.split(' ');
						switch (parseInt(value.time)) {
							case 14:
								restOfSeats[0] -= presale.length;
								break;
							case 16:
								restOfSeats[1] -= presale.length;
								break;
							case 18:
								restOfSeats[2] -= presale.length;
								break;
							case 20:
								restOfSeats[3] -= presale.length;
								break;
							case 22:
								restOfSeats[4] -= presale.length;
								break;
						}
					}
				);
				let showing = '<option selected>請選擇</option>', index = 0, start;
				orderedDate = new Date(jQuery(this).val());
				if (orderedDate.getDate() === today.getDate()&&today.getHours()>14) {
					start =today.getHours()%2?today.getHours()+1:today.getHours()+2;
				} else {
					start = 14;
				}	
				for (let hour = start; hour < 24; hour += 2) {
					showing += `<option value='${hour}'>${hour}:00~${hour + 2 === 24 ? '00' : hour + 2}:00 剩餘座位 ${restOfSeats[index]}</option>`;					
					index++;
				}
				jQuery("#Time").empty().append(showing);
			}
		);
		//篩選座位
		jQuery("#Time").change(
			function(){
				seatList = seatList.filter(value =>  value.time === Number(jQuery(this).val()));
			}
		);
		jQuery("#ToStep2").click(
			() => {
				event.preventDefault();
				let chosenSeats=[],seatTable =
					`<tr>`;
				//紀錄已訂位座位
				seatList.forEach(
					value1 => {
						console.info(value1.seat.split(' '))
						value1.seat.split(' ').forEach(
							value2 => {
								chosenSeats.push(value2);
							}
						);
					}
				);			
				//載入座位分布圖
				for (let i = 1; i <=20; i++) {
					seatTable +=
							`<td>
								${Math.ceil(i / 5)}排${i % 5 === 0 ? 5 : i % 5}號<br/>`;
					if (chosenSeats.indexOf(i) > -1) {
						seatTable +=
								`<img src='/ClassB/WebB03/Images/03D03.png' width='40' height='40' />`;
					} else {
						seatTable +=
								`<img src='/ClassB/WebB03/Images/03D02.png' width='40' height='40' />
								<input type='checkbox' name='avalibleSeats' value='${i}' />`;
					}
					seatTable +=
							`</td>`;
					if (i % 5 === 0) {
						seatTable +=
						`</tr>
						<tr>`
					}
				}
				seatTable += `</tr>`;
				jQuery("#ChooseSeat table").empty().append(seatTable);
				jQuery("#Step1").hide();
				jQuery("#Step2").show();
				//顯示片名
				jQuery("#SelectedMovie").text(jQuery("#Movie :checked").text());
				//顯示日期與時段
				jQuery("#SelectedTime").text(`${jQuery("#Date :checked").text().slice(0,6)} ${jQuery("#Time :checked").text().slice(0,11)}`);
			}
		);
		var selectedSeat = [],seatCount=0;
		jQuery("#ChooseSeat").on(
			'change',
			":checkbox",
			function () {
				if (jQuery(this).prop('checked')) {
					seatCount++;
					//限制最多勾選4個座位
					if (seatCount > 4) {
						jQuery(this).prop('checked', false);
						seatCount = 4;
					} else {
						selectedSeat.push(jQuery(this).val());
					}
				} else {
					seatCount--;
					selectedSeat.splice(selectedSeat.indexOf(jQuery(this).val()), 1);
				}
				jQuery("#SeatCounts").text(seatCount);
			}
		);
		jQuery("#ToStep1").click(
			() => {
				jQuery("#Step2").hide();
				jQuery("#Step1").show();
			}
		);
		jQuery("#ToStep3").click(
			() => {
				event.preventDefault();
				//依日期篩選座位，並產生訂單編號
				let seatFilter = seatList.filter(value => value.date === jQuery("#Date").val()),
					id = seatFilter?.[seatFilter.length - 1]?.number+1 ?? parseInt(`${orderedDate.getFullYear()}${(orderedDate.getMonth() + 1).toString().padStart(2, 0)}${orderedDate.getDate()}0001`);
				jQuery.post(
					'/ClassB/WebB03/Add.ashx',
					{
						item: 'Ticket',
						movie: jQuery("#Movie").val(),
						date: jQuery("#Date").val(),
						time: jQuery("#Time").val(),
						seat:selectedSeat.join(' '),
						number:id
					},
					response => {
						if (response !== 'failed') {
							//訂單編號
							jQuery("#TicketNo").text(id);
							//片名
							jQuery("#OrderedMovie").text(jQuery("#Movie :checked").text());
							//日期
							jQuery("#OrderedDate").text(`${orderedDate.getFullYear()}/${orderedDate.getMonth() + 1}/${orderedDate.getDate()}`);
							//時段
							jQuery("#OrderedTime").text(jQuery("#Time :checked").text().slice(0, 11));
							let orderedSeat = ``;
							//座位
							selectedSeat.forEach(
								seat => {
									orderedSeat+=`${Math.ceil(seat/5)}排${seat%5===0?5:seat%5}號<br/>`
								}
							);
							//票數
							jQuery("#SelectedSeats").html(`${orderedSeat}<br/>共${selectedSeat.length}張電影票`);				
							jQuery("#Step2").hide();
							jQuery("#Step3").show();
						}
					}
				);
			}
		);
		//回首頁
		jQuery("form").submit(
			() => {
				event.preventDefault();
				location.assign('index.html');
			}
		);
	}
);