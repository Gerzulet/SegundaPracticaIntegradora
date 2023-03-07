  document.getElementById("login-form").addEventListener("submit", async(e) => {
    e.preventDefault()

    const user = {
      email : document.getElementById("email").value, 
      password : document.getElementById("password").value
    }

    fetch('/api/sessions/login', {
      method: 'POST', 
      headers : {'Content-Type':'aplication/json'},
      body: JSON.stringify(user)
    })
    .then(res=> res.json())
    .then(data => {
        if(data.token){
          localStorage.setItem('token', data.token)
          window.location.href = '/products'
        }
      })
    .catch(err => console.log(err, err.message))
  })

  (async () => {
      if(localStorage.getItem('token')){
        window.location.href = '/products'
      }
    })
