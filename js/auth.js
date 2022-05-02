// const $email = document.querySelector('.emailInput')
// const $pass = document.querySelector('.passInput')
const $btn = document.querySelector('.registerBtn')
const $allInp = document.querySelectorAll('.block_body div input')


const baseUrl = 'https://todo-itacademy.herokuapp.com/api'

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

function getRegister(endPoint) {
  fetch(`${baseUrl}/${endPoint}`, {
    method: 'POST',
    body: JSON.stringify(getInpValue()),
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
  isValidate() && getRegister('login')
})

window.addEventListener('load', () => {
  const active = localStorage.getItem('isActivated')
  if(active){
    window.open('../index.html', '_self')
  }
})