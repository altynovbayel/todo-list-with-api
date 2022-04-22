const $email = document.querySelector('.emailInput')
const $pass = document.querySelector('.passInput')
const $btn = document.querySelector('.registerBtn')
const $blockBody = document.querySelector('.block_body')

// https://todo-itacademy.herokuapp.com/api/registration
// https://todo-itacademy.herokuapp.com/api/login
// https://todo-itacademy.herokuapp.com/api/create
// https://todo-itacademy.herokuapp.com/api/todos

const baseUrl = 'https://todo-itacademy.herokuapp.com/api'

function getRegister(endPoint){
  fetch(`${baseUrl}/${endPoint}`, {
    method:'POST',
    body:JSON.stringify({
      email: $email.value,
      password: $pass.value,
    }),
    headers:{
      'Content-type':'application/json'
    }
  })
  .then(res => res.json())
  .then(r => {
    localStorage.setItem('accessToken', r.accessToken)
    localStorage.setItem('refreshToken', r.refreshToken)
    localStorage.setItem('userId', r.user.id)
    console.log(r.user);
  })
}

$btn.addEventListener('click', e => {
  e.preventDefault()

  if($email.value.length === 0 || $pass.value.length === 0){
    if ($email.value.length === 0){
      $email.classList.add('active')
    }
    if ($pass.value.length === 0){
      $pass.classList.add('active')
    }
  }else{
    getRegister('registration')
    $blockBody.innerHTML = `
      <h1>Мы отправили ссылку на вашу почту</h1>
    `
  }
})