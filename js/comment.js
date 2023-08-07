// 스타일 추가, 댓글 클릭 이벤트 적용 7.31 신지수
document.addEventListener("DOMContentLoaded", function () {
    const commentForm = document.getElementById("comment-form"); //댓글 작성 폼
    const commentsContainer = document.getElementById("comments"); //댓글창
  
    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        //폼 제출 시 이벤트

        const icon = '../svg/oreumi.png';
        const name = "오르미"
        const commentInput = document.getElementById("comment");//댓글 내용
        const comment = commentInput.value;
        const edit = "EDIT"
        const now = "now"
  
        addComment(icon, name, comment, edit, now);
  
        commentInput.value = "";
    });

    // 텍스트 공간 이벤트
    const commentInput = document.getElementById("comment");
    const commentBtn = document.getElementsByClassName("comment-btn");
    //버튼에 직접 스타일 넣을 수 없어서 for문 사용
    for (const btn of commentBtn) {
        btn.style.display = "none";
    }
    // 클릭 시 버튼 생성
    commentInput.addEventListener("click", function () {
        for (const btn of commentBtn) {
            btn.style.display = "block";
        }
    });
    document.addEventListener("click", function (event) {
        const target = event.target;
        // 클릭한 요소가 textarea가 아니고, 버튼도 아닌 경우에만 버튼 숨김
        if (target !== commentInput && ![...commentBtn].some(btn => btn.contains(target))) {
            for (const btn of commentBtn) {
                btn.style.display = "none";
            }
        }
    });

    //댓글 추가 함수
    function addComment(icon, name, comment, edit, now) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        // 이미지, 이름, 댓글을 담을 컨테이너 생성
        const contentContainer = document.createElement("div");
        contentContainer.classList.add("content-container");

        // 아이콘 생성(사진 안뜨면 이름뜨도록)
        const imgElement = document.createElement("img");
        imgElement.src = icon;
        imgElement.alt = name;

        // 아이콘 크기 조정 + 스타일 적용
        const imageSize = "50px";
        imgElement.style.width = imageSize;
        imgElement.style.height = imageSize;
        imgElement.style.borderRadius = "50%";
        imgElement.style.marginRight = "20px";
        
        // 이름 지우지 않기!!!!
        const nameDv = document.createElement("div");
        nameDv.textContent = name;
        const nowDv = document.createElement("div");
        nowDv.textContent = now;
        const commentDv = document.createElement("div");
        commentDv.textContent = comment;
        const editDv = document.createElement("div");
        editDv.textContent = edit;

        //스타일
        contentContainer.style.display = "grid";
        contentContainer.style.gridTemplateAreas = '"imgElement nameDv nowDv" "imgElement commentDv commentDv" "imgElement editDv editDv"';
        nameDv.style.gridArea = "nameDv";
        nowDv.style.gridArea = "nowDv";
        commentDv.style.gridArea = "commentDv";
        imgElement.style.gridArea = "imgElement";
        editDv.style.gridArea = "editDv";
        //정렬
        contentContainer.style.justifyContent = "start";

        // 폰트 스타일
        contentContainer.style.marginBottom = "30px";
        contentContainer.style.color = "white";
        nameDv.style.fontWeight = "bold";
        nameDv.style.fontSize = "18px";
        editDv.style.color = "#AAAAAA";
        editDv.style.fontSize = "16px";
        editDv.style.marginLeft = "5px";
        nowDv.style.color = "#AAAAAA";
        nowDv.style.fontSize = "18px";
        nowDv.style.marginLeft = "5px";
        
        // 이미지, 이름, 댓글을 컨테이너에 추가
        contentContainer.appendChild(imgElement);
        contentContainer.appendChild(nameDv);
        contentContainer.appendChild(commentDv);
        contentContainer.appendChild(editDv);
        contentContainer.appendChild(nowDv);

        commentDiv.appendChild(contentContainer);
        commentsContainer.insertBefore(commentDiv, commentsContainer.firstChild);
    }
});
