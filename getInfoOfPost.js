let idOfPost = window.sessionStorage.getItem("idOfuser")
let content = document.getElementById("posts")



creatAbigPost(idOfPost)
function creatAbigPost(parm) {
    axios.get(`https://tarmeezAcademy.com/api/v1/posts/${parm}`)
    .then((response) => {
        let post = response.data.data

        let cont = 
        `
        <div class="card" id="${post.id}">
            <div class="head">
                <div>
                    <img src="${post.author.profile_image}" alt="">
                    <b>${post.author.username}</b>
                </div>
            </div>
            <div class="body">
                <img src="${post.image}" alt="">
                <span>${post.created_at}</span>
                <h5>${post.title || ""}</h5>
                <p>${post.body}</p>
                <hr>
            </div>
            <div class="foot">
                <p><i class="fa-sharp fa-solid fa-pen"></i> (${post.comments_count}) Commints</p>
                <div class="tags"></div>
                <div class="commints">

                    <div class="Newcommint">
                        <form action="">
                            <input type="text"  placeholder="Write commints">
                            <input type="submit" value="Send">
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `

        content.innerHTML = cont
        for (const iter of post.tags) {
            let comt = 
            `
                <span>${iter.name}</span>
            `
            document.querySelector(`.tags`).innerHTML += comt
        }

        for (const iter of post.comments) {
            let comt = 
            `
            <div>
                <div>
                    <img src="${iter.author.profile_image}">
                    <h3>${iter.author.username}</h3>
                </div>
                <p>${iter.body}</p>                                                             
            </div>
            `
            document.querySelector(`.commints`).innerHTML += comt
        }

    })
}

function creatcommints() {
    document.querySelector(`.Newcommint form`).onsubmit = function(eve) {
        eve.preventDefault();

    
        let postId = document.querySelector(`.card`).id
        let values = document.querySelector(`.Newcommint form input[type="text"]`).value

        let ob = {
            "body" : values
        }
        let tok = window.localStorage.getItem("tokenOfUser")
        
        axios.post(`https://tarmeezAcademy.com/api/v1/posts/${postId}/comments` , ob , {
            headers : {
                "authorization" : `Bearer ${tok}`
            }
        })
        .then((response) => {
            window.location.reload()
        })
    }
}


setTimeout(() => {
    creatcommints()
}, 10000);