
    async function getSingleEvent(eventId) {
        const eventsCol = db.collection("events");
        const querySnapshot = await eventsCol.where("id", "==", eventId).get(); 

        if (!querySnapshot.empty) {
            // console.log("この企画だよね", querySnapshot.docs[0].data());
            return querySnapshot.docs[0].data();
        } else {
            console.log("一致するイベントが見つかりませんでした");
        }
    }
    
    // URLからクエリパラメータとして渡された企画IDを取得
    
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id'); // 'id'パラメータを取得
    }

    async function displayEventDetail(){

        const eventId = getQueryParams();
        let event = await getSingleEvent(eventId);

        if (event) {
            // console.log("こっちでも見れてます", event);
    
            const detailImg = document.querySelector(".detail-img");
            detailImg.src = event.imageUrlSquare;
    
            const detailName = document.querySelector(".detail-name");
            detailName.textContent = `企画名:  ${event.name}`;
            const detailPlace = document.querySelector(".detail-place");
            detailPlace.textContent = `場所:  ${event.place + event.placeRoom}`;
            const detailFestivalid = document.querySelector(".detail-festivalid");
            detailFestivalid.textContent = `企画番号:  ${event.festivalId}`;
            const detailComment = document.querySelector(".detail-comment");
            detailComment.textContent = `${event.comment}`;
            const detailHost = document.querySelector(".detail-host");
            detailHost.textContent = `主催団体:  ${event.host}`;
            const detailExplanation = document.querySelector(".detail-explanation");
            detailExplanation.textContent = `${event.explanation}`;
        } else {
            console.log("イベントが見つかりませんでした。");
        }

    }

    displayEventDetail();


