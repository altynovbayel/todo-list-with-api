const $btn = document.querySelector('.add_btn')
const $row = document.querySelector('.row')
const $logout = document.querySelector('.logOut')
const $allInp = document.querySelectorAll('.card_body div input')

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

  !accessToken && window.open('../auth.html', '_self')

  getTodos()
})

// check validation input

function isValidate(){
  $allInp.forEach(item => {
    item.value.length === 0
    ? item.classList.add('active')
    : item.classList.remove('active')
  })
  return [...$allInp].every(item => item.value)
}

function getInpValue(){
  return [...$allInp].reduce((object, item) => {
    return {
      ...object,
      [item.name]:item.value
    }
  }, {})

}

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

// create todos

function createTodos() {
  $btn.disabled = true

  requests.post(`${baseUrl}/todos/create`, accessToken, getInpValue())
  .then(getTodos)
  .finally($btn.disabled = false)
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

const completeTodo = (id) => requests.get(`${baseUrl}/todos/${id}/completed`, accessToken).then(getTodos)

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
  requests.get(`${baseUrl}/todos/${id}`, accessToken)
  .then(res => { 

    fetch(`${baseUrl}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: prompt('New title', res.title) || res.title,
          content: prompt('New content', res.content) || res.content,
        })
      })
      .then(getTodos)
  })
}

$btn.addEventListener('click', e => {
  e.preventDefault()

  $btn.disabled = true

  isValidate() && createTodos()
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