const firebaseConfig = {
    apiKey: "AIzaSyBvWX3qm7pzhxj372tsy9oTFF1ISV-ofRo",
    authDomain: "yagamy-aa04b.firebaseapp.com",
    projectId: "yagamy-aa04b",
    storageBucket: "yagamy-aa04b.appspot.com",
    messagingSenderId: "921985479209",
    appId: "1:921985479209:web:211165a4ce0a383a80a238",
    measurementId: "G-QXEKV4DTFH"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);
    
    const db = firebase.firestore();

    const pageSize = 35; // 1ページあたりのイベント数

    async function getSingleEvent(eventId) {
        const eventsCol = db.collection("events");
        const eventSnapshot = await eventsCol.get(); 
        // const eventList = eventSnapshot.docs.map(doc => doc.data());
        const event = eventSnapshot.docs.eventId;
        console.log("企画情報だよ", event);
        return event;
    }

    let lastVisible = null; 

    async function getEventsPage(pageNumber) {
        const eventContainer = document.getElementById('event-container');
        const loading = document.getElementById('loading');
        eventContainer.innerHTML = ''; // 以前のデータをクリア
        loading.style.display = "block";
      
        let query = db.collection("events")
          .orderBy("festivalId") // 並び替え
          .limit(pageSize); // 1ページあたりの件数
      
        if (lastVisible && pageNumber > 0) {
          query = query.startAfter(lastVisible); // 前回の最後のドキュメントから開始
        }
        try{
            const eventSnapshot = await query.get();
        
            // イベント情報を表示し、次のページ用に最後のドキュメントを保存
            eventSnapshot.forEach(doc => {
              const event = doc.data();
              displayEvent(event);
            });
            // 最後のドキュメントを保存（次ページ取得のため）
            lastVisible = eventSnapshot.docs[eventSnapshot.docs.length - 1];

        } catch (error){

        } finally {
            loading.style.display = "none";

        }
      }

      // イベント情報をHTMLに表示
    function displayEvent(event) {

        const eventContainer = document.getElementById('event-container');
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');

        eventDiv.innerHTML = `
            <div class="info">
                <p class="name">${event.name}</p>
                <p class="place">${event.place + event.placeRoom}</p>
                <p class="host">${event.host}</p>
                <a href="/html/event-detail.html?id=${event.id}">詳細を見る</a>
            </div>
            <img src="${event.imageUrlSquare}" alt="${event.name}" class="event-image" style="max-width: 25%; border-radius: 8px">
        `
        eventContainer.appendChild(eventDiv);
      }

    //   ページネーションを作成
    function createPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = ''; // 以前のページネーションをクリア
  
        for (let i = 0; i < totalPages; i++) {
          const button = document.createElement('button');
          button.textContent = i + 1;
          button.addEventListener('click', () => getEventsPage(i));
          pagination.appendChild(button);
        }
      }
  
      // 総イベント数を取得してページネーションを設定
      async function setupPagination() {
        const eventsCol = db.collection("events");
        const snapshot = await eventsCol.get();
        const totalEvents = snapshot.size;
        const totalPages = Math.ceil(totalEvents / pageSize);
  
        createPagination(totalPages); // ページネーションを作成
      }

      setupPagination().then(() => getEventsPage(0));
