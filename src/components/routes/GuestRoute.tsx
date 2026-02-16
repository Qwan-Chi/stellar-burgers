import { FC, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIsAuthenticated, selectIsAuthChecked } from '@selectors';
import { Preloader } from '../ui';

export const GuestRoute: FC<PropsWithChildren> = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};
