const $email = document.querySelector('.emailInput')
const $pass = document.querySelector('.passInput')
const $btn = document.querySelector('.registerBtn')
const $blockBody = document.querySelector('.block_body')
const $eyeBtn = document.querySelector('.eye')
const $showBtn = document.querySelector('.show_btn')
const $inputVal = document.querySelectorAll('.block_body div input')

const baseUrl = 'https://todo-itacademy.herokuapp.com/api'

window.addEventListener('load', () => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken === 'undefined') {
    localStorage.clear()
  }else if (accessToken) {
    window.open('../auth.html', '_self')
  }

})

function isValidate() {
  $allInp.forEach(item => {
    item.value.length === 0
      ? item.classList.add('active')
      : item.classList.remove('active')
  })
  return [...$allInp].every(item => item.value)
}

function getInpValue() {
  return [...$allInp].reduce((object, item) => {
    return {
      ...object,
      [item.name]: item.value
    }
  }, {})

}

function getRegister(endPoint){
  fetch(`${baseUrl}/${endPoint}`, {
    method:'POST',
    body:JSON.stringify(getInpValue()),
    headers:{
      'Content-type':'application/json'
    }
  })
  .then(res => res.json())
  .then(r => {
    localStorage.setItem('accessToken', r.accessToken)
    localStorage.setItem('refreshToken', r.refreshToken)
    localStorage.setItem('userId', r.user.id)
    localStorage.setItem('isActivated', r.user.isActivated)
    window.open('../auth.html', '_self')
  })
  .finally(() => {
    $btn.disabled = false 
  })
}

$btn.addEventListener('click', e => {
  e.preventDefault()
  $btn.disabled = true
  isValidate() && getRegister('registration')
})

$eyeBtn.addEventListener('click', e => {
  e.preventDefault()

  setInputType('text')

})

function setInputType(type){
  $pass.setAttribute('type', type)
}