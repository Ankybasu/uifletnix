import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Clone the request to add the Authorization header if the token exists
  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Add withCredentials: true to the cloned request to send credentials with the request
  clonedReq = clonedReq.clone({ withCredentials: true });

  // Pass the modified request
  return next(clonedReq);
};
