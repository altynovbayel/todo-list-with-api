const $email = document.querySelector('.emailInput')
const $pass = document.querySelector('.passInput')
const $btn = document.querySelector('.registerBtn')

// https://todo-itacademy.herokuapp.com/api/registration
// https://todo-itacademy.herokuapp.com/api/login
// https://todo-itacademy.herokuapp.com/api/create
// https://todo-itacademy.herokuapp.com/api/todos

const baseUrl = 'https://todo-itacademy.herokuapp.com/api'

function getRegister(endPoint) {
  fetch(`${baseUrl}/${endPoint}`, {
    method: 'POST',
    body: JSON.stringify({
      email: $email.value,
      password: $pass.value,
    }),
    headers: {
      'Content-type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(r => {
      localStorage.setItem('accessToken', r.accessToken)
      localStorage.setItem('refreshToken', r.refreshToken)
      localStorage.setItem('userId', r.user.id)
      if(r.user.isActivated){
        window.open('./index.html', '_self')
        localStorage.setItem('isActivated', r.user.isActivated)
      }
    })
    .finally(() => $btn.disabled = false)
}

$btn.addEventListener('click', e => {
  e.preventDefault()
  $btn.disabled = true
  if ($email.value.length === 0 || $pass.value.length === 0) {
    if ($email.value.length === 0) {
      $email.classList.add('active')
    }
    if ($pass.value.length === 0) {
      $pass.classList.add('active')
    }
  } else {
    getRegister('login')
  }
})

window.addEventListener('load', () => {
  const active = localStorage.getItem('isActivated')
  if(active){
    window.open('../index.html', '_self')
  }
})