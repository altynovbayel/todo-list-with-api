const $title = document.querySelector('.title')
const $content = document.querySelector('.content')
const $date = document.querySelector('.date')
const $btn = document.querySelector('.add_btn')
const $row = document.querySelector('.row')
const $logout = document.querySelector('.logOut')

const baseUrl = 'https://todo-itacademy.herokuapp.com/api'
const accessToken = localStorage.getItem('accessToken')

const requests = {
  get: (url, accessToken) => {
    return fetch(url, {
      method: 'GET',
      headers:{
        'Content-type':'application/json',
        'Authorization':`Bearer ${accessToken}`
      }
    })
    .then(res => {
      if(res.status === 401){
        getRefresh()
      }
      return res.json()
    })
  },
  post:(url, accessToken, body) => {
    return fetch(url, {
      method:'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
  }

}

// check unAutorized

window.addEventListener('load', () => {
  const accessToken = localStorage.getItem('accessToken')
  const active = localStorage.getItem('isActivated')
  if(active === 'false'){
    alert('активируйте свой аккаунт')
  }
  if (!accessToken) {
    window.open('../auth.html', '_self')
  }
})

// render todos when window loaded

window.addEventListener('load', () => {
  getTodos()
})

// get todos

function getTodos() {
  requests.get(`${baseUrl}/todos`, accessToken)
  .then(r => {
    const result = r.todos
    .reverse()
    .map(todo => cardTemplate(todo))
    .join('')
    $row.innerHTML = result
  })
}

// get single todo

function getSingleTodo(id) {

  return requests.get(`${baseUrl}/todos/${id}`, accessToken)

}

// create todos

function createTodos(title, content, date) {
  $btn.disabled = true

  requests.post(`${baseUrl}/todos/create`, accessToken, {
    title,
    content,
    date,
  })
  .then(() => {
    getTodos()
  })
  .finally(() => $btn.disabled = false)
}

// card template

function cardTemplate({
  title,
  content,
  date,
  id,
  completed,
  edited
}) {
  return `
    <div class="card">
      <div class="todo_header">
        <h3 class="card_title">${title}</h3>
        ${completed ? `<img class="completedImg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl0g19_asZcdOagR3Pm82udTa2QohKh3cJqw&usqp=CAU">` : ''}
      </div>
      <div class="todo_body">
        <p>${content}</p>
        
      </div>
      
      <div class="todo_footer">
        <span>
          date: ${date} 
          ${edited.state ? `<span class="editedDate">edited: ${edited.date}</span>` : ''}
        </span>
        <button class="del" onclick="deleteTodo('${id}')">Delete</button>
        <button class="complete" onclick="completeTodo('${id}')">Complete</button>
        <button class="edit" onclick="editTodo('${id}')">Edit</button>
      </div>
    </div>
  `
}

// complete todo

function completeTodo(id) {
  requests.get(`${baseUrl}/todos/${id}/completed`, accessToken)
  .then(getTodos)
}

// delete todo

function deleteTodo(id) {
  fetch(`${baseUrl}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(getTodos)
}

// edit todo

function editTodo(id) {
  getSingleTodo(id)
  .then(res => {
    const askTitle = prompt('New title', res.title)
    const askContent = prompt('New content', res.content)

    fetch(`${baseUrl}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: askTitle || res.title,
          content: askContent || res.content,
        })
      })
      .then(getTodos)
  })
}

$btn.addEventListener('click', e => {
  e.preventDefault()

  $btn.disabled = true

  createTodos($title.value, $content.value, $date.value)
})

$logout.addEventListener('click', e => {
  e.preventDefault()
  $logout.disabled = true

  const refreshToken = localStorage.getItem('refreshToken')

  requests.post(`${baseUrl}/logout`, '', refreshToken)
  .then(() => {
  localStorage.clear()
  window.open('../auth.html', '_self')
  })
  .finally(() => {
    $logout.disabled = false
  })

})

//  refreshToken

function getRefresh(){
  requests.post(`${baseUrl}/refresh`, accessToken, {refreshToken})
  .then(res => console.log(res))
  alert('перезайдите на свой аккаунт')
}