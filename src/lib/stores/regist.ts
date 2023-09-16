
let listTarget = ['email', 'username', 'password', 'password2'];


export const correct = (tag: InputReg) => {
  console.log(tag);
  const target = document.getElementById(listTarget[tag.id]);
  const alert = document.getElementsByClassName('alert')[tag.id];

  switch (tag.id) {

    case 0:


      if (!tag.tag.includes("@")) { //regular expresion
        alert.innerHTML = tag.alert[0];
        alert.classList.add('text-red-700');
        target?.classList.add('salah');
      } else {
        alert.innerHTML = '';
        alert.classList.remove('text-red-700');
        target?.classList.remove('salah');
      }
      break;
  }
}

