//html 시작 시 이벤트
document.addEventListener("DOMContentLoaded", function () {
    const commentForm = document.getElementById("comment-form"); //댓글 작성 폼
    const commentsContainer = document.getElementById("comments"); //댓글창
  
    commentForm.addEventListener("submit", function (event) {
        event.preventDefault();
        //폼 제출 시 이벤트
  
        const name = "오르미"
        const commentInput = document.getElementById("comment");//댓글 내용
        const comment = commentInput.value;
  
        addComment(name, comment);
  
        commentInput.value = "";
    });
    //댓글 추가
    function addComment(name, comment) {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");
        //<div> 댓글

        // 이름 지우지 않기!!!!
        //이름 + 댓글
        const namedv = document.createElement("div");
        namedv.textContent = name;
        const commentDv = document.createElement("div");
        commentDv.textContent = comment;
    
        commentDiv.appendChild(namedv);
        commentDiv.appendChild(commentDv);
    
        commentsContainer.appendChild(commentDiv);
    }
  });
  