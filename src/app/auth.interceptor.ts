import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
 // Get the token from localStorage
 const token = localStorage.getItem('token');

 // Clone the request to add the Authorization header if the token exists
 if (token) {
   const clonedReq = req.clone({
     setHeaders: {
       Authorization: `Bearer ${token}`,
     },
   });
   return next(clonedReq);
 }

 // Pass the original request if no token is found
 return next(req);
}

