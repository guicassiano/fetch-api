// URL do arquivo JSON
const url = "https://jsonplaceholder.typicode.com/posts"

// Pegando os elementos
const loadingElement = document.querySelector("#loading")
const postsContainer = document.querySelector("#posts-container")

const postPage = document.querySelector("#post")
const postContainer = document.querySelector("#post-container")
const commentsContainer = document.querySelector("#comments-container")

const commentForm = document.querySelector("#comment-form")
const emailInput = document.querySelector("#email")
const bodyInput = document.querySelector("#body")

// Get id da URL
const urlSearchParams = new URLSearchParams(window.location.search);
const postId = urlSearchParams.get("id");

// Buscando todos os posts
async function getAllPosts(){
    const response = await fetch(url)
    
    const data = await response.json()

    loadingElement.classList.add("hide")

    data.map((post)=>{
        const div = document.createElement("div")
        const title = document.createElement("h2")
        const body = document.createElement("p")
        const link = document.createElement("a")

        title.innerText = post.title;
        body.innerText = post.body;
        link.innerText = "Ler"
        link.setAttribute("href",`/posts.html?id=${post.id}`)

        div.appendChild(title)
        div.appendChild(body)
        div.appendChild(link)

        postsContainer.appendChild(div)
    })
}

// Get post individual
async function getPost(id){
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])
    
    const dataPost = await responsePost.json()
    const dataComments = await responseComments.json()
    
    loadingElement.classList.add("hide")
    postPage.classList.remove("hide")

    const title = document.createElement("h1")
    const body = document.createElement("p")

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title)
    postContainer.appendChild(body)

    dataComments.map((comment)=>{
        createComment(comment)
    })
}

// criar um comentário para o post
function createComment(comment){
    const div = document.createElement("div")
    const email = document.createElement("h3")
    const commentBody = document.createElement("p")

    email.innerText = comment.email
    commentBody.innerText = comment.body

    div.appendChild(email)
    div.appendChild(commentBody)

    commentsContainer.appendChild(div)
}

// busca os comentarios da api
async function postComment(comment){
    const response = await fetch(`${url}/${postId}/comments`,
    {
        method: "POST",
        body: comment,
        headers: {
            "content-type": "application/json"
        },
    })
    const data = await response.json()
    createComment(data)
}

// exibe os elementos
if(!postId){
    getAllPosts()
}else{
    getPost(postId)

    // Cria e adiciona um comentário no post
    commentForm.addEventListener("submit",(evt)=>{
        evt.preventDefault();

        let comment = {
            email: emailInput.value,
            body: bodyInput.value,
        }

        comment = JSON.stringify(comment)

        postComment(comment)
    })
}