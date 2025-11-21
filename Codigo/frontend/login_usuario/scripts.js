    function togglePwd(){
      const i = document.getElementById('senha');
      const eye = document.getElementById('eye');
      if(i.type === 'password'){
        i.type = 'text';
        eye.innerHTML = '<path d="M3 3l18 18"/><path d="M10.6 10.6a3.5 3.5 0 0 1 4.8 4.8"/><path d="M9.88 4.62A8.87 8.87 0 0 1 12 5c7 0 11 7 11 7a17.54 17.54 0 0 1-5.07 5.07"/><path d="M6.11 6.11A17.57 17.57 0 0 0 1 12s4 7 11 7a10.3 10.3 0 0 0 5.46-1.54"/>'
      } else {
        i.type = 'password';
        eye.innerHTML = '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3.5"/>'
      }
    }