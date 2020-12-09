/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './auth.context';
import { verifyToken } from './auth.service';

// eslint-disable-next-line react/prop-types
const RouteGuard = ({ component: Component, ...rest }) => {
  const { authToken } = useAuth();
  const isAuthenticated = verifyToken(authToken);

  return (
    <Route
      {...rest}
      render={(props) => (isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      ))}
    />
  );
};

export default RouteGuard;
