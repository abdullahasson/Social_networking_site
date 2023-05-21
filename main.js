if (document.body.getAttribute("data-val") !== "false") {
    // Log in and sign up animation
    const wrapper = document.querySelector(`.wrapper`)
    const signUpLink = document.querySelector(`.signUp-link`)
    const signInLink = document.querySelector(`.signin-link`)

    signUpLink.addEventListener('click' , () => {
        wrapper.classList.add('animate-signIn')
        wrapper.classList.remove('animate-signUp')
    })

    signInLink.addEventListener('click' , () => {
        wrapper.classList.add('animate-signUp')
        wrapper.classList.remove('animate-signIn')
    })
}



let imgplaceholder = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc83mFSqBl_YZ9dv2uDbUn5utQFPwA-Z-7oiLhgiqAsg&s"

let filee = ""
fetch(imgplaceholder)
.then(req => req.blob())
.then(blob => {
    filee = new File([blob] , 'image' , {type : blob.type})
})

let noimageforpost = ""
fetch(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6V_R6WMnHzN5bpexR-vQ1tNickx9phBGTHA&usqp=CAU`)
.then(req => req.blob())
.then(blob => {
    noimageforpost = new File([blob] , 'image' , {type : blob.type})
})

let UrL = "https://tarmeezAcademy.com/api/v1"

let newPage = 1;
let averag = document.documentElement.clientHeight;

function endofpagenewposts() {
    if (document.body.getAttribute("data-val") !== "false") {
        const container = document.getElementById('posts');
        // The Scroll Event.
        window.addEventListener('scroll',()=>{
            const {scrollHeight,scrollTop,clientHeight} = document.documentElement;
            if(scrollTop + clientHeight > scrollHeight - 5){
                console.log("end")
                newPage += 1
                window.sessionStorage.setItem("numofpage" , newPage)
                getPost(newPage)
            }
        });
        
    }
}

// check if the user is log in
setupUi()

// show login massege 
if (document.body.getAttribute("data-val") !== "false") {
    document.querySelector(`.log`).addEventListener("submit" , (eve) => {
        let username = document.querySelector(`.log .input-group input[type = "text"]`).value
        let password = document.querySelector(`.log .input-group input[type = "password"]`).value
    
        let parms = {
            "username": username,
            "password": password
        }
        axios.post(`${UrL}/login`, parms)
            .then((response) => {
                window.localStorage.setItem("user", JSON.stringify(response.data.user))
                window.localStorage.setItem("tokenOfUser", response.data.token)
                successfully()
            }).catch(() => {
                let er = 'This account is not valid'
                fail(er)
        })
    
        eve.preventDefault();
    })
}

// When user click on logout btn 
function LogOutBtnClicked() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't logout!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Logout'
    }).then((result) => {
        if (result.isConfirmed) {
            window.localStorage.removeItem("user")
            window.localStorage.removeItem("tokenOfUser")
            window.location.reload()
        }
    })
}

// when user click on register
if (document.body.getAttribute("data-val") !== "false") {
    document.querySelector('.sig').addEventListener("submit" , (eve) => {

        let name = document.querySelector(`.sig .name`).value
        let username = document.querySelector(`.sig .username`).value
        let img =  document.querySelector(`.sig .input-group input[type = "file"]`).files[0]
        let password = document.querySelector(`.sig .input-group input[type = "password"]`).value
    
        let fromdata = new FormData()
        fromdata.append("name", name)
        fromdata.append("username", username)
        fromdata.append("image", img || filee)
        fromdata.append("password", password)
    
        axios.post(`${UrL}/register`, fromdata, {
            headers: {
                "Content-Type": "multipart/from-data"
            }
        })
            .then((response) => {
                window.localStorage.setItem("user", JSON.stringify(response.data.user))
                window.localStorage.setItem("tokenOfUser", response.data.token)
                successfully()
            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${error.response.data.message}`,
                })
            })
    
        eve.preventDefault();
    })
}

// setup UI page 
function setupUi() {
    let token = window.localStorage.getItem("tokenOfUser")

    if (token == null) {

    } else {
        getPost()
        endofpagenewposts()
        document.querySelector(`.navbar .container .middle .main`).style.cssText = `
        width: 100%;
        margin: auto;
        justify-content: space-between;

        `
        document.querySelector(`.sss`).style.display = "block"
        if (document.body.getAttribute("data-val") !== "false") {
            document.querySelector(`.lds-ripple`).style.display = "block"
            document.getElementById("Logout-btn").style.display = "block"
            document.getElementById("addPost").style.display = "block"
            document.querySelector('.wrapper').style.display = "none"
        }
        document.getElementById("useraccout").style.display = "flex"
        let info = JSON.parse(window.localStorage.getItem("user"))
        document.querySelector(`.navbar .container .middle .main .userAcuont img`).src = info.profile_image == "[object Object]" ? "./images/تنزيل (2).jpg" : info.profile_image
        document.querySelector(`.navbar .container .middle .main .userAcuont b`).innerHTML = info.name
    }
}


