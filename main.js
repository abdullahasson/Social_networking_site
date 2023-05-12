let UrL = "https://tarmeezAcademy.com/api/v1"
// mune show
let btn = document.getElementById("menu");
let mune = document.querySelector(`.navbar .container .middle .main .btns`)

btn.addEventListener("click" , () => {
    mune.classList.toggle("show");
})

let newPage = 1;
let averag = document.documentElement.clientHeight;

if (document.body.getAttribute("data-val") !== "false") {
    window.addEventListener("scroll" , () => {
        let scrollY = window.scrollY;
        let pageHeight = document.documentElement.scrollHeight;
    
        const scrolledEnd = (scrollY + averag) >= pageHeight;
    
        if (scrolledEnd) {
            console.log("end")
            newPage += 1
            getPost(newPage)
        }
    })
}

// check if the user is log in
setupUi()

// show login massege 
async function LoginBtnClicked() {
    const { value: formValues } = await Swal.fire({
        title: 'Login',
        html:
          '<label for="name">Username</label>' +
          '<input id="name" class="swal2-input" type="text">' +
          '<label for="password">Password</label>' +
          '<input id="password" class="swal2-input" type="password">',
        focusConfirm: false,
        showCancelButton : true,
        preConfirm: () => {
          return [
            document.getElementById('name').value,
            document.getElementById('password').value
          ]
        }
      })
      
      if (formValues) {
        let parms = {
                "username" : formValues[0],
                "password" : formValues[1]
        }
        axios.post(`${UrL}/login` , parms)
        .then((response) => {
            window.localStorage.setItem("user" , JSON.stringify(response.data.user))
            window.localStorage.setItem("tokenOfUser" , response.data.token)
            successfully()
        }).catch(() => {
            let er = 'This account is not valid'
            fail(er)
        })
      }
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
            window.close("./portfolio.html")
            window.localStorage.removeItem("user")
            window.localStorage.removeItem("tokenOfUser")
            window.location.reload()
        }
      })
      
}

// when user click on register
async function RegisterBtnClicked() {
    const { value: formValues } = await Swal.fire({
        title: 'Register',
        html:
          '<input id="swal-input1" class="swal2-input" style="width: 80%;" placeholder="Enter your name">' +
          '<input id="swal-input2" class="swal2-input" style="width: 80%;" placeholder="Enter your Username">' +
          '<input type="file" id="swal-input3" class="swal2-input sp" style="width: 80%;" placeholder="select image">' +
          '<input id="swal-input4" class="swal2-input" style="width: 80%;" type="password" placeholder="Enter your password">',
        focusConfirm: false,
        showCancelButton : true,
        preConfirm: () => {
          return [
            document.getElementById('swal-input1').value,
            document.getElementById('swal-input2').value,
            document.getElementById('swal-input3').files[0],
            document.getElementById('swal-input4').value
          ]
        }
      })
      
      if (formValues) {
        let fromdata = new FormData()
        fromdata.append("name" , formValues[0])
        fromdata.append("username" , formValues[1])
        fromdata.append("image" , formValues[2])
        fromdata.append("password" , formValues[3])

        axios.post(`${UrL}/register` , fromdata , {
            headers : {
                "Content-Type" : "multipart/from-data"
            }
        })
        .then((response) => {
            window.localStorage.setItem("user" , JSON.stringify(response.data.user))
            window.localStorage.setItem("tokenOfUser" , response.data.token)
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

// setup UI page 
function setupUi() {
    let token = window.localStorage.getItem("tokenOfUser")
    
    if (token == null) {
       
    } else {
        document.getElementById("Login-btn").style.display = "none"
        document.getElementById("Register-btn").style.display = "none"
        document.getElementById("Logout-btn").style.display = "block"
        
        if (document.body.getAttribute("data-val") !== "false") {
            document.getElementById("addPost").style.display = "block"
        }

        document.getElementById("useraccout").style.display = "flex"
        document.querySelector(`.sss`).style.display = "block"
        let info = JSON.parse(window.localStorage.getItem("user"))
        document.querySelector(`.navbar .container .middle .main .userAcuont img`).src = info.profile_image
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
        fromdata.append("title" , formValues[0])
        fromdata.append("body" , formValues[1])
        fromdata.append("image" , formValues[2])
        
        axios.post(`https://tarmeezAcademy.com/api/v1/posts` , fromdata , {
            headers : {
                "Content-Type" : "multipart/from-data",
                "authorization" : `Bearer ${window.localStorage.getItem("tokenOfUser")}`
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

getPost()

// All The Posts in main Page
let postsContainer = document.getElementById("posts")
function getPost(page = 1) {
    if (document.body.getAttribute("data-val") == 'true') {
        axios.get(`https://tarmeezAcademy.com/api/v1/posts?limit=4&page=${page}`)
        .then((response) => {
            let posts = response.data.data
    
            lastPage = response.data.meta.last_page
    
            
            for(post of posts) {
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
                                <p><i class=""></i> (${post.comments_count}) Commints</p>
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
    if (window.localStorage.getItem("tokenOfUser") !== null) {
        window.open("./showPost.html" , "_self").sessionStorage.setItem("idOfuser" , parm)
    }
}


function portfolio() {
    window.open("./portfolio.html" , "_self")
}