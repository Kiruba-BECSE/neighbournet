export function redirectByRole(role, navigate) {
  if (role === 'worker') navigate('/worker');
  else if (role === 'officer') navigate('/officer');
  else if (role === 'admin') navigate('/admin');
  else navigate('/');
}