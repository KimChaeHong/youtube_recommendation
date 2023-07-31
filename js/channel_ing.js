function createVideoItem(video_id) {
  // XMLHttpRequest 객체 생성
  let xhr = new XMLHttpRequest();

  // API 요청 설정
  let apiUrl = `http://oreumi.appspot.com/video/getVideoInfo?video_id=${video_id}`;
  xhr.open("GET", apiUrl, true);

  // 응답 처리 설정
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      // 가져온 응답 처리
      let response = JSON.parse(xhr.responseText);

      // 데이터 있는지 확인
      if (response && response.video_id !== undefined) {
        let image_link = response.image_link;
        let upload_date = response.upload_date;
        let video_channel = response.video_channel;
        let video_detail = response.video_detail;
        let video_id = response.video_id;
        let video_link = response.video_link;
        let video_tag = response.video_tag;
        let video_title = response.video_title;
        let views = response.views;

        // 채널 데이터를 가져오기 위해 POST 요청
        let channelApiUrl = "http://oreumi.appspot.com/channel/getChannelInfo";
        let channelXhr = new XMLHttpRequest();
        channelXhr.open("POST", channelApiUrl, true);
        channelXhr.setRequestHeader("Content-Type", "application/json");

        // post 요청에 JSON 데이터 넣기
        let postData = JSON.stringify({ video_channel: video_channel });
        channelXhr.onreadystatechange = function () {
          if (
            channelXhr.readyState === XMLHttpRequest.DONE &&
            channelXhr.status === 200
          ) {
            let channelResponse = JSON.parse(channelXhr.responseText);

            // 채널 데이터를 받아와서 처리하는 로직 추가
            if (channelResponse) {
              let channel_profile = channelResponse.channel_profile;

              // html에 요소 넣기
              // 스몰 비디오

              // 컨테이너 생성
              
              //영상 넣기
              
              let link = document.createElement("a");
              link.href = video_link;
              link.classList.add("s-video");

              //제목 넣기
              let videoTitle = document.createElement("div");
              videoTitle.classList.add("video-title");
              videoTitle.textContent = video_title;

              //썸네일
              let thumbnailDiv = document.createElement("div");
              thumbnailDiv.classList.add("feed__item__thumbnail");

              let thumbnailImage = document.createElement("img");
              thumbnailImage.src = image_link;
              thumbnailDiv.appendChild(thumbnailImage);
              
              

              let small_video = document.getElementById('small-video');
              small_video.appendChild(link);
              small_video.appendChild(videoTitle);
              small_video.appendChild(thumbnailDiv);


              


              

              // FEED에 컨테이너 추가
              // let channel = document.getElementById("channel");
              // feed.appendChild(videoContainer);

              // 재귀호출

              // createVideoItem(video_id + 1);
            }
          }
        };
        // 채널 데이터 요청 전송
        channelXhr.send(postData);
      }
    }
  };

  // 요청 전송
  xhr.send();
}

// id = 0부터 아이템 불러오기
createVideoItem(0);