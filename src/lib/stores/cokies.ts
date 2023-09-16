import { goto } from "$app/navigation";

export const SetCookie = (name: string, value: string, mili_secon: number) => {
  var expires = '';
  if (mili_secon) {
    var date = new Date();
    date.setTime(date.getTime() + mili_secon);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

export const DelCookie = (name: string) => {
  var expires = '';

  var date = new Date();
  date.setTime(date.getTime());
  expires = '; expires=' + date.toUTCString();
  document.cookie = name + '=' + ('asda' || '') + expires + '; path=/';
  console.log('dell cokie')
}



export const GetCookie = (name: string) => {
  var nameEQ = name + '=';

  if (document && document.cookie) {

    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

let message = ''

export const generateAccesToken = async (act: string) => {
  const refresh_token = act
  const response = await fetch('http://127.0.0.1:8000/api/api/v1/auth/refresh_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      refresh_token
    })
  });

  const content = await response.json();
  const actNew = content.data.access_token
  const expired_at = content.data.expired_at
  console.log(content.data.access_token);

  SetCookie('accesskey', actNew, expired_at);


}

export const logout = async () => {
  const refresh_token = GetCookie('refreshkey')
  if (refresh_token) {
    const postLogout = await fetch('http://127.0.0.1:8000/api/api/v1/auth/logout', {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json"
      }, body: JSON.stringify({
        refresh_token
      })
    })

  }

  document.cookie.split(';').forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
  goto('/');
};