// New post to creat
async function newPost() {
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

        let fromdata = new FormData()
        fromdata.append("title", formValues[0])
        fromdata.append("body", formValues[1])
        fromdata.append("image", formValues[2] || noimageforpost)

        axios.post(`https://tarmeezAcademy.com/api/v1/posts`, fromdata, {
            headers: {
                "Content-Type": "multipart/from-data",
                "authorization": `Bearer ${window.localStorage.getItem("tokenOfUser")}`
            }
        })
            .then((response) => {
                successfully()
            }).catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${error.response.data.message}`,
                })
            })
    }
}


// show massege if successfully
function successfully() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: 'success',
        title: 'successfully'
    })

    setTimeout(() => {
        window.location.reload()
    }, 2000);
}

// show massege if fail
function fail(massegeError) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${massegeError}`,
    })
}

// All The Posts in main Page
let postsContainer = document.getElementById("posts")
function getPost(page = 1) {
    if (document.body.getAttribute("data-val") == 'true') {
        axios.get(`https://tarmeezAcademy.com/api/v1/posts?limit=4&page=${page}`)
            .then((response) => {
                let posts = response.data.data

                lastPage = response.data.meta.last_page


                for (post of posts) {
                    let em = document.createElement("div")
                    function tag() {
                        for (tag of post.tags) {
                            let comt = `<span>${tag.name}</span>`
                            em.innerHTML += comt
                        }
                        return em.innerHTML
                    }

                    let contentt =
                        `
                        <div class="card" id="${post.id}" onclick="showPost(${post.id})">
                            <div class="head">
                                <div>
                                    <img src="${post.author.profile_image == "[object Object]" ? "./images/تنزيل (2).jpg" : post.author.profile_image}" alt="">
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
                                <p><i class="fa-sharp fa-solid fa-pen"></i> (<span id="${post.id}com">${post.comments_count}</span>) comments</p>
                                <div class="tags">${tag()}</div>
                            </div>
                        </div>
                    `
                    postsContainer.innerHTML += contentt
                }

            })
    }
}

// Show Post 
function showPost(parm) {
    axios.get(`https://tarmeezAcademy.com/api/v1/posts/${parm}`)
    .then((response) => {
        let post = response.data.data
        Swal.fire({
            title: 'comments!',
            html : `
            <div class="comm"></div>
            <div class="Newcommint">
                <form action="">
                    <input type="text"  placeholder="Write Comment">
                    <input type="submit" value="Send">
                </form>
            </div>
            `
        })

        creatcomm(parm)


        for (const iter of post.comments) {
            let comt = 
            `
            <div>
                <div>
                    <img src="${iter.author.profile_image == "[object Object]" ? "./images/تنزيل (2).jpg" : iter.author.profile_image}">
                    <h3>${iter.author.username}</h3>
                </div>
                <p>${iter.body}</p>                                                             
            </div>
            `

            document.querySelector(`.comm`).innerHTML += comt
        }

    })
}


function creatcomm(parm) {
    document.querySelector(`.Newcommint form`).onsubmit = function(eve) {
        eve.preventDefault();
    
    
        let postId = document.querySelector(`.card`).id
        let values = document.querySelector(`.Newcommint form input[type="text"]`).value
    
        let ob = {
            "body" : values
        }
        let tok = window.localStorage.getItem("tokenOfUser")
        
        axios.post(`https://tarmeezAcademy.com/api/v1/posts/${parm}/comments` , ob , {
            headers : {
                "authorization" : `Bearer ${tok}`
            }
        })
        .then((response) => {
            document.querySelector(`.Newcommint form input[type="text"]`).value = ""
            document.getElementById(`${parm}com`).innerHTML = +(document.getElementById(`${parm}com`).innerHTML) + 1
            axios.get(`https://tarmeezAcademy.com/api/v1/posts/${parm}`)
            .then((response) => {        
                let post = response.data.data
                document.querySelector(`.comm`).innerHTML = ""
                for (const iter of post.comments) {
                    let comt = 
                    `
                    <div>
                        <div>
                            <img src="${iter.author.profile_image == "[object Object]" ? "./images/تنزيل (2).jpg" : iter.author.profile_image}">
                            <h3>${iter.author.username}</h3>
                        </div>
                        <p>${iter.body}</p>                                                             
                    </div>
                    `
        
                    document.querySelector(`.comm`).innerHTML += comt
                }
            })
        })
    }    
}

function portfolio() {
    window.open("./portfolio.html", "_self")
}
