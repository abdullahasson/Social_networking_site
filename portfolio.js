let IdofUser =  JSON.parse(window.localStorage.getItem("user"))
userInfo(IdofUser.id)

function userInfo(parm) {
    axios.get(`https://tarmeezAcademy.com/api/v1/users/${parm}`)
    .then((response) => {
        let rr = response.data.data

        let conte = `
            <div class="left">
                <img src="${rr.profile_image == "[object Object]" ? "./images/تنزيل (2).jpg" : rr.profile_image}" alt="">
                <div>
                    <h3>${rr.name}</h3>
                    <h3>${rr.username}</h3>
                </div>
            </div>
            <div class="right">
                <div><h5>${rr.posts_count}</h5><span>Posts</span></div>
                <div><h5>${rr.comments_count}</h5><span>comments</span></div>
            </div>
        `

        document.querySelector(`.count`).innerHTML = conte
    }) 

    axios.get(`https://tarmeezAcademy.com/api/v1/users/${parm}/posts`)
    .then((response) => {
        for (iterr of response.data.data) {
            let cont = `
                <div class="card" id="${iterr.id}">
                    <div class="head">
                        <div>
                            <img src="${iterr.author.profile_image == "[object Object]" ? "./images/تنزيل (2).jpg" : iterr.author.profile_image}" alt="">
                            <b>${iterr.author.username}</b>
                        </div>

                        <div class="btns">
                            <button onclick="adite(${iterr.id})">edit</button>
                            <button onclick="del(${iterr.id})">delete</button>
                        </div>
                    </div>
                    <div class="body">
                        <img src="${iterr.image}" alt="">
                        <span>${iterr.created_at}</span>
                        <h5>${iterr.title}</h5>
                        <p>${iterr.body}</p>
                        <hr>
                    </div>
                    <div class="foot">
                        <p><i class="fa-sharp fa-solid fa-pen"></i>(${iterr.comments_count}) comments</p>
                        <div class="tags"></div>
                    </div>
                </div>
            `
            document.querySelector(`.myposts`).innerHTML += cont
        }
    })
}

let tok = window.localStorage.getItem("tokenOfUser")

function del(parm) {
    Swal.fire({
    title: 'Are you sure?',
    text: "You won't logout!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Delete'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`https://tarmeezAcademy.com/api/v1/posts/${parm}` , {
                headers : {
                    "authorization" : `Bearer ${tok}`
                }
            })
            .then((response) => {
                location.reload()
            })

        }
    })
}

async function adite(parm) {
    const { value: formValues } = await Swal.fire({
        title: 'add post',
        html: `
            <form action="" class="addpostform">
                <input id="swal-input1" class="swal2-input" placeholder="Title">
                <textarea id="swal-input2" class="swal2-input" cols="30" rows="10" placeholder="content"></textarea>
                <input type="file" id="swal-input3" class="swal2-input" placeholder="select image">
            </form>
        `,
        preConfirm: () => {
        return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').files[0]
        ]
        }
    })

    if (formValues) {

        let ob = {
            "title":formValues[0],
            "body":formValues[1],
            "image":formValues[2] 
        }
        
        axios.put(`https://tarmeezAcademy.com/api/v1/posts/${parm}` , ob , {
            headers : {
                    "authorization" : `Bearer ${tok}`
            }
        })
        .then((response) => {
            console.log(response)
        })
    }
}