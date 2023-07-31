document.getElementById("search-btn").addEventListener("click", searchResult);

function searchResult() {
    let searchInput = document.getElementById("searchInput").value;

    if (searchInput === '') {
        alert('검색어를 입력하세요.');
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                if (data.Response === 'False') {
                    alert('검색 결과를 가져오는데 실패했습니다.');
                } else{
                    let thumnailInfo = '';
                    thumnailInfo += '<img src="' + data.image_link +  '">';
                    thumnailInfo += '<div>' + data.video_title + '</div>';
                    thumnailInfo += '<p>조회수 ' + data.views + '회</p>';
                    thumnailInfo += '<p>' + data.upload_date + '</p>';
                    thumnailInfo += '<p>' + data.video_channel + '</p>';
                    thumnailInfo += '<p>' + data.video_detail + '</p>';
                    document.getElementById('search_result').innerHTML = thumnailInfo;
                }
            } else {
                alert("검색 결과를 가져오는데 실패했습니다.");
            }
        }
    };
    xhr.open('GET', 'http://oreumi.appspot.com/video/getVideoInfo?video_id=' + encodeURIComponent(searchInput), true); 
    xhr.send();
}