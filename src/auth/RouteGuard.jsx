import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from './auth.context';
import { verifyToken } from './auth.service';

const RouteGuard = ({ component: Component, ...rest }) => {
	const { authToken } = useAuth();
	const isAuthenticated = verifyToken(authToken);

  return (
    <Route
      {...rest}
			render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

export default RouteGuard